<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     */
    public function toResponse($request): Response
    {
        $user = $request->user();

        if ($request->wantsJson()) {
            return response()->json(['two_factor' => false]);
        }

        if ($user !== null && $user->hasRole(UserRole::Admin->value)) {
            return redirect()->intended(route('admin.dashboard'));
        }

        if ($user !== null && $user->hasRole(UserRole::Tenant->value)) {
            return redirect()->intended(route('tenant.dashboard'));
        }

        return redirect()->intended(route('dashboard'));
    }
}
