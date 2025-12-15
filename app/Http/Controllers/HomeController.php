<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ResearchItem;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function researchItems() {
        $userId = Auth::user()->id;

        $researchItems = ResearchItem::with('user', 'category', 'url', 'tag')->where('user_id', $userId)->get();

        return Inertia::render('research-items/index', [
            'researchItems' => $researchItems,
        ]);
    }
}
