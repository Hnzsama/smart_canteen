<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'tenant_id' => null,
            'remember_token' => Str::random(10),
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the model has two-factor authentication configured.
     */
    public function withTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at' => now(),
        ]);
    }

    /**
     * Assign Admin role.
     */
    public function admin(): static
    {
        return $this->afterCreating(function (User $user) {
            Role::findOrCreate(UserRole::Admin->value, 'web');
            $user->assignRole(UserRole::Admin->value);
        });
    }

    /**
     * Assign Tenant role and optional tenant association.
     */
    public function tenant(?Tenant $tenant = null): static
    {
        return $this->state(fn () => [
            'tenant_id' => $tenant?->id ?? Tenant::factory(),
        ])->afterCreating(function (User $user) {
            Role::findOrCreate(UserRole::Tenant->value, 'web');
            $user->assignRole(UserRole::Tenant->value);
        });
    }

    /**
     * Assign Mahasiswa role.
     */
    public function mahasiswa(): static
    {
        return $this->afterCreating(function (User $user) {
            Role::findOrCreate(UserRole::Mahasiswa->value, 'web');
            $user->assignRole(UserRole::Mahasiswa->value);
        });
    }
}
