<?php

use App\Enums\UserRole;
use App\Models\Tenant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guest is redirected to login when accessing admin users', function () {
    $this->get(route('admin.users'))
        ->assertRedirect(route('login'));
});

test('non-admin user receives 403 forbidden when accessing admin users', function () {
    $mahasiswa = User::factory()->mahasiswa()->create();

    $this->actingAs($mahasiswa)
        ->get(route('admin.users'))
        ->assertForbidden();

    $this->actingAs($mahasiswa)
        ->post(route('admin.users.store'), [
            'name' => 'Hacker User',
            'email' => 'hacker@example.com',
            'password' => 'password123',
            'role' => 'admin',
        ])
        ->assertForbidden();
});

test('admin can view users list with counts and filters', function () {
    $admin = User::factory()->admin()->create();
    $mahasiswa = User::factory()->mahasiswa()->create();
    $tenant = Tenant::factory()->create();
    $tenantUser = User::factory()->tenant($tenant)->create();
    $trashedUser = User::factory()->mahasiswa()->create();
    $trashedUser->delete();

    $response = $this->actingAs($admin)
        ->get(route('admin.users'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/users')
        ->has('users', 3)
        ->where('counts.all', 3)
        ->where('counts.admin', 1)
        ->where('counts.mahasiswa', 1)
        ->where('counts.tenant', 1)
        ->where('counts.trashed', 1)
        ->where('filters.role', 'all')
        ->has('tenants')
    );
});

test('admin can filter users by role and search keyword', function () {
    $admin = User::factory()->admin()->create();
    $tenant = Tenant::factory()->create(['name' => 'Stand Ayam Geprek']);
    User::factory()->tenant($tenant)->create(['name' => 'Budi Penjual', 'email' => 'budi@kantin.com']);
    User::factory()->mahasiswa()->create(['name' => 'Siti Mahasiswi', 'email' => 'siti@student.ac.id']);

    // Filter by role tenant
    $response = $this->actingAs($admin)
        ->get(route('admin.users', ['role' => 'tenant']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/users')
        ->has('users', 1)
        ->where('users.0.name', 'Budi Penjual')
        ->where('users.0.role', 'tenant')
        ->where('users.0.tenant_name', 'Stand Ayam Geprek')
    );

    // Filter by search keyword
    $searchResponse = $this->actingAs($admin)
        ->get(route('admin.users', ['search' => 'siti@student']));

    $searchResponse->assertOk();
    $searchResponse->assertInertia(fn (Assert $page) => $page
        ->component('admin/users')
        ->has('users', 1)
        ->where('users.0.name', 'Siti Mahasiswi')
    );
});

test('admin can create a new mahasiswa user', function () {
    $admin = User::factory()->admin()->create();

    $payload = [
        'name' => 'Doni Darmawan',
        'email' => 'doni@student.feb.ac.id',
        'password' => 'password123',
        'role' => UserRole::Mahasiswa->value,
        'verify_email_now' => true,
    ];

    $response = $this->actingAs($admin)
        ->post(route('admin.users.store'), $payload);

    $response->assertRedirect();
    $response->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'success');

    $this->assertDatabaseHas('users', [
        'name' => 'Doni Darmawan',
        'email' => 'doni@student.feb.ac.id',
        'tenant_id' => null,
    ]);

    $createdUser = User::where('email', 'doni@student.feb.ac.id')->first();
    expect($createdUser->hasRole(UserRole::Mahasiswa->value))->toBeTrue();
    expect($createdUser->hasVerifiedEmail())->toBeTrue();
});

test('admin can create a new tenant user linked to a stand', function () {
    $admin = User::factory()->admin()->create();
    $tenant = Tenant::factory()->create(['name' => 'Stand Jus Segar']);

    $payload = [
        'name' => 'Pak Bambang Jus',
        'email' => 'bambang@kantin.id',
        'password' => 'password123',
        'role' => UserRole::Tenant->value,
        'tenant_id' => $tenant->id,
        'verify_email_now' => true,
    ];

    $response = $this->actingAs($admin)
        ->post(route('admin.users.store'), $payload);

    $response->assertRedirect();
    $response->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'success');

    $this->assertDatabaseHas('users', [
        'name' => 'Pak Bambang Jus',
        'email' => 'bambang@kantin.id',
        'tenant_id' => $tenant->id,
    ]);

    $createdUser = User::where('email', 'bambang@kantin.id')->first();
    expect($createdUser->hasRole(UserRole::Tenant->value))->toBeTrue();
});

