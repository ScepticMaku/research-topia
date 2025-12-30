<?php

use App\Models\Category;
use App\Models\ResearchItem;
use App\Models\Tag;
use App\Models\User;

test('fetch research items', function() {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('research-item.index'))->assertStatus(200);
});

test('can add a url', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('research-item.store'), [
        'url' => 'https://www.lazyvim.org/'
    ]);

    $response->assertRedirect(route('research-items'));
});

test('return error if not an url', function() {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('research-item.store'), [
        'url' => 'not-url'
    ]);

    $response->assertInvalid(['url']);
});

test('can update a research item', function() {
    $user = User::factory()->create();
    $researchItem = ResearchItem::factory()->create();

    $response = $this->actingAs($user)->put(route('research-item.update', $researchItem->id), [
        'title' => 'test',
        'description' => 'test',
        'note' => 'test',
        'url' => 'https://www.lazyvim.org/',
    ]);

    $response->assertRedirect(route('research-items'));
});

test('can delete a research item', function() {
    $user = User::factory()->create();
    $researchItem = ResearchItem::factory()->create();

    $response = $this->actingAs($user)->delete(route('research-item.destroy', $researchItem->id));

    $response->assertRedirect(route('research-items'));
});

test('can toggle favorites', function() {
    $user = User::factory()->create();
    $researchItem = ResearchItem::factory()->create();

    $response = $this->actingAs($user)->post(route('research-item.toggleFavorite', $researchItem->id));

    $response->assertRedirect(route('research-items'));
});

test('can change category', function() {
    $user = User::factory()->create();
    $researchItem = ResearchItem::factory()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($user)->put(route('research-item.selectCategory', $researchItem->id), [
        'category_id' => $category->id,
    ]);

    $response->assertRedirect(route('research-items'));
});

test('can add tags', function() {
    $user = User::factory()->create();
    ResearchItem::factory()->create();

    $response = $this->actingAs($user)->post(route('research-item.addTag'), [
        'name' => 'tag name',
    ]);

    $response->assertRedirect(route('research-items'));
});

test('can remove tags', function() {
    $user = User::factory()->create();
    ResearchItem::factory()->create();
    $tag = Tag::factory()->create();

    $response = $this->actingAs($user)->delete(route('research-item.removeTag', $tag->id));

    $response->assertRedirect(route('research-items'));
});
