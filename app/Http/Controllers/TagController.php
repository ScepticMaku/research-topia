<?php

namespace App\Http\Controllers;

use App\Models\ResearchItem;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function addTag(Request $request) {

        $request->validate([
            'name' => 'required|string'
        ]);

        $researchItemId = $request->research_item_id;
        $researchItem = ResearchItem::find($researchItemId);

        if(!$researchItem) {
            return redirect()->route('research-items')->with('error', 'Research item not found.');
        }

        $researchItem->tag()->create([
            'name' => $request->name
        ]);

        return redirect()->route('research-items');
    }

    public function removeTag(string $id) {
        $tag = Tag::find($id);

        if(!$tag) {
            return redirect()->route('research-items')->with('error', 'Tag not found.');
        }

        Tag::destroy($id);

        return redirect()->route('research-items');
    }
}
