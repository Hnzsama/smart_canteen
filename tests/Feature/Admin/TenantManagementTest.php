<?php

use App\Models\Tenant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guest is redirected to login when accessing admin tenants', function () {
    $this->get(route('admin.tenants'))
        ->assertRedirect(route('login'));
});

test('non-admin user receives 403 forbidden when accessing admin tenants', function () {
    $mahasiswa = User::factory()->mahasiswa()->create();

    $this->actingAs($mahasiswa)
        ->get(route('admin.tenants'))
        ->assertForbidden();

    $this->actingAs($mahasiswa)
        ->post(route('admin.tenants.store'), ['name' => 'Stand Ilegal'])
        ->assertForbidden();
});

test('admin can view tenants listing with counts and filters', function () {
    $admin = User::factory()->admin()->create();

    Tenant::factory()->create(['name' => 'Stand Alpha', 'is_active' => true]);
    Tenant::factory()->create(['name' => 'Stand Beta', 'is_active' => false]);
    $trashedTenant = Tenant::factory()->create(['name' => 'Stand Gamma']);
    $trashedTenant->delete();

    $response = $this->actingAs($admin)
        ->get(route('admin.tenants'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/tenants')
        ->has('tenants', 2)
        ->where('counts.all', 2)
        ->where('counts.active', 1)
        ->where('counts.inactive', 1)
        ->where('counts.trashed', 1)
        ->where('filters.status', 'all')
    );
});

test('admin can filter tenants by status trashed and search keyword', function () {
    $admin = User::factory()->admin()->create();

    Tenant::factory()->create(['name' => 'Stand Makanan Enak', 'is_active' => true]);
    $trashed = Tenant::factory()->create(['name' => 'Stand Minuman Segar', 'is_active' => true]);
    $trashed->delete();

    // Filter trashed
    $response = $this->actingAs($admin)
        ->get(route('admin.tenants', ['status' => 'trashed']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/tenants')
        ->has('tenants', 1)
        ->where('tenants.0.name', 'Stand Minuman Segar')
        ->where('filters.status', 'trashed')
    );

    // Filter search keyword
    $searchResponse = $this->actingAs($admin)
        ->get(route('admin.tenants', ['search' => 'Makanan']));

    $searchResponse->assertOk();
    $searchResponse->assertInertia(fn (Assert $page) => $page
        ->component('admin/tenants')
        ->has('tenants', 1)
        ->where('tenants.0.name', 'Stand Makanan Enak')
    );
});

test('admin cannot store tenant without manager account data', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)
        ->post(route('admin.tenants.store'), [
            'name' => 'Stand Tanpa Pengelola',
            'description' => 'Tidak punya pengelola',
            'is_active' => true,
        ]);

    $response->assertSessionHasErrors(['manager_mode']);

    $responseWithNewMode = $this->actingAs($admin)
        ->post(route('admin.tenants.store'), [
            'name' => 'Stand Tanpa Data Pengelola',
            'manager_mode' => 'new',
        ]);

    $responseWithNewMode->assertSessionHasErrors(['manager_name', 'manager_email', 'manager_password']);
});

test('admin can store a new tenant with newly created manager account', function () {
    $admin = User::factory()->admin()->create();

    $payload = [
        'name' => 'Kantin Jujur FEB',
        'description' => 'Menyediakan jajanan sehat dan higienis',
        'is_active' => true,
        'manager_mode' => 'new',
        'manager_name' => 'Pak Joko Pengelola',
        'manager_email' => 'joko@feb.ac.id',
        'manager_password' => 'password123',
    ];

    $response = $this->actingAs($admin)
        ->post(route('admin.tenants.store'), $payload);

    $response->assertRedirect();
    $response->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'success' && str_contains($toast['message'], 'berhasil ditambahkan'));

    $tenant = Tenant::where('name', 'Kantin Jujur FEB')->first();
    expect($tenant)->not->toBeNull();
    expect($tenant->slug)->toBe('kantin-jujur-feb');

    $this->assertDatabaseHas('users', [
        'name' => 'Pak Joko Pengelola',
        'email' => 'joko@feb.ac.id',
        'tenant_id' => $tenant->id,
    ]);

    $manager = User::where('email', 'joko@feb.ac.id')->first();
    expect($manager->hasRole('tenant'))->toBeTrue();
});

test('admin can store a new tenant by linking existing user', function () {
    $admin = User::factory()->admin()->create();
    $candidateUser = User::factory()->create([
        'name' => 'Calon Mitra',
        'email' => 'calonmitra@feb.ac.id',
    ]);

    $payload = [
        'name' => 'Stand Aneka Jus FEB',
        'description' => 'Jus buah segar',
        'is_active' => true,
        'manager_mode' => 'existing',
        'manager_user_id' => $candidateUser->id,
    ];

    $response = $this->actingAs($admin)
        ->post(route('admin.tenants.store'), $payload);

    $response->assertRedirect();
    $tenant = Tenant::where('name', 'Stand Aneka Jus FEB')->first();
    expect($tenant)->not->toBeNull();

    expect($candidateUser->fresh()->tenant_id)->toBe($tenant->id);
    expect($candidateUser->fresh()->hasRole('tenant'))->toBeTrue();
});

