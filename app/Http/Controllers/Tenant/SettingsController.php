<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Display the tenant store settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $tenant = $user->tenant ?? Tenant::query()->first();

        return Inertia::render('tenant/settings', [
            'tenant' => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'description' => $tenant->description ?? '',
                'phone' => $tenant->phone ?? '',
                'opening_hours' => $tenant->opening_hours ?? '08:00 - 17:00',
                'is_open' => (bool) $tenant->is_open,
                'image' => $tenant->image ?? '',
                'banner_image' => $tenant->banner_image ?? '',
                'logo_image' => $tenant->logo_image ?? '',
                'rating' => (float) $tenant->rating,
                'reviews_count' => (int) $tenant->reviews_count,
            ],
        ]);
    }

    /**
     * Update the tenant store settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        $tenant = $user->tenant ?? Tenant::query()->findOrFail($request->input('tenant_id', 1));

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'phone' => ['nullable', 'string', 'max:30'],
            'opening_hours' => ['nullable', 'string', 'max:100'],
            'is_open' => ['required', 'boolean'],
            'image' => ['nullable', 'string', 'max:2048'],
            'banner_image' => ['nullable', 'string', 'max:2048'],
            'logo_image' => ['nullable', 'string', 'max:2048'],
            'image_file' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'banner_file' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'logo_file' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        if ($request->hasFile('banner_file')) {
            $path = $request->file('banner_file')->store('tenants/banners', 'public');
            $validated['banner_image'] = Storage::url($path);
        }

        if ($request->hasFile('logo_file')) {
            $path = $request->file('logo_file')->store('tenants/logos', 'public');
            $validated['logo_image'] = Storage::url($path);
            $validated['image'] = Storage::url($path);
        }

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('tenants/logos', 'public');
            $validated['image'] = Storage::url($path);
        }

        unset($validated['banner_file'], $validated['logo_file'], $validated['image_file']);

        $tenant->update($validated);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Pengaturan toko berhasil diperbarui!',
        ]);
    }

    /**
     * Toggle tenant open/closed store status.
     */
    public function toggleOpen(Request $request): RedirectResponse
    {
        $user = $request->user();
        $tenant = $user->tenant ?? Tenant::query()->first();

        if ($tenant) {
            $tenant->update([
                'is_open' => ! $tenant->is_open,
            ]);
        }

        $statusText = $tenant->is_open ? 'BUKA' : 'TUTUP';

        return back()->with('toast', [
            'type' => 'success',
            'message' => "Status toko sekarang {$statusText}!",
        ]);
    }
}
