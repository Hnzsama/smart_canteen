<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Menu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    /**
     * Display the authenticated user's favorite menus.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $favoriteMenus = $user->favoriteMenus()
            ->where('is_available', true)
            ->with(['tenant:id,name,slug,logo_image,image,is_open', 'category:id,name'])
            ->latest('favorites.created_at')
            ->get()
            ->map(fn (Menu $m) => [
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

        $userFavorites = $favoriteMenus->pluck('id')->toArray();

        return Inertia::render('customer/favorites/index', [
            'favoriteMenus' => $favoriteMenus,
            'userFavorites' => $userFavorites,
        ]);
    }

    /**
     * Toggle favorite status for a menu item.
     */
    public function toggle(Request $request, Menu $menu): JsonResponse
    {
        $user = $request->user();

        $existing = Favorite::where('user_id', $user->id)
            ->where('menu_id', $menu->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $favorited = false;
            $message = 'Menu dihapus dari favorit';
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'menu_id' => $menu->id,
            ]);
            $favorited = true;
            $message = 'Menu ditambahkan ke favorit';
        }

        return response()->json([
            'success' => true,
            'favorited' => $favorited,
            'message' => $message,
            'menu_id' => $menu->id,
        ]);
    }
}
