<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create main application roles
        Role::findOrCreate(UserRole::Admin->value, 'web');
        Role::findOrCreate(UserRole::Tenant->value, 'web');
        Role::findOrCreate(UserRole::Mahasiswa->value, 'web');
    }
}
