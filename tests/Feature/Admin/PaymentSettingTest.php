<?php

use App\Models\AppSetting;
use App\Models\PaymentMethod;
use App\Models\User;
use Database\Seeders\AppSettingSeeder;
use Database\Seeders\PaymentMethodSeeder;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
    $this->seed(PaymentMethodSeeder::class);
    $this->seed(AppSettingSeeder::class);
});

test('non-admin users cannot access admin payment settings', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/admin/payment-settings');

    $response->assertStatus(403);
});

test('admin can access payment settings page', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $response = $this->actingAs($admin)->get('/admin/payment-settings');

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('admin/payment-settings/index')
            ->has('bankTransferMethods')
            ->has('eWalletMethods')
            ->has('appFee')
        );
});

test('admin can toggle payment method active status', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $method = PaymentMethod::where('code', 'bca')->firstOrFail();
    expect($method->is_active)->toBeTrue();

    $response = $this->actingAs($admin)->patch("/admin/payment-settings/methods/{$method->id}", [
        'is_active' => false,
    ]);

    $response->assertRedirect();

    $method->refresh();
    expect($method->is_active)->toBeFalse();
});

test('admin can update application development admin fee', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $response = $this->actingAs($admin)->post('/admin/payment-settings/app-fee', [
        'app_fee' => 1500,
    ]);

    $response->assertRedirect();

    expect(AppSetting::get('app_fee'))->toBe('1500');
});
