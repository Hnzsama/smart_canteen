<?php

use App\Models\Category;
use App\Models\Menu;
use App\Models\Order;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Schema;

test('all required smart canteen tables exist in schema', function () {
    expect(Schema::hasTable('tenants'))->toBeTrue()
        ->and(Schema::hasTable('categories'))->toBeTrue()
        ->and(Schema::hasTable('menus'))->toBeTrue()
        ->and(Schema::hasTable('orders'))->toBeTrue()
        ->and(Schema::hasTable('order_items'))->toBeTrue()
        ->and(Schema::hasTable('users'))->toBeTrue()
        ->and(Schema::hasTable('roles'))->toBeTrue()
        ->and(Schema::hasTable('permissions'))->toBeTrue();
});

test('users table has tenant_id and deleted_at columns', function () {
    expect(Schema::hasColumns('users', ['tenant_id', 'deleted_at']))->toBeTrue();
});

test('tenants table has required columns', function () {
    expect(Schema::hasColumns('tenants', [
        'id', 'name', 'slug', 'description', 'image', 'is_active', 'deleted_at', 'created_at', 'updated_at',
    ]))->toBeTrue();
});

test('orders table has required columns for payment and pickup lifecycle', function () {
    expect(Schema::hasColumns('orders', [
        'id', 'order_number', 'pickup_code', 'user_id', 'tenant_id',
        'total_amount', 'payment_method', 'payment_status', 'status',
        'snap_token', 'paid_at', 'processing_at', 'ready_at', 'completed_at',
        'deleted_at', 'created_at', 'updated_at',
    ]))->toBeTrue();
});

test('soft deletes work properly on models', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id]);
    $menu = Menu::factory()->forCategory(
        Category::factory()->create(['tenant_id' => $tenant->id])
    )->create();
    $order = Order::factory()->create([
        'tenant_id' => $tenant->id,
        'user_id' => $user->id,
    ]);

    $tenant->delete();
    $user->delete();
    $menu->delete();
    $order->delete();

    expect(Tenant::count())->toBe(0)
        ->and(Tenant::withTrashed()->count())->toBe(1)
        ->and(User::find($user->id))->toBeNull()
        ->and(User::withTrashed()->find($user->id))->not->toBeNull()
        ->and(Menu::find($menu->id))->toBeNull()
        ->and(Menu::withTrashed()->find($menu->id))->not->toBeNull()
        ->and(Order::find($order->id))->toBeNull()
        ->and(Order::withTrashed()->find($order->id))->not->toBeNull();
});
