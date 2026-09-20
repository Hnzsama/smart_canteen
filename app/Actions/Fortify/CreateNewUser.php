<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Enums\UserRole;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Spatie\Permission\Models\Role;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $role = $input['role'] ?? UserRole::Mahasiswa->value;

        $rules = [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ];

        if ($role === UserRole::Tenant->value) {
            $rules['tenant_name'] = ['required', 'string', 'max:255'];
            $rules['tenant_description'] = ['nullable', 'string', 'max:1000'];
        }

        Validator::make($input, $rules)->validate();

        return DB::transaction(function () use ($input, $role): User {
            $tenantId = null;

            if ($role === UserRole::Tenant->value) {
                $baseSlug = Str::slug($input['tenant_name']);
                $slug = $baseSlug;
                $count = 1;

                while (Tenant::where('slug', $slug)->exists()) {
                    $slug = $baseSlug.'-'.$count;
                    $count++;
                }

                $tenant = Tenant::query()->create([
                    'name' => $input['tenant_name'],
                    'slug' => $slug,
                    'description' => $input['tenant_description'] ?? null,
                    'is_active' => true,
                ]);

                $tenantId = $tenant->id;
            }

            $user = User::query()->create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
                'tenant_id' => $tenantId,
            ]);

            $assignedRole = ($role === UserRole::Tenant->value)
                ? UserRole::Tenant->value
                : UserRole::Mahasiswa->value;

            Role::findOrCreate($assignedRole, 'web');
            $user->assignRole($assignedRole);

            return $user;
        });
    }
}
