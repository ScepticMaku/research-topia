<?php

use App\Models\User;

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
