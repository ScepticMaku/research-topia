<?php

namespace App\Http\Controllers;

use App\Models\ResearchItem;
use App\Models\Url;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

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
        $html = $this->fetchMetadata($request);

        $title = $this->extractTitle($html);
        $description = $this->extractDescription($html);
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
        return redirect()->route('research-items');
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
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

            /*
            $title = $this->extractTitle($html);
            $description = $this->extractDescription($html);
            $url = $request->url;
            $image = $this->extractImage($html, $request);
            */

            return $html;

        } catch (\Exception $e) {
            return '';
        }
    }

    private function extractTitle($html) {
        if(preg_match('/<title[^>]*>(.*?)<\/title>/is', $html, $matches)) {
            return html_entity_decode(trim($matches[1]));
        }

         // Try Open Graph title
        if (preg_match('/<meta[^>]*property=["\']og:title["\'][^>]*content=["\']([^"\']+)["\']/is', $html, $matches)) {
            return html_entity_decode(trim($matches[1]));
        }

        // Try Twitter title
        if (preg_match('/<meta[^>]*name=["\']twitter:title["\'][^>]*content=["\']([^"\']+)["\']/is', $html, $matches)) {
            return html_entity_decode(trim($matches[1]));
        }

        return 'No title found';
    }

    private function extractDescription($html) {
        if(preg_match('/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\']/is', $html, $matches)) {
            return html_entity_decode(trim($matches[1]));
        }

        // Try Open Graph description
        if (preg_match('/<meta[^>]*property=["\']og:description["\'][^>]*content=["\']([^"\']+)["\']/is', $html, $matches)) {
            return html_entity_decode(trim($matches[1]));
        }

        // Try Twitter description
        if (preg_match('/<meta[^>]*name=["\']twitter:description["\'][^>]*content=["\']([^"\']+)["\']/is', $html, $matches)) {
            return html_entity_decode(trim($matches[1]));
        }

        return '';
    }

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

    private function makeAbsoluteUrl($url, $baseUrl) {
        if(empty($url)) return null;

        if(filter_var($url, FILTER_VALIDATE_URL)) {
            return $url;
        }

        $parsedBase = parse_url($baseUrl);
        $base = $parsedBase['scheme'].'://'.$parsedBase['host'];

        if(strpos($url, '/') === 0) {
            return $base.$url;
        }

        return $base.'/'.$url;
    }
}
