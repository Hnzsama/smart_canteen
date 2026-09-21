<?php

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

test('unauthenticated user is redirected from orders index and history', function () {
    $this->get('/orders')->assertRedirect('/login');
    $this->get('/orders/history')->assertRedirect('/login');
});

test('authenticated user can view active orders list', function () {
    $user = User::factory()->create();
    $tenant = Tenant::factory()->create();

    Order::factory()->create([
        'user_id' => $user->id,
        'tenant_id' => $tenant->id,
        'status' => 'processing',
    ]);

    $response = $this->actingAs($user)->get('/orders');

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('customer/orders/index')
            ->has('activeOrders', 1)
        );
});

test('authenticated user can view completed order history', function () {
    $user = User::factory()->create();
    $tenant = Tenant::factory()->create();

    Order::factory()->create([
        'user_id' => $user->id,
        'tenant_id' => $tenant->id,
        'status' => 'completed',
    ]);

    $response = $this->actingAs($user)->get('/orders/history');

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('customer/orders/history')
            ->has('orderHistory', 1)
        );
});

test('authenticated user can view dedicated payment page for order', function () {
    $user = User::factory()->create();
    $tenant = Tenant::factory()->create();

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'tenant_id' => $tenant->id,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($user)->get("/orders/{$order->id}/payment");

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('customer/orders/payment')
            ->has('order')
        );
});

test('authenticated user can submit rating for completed order', function () {
    $user = User::factory()->create();
    $tenant = Tenant::factory()->create();

    $order = Order::factory()->create([
        'user_id' => $user->id,
        'tenant_id' => $tenant->id,
        'status' => 'completed',
    ]);

    $response = $this->actingAs($user)->post("/orders/{$order->id}/rate", [
        'rating' => 5,
        'comment' => 'Makanan sangat enak!',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('tenant_ratings', [
        'order_id' => $order->id,
        'tenant_id' => $tenant->id,
        'user_id' => $user->id,
        'rating' => 5,
        'comment' => 'Makanan sangat enak!',
    ]);
});

test('confirming cash payment automatically updates status to processing', function () {
    $tenantUser = User::factory()->create();
    $tenant = Tenant::factory()->create();
    $tenantUser->update(['tenant_id' => $tenant->id]);
    $tenantUser->assignRole('tenant');

    $order = Order::factory()->create([
        'tenant_id' => $tenant->id,
        'payment_method' => 'cash',
        'payment_status' => 'unpaid',
        'status' => 'pending',
    ]);

    $response = $this->actingAs($tenantUser)->post("/tenant/orders/{$order->id}/confirm-cash");

    $response->assertRedirect();

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'payment_status' => 'paid',
        'status' => 'processing',
    ]);
});
