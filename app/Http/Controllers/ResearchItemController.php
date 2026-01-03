<?php

namespace App\Http\Controllers;

use App\Models\ResearchItem;
use App\Models\Url;
use DOMDocument;
use DOMXPath;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use andreskrey\Readability\Readability;
use andreskrey\Readability\Configuration;

class ResearchItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('research-items/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'url' => 'required|url'
        ]);

        $metadata = $this->fetchMetadata($request);
        //$host = strtolower(parse_url($request->url, PHP_URL_HOST));
        //dd($host);
        dd($metadata);

        if($metadata == 403) {
            return redirect()->route('research-items')->with('error', 'Material access is forbidden.');
        }

        /*
        if(!$this->validateDomain($request->url)) {
            return redirect()->route('research-items')->with('error', 'The material is not an allowed domain.');
        }
        */

        if(!$this->validateResearchContent($metadata)) {
            return redirect()->route('research-items')->with('error', 'The material is not research-based');
        }

        $title = $metadata['title'];
        $description = $metadata['description'];
        $requestUrl = $request->url;

        DB::transaction(function() use ($title, $description, $requestUrl) {
            $userId = Auth::user()->id;

            $url = Url::create([
                'title' =>  $title,
                'description' => $description,
                'url' => $requestUrl
            ]);

            $url->researchItem()->create([
                'category_id' => 1,
                'user_id' => $userId,
            ]);
        });

        return redirect()->route('research-items')->with('success', 'Research item successfully added!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //

    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        dd($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $researchItem = ResearchItem::with('url', 'user', 'tag', 'category')->find($id);
        $url = Url::find($researchItem->url_id);

        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'note' => 'nullable|string',
            'url' => 'required|url'
        ]);

        $researchItem = DB::transaction(function() use ($request, $researchItem, $url) {

            $researchItem->update([
                'note' => $request->note,
            ]);

            $url->update([
                'title' => $request->title,
                'description' => $request->description,
                'url' => $request->url
            ]);
        });

        if($researchItem) {
            return redirect()->route('research-items')->with('success', 'Research item successfully updated!');
        }
        return redirect()->route('research-items')->with('error', 'Research item failed to update.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Url::destroy($id);
        return redirect()->route('research-items');
    }

    private function fetchMetadata(Request $request) {
        $validator = Validator::make($request->all(), [
            'url' => 'required|url'
        ]);

        if($validator->fails()) {
            return redirect()->back();
        }

        try {
            $client = new Client([
                'timeout' => 10,
                'headers' => [
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64 x64) AppleWebKit/537.36'
                ],
                'verify' => false // make it true if in production
            ]);

            $response = $client->get($request->url);
            $html = (string)$response->getBody();

            $dom = new DOMDocument();
            @$dom->loadHTML($html);

            $metadata = [
                'url' => $request->url,
                'title' => $this->extractTitle($dom),
                'description' => $this->extractDescription($dom),
                'image' => $this->extractImage($dom, $request->url),
                'content' => $this->extractContent($html),
                'keywords' => $this->extractKeywords($dom),
                'author' => $this->extractAuthor($dom),
                'published_time' => $this->extractPublishedTime($dom)
            ];

            return $metadata;

        } catch (\Exception $e) {
            return $e->getCode();
        }
    }

    private function extractTitle($dom) {
        $title = '';

        $titleTags = $dom->getElementsByTagName('title');
        if($titleTags->length > 0) {
            $title = $titleTags->item(0)->textContent;
        }

        return trim($title);
    }

    private function extractDescription($dom) {
        $description = '';

        $metaDesc = $this->getMetaContent($dom, 'description');
        if($metaDesc) return $metaDesc;

        return $description;
    }

    private function extractImage($dom, $baseUrl) {
        $image = '';

        $images = $dom->getElementsByTagName('img');
        foreach($images as $img) {
            $src = $img->getAttribute('src');
            if($src && $this->isSignificantImage($src, $img)) {
                return $this->makeAbsoluteUrl($src, $baseUrl);
            }
        }

        return $image;
    }

    private function extractKeywords($dom) {
        $keywords = $this->getMetaContent($dom, 'keywords');
        return $keywords ? explode(',', $keywords) : [];
    }

    private function extractAuthor($dom) {
        $author = $this->getMetaContent($dom, 'author');
        if(!$author) {
            $author = $this->getMetaContent($dom, 'article:author');
        }
        if(!$author) {
            $author = $this->getMetaContent($dom, 'og:author');
        }

        return $author;
    }

    private function extractPublishedTime($dom) {
        $time = $this->getMetaContent($dom, 'article:published_time');
        if(!$time) {
            $time = $this->getMetaContent($dom, 'og:published_time');
        }
        return $time;
    }

    private function extractContent($html) {
        $content = '';

        $readability = new Readability(new Configuration());
        $readability->parse($html);

        $content = $readability->getContent();

        return $content;
    }

    /*
    private function extractContent($html) {
        $dom = new DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
        $xpath = new DOMXPath($dom);

        $this->removeUnwantedElements($xpath);

        $content = '';
        $paragraphs = [];

        $pElements = $xpath->query("//p[not(ancestor::header) and not(ancestor::footer) and not(ancestor::nav) and not(ancestor::aside)]");

        foreach($pElements as $p) {
            $text = trim($p->textContent);

            if(strlen($text) < 20) continue;
            if(preg_match('/copyright|©|all rights reserved|privacy policy|terms of service/i', $text)) continue;
            if($this->isNavigationText($text)) continue;

            $paragraphs[] = $text;
        }

        if(count($paragraphs) >= 3) {
            $content = implode("\n\n", $paragraphs);
        }

        if(empty($content)) {
            $divs = $xpath->query("//div[not(ancestor::header) and not(ancester::footer) and not(ancestor::nav)]");

            foreach($divs as $div) {
                $text = trim($div->textContent);
                $words = str_word_count($text);

                if($words > 100 && $words < 5000) {
                    $content = $text;
                    break;
                }
            }
        }

        return $content ? $this->cleanText($content) : '';
    }
    */

    /*
    private function extractImage($html, Request $request) {
        // Try Open Graph image
        if (preg_match('/<meta[^>]*property=["\']og:image["\'][^>]*content=["\']([^"\']+)["\']/is', $html, $matches)) {
            return $this->makeAbsoluteUrl(trim($matches[1]), $request->url);
        }

        // Try Twitter image
        if (preg_match('/<meta[^>]*name=["\']twitter:image["\'][^>]*content=["\']([^"\']+)["\']/is', $html, $matches)) {
            return $this->makeAbsoluteUrl(trim($matches[1]), $request->url);
        }

        return null;
    }
    */

    private function removeUnwantedElements($xpath) {
        $unwatedTags = [
            'script', 'style', 'nav', 'header', 'footer',
            'aside', 'form', 'iframe', 'noscript'
        ];

        foreach($unwatedTags as $tag) {
            $elements = $xpath->query("//{$tag}");
            foreach($elements as $element) {
                $element->parentNode->removeChild($element);
            }
        }

        $unwantedClasses = [
            'social', 'share', 'advertisement', 'ad', 'sidebar', 'menu', 'navigation', 'banner', 'comments', 'related', 'popular', 'trending', 'newsletter', 'subscribe', 'footer', 'header'
        ];

        foreach($unwantedClasses as $class) {
            $elements = $xpath->query("//*[contains(@class, '{$class}')]");
            foreach($elements as $element) {
                $element->parentNode->removeChild($element);
            }
        }
    }

    private function cleanText($text) {
        $text = preg_replace('/\s+/', ' ', $text);
        $text = trim($text);

         $patterns = [
            '/\b(?:share|tweet|like|follow|subscribe)\b/i',
            '/\b(?:click here|read more|learn more)\b/i',
            '/\b\d+\s*(?:comments|shares|likes)\b/i',
            '/\b(?:advertisement|sponsored content|partner content)\b/i',
        ];

        foreach($patterns as $pattern) {
            $text = preg_replace($pattern, '', $text);
        }

        return $text;
    }

    private function isNavigationText($text) {
        $navigationWords = [
            'home', 'about', 'contact', 'services', 'products',
            'blog', 'news', 'login', 'register', 'sign up',
            'search', 'categories', 'tags', 'archives'
        ];

        $text = strtolower($text);
        foreach($navigationWords as $word) {
            if(strpos($text, $word) !== false && strlen($text) < 50) {
                return true;
            }
        }

        return false;
    }

    private function validateDomain($url) {
            $host = strtolower(parse_url($url, PHP_URL_HOST));

            $allowedDomains = [
                // Exact Matches
                'researchgate.net',
                'medium.com',
                'arxiv.org',
                'geeksforgeeks.org',

                    // Wildcard
                '*.geeksforgeeks.org',
                '*.researchgate.net',
                '*.medium.com',
                '*.substack.com',
                'github.com',
                '*.gitlab.io',
                'blog.*.com',
                'news.*.com',
                '*.edu',
                '*.ac.*'
            ];

            foreach($allowedDomains as $pattern) {
                if($this->matchesPattern($host, $pattern)) {
                    return true;
                }
            }
        return false;
    }

    private function matchesPattern($host, $pattern) {
        $regex = str_replace('.', '\.', $pattern);
        $regex = str_replace('*', '.*', $regex);
        $regex = '/^' . $regex . '$/i';

        return preg_match($regex, $host);
    }

    private function validateResearchContent($metadata) {
        $researchKeywords = [
            'research', 'study', 'paper', 'article', 'journal',
            'conference', 'proceedings', 'analysis', 'findings',
            'methodology', 'results', 'discussion', 'abstract',
            'peer-reviewed', 'academic', 'scholarly', 'technical',
            'tutorial', 'guide', 'documentation', 'whitepaper',
            'case study', 'literature review'
        ];

        $title = strtolower($metadata['title'] ?? '');
        $description = strtolower($metadata['description'] ?? '');
        $content = strtolower($metadata['content'] ?? '');

        $textToCheck = $title . '' . $description . '' . substr($content, 0, 500);

        $keywordCount = 0;
        foreach($researchKeywords as $keyword) {
            if (str_contains($textToCheck, $keyword)) {
                $keywordCount++;
            }
        }

        return $keywordCount >= 2;
    }

    private function makeAbsoluteUrl($url, $baseUrl) {
        if(filter_var($url, FILTER_VALIDATE_URL)){
            return $url;
        }

        $base = parse_url($baseUrl);
        if(strpos($url, '/') === 0) {
            return $base['scheme'] . '://' .$base['hose'] . $url;
        }

        return $baseUrl . '/' . ltrim($url, '/');
    }

    public function toggleFavorite(string $id) {
        $researchItem = ResearchItem::find($id);

        if(!$researchItem) {
            return redirect()->route('research-items')->with('error', 'Research item not found.');
        }

        $researchItem->update([
            'is_favorite' => !$researchItem->is_favorite
        ]);

        return redirect()->route('research-items');
    }

    public function selectCategory(Request $request, string $id) {
        $researchItemId = $request->id;
        $categoryId = $id;
        $researchItem = ResearchItem::find($researchItemId);

        if(!$researchItem) {
            return redirect()->route('research-items')->with('error', 'Research item not found.');
        }

        $researchItem->update([
            'category_id' => $categoryId
        ]);

        return redirect()->route('research-items');
    }

    private function getMetaContent($dom, $property) {
        $xpath = new DOMXPath($dom);

        $queries = [
            "//meta[@property='{$property}']/@content",
            "//meta[@name='{$property}']/@content",
            "//meta[@itemprop='{$property}']/@content",
        ];

        foreach ($queries as $query) {
            $nodes = $xpath->query($query);
            if($nodes->length > 0) {
                return $nodes->item(0)->textContent;
            }
        }

        return null;
    }

    private function isSignificantImage($src, $imgElement) {
        $width = $imgElement->getAttribute('width');
        $height = $imgElement->getAttribute('height');
        $alt = strtolower($imgElement->getAttribute('alt') ?? '');

        $skipPatterns = ['logo', 'icon', 'spacer', 'pixel', 'loading','placeholder'];

        foreach($skipPatterns as $pattern) {
            if(stripos($src, $pattern) !== false || stripos($alt, $pattern)!== false) {
            return false;
            }
        }

        if($width && $height && ($width < 100 || $height < 100)) {
            return false;
        }

        return true;
    }
}
