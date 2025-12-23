<?php

use App\Models\ResearchItem;
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

test('can set to favorites if unfavorited', function() {
    $user = User::factory()->create();
    $researchItem = ResearchItem::factory()->create();

    $response = $this->actingAs($user)->put(route('research-item.setFavorite', $researchItem->id), [
        'set_favorite' => '0'
    ]);

    $response->assertRedirect(route('research-items'));
});

test('can set to unfavorites if favorited', function() {
    $user = User::factory()->create();
    $researchItem = ResearchItem::factory()->create();

    $response = $this->actingAs($user)->put(route('research-item.setFavorite', $researchItem->id), [
        'set_favorite' => '1'
    ]);

    $response->assertRedirect(route('research-items'));
});
