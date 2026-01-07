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
use Illuminate\Support\Facades\Http;

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
        $requestUrl = $request->url;
        //dd($metadata);
        //$isArticle = $this->checkIfArticle($metadata['html']);
        $checkCredibility = $this->credibilityChecker($metadata);
        $isCredible = $checkCredibility['is_credible'];
        $isDomainAllowed = $checkCredibility['is_domain_allowed'];
        //$isResearchBased = $this->validateResearchContent($metadata);
        //dd($host);

        if($metadata['code'] == 403) {
            return redirect()->route('research-items')->with('error', 'Material access is forbidden.');
        }

        /*
        if(!$isArticle) {
            return redirect()->route('research-items')->with('error', 'Material is not an article.');
        }
*/

        if(!($isCredible || $isDomainAllowed)) {
            return redirect()->route('research-items')->with('error', 'Material is not credible.');
        }


        /*
        if(!$this->validateDomain($request->url)) {
            return redirect()->route('research-items')->with('error', 'The material is not an allowed domain.');
        }
        */

        /*
        if(!$isResearchBased) {
            return redirect()->route('research-items')->with('error', 'The material is not research-based');
        }
        */

        $title = $metadata['title'];
        $description = $metadata['description'];

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
                //'image' => $this->extractImage($dom, $request->url),
                'content' => $this->extractContent($html),
                'keywords' => $this->extractKeywords($dom),
                'author' => $this->extractAuthor($dom),
                'published_time' => $this->extractPublishedTime($dom),
                'html' => $html,
                'code' => 200
            ];

            return $metadata;

        } catch (\Exception $e) {
            return [
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ];
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

    /*
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
    */

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
        try {
            $content = '';

            $readability = new Readability(new Configuration());
            $readability->parse($html);

            $content = $readability->getContent();

            return $content;
        } catch(\Exception $e) {
            return $e->getMessage();
        }
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

    /*
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
    */

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

    private function credibilityChecker($metadata) {
        $url = $metadata['url'];
        $parsedUrl = parse_url($url);
        $domain = $parsedUrl['host'] ?? $url;
        $isAllowed = false;

        $allowedDomains = [
            'geeksforgeeks', 'freecodecamp', 'dev.to'
        ];

        $checks = [
            'has_ssl' => $this->checkSSL($url),
            'safe_browsing' => $this->verifyBusinessInfo($domain),
            'has_citation' => $this->hasCitationPatterns($metadata['content']),
            'has_abstract' => $this->hasAbstractSection($metadata['content']),
            'has_publication' => $this->hasPublicationDate($metadata['content']),
            'has_references' => $this->hasReferences($metadata['html']),
            'has_keywords' => $this->hasResearchKeywords($metadata['content']),
        ];

        $score = array_sum($checks) / count($checks) * 100;

        foreach($allowedDomains as $allowedDomain) {
            if(str_contains($domain, $allowedDomain)) {
                $isAllowed = true;
                break;
            }
        }

        return [
            'is_credible' => $score >= 70,
            'is_domain_allowed' => $isAllowed
        ];
    }

    private function checkSSL($url) {
        try {
            $response = Http::timeout(10)->get($url);
            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }

    public function verifyBusinessInfo($domain) {
        $apiKey = env('GOOGLE_SAFE_BROWSING_API_KEY');

        $response = Http::post("https://safebrowsing.googleapis.com/v4/threatMatches:find?key={$apiKey}", [
            "client" => [
                "clientId" => "research-topia",
                "clientVersion" => "1.0.0"
            ],
            "threatInfo" => [
                "threatTypes" => ["MALWARE", "SOCIAL_ENGINEERING"],
                "platformTypes" => ["WINDOWS"],
                "threatEntries" => [["url" => $domain]]
            ]
        ]);

        return empty($response->json());
    }

    private function hasCitationPatterns($content) {
        $citationPatterns = [
            '/\([A-Z][a-z]+,\s*\d{4}\)/i',  // (Smith, 2020)
            '/\[[0-9]+(?:-[0-9]+)?\]/',     // [1] or [1-5]
            '/et al\./i',                   // et al.
            '/references?\s*:/i',           // Reference(s):
            '/bibliography/i'
        ];

        $citationCount = 0;
        foreach($citationPatterns as $pattern) {
            $citationCount += preg_match_all($pattern, $content);
        }

        return  $citationCount > 3;
    }

    private function hasAbstractSection($content) {
        $abstractPatterns = [
            '/abstract/i',
            '/summary\s*:/i',
            '/executive\s+summary/i',
        ];

        foreach($abstractPatterns as $pattern) {
            if(preg_match($pattern, $content)) {
                return true;
            }
        }

        return false;
    }

    private function hasPublicationDate($content) {
        $datePatterns = [
            '/published:\s*(\d{1,2}\s+\w+\s+\d{4})/i',
            '/date:\s*(\d{1,2}\s+\w+\s+\d{4})/i',
            '/(?:©|copyright)\s*\d{4}/i',
            '/\d{4}\s*-\s*\d{4}/', // Date ranges
            '/volume\s+\d+/i',
            '/issue\s+\d+/i'
        ];

        foreach($datePatterns as $pattern) {
            if(preg_match($pattern, $content)) {
                return true;
            }
        }

        return false;
    }

    private function hasReferences($html) {
        $referencePatterns = [
            '/<h[1-6][^>]*>.*?(?:reference|bibliography).*?<\/h[1-6]>/i',
            '/<div[^>]*class=".*?(?:reference|bibliography).*?"[^>]*>/i',
            '/<section[^>]*id=".*?(?:reference|bibliography).*?"[^>]*>/i'
        ];

        foreach($referencePatterns as $pattern) {
            if(preg_match($pattern, $html)) {
                return true;
            }
        }

        return false;
    }

    private function hasResearchKeywords($content) {
         $researchKeywords = [
            'research', 'study', 'publication', 'journal',
            'academic', 'scholar', 'university', 'institute',
            'laboratory', 'experiment', 'methodology',
            'hypothesis', 'findings', 'conclusion', 'data analysis',
            'peer-reviewed', 'citation', 'references', 'bibliography'
        ];

        foreach($researchKeywords as $keyword) {
            if(str_contains($content, $keyword)) {
                return true;
            }
        }

        return false;
    }

    private function checkIfArticle($html) {
        try {
            $text = strtolower(strip_tags($html));

            $indicators = [
                'word_count' => str_word_count($text) > 300,
                'has_title' => preg_match('/<h1[^>]*>.*?<\/h1>/i', $html),
                'has_author' => preg_match('/author|byline|writer|contributor/i', $html),
                'has_date' => preg_match('/(published|posted|date|time).*?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})/i', $html),
                'has_paragraphs' => substr_count($html, '<p>') > 3,
                'has_comments' => preg_match('/comment|discussion|response/i', $html)
            ];

            $trueCount = count(array_filter($indicators));

            return $trueCount >= 5;
        } catch (\Exception $e) {
            return false;
        }
    }
}
