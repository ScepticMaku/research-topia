<?php

use App\Models\User;
use App\Models\Category;

test('can create a category', function() {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('category.store'), [
        'name' => 'test'
    ]);

    $response->assertRedirect(route('research-items'));
});

test('can update a category', function() {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($user)->put(route('category.update', $category->id), [
        'name' => 'new test'
    ]);

    $response->assertRedirect(route('research-items'));
});

test('can delete a category', function() {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($user)->delete(route('category.destroy', $category->id));

    $response->assertRedirect(route('research-items'));

});
