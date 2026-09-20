<?php

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Menu;
use App\Models\Order;
use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Spatie\Permission\Models\Role;

test('database seeder successfully populates demo records and permissions', function () {
    $this->seed(DatabaseSeeder::class);

    // 1. Roles
    expect(Role::where('name', UserRole::Admin->value)->exists())->toBeTrue()
        ->and(Role::where('name', UserRole::Tenant->value)->exists())->toBeTrue()
        ->and(Role::where('name', UserRole::Mahasiswa->value)->exists())->toBeTrue();

    // 2. Tenants & Menus
    expect(Tenant::count())->toBeGreaterThanOrEqual(3)
        ->and(Category::count())->toBeGreaterThanOrEqual(6)
        ->and(Menu::count())->toBeGreaterThanOrEqual(10);

    // 3. Demo Users
    $admin = User::where('email', 'admin@feb.ac.id')->first();
    $tenantUser = User::where('email', 'tenant@feb.ac.id')->first();
    $mahasiswa = User::where('email', 'mahasiswa@feb.ac.id')->first();

    expect($admin)->not->toBeNull()
        ->and($admin->hasRole(UserRole::Admin->value))->toBeTrue()
        ->and($tenantUser)->not->toBeNull()
        ->and($tenantUser->hasRole(UserRole::Tenant->value))->toBeTrue()
        ->and($tenantUser->tenant_id)->not->toBeNull()
        ->and($mahasiswa)->not->toBeNull()
        ->and($mahasiswa->hasRole(UserRole::Mahasiswa->value))->toBeTrue();

    // 4. Demo Orders & Items
    expect(Order::count())->toBeGreaterThanOrEqual(3)
        ->and(Order::whereNotNull('snap_token')->exists())->toBeTrue()
        ->and(Order::where('pickup_code', 'FEB-8821')->exists())->toBeTrue();
});