test('admin cannot store tenant with duplicate name', function () {
    $admin = User::factory()->admin()->create();
    Tenant::factory()->create(['name' => 'Stand Kopi']);

    $response = $this->actingAs($admin)
        ->post(route('admin.tenants.store'), [
            'name' => 'Stand Kopi',
            'description' => 'Kopi mantap',
            'is_active' => true,
            'manager_mode' => 'new',
            'manager_name' => 'Pengelola Kopi',
            'manager_email' => 'kopi_baru@feb.ac.id',
            'manager_password' => 'password123',
        ]);

    $response->assertSessionHasErrors('name');
});

test('admin can update an existing tenant', function () {
    $admin = User::factory()->admin()->create();
    $tenant = Tenant::factory()->create([
        'name' => 'Stand Minuman Dingin',
        'description' => 'Es teh dan kopi',
        'is_active' => true,
    ]);
    User::factory()->create([
        'tenant_id' => $tenant->id,
        'email' => 'existing_pengelola@feb.ac.id',
    ]);

    $response = $this->actingAs($admin)
        ->put(route('admin.tenants.update', $tenant), [
            'name' => 'Stand Minuman Segar & Hangat',
            'description' => 'Es teh, jus buah, dan kopi susu',
            'is_active' => false,
            'manager_mode' => 'keep',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'success');

    $this->assertDatabaseHas('tenants', [
        'id' => $tenant->id,
        'name' => 'Stand Minuman Segar & Hangat',
        'slug' => 'stand-minuman-segar-hangat',
        'is_active' => false,
    ]);
});

test('admin can assign manager to unmanaged tenant during update', function () {
    $admin = User::factory()->admin()->create();
    $tenant = Tenant::factory()->create([
        'name' => 'Stand Tanpa Akun Awal',
        'is_active' => true,
    ]);

    // Updating without manager should fail because it has no manager yet
    $failResponse = $this->actingAs($admin)
        ->put(route('admin.tenants.update', $tenant), [
            'name' => 'Stand Update Gagal',
        ]);
    $failResponse->assertSessionHasErrors(['manager_mode']);

    // Updating with new manager succeeds
    $successResponse = $this->actingAs($admin)
        ->put(route('admin.tenants.update', $tenant), [
            'name' => 'Stand Sudah Berakun',
            'manager_mode' => 'new',
            'manager_name' => 'Pengelola Baru',
            'manager_email' => 'pengelolabaru@feb.ac.id',
            'manager_password' => 'password123',
        ]);

    $successResponse->assertRedirect();
    $this->assertDatabaseHas('users', [
        'email' => 'pengelolabaru@feb.ac.id',
        'tenant_id' => $tenant->id,
    ]);
});

test('admin can toggle tenant operational status', function () {
    $admin = User::factory()->admin()->create();
    $tenant = Tenant::factory()->create(['is_active' => true]);

    $response = $this->actingAs($admin)
        ->patch(route('admin.tenants.toggle-status', $tenant));

    $response->assertRedirect();
    $response->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'success');
    expect($tenant->fresh()->is_active)->toBeFalse();

    // Toggle back to active
    $this->actingAs($admin)
        ->patch(route('admin.tenants.toggle-status', $tenant));

    expect($tenant->fresh()->is_active)->toBeTrue();
});

test('admin can soft delete a tenant', function () {
    $admin = User::factory()->admin()->create();
    $tenant = Tenant::factory()->create(['name' => 'Stand Akan Dihapus']);

    $response = $this->actingAs($admin)
        ->delete(route('admin.tenants.destroy', $tenant));

    $response->assertRedirect();
    $response->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'success' && str_contains($toast['message'], 'tempat sampah'));

    $this->assertSoftDeleted('tenants', [
        'id' => $tenant->id,
    ]);
});

test('admin can restore a soft-deleted tenant', function () {
    $admin = User::factory()->admin()->create();
    $tenant = Tenant::factory()->create(['name' => 'Stand Kembali']);
    $tenant->delete();

    expect($tenant->fresh()->trashed())->toBeTrue();

    $response = $this->actingAs($admin)
        ->post(route('admin.tenants.restore', $tenant->id));

    $response->assertRedirect();
    $response->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'success' && str_contains($toast['message'], 'berhasil dipulihkan'));

    expect($tenant->fresh()->trashed())->toBeFalse();
});

test('database error during tenant creation is caught, logged, and returns user-friendly toast', function () {
    $admin = User::factory()->admin()->create();

    Tenant::saving(function () {
        throw new Exception('Simulated database write failure');
    });

    $response = $this->actingAs($admin)
        ->post(route('admin.tenants.store'), [
            'name' => 'Stand Unik Error Test',
            'is_active' => true,
            'manager_mode' => 'new',
            'manager_name' => 'Pengelola Error Test',
            'manager_email' => 'errortest@feb.ac.id',
            'manager_password' => 'password123',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('toast', fn ($toast) => $toast['type'] === 'error' && str_contains($toast['message'], 'kesalahan sistem'));
});

test('admin tenant listing returns server-side pagination meta and responds to page and per_page query', function () {
    $admin = User::factory()->admin()->create();

    Tenant::factory()->count(15)->create();

    $response = $this->actingAs($admin)
        ->get(route('admin.tenants', ['per_page' => 5, 'page' => 2]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/tenants')
        ->has('tenants', 5)
        ->where('pagination.current_page', 2)
        ->where('pagination.per_page', 5)
        ->where('pagination.total', 15)
        ->where('pagination.last_page', 3)
    );
});
