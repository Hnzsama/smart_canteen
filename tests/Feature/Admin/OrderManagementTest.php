<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Tenant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guest is redirected to login when accessing admin orders', function () {
    $this->get(route('admin.orders'))
        ->assertRedirect(route('login'));
});

test('non-admin user receives 403 forbidden when accessing admin orders', function () {
    $mahasiswa = User::factory()->mahasiswa()->create();

    $this->actingAs($mahasiswa)
        ->get(route('admin.orders'))
        ->assertForbidden();
});

test('admin can view orders list with summary metrics and item details', function () {
    $admin = User::factory()->admin()->create();
    $tenant = Tenant::factory()->create(['name' => 'Stand Soto Ayam']);
    $student = User::factory()->mahasiswa()->create(['name' => 'Rian Hidayat']);

    $order = Order::factory()->create([
        'order_number' => 'SC-20260919-0101',
        'pickup_code' => 'FEB-9999',
        'tenant_id' => $tenant->id,
        'user_id' => $student->id,
        'total_amount' => 30000.00,
        'payment_method' => PaymentMethod::Cashless,
        'payment_status' => PaymentStatus::Paid,
        'status' => OrderStatus::Processing,
    ]);

    $order->items()->create([
        'menu_name' => 'Soto Ayam Komplit',
        'price' => 25000.00,
        'quantity' => 1,
        'subtotal' => 25000.00,
    ]);

    $order->items()->create([
        'menu_name' => 'Es Jeruk',
        'price' => 5000.00,
        'quantity' => 1,
        'subtotal' => 5000.00,
    ]);

    $response = $this->actingAs($admin)
        ->get(route('admin.orders'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/orders')
        ->has('orders.data', 1)
        ->where('orders.data.0.order_number', 'SC-20260919-0101')
        ->where('orders.data.0.pickup_code', 'FEB-9999')
        ->where('orders.data.0.customer_name', 'Rian Hidayat')
        ->where('orders.data.0.tenant_name', 'Stand Soto Ayam')
        ->where('orders.data.0.total_amount', 30000)
        ->has('orders.data.0.items', 2)
        ->where('summary.total_orders', 1)
        ->where('summary.total_revenue', 30000)
        ->where('summary.cashless_revenue', 30000)
        ->where('summary.cash_revenue', 0)
        ->has('tenants')
        ->has('filters')
    );
});

test('admin can filter orders by tenant and payment method', function () {
    $admin = User::factory()->admin()->create();
    $tenantA = Tenant::factory()->create(['name' => 'Stand A']);
    $tenantB = Tenant::factory()->create(['name' => 'Stand B']);
    $student = User::factory()->mahasiswa()->create();

    // Order at Stand A (Cashless)
    Order::factory()->create([
        'order_number' => 'SC-A-001',
        'tenant_id' => $tenantA->id,
        'user_id' => $student->id,
        'payment_method' => PaymentMethod::Cashless,
    ]);

    // Order at Stand B (Cash)
    Order::factory()->cash()->create([
        'order_number' => 'SC-B-002',
        'tenant_id' => $tenantB->id,
        'user_id' => $student->id,
    ]);

    // Filter Stand A
    $response = $this->actingAs($admin)
        ->get(route('admin.orders', ['tenant_id' => $tenantA->id]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/orders')
        ->has('orders.data', 1)
        ->where('orders.data.0.order_number', 'SC-A-001')
    );

    // Filter Payment Method Cash
    $cashResponse = $this->actingAs($admin)
        ->get(route('admin.orders', ['payment_method' => 'cash']));

    $cashResponse->assertOk();
    $cashResponse->assertInertia(fn (Assert $page) => $page
        ->component('admin/orders')
        ->has('orders.data', 1)
        ->where('orders.data.0.order_number', 'SC-B-002')
    );
});

test('admin can search orders by pickup code or customer name', function () {
    $admin = User::factory()->admin()->create();
    $student = User::factory()->mahasiswa()->create(['name' => 'Aditya Pratama']);

    Order::factory()->create([
        'order_number' => 'SC-12345',
        'pickup_code' => 'FEB-7777',
        'user_id' => $student->id,
    ]);

    // Search by pickup code
    $response = $this->actingAs($admin)
        ->get(route('admin.orders', ['search' => 'FEB-7777']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/orders')
        ->has('orders.data', 1)
        ->where('orders.data.0.pickup_code', 'FEB-7777')
    );

    // Search by customer name
    $nameResponse = $this->actingAs($admin)
        ->get(route('admin.orders', ['search' => 'Aditya']));

    $nameResponse->assertOk();
    $nameResponse->assertInertia(fn (Assert $page) => $page
        ->component('admin/orders')
        ->has('orders.data', 1)
        ->where('orders.data.0.customer_name', 'Aditya Pratama')
    );
});

test('admin can update order status and payment status with audit timestamps', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create([
        'status' => OrderStatus::Pending,
        'payment_status' => PaymentStatus::Unpaid,
        'paid_at' => null,
        'ready_at' => null,
    ]);

    $response = $this->actingAs($admin)
        ->patch(route('admin.orders.update-status', $order), [
            'status' => OrderStatus::Ready->value,
            'payment_status' => PaymentStatus::Paid->value,
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'success');

    $order->refresh();
    expect($order->status)->toBe(OrderStatus::Ready);
    expect($order->payment_status)->toBe(PaymentStatus::Paid);
    expect($order->paid_at)->not->toBeNull();
    expect($order->ready_at)->not->toBeNull();
});

test('admin can soft delete an order', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create();

    $response = $this->actingAs($admin)
        ->delete(route('admin.orders.destroy', $order));

    $response->assertRedirect();
    $response->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'success');

    $this->assertSoftDeleted('orders', [
        'id' => $order->id,
    ]);
});

test('database error during status update is caught and returns friendly toast', function () {
    $admin = User::factory()->admin()->create();
    $order = Order::factory()->create();

    Order::saving(function () {
        throw new Exception('Simulated database write error during order audit');
    });

    $response = $this->actingAs($admin)
        ->patch(route('admin.orders.update-status', $order), [
            'status' => OrderStatus::Completed->value,
            'payment_status' => PaymentStatus::Paid->value,
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'error' && str_contains($toast['message'], 'kesalahan sistem'));
});
