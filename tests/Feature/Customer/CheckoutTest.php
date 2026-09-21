<?php

use App\Models\Menu;
use App\Models\Order;
use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\AppSettingSeeder;
use Database\Seeders\PaymentMethodSeeder;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
    $this->seed(PaymentMethodSeeder::class);
    $this->seed(AppSettingSeeder::class);
});

test('unauthenticated user is redirected from checkout page', function () {
    $response = $this->get('/checkout');

    $response->assertRedirect('/login');
});

test('authenticated user can view checkout page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/checkout');

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('customer/checkout/index')
            ->has('bankTransferMethods')
            ->has('eWalletMethods')
            ->has('appFee')
        );
});

test('user can submit checkout order with cash payment', function () {
    $user = User::factory()->create();
    $tenant = Tenant::factory()->create(['is_active' => true, 'is_open' => true]);
    $menu = Menu::factory()->create([
        'tenant_id' => $tenant->id,
        'price' => 15000,
        'is_available' => true,
    ]);

    $payload = [
        'items' => [
            [
                'menu_id' => $menu->id,
                'qty' => 2,
                'price' => 30000,
                'choices' => ['Pedas' => ['name' => 'Sedang', 'price' => 0]],
                'note' => 'Jangan pakai cuka',
            ],
        ],
        'payment_method' => 'cash',
        'payment_channel_code' => null,
        'dining_option' => 'dine_in',
        'notes' => 'Catatan umum pesanan',
    ];

    $response = $this->actingAs($user)->postJson('/checkout', $payload);

    $response->assertStatus(200)
        ->assertJson(['success' => true]);

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'tenant_id' => $tenant->id,
        'dining_option' => 'dine_in',
        'payment_method' => 'cash',
        'status' => 'pending',
    ]);
});

test('user can submit checkout order with QRIS payment and receive payment info', function () {
    $user = User::factory()->create();
    $tenant = Tenant::factory()->create(['is_active' => true, 'is_open' => true]);
    $menu = Menu::factory()->create([
        'tenant_id' => $tenant->id,
        'price' => 20000,
        'is_available' => true,
    ]);

    $payload = [
        'items' => [
            [
                'menu_id' => $menu->id,
                'qty' => 1,
                'price' => 20000,
                'choices' => [],
                'note' => '',
            ],
        ],
        'payment_method' => 'cashless',
        'payment_channel_code' => 'qris',
        'dining_option' => 'takeaway',
    ];

    $response = $this->actingAs($user)->postJson('/checkout', $payload);

    $response->assertStatus(200)
        ->assertJson(['success' => true])
        ->assertJsonPath('payment_info.type', 'qris');

    $order = Order::where('user_id', $user->id)->first();
    expect($order)->not->toBeNull()
        ->and($order->payment_channel_code)->toBe('qris')
        ->and($order->payment_details)->toHaveKey('qr_url');
});

test('user cannot submit checkout order if stand is closed', function () {
    $user = User::factory()->create();
    $tenant = Tenant::factory()->create(['is_active' => true, 'is_open' => false]);
    $menu = Menu::factory()->create([
        'tenant_id' => $tenant->id,
        'price' => 20000,
        'is_available' => true,
    ]);

    $payload = [
        'items' => [
            [
                'menu_id' => $menu->id,
                'qty' => 1,
                'price' => 20000,
                'choices' => [],
                'note' => '',
            ],
        ],
        'payment_method' => 'cash',
        'payment_channel_code' => null,
        'dining_option' => 'dine_in',
    ];

    $response = $this->actingAs($user)->postJson('/checkout', $payload);

    $response->assertStatus(422)
        ->assertJsonPath('message', "Stand '{$tenant->name}' sedang tutup. Silakan hapus item dari stand ini untuk melanjutkan.");
});

test('user cannot submit checkout order if menu is unavailable', function () {
    $user = User::factory()->create();
    $tenant = Tenant::factory()->create(['is_active' => true, 'is_open' => true]);
    $menu = Menu::factory()->create([
        'tenant_id' => $tenant->id,
        'price' => 20000,
        'is_available' => false,
    ]);

    $payload = [
        'items' => [
            [
                'menu_id' => $menu->id,
                'qty' => 1,
                'price' => 20000,
                'choices' => [],
                'note' => '',
            ],
        ],
        'payment_method' => 'cash',
        'payment_channel_code' => null,
        'dining_option' => 'dine_in',
    ];

    $response = $this->actingAs($user)->postJson('/checkout', $payload);

    $response->assertStatus(422)
        ->assertJsonPath('message', "Menu '{$menu->name}' sedang tidak tersedia.");
});
