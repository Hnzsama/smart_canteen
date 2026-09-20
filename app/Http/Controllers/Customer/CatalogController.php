<?php

namespace App\Http\Controllers\Customer;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Menu;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    /**
     * Display customer food catalog at root level (/).
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        if ($user !== null) {
            if ($user->hasRole(UserRole::Admin->value)) {
                return redirect()->route('admin.dashboard');
            }
            if ($user->hasRole(UserRole::Tenant->value)) {
                return redirect()->route('tenant.dashboard');
            }
        }

        $search = $request->query('search');
        $tenantId = $request->query('tenant_id');
        $categoryId = $request->query('category_id');
        $globalCategory = $request->query('global_category');

        $tenants = Tenant::query()
            ->where('is_active', true)
            ->withCount('orders')
            ->get(['id', 'name', 'slug', 'description', 'image', 'banner_image', 'logo_image', 'phone', 'opening_hours', 'is_open', 'rating', 'reviews_count'])
            ->map(fn (Tenant $t) => [
                'id' => $t->id,
                'name' => $t->name,
                'slug' => $t->slug,
                'description' => $t->description,
                'image' => $t->image,
                'banner_image' => $t->banner_image,
                'logo_image' => $t->logo_image,
                'phone' => $t->phone,
                'opening_hours' => $t->opening_hours,
                'is_open' => (bool) $t->is_open,
                'rating' => (float) ($t->rating ?? 5.0),
                'reviews_count' => (int) ($t->reviews_count ?? 0),
                'orders_count' => (int) ($t->orders_count ?? 0),
            ]);

        $categories = Category::query()
            ->get(['id', 'tenant_id', 'name', 'slug']);

        $menusQuery = Menu::query()
            ->where('is_available', true)
            ->with(['tenant:id,name,slug,logo_image,image,is_open', 'category:id,name']);

        if ($tenantId && is_numeric($tenantId)) {
            $menusQuery->where('tenant_id', (int) $tenantId);
        }

        if ($categoryId && is_numeric($categoryId)) {
            $menusQuery->where('category_id', (int) $categoryId);
        }

        if ($globalCategory && $globalCategory !== 'all') {
            $menusQuery->where('global_category', $globalCategory);
        }

        if (! empty($search)) {
            $menusQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $menus = $menusQuery->latest('id')->get()->map(fn (Menu $m) => [
            'id' => $m->id,
            'tenant_id' => $m->tenant_id,
            'tenant_name' => $m->tenant?->name ?? 'Stand Kantin',
            'tenant_slug' => $m->tenant?->slug ?? '',
            'tenant_logo' => $m->tenant?->logo_image ?? $m->tenant?->image ?? '',
            'is_tenant_open' => (bool) ($m->tenant?->is_open ?? true),
            'category_id' => $m->category_id,
            'category_name' => $m->category?->name ?? 'Menu',
            'global_category' => $m->global_category ?? 'makanan',
            'name' => $m->name,
            'description' => $m->description,
            'price' => (float) $m->price,
            'original_price' => $m->original_price ? (float) $m->original_price : null,
            'image' => $m->image,
            'is_recommended' => (bool) $m->is_recommended,
            'estimated_time' => $m->estimated_time ?? 15,
            'options' => $m->options ?? [],
        ]);

        return Inertia::render('catalog', [
            'tenants' => $tenants,
            'categories' => $categories,
            'menus' => $menus,
            'filters' => [
                'search' => $search ?? '',
                'tenant_id' => $tenantId ?? 'all',
                'category_id' => $categoryId ?? 'all',
                'global_category' => $globalCategory ?? 'all',
            ],
        ]);
    }

    /**
     * Display detailed Tenant Stand page (/{tenant:slug}).
     */
    public function showTenant(Request $request, Tenant $tenant): Response|RedirectResponse
    {
        $user = $request->user();
        if ($user !== null) {
            if ($user->hasRole(UserRole::Admin->value)) {
                return redirect()->route('admin.dashboard');
            }
            if ($user->hasRole(UserRole::Tenant->value)) {
                return redirect()->route('tenant.dashboard');
            }
        }

        $tenant->loadCount('orders');

        $categories = Category::query()
            ->where('tenant_id', $tenant->id)
            ->get(['id', 'tenant_id', 'name', 'slug']);

        $menus = Menu::query()
            ->where('tenant_id', $tenant->id)
            ->where('is_available', true)
            ->with(['category:id,name'])
            ->latest('id')
            ->get()
            ->map(fn (Menu $m) => [
                'id' => $m->id,
                'tenant_id' => $m->tenant_id,
                'tenant_name' => $tenant->name,
                'tenant_slug' => $tenant->slug,
                'tenant_logo' => $tenant->logo_image ?? $tenant->image ?? '',
                'is_tenant_open' => (bool) $tenant->is_open,
                'category_id' => $m->category_id,
                'category_name' => $m->category?->name ?? 'Menu',
                'name' => $m->name,
                'description' => $m->description,
                'price' => (float) $m->price,
                'original_price' => $m->original_price ? (float) $m->original_price : null,
                'image' => $m->image,
                'is_recommended' => (bool) $m->is_recommended,
                'estimated_time' => $m->estimated_time ?? 15,
                'options' => $m->options ?? [],
            ]);

        return Inertia::render('tenant-detail', [
            'tenant' => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'description' => $tenant->description,
                'image' => $tenant->image,
                'banner_image' => $tenant->banner_image,
                'logo_image' => $tenant->logo_image,
                'phone' => $tenant->phone,
                'opening_hours' => $tenant->opening_hours,
                'is_open' => (bool) $tenant->is_open,
                'rating' => (float) ($tenant->rating ?? 5.0),
                'reviews_count' => (int) ($tenant->reviews_count ?? 0),
                'orders_count' => (int) ($tenant->orders_count ?? 0),
            ],
            'categories' => $categories,
            'menus' => $menus,
        ]);
    }

    /**
     * Display detailed Menu item page (/menu/{menu}).
     */
    public function showMenu(Request $request, Menu $menu): Response|RedirectResponse
    {
        $user = $request->user();
        if ($user !== null) {
            if ($user->hasRole(UserRole::Admin->value)) {
                return redirect()->route('admin.dashboard');
            }
            if ($user->hasRole(UserRole::Tenant->value)) {
                return redirect()->route('tenant.dashboard');
            }
        }

        $menu->load(['tenant:id,name,slug,logo_image,image,is_open,opening_hours,rating', 'category:id,name']);

        $relatedMenus = Menu::query()
            ->where('tenant_id', $menu->tenant_id)
            ->where('id', '!=', $menu->id)
            ->where('is_available', true)
            ->take(4)
            ->get()
            ->map(fn (Menu $m) => [
                'id' => $m->id,
                'name' => $m->name,
                'price' => (float) $m->price,
                'image' => $m->image,
                'estimated_time' => $m->estimated_time ?? 15,
            ]);

        return Inertia::render('menu-detail', [
            'menu' => [
                'id' => $menu->id,
                'tenant_id' => $menu->tenant_id,
                'tenant_name' => $menu->tenant?->name ?? 'Stand Kantin',
                'tenant_slug' => $menu->tenant?->slug ?? '',
                'tenant_logo' => $menu->tenant?->logo_image ?? $menu->tenant?->image ?? '',
                'is_tenant_open' => (bool) ($menu->tenant?->is_open ?? true),
                'tenant_rating' => (float) ($menu->tenant?->rating ?? 5.0),
                'category_id' => $menu->category_id,
                'category_name' => $menu->category?->name ?? 'Menu',
                'name' => $menu->name,
                'description' => $menu->description,
                'price' => (float) $menu->price,
                'original_price' => $menu->original_price ? (float) $menu->original_price : null,
                'image' => $menu->image,
                'is_recommended' => (bool) $menu->is_recommended,
                'estimated_time' => $menu->estimated_time ?? 15,
                'options' => $menu->options ?? [],
            ],
            'related_menus' => $relatedMenus,
        ]);
    }
}
