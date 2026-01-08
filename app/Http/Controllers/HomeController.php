<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ResearchItem;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function researchItems() {
        $userId = Auth::user()->id;
        $categories = Category::get();
        $researchItems = ResearchItem::with('user', 'category', 'url', 'tag')->where('user_id', $userId)->paginate(5);

        return Inertia::render('research-items/index', [
            'researchItems' => $researchItems,
            'categories' => $categories,
        ]);
    }
}
