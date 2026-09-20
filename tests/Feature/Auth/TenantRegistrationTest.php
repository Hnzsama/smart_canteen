<?php

use App\Enums\UserRole;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;

test('tenant registration screen can be rendered', function () {
    $response = $this->get(route('register.tenant'));

    $response->assertOk();
});

test('new tenants can register and create stand record', function () {
    Event::fake([Registered::class]);

    $response = $this->post(route('register.tenant.store'), [
        'name' => 'Pak Joko',
        'email' => 'pakjoko@feb.ac.id',
        'tenant_name' => 'Kantin Ayam Berkah FEB',
        'tenant_description' => 'Ayam penyet dan geprek sedap',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();

    $user = User::where('email', 'pakjoko@feb.ac.id')->first();
    expect($user)->not->toBeNull()
        ->and($user->hasRole(UserRole::Tenant->value))->toBeTrue()
        ->and($user->tenant_id)->not->toBeNull();

    $tenant = Tenant::find($user->tenant_id);
    expect($tenant)->not->toBeNull()
        ->and($tenant->name)->toBe('Kantin Ayam Berkah FEB')
        ->and($tenant->slug)->toBe('kantin-ayam-berkah-feb');

    Event::assertDispatched(Registered::class);
});

test('tenant registration requires tenant name', function () {
    $response = $this->post(route('register.tenant.store'), [
        'name' => 'Pak Joko',
        'email' => 'pakjoko@feb.ac.id',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors(['tenant_name']);
    $this->assertGuest();
});
