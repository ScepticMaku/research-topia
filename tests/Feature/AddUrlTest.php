<?php

use App\Models\User;

test('metadata url has been fetched', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('metadata.fetch'), [
        'url' => 'https://laravel.com/docs/12.x/helpers#urls'
    ]);

    $response->assertSuccessful();
});
