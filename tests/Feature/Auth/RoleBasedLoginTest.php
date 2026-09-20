<?php

use App\Models\Tenant;
use App\Models\User;

test('admin user is redirected to admin dashboard upon login', function () {
    $admin = User::factory()->admin()->create([
        'password' => 'password',
    ]);

    $response = $this->post(route('login.store'), [
        'email' => $admin->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('admin.dashboard', absolute: false));
});

test('tenant user is redirected to tenant dashboard upon login', function () {
    $tenant = Tenant::factory()->create();
    $tenantUser = User::factory()->tenant($tenant)->create([
        'password' => 'password',
    ]);

    $response = $this->post(route('login.store'), [
        'email' => $tenantUser->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('tenant.dashboard', absolute: false));
});

test('mahasiswa user is redirected to dashboard upon login', function () {
    $mahasiswa = User::factory()->mahasiswa()->create([
        'password' => 'password',
    ]);

    $response = $this->post(route('login.store'), [
        'email' => $mahasiswa->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('admin can access admin dashboard but other roles are forbidden', function () {
    $admin = User::factory()->admin()->create();
    $mahasiswa = User::factory()->mahasiswa()->create();
    $tenant = Tenant::factory()->create();
    $tenantUser = User::factory()->tenant($tenant)->create();

    $this->actingAs($admin)->get(route('admin.dashboard'))->assertOk();
    $this->actingAs($mahasiswa)->get(route('admin.dashboard'))->assertForbidden();
    $this->actingAs($tenantUser)->get(route('admin.dashboard'))->assertForbidden();
});

test('tenant can access tenant dashboard but other roles are forbidden', function () {
    $admin = User::factory()->admin()->create();
    $mahasiswa = User::factory()->mahasiswa()->create();
    $tenant = Tenant::factory()->create();
    $tenantUser = User::factory()->tenant($tenant)->create();

    $this->actingAs($tenantUser)->get(route('tenant.dashboard'))->assertOk();
    $this->actingAs($mahasiswa)->get(route('tenant.dashboard'))->assertForbidden();
    $this->actingAs($admin)->get(route('tenant.dashboard'))->assertForbidden();
});

test('unverified user cannot access role dashboards before email verification', function () {
    $admin = User::factory()->admin()->unverified()->create();
    $tenant = Tenant::factory()->create();
    $tenantUser = User::factory()->tenant($tenant)->unverified()->create();

    $this->actingAs($admin)->get(route('admin.dashboard'))
        ->assertRedirect(route('verification.notice'));

    $this->actingAs($tenantUser)->get(route('tenant.dashboard'))
        ->assertRedirect(route('verification.notice'));
});
