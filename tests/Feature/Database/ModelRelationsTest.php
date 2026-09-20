<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Tenant;
use App\Models\User;

test('tenant has categories, menus, users, and orders', function () {
    $tenant = Tenant::factory()->create();
    $category = Category::factory()->create(['tenant_id' => $tenant->id]);
    $menu = Menu::factory()->create([
        'tenant_id' => $tenant->id,
        'category_id' => $category->id,
    ]);
    $user = User::factory()->tenant($tenant)->create();
    $order = Order::factory()->create([
        'tenant_id' => $tenant->id,
        'user_id' => $user->id,
    ]);

    expect($tenant->categories)->toHaveCount(1)
        ->and($tenant->categories->first()->id)->toBe($category->id)
        ->and($tenant->menus)->toHaveCount(1)
        ->and($tenant->menus->first()->id)->toBe($menu->id)
        ->and($tenant->users)->toHaveCount(1)
        ->and($tenant->users->first()->id)->toBe($user->id)
        ->and($tenant->orders)->toHaveCount(1)
        ->and($tenant->orders->first()->id)->toBe($order->id);
});

test('order has items and belongs to user and tenant', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->mahasiswa()->create();
    $order = Order::factory()->create([
        'tenant_id' => $tenant->id,
        'user_id' => $user->id,
    ]);

    $item1 = OrderItem::factory()->create(['order_id' => $order->id]);
    $item2 = OrderItem::factory()->create(['order_id' => $order->id]);

    expect($order->user->id)->toBe($user->id)
        ->and($order->tenant->id)->toBe($tenant->id)
        ->and($order->items)->toHaveCount(2)
        ->and($item1->order->id)->toBe($order->id);
});

test('order casts enum values and datetimes correctly', function () {
    $order = Order::factory()->create([
        'payment_method' => PaymentMethod::Cashless,
        'payment_status' => PaymentStatus::Paid,
        'status' => OrderStatus::Processing,
        'paid_at' => now(),
        'processing_at' => now(),
    ]);

    expect($order->payment_method)->toBe(PaymentMethod::Cashless)
        ->and($order->payment_status)->toBe(PaymentStatus::Paid)
        ->and($order->status)->toBe(OrderStatus::Processing)
        ->and($order->paid_at)->toBeInstanceOf(DateTimeInterface::class)
        ->and($order->processing_at)->toBeInstanceOf(DateTimeInterface::class);
});

test('order item preserves price and menu name snapshot even after menu is modified or soft deleted', function () {
    $tenant = Tenant::factory()->create();
    $menu = Menu::factory()->create([
        'tenant_id' => $tenant->id,
        'name' => 'Nasi Ayam Crispy Spesial',
        'price' => 15000.00,
    ]);

    $order = Order::factory()->create(['tenant_id' => $tenant->id]);
    $orderItem = OrderItem::factory()->forMenu($menu, 2)->create([
        'order_id' => $order->id,
    ]);

    expect($orderItem->menu_name)->toBe('Nasi Ayam Crispy Spesial')
        ->and((float) $orderItem->price)->toBe(15000.00)
        ->and($orderItem->quantity)->toBe(2)
        ->and((float) $orderItem->subtotal)->toBe(30000.00);

    // Ubah data menu asli
    $menu->update([
        'name' => 'Nasi Ayam Crispy Versi 2',
        'price' => 20000.00,
    ]);

    // Hapus menu secara soft delete
    $menu->delete();

    $freshItem = $orderItem->fresh();
    expect($freshItem->menu_name)->toBe('Nasi Ayam Crispy Spesial')
        ->and((float) $freshItem->price)->toBe(15000.00)
        ->and((float) $freshItem->subtotal)->toBe(30000.00);
});

test('user factory creates users with correct spatie roles', function () {
    $admin = User::factory()->admin()->create();
    $tenantUser = User::factory()->tenant()->create();
    $mahasiswa = User::factory()->mahasiswa()->create();

    expect($admin->hasRole(UserRole::Admin->value))->toBeTrue()
        ->and($tenantUser->hasRole(UserRole::Tenant->value))->toBeTrue()
        ->and($tenantUser->tenant_id)->not->toBeNull()
        ->and($mahasiswa->hasRole(UserRole::Mahasiswa->value))->toBeTrue();
});
