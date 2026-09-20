<?php

use App\Models\User;

test('guests can visit the catalog at root', function () {
    $response = $this->get(route('home'));
    $response->assertOk();
});

test('authenticated student can visit the catalog at root', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('home'));
    $response->assertOk();
});

test('dashboard route redirects students to root catalog', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('catalog'));
});