test('tenant user creation requires valid tenant_id', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)
        ->post(route('admin.users.store'), [
            'name' => 'Tenant Tanpa Stand',
            'email' => 'tanpastand@example.com',
            'password' => 'password123',
            'role' => UserRole::Tenant->value,
            'tenant_id' => null,
        ]);

    $response->assertSessionHasErrors('tenant_id');
});

test('admin can update user profile and role', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->mahasiswa()->create([
        'name' => 'Nama Lama',
        'email' => 'lama@example.com',
    ]);
    $tenant = Tenant::factory()->create();

    $response = $this->actingAs($admin)
        ->put(route('admin.users.update', $user), [
            'name' => 'Nama Baru',
            'email' => 'baru@example.com',
            'role' => UserRole::Tenant->value,
            'tenant_id' => $tenant->id,
            'verify_email_now' => true,
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'success');

    $user->refresh();
    expect($user->name)->toBe('Nama Baru');
    expect($user->email)->toBe('baru@example.com');
    expect($user->hasRole(UserRole::Tenant->value))->toBeTrue();
    expect($user->tenant_id)->toBe($tenant->id);
});

test('admin cannot demote their own admin role', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)
        ->put(route('admin.users.update', $admin), [
            'name' => $admin->name,
            'email' => $admin->email,
            'role' => UserRole::Mahasiswa->value,
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'error' && str_contains($toast['message'], 'tidak dapat mengubah role'));

    expect($admin->fresh()->hasRole(UserRole::Admin->value))->toBeTrue();
});

test('admin cannot soft delete their own account', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $admin));

    $response->assertRedirect();
    $response->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'error' && str_contains($toast['message'], 'tidak dapat menghapus akun Anda sendiri'));

    expect($admin->fresh()->trashed())->toBeFalse();
});

test('admin can soft delete other users and restore them', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->mahasiswa()->create();

    // Soft delete
    $deleteResponse = $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $user));

    $deleteResponse->assertRedirect();
    $deleteResponse->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'success' && str_contains($toast['message'], 'tempat sampah'));
    expect($user->fresh()->trashed())->toBeTrue();

    // Restore
    $restoreResponse = $this->actingAs($admin)
        ->post(route('admin.users.restore', $user->id));

    $restoreResponse->assertRedirect();
    $restoreResponse->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'success' && str_contains($toast['message'], 'dipulihkan'));
    expect($user->fresh()->trashed())->toBeFalse();
});

test('admin can toggle user email verification status', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->mahasiswa()->unverified()->create();

    expect($user->hasVerifiedEmail())->toBeFalse();

    // Verify
    $response = $this->actingAs($admin)
        ->patch(route('admin.users.toggle-verify', $user));

    $response->assertRedirect();
    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();

    // Unverify
    $this->actingAs($admin)
        ->patch(route('admin.users.toggle-verify', $user));

    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

test('database error during user creation is caught and returns friendly toast', function () {
    $admin = User::factory()->admin()->create();

    User::saving(function () {
        throw new Exception('Simulated database write error');
    });

    $response = $this->actingAs($admin)
        ->post(route('admin.users.store'), [
            'name' => 'User Gagal Error',
            'email' => 'gagal@example.com',
            'password' => 'password123',
            'role' => UserRole::Mahasiswa->value,
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'error' && str_contains($toast['message'], 'kesalahan sistem'));
});

test('admin user listing returns server-side pagination meta and responds to page and per_page query', function () {
    $admin = User::factory()->admin()->create();

    User::factory()->count(14)->mahasiswa()->create();

    $response = $this->actingAs($admin)
        ->get(route('admin.users', ['per_page' => 5, 'page' => 2]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/users')
        ->has('users', 5)
        ->where('pagination.current_page', 2)
        ->where('pagination.per_page', 5)
        ->where('pagination.total', 15) // 1 admin + 14 mahasiswa
        ->where('pagination.last_page', 3)
    );
});
