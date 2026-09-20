<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Tenant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guest is redirected to login when accessing admin dashboard', function () {
    $this->get(route('admin.dashboard'))
        ->assertRedirect(route('login'));
});

test('non-admin user receives 403 forbidden when accessing admin dashboard', function () {
    $mahasiswa = User::factory()->mahasiswa()->create();
    $tenant = Tenant::factory()->create();
    $tenantUser = User::factory()->tenant($tenant)->create();

    $this->actingAs($mahasiswa)
        ->get(route('admin.dashboard'))
        ->assertForbidden();

    $this->actingAs($tenantUser)
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('admin can access dashboard and receives real metrics, chart series, and recent orders', function () {
    $admin = User::factory()->admin()->create();
    $tenant = Tenant::factory()->create(['name' => 'Kantin Berkah', 'is_active' => true]);
    $student = User::factory()->mahasiswa()->create(['name' => 'Doni Mahasiswa']);

    // Create 1 Cashless paid order
    Order::factory()->create([
        'order_number' => 'SC-20260919-0001',
        'pickup_code' => 'FEB-1111',
        'tenant_id' => $tenant->id,
        'user_id' => $student->id,
        'total_amount' => 25000.00,
        'payment_method' => PaymentMethod::Cashless,
        'payment_status' => PaymentStatus::Paid,
        'status' => OrderStatus::Processing,
    ]);

    // Create 1 Cash unpaid order
    Order::factory()->cash()->create([
        'order_number' => 'SC-20260919-0002',
        'pickup_code' => 'FEB-2222',
        'tenant_id' => $tenant->id,
        'user_id' => $student->id,
        'total_amount' => 15000.00,
    ]);

    $response = $this->actingAs($admin)
        ->get(route('admin.dashboard'));

    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/dashboard')
        ->has('metrics')
        ->where('metrics.total_orders', 2)
        ->where('metrics.paid_orders', 1)
        ->where('metrics.total_revenue', 25000)
        ->where('metrics.cashless_orders', 1)
        ->where('metrics.cash_orders', 1)
        ->where('metrics.cashless_percentage', 50)
        ->where('metrics.cash_percentage', 50)
        ->where('metrics.active_tenants', 1)
        ->has('recentOrders', 2)
        ->where('recentOrders.0.pickup_code', 'FEB-2222')
        ->has('revenueTrend', 7)
        ->has('paymentDistribution', 2)
        ->has('tenants', 1)
        ->where('selectedTenantId', null)
    );
});

test('admin can filter dashboard by specific tenant', function () {
    $admin = User::factory()->admin()->create();
    $tenantA = Tenant::factory()->create(['name' => 'Stand Ayam Geprek']);
    $tenantB = Tenant::factory()->create(['name' => 'Stand Jus Buah']);
    $student = User::factory()->mahasiswa()->create();

    // Order for Tenant A
    Order::factory()->create([
        'order_number' => 'SC-A-0001',
        'tenant_id' => $tenantA->id,
        'user_id' => $student->id,
        'total_amount' => 30000.00,
        'payment_method' => PaymentMethod::Cashless,
        'payment_status' => PaymentStatus::Paid,
    ]);

    // Order for Tenant B
    Order::factory()->create([
        'order_number' => 'SC-B-0001',
        'tenant_id' => $tenantB->id,
        'user_id' => $student->id,
        'total_amount' => 10000.00,
        'payment_method' => PaymentMethod::Cashless,
        'payment_status' => PaymentStatus::Paid,
    ]);

    $response = $this->actingAs($admin)
        ->get(route('admin.dashboard', ['tenant_id' => $tenantA->id]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/dashboard')
        ->where('selectedTenantId', $tenantA->id)
        ->where('metrics.total_orders', 1)
        ->where('metrics.total_revenue', 30000)
        ->has('recentOrders', 1)
        ->where('recentOrders.0.order_number', 'SC-A-0001')
    );
});
