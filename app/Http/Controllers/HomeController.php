<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ResearchItem;

class HomeController extends Controller
{
    public function researchItems() {
        $researchItems = ResearchItem::with('user', 'category', 'url', 'tag')->get();

        return Inertia::render('research-items/index', [
            'researchItems' => $researchItems
        ]);
    }
}
