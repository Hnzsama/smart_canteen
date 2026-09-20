<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Menu;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class MenuController extends Controller
{
    /**
     * Display catalog and management of stand menus.
     */
    public function index(Request $request): Response
    {
        try {
            $user = $request->user();
            $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

            $statusFilter = $request->query('status', 'all');
            $categoryFilter = $request->query('category_id', 'all');
            $recommendedFilter = $request->query('recommended', 'all');
            $search = $request->query('search');

            $query = Menu::query()
                ->where('tenant_id', $tenantId)
                ->with(['category:id,name']);

            if ($statusFilter === 'trashed') {
                $query->onlyTrashed();
            } else {
                $query->withoutTrashed();

                if ($statusFilter === 'available') {
                    $query->where('is_available', true);
                } elseif ($statusFilter === 'unavailable') {
                    $query->where('is_available', false);
                }
            }

            if ($categoryFilter !== 'all' && is_numeric($categoryFilter)) {
                $query->where('category_id', (int) $categoryFilter);
            }

            if ($recommendedFilter === 'true') {
                $query->where('is_recommended', true);
            } elseif ($recommendedFilter === 'false') {
                $query->where('is_recommended', false);
            }

            if (! empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            }

            $paginated = $query->latest('id')->paginate(10)->withQueryString();

            $menus = collect($paginated->items())->map(function (Menu $menu) {
                return [
                    'id' => $menu->id,
                    'tenant_id' => $menu->tenant_id,
                    'category_id' => $menu->category_id,
                    'category_name' => $menu->category?->name ?? 'Tanpa Kategori',
                    'global_category' => $menu->global_category ?? 'makanan',
                    'name' => $menu->name,
                    'description' => $menu->description,
                    'price' => (float) $menu->price,
                    'formatted_price' => 'Rp '.number_format((float) $menu->price, 0, ',', '.'),
                    'original_price' => $menu->original_price ? (float) $menu->original_price : null,
                    'formatted_original_price' => $menu->original_price ? 'Rp '.number_format((float) $menu->original_price, 0, ',', '.') : null,
                    'image' => $menu->image,
                    'is_available' => (bool) $menu->is_available,
                    'is_recommended' => (bool) $menu->is_recommended,
                    'estimated_time' => (int) ($menu->estimated_time ?? 15),
                    'options' => $menu->options ?? [],
                    'is_trashed' => $menu->trashed(),
                    'created_at' => $menu->created_at?->diffForHumans() ?? $menu->created_at?->format('d M Y'),
                ];
            })->all();

            $categories = Category::query()
                ->where('tenant_id', $tenantId)
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn ($cat) => ['id' => $cat->id, 'name' => $cat->name])
                ->all();

            $baseTenantQuery = Menu::query()->where('tenant_id', $tenantId);
            $counts = [
                'all' => (clone $baseTenantQuery)->withoutTrashed()->count(),
                'available' => (clone $baseTenantQuery)->withoutTrashed()->where('is_available', true)->count(),
                'unavailable' => (clone $baseTenantQuery)->withoutTrashed()->where('is_available', false)->count(),
                'recommended' => (clone $baseTenantQuery)->withoutTrashed()->where('is_recommended', true)->count(),
                'trashed' => (clone $baseTenantQuery)->onlyTrashed()->count(),
            ];

            return Inertia::render('tenant/menus', [
                'menus' => $menus,
                'categories' => $categories,
                'pagination' => [
                    'current_page' => $paginated->currentPage(),
                    'last_page' => $paginated->lastPage(),
                    'per_page' => $paginated->perPage(),
                    'total' => $paginated->total(),
                    'from' => $paginated->firstItem(),
                    'to' => $paginated->lastItem(),
                ],
                'filters' => [
                    'status' => $statusFilter,
                    'category_id' => $categoryFilter,
                    'recommended' => $recommendedFilter,
                    'search' => $search ?? '',
                ],
                'counts' => $counts,
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal memuat katalog menu tenant: '.$e->getMessage(), ['exception' => $e]);

            return Inertia::render('tenant/menus', [
                'menus' => [],
                'categories' => [],
                'pagination' => null,
                'filters' => [
                    'status' => 'all',
                    'category_id' => 'all',
                    'recommended' => 'all',
                    'search' => '',
                ],
                'counts' => ['all' => 0, 'available' => 0, 'unavailable' => 0, 'recommended' => 0, 'trashed' => 0],
                'error' => 'Gagal memuat katalog menu stand.',
            ]);
        }
    }

    /**
     * Show form to create a new menu item.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();
        $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

        $categories = Category::query()
            ->where('tenant_id', $tenantId)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($cat) => ['id' => $cat->id, 'name' => $cat->name])
            ->all();

        return Inertia::render('tenant/menus/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Create a new menu item for the tenant.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'global_category' => ['required', 'string', 'in:makanan,minuman,snack,dessert,sarapan,kopi'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['required', 'numeric', 'min:0'],
            'original_price' => ['nullable', 'numeric', 'min:0'],
            'is_available' => ['required', 'boolean'],
            'is_recommended' => ['nullable', 'boolean'],
            'estimated_time' => ['nullable', 'integer', 'min:1', 'max:120'],
            'image' => ['nullable'],
            'image_file' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'options' => ['nullable', 'array'],
        ], [
            'name.required' => 'Nama menu wajib diisi.',
            'global_category.required' => 'Kategori utama (global) wajib dipilih.',
            'global_category.in' => 'Kategori utama yang dipilih tidak valid.',
            'price.required' => 'Harga menu wajib diisi.',
            'price.min' => 'Harga menu tidak boleh bernilai negatif.',
            'image_file.image' => 'File foto harus berupa gambar valid.',
            'image_file.max' => 'Ukuran foto maksimal 5 MB.',
        ]);

        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('menus', 'public');
            $imagePath = '/storage/'.$path;
        } elseif ($request->hasFile('image')) {
            $path = $request->file('image')->store('menus', 'public');
            $imagePath = '/storage/'.$path;
        } elseif (is_string($request->input('image')) && ! empty($request->input('image'))) {
            $imagePath = $request->input('image');
        }

        try {
            $menu = Menu::create([
                'tenant_id' => $tenantId,
                'category_id' => $validated['category_id'] ?? null,
                'global_category' => $validated['global_category'],
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'price' => $validated['price'],
                'original_price' => $validated['original_price'] ?? null,
                'is_available' => $validated['is_available'],
                'is_recommended' => $validated['is_recommended'] ?? false,
                'estimated_time' => $validated['estimated_time'] ?? 15,
                'image' => $imagePath,
                'options' => $validated['options'] ?? null,
            ]);

            $toast = [
                'type' => 'success',
                'message' => "Menu \"{$menu->name}\" berhasil ditambahkan ke katalog stand.",
            ];
            Inertia::flash('toast', $toast);

            return redirect()->route('tenant.menus')->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error('Gagal menambah menu tenant: '.$e->getMessage(), ['exception' => $e]);

            $toast = [
                'type' => 'error',
                'message' => 'Gagal menambah menu: '.$e->getMessage(),
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Show form to edit existing menu item.
     */
    public function edit(Request $request, Menu $menu): Response
    {
        $user = $request->user();
        $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

        if ((int) $menu->tenant_id !== (int) $tenantId) {
            abort(403, 'Anda tidak memiliki hak akses untuk mengubah menu ini.');
        }

        $categories = Category::query()
            ->where('tenant_id', $tenantId)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($cat) => ['id' => $cat->id, 'name' => $cat->name])
            ->all();

        return Inertia::render('tenant/menus/edit', [
            'menu' => [
                'id' => $menu->id,
                'tenant_id' => $menu->tenant_id,
                'category_id' => $menu->category_id,
                'category_name' => $menu->category?->name ?? 'Tanpa Kategori',
                'global_category' => $menu->global_category ?? 'makanan',
                'name' => $menu->name,
                'description' => $menu->description,
                'price' => (float) $menu->price,
                'original_price' => $menu->original_price ? (float) $menu->original_price : null,
                'formatted_price' => 'Rp '.number_format((float) $menu->price, 0, ',', '.'),
                'formatted_original_price' => $menu->original_price ? 'Rp '.number_format((float) $menu->original_price, 0, ',', '.') : null,
                'image' => $menu->image,
                'is_available' => (bool) $menu->is_available,
                'is_recommended' => (bool) $menu->is_recommended,
                'estimated_time' => (int) ($menu->estimated_time ?? 15),
                'options' => $menu->options ?? [],
                'is_trashed' => $menu->trashed(),
                'created_at' => $menu->created_at?->format('d M Y'),
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Update existing menu item.
     */
    public function update(Request $request, Menu $menu): RedirectResponse
    {
        $user = $request->user();
        $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

        if ((int) $menu->tenant_id !== (int) $tenantId) {
            abort(403, 'Anda tidak memiliki hak akses untuk mengubah menu ini.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'global_category' => ['required', 'string', 'in:makanan,minuman,snack,dessert,sarapan,kopi'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['required', 'numeric', 'min:0'],
            'original_price' => ['nullable', 'numeric', 'min:0'],
            'is_available' => ['required', 'boolean'],
            'is_recommended' => ['nullable', 'boolean'],
            'estimated_time' => ['nullable', 'integer', 'min:1', 'max:120'],
            'image' => ['nullable'],
            'image_file' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'options' => ['nullable', 'array'],
        ], [
            'name.required' => 'Nama menu wajib diisi.',
            'global_category.required' => 'Kategori utama (global) wajib dipilih.',
            'global_category.in' => 'Kategori utama yang dipilih tidak valid.',
            'price.required' => 'Harga menu wajib diisi.',
            'image_file.image' => 'File foto harus berupa gambar valid.',
            'image_file.max' => 'Ukuran foto maksimal 5 MB.',
        ]);

        $imagePath = $menu->image;
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('menus', 'public');
            $imagePath = '/storage/'.$path;
        } elseif ($request->hasFile('image')) {
            $path = $request->file('image')->store('menus', 'public');
            $imagePath = '/storage/'.$path;
        } elseif ($request->has('image') && is_string($request->input('image'))) {
            $imagePath = $request->input('image');
        }

        try {
            $menu->update([
                'category_id' => $validated['category_id'] ?? null,
                'global_category' => $validated['global_category'],
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'price' => $validated['price'],
                'original_price' => $validated['original_price'] ?? null,
                'is_available' => $validated['is_available'],
                'is_recommended' => $validated['is_recommended'] ?? false,
                'estimated_time' => $validated['estimated_time'] ?? 15,
                'image' => $imagePath,
                'options' => $validated['options'] ?? null,
            ]);

            $toast = [
                'type' => 'success',
                'message' => "Data menu \"{$menu->name}\" berhasil diperbarui.",
            ];
            Inertia::flash('toast', $toast);

            return redirect()->route('tenant.menus')->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error('Gagal memperbarui menu tenant: '.$e->getMessage(), ['exception' => $e, 'menu_id' => $menu->id]);

            $toast = [
                'type' => 'error',
                'message' => 'Gagal memperbarui menu: '.$e->getMessage(),
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Toggle stock availability status (available / sold out).
     */
    public function toggleAvailability(Request $request, Menu $menu): RedirectResponse
    {
        $user = $request->user();
        $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

        if ((int) $menu->tenant_id !== (int) $tenantId) {
            abort(403, 'Anda tidak memiliki hak akses untuk mengubah status menu ini.');
        }

        try {
            $newStatus = ! $menu->is_available;
            $menu->update(['is_available' => $newStatus]);

            $statusText = $newStatus ? 'Tersedia' : 'Habis / Out of Stock';
            $toast = [
                'type' => 'success',
                'message' => "Stok menu \"{$menu->name}\" kini diubah menjadi \"{$statusText}\".",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error('Gagal ubah stok menu tenant: '.$e->getMessage(), ['exception' => $e, 'menu_id' => $menu->id]);

            $toast = [
                'type' => 'error',
                'message' => 'Gagal mengubah status stok: '.$e->getMessage(),
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Toggle recommendation status (Best Seller / Rekomendasi).
     */
    public function toggleRecommendation(Request $request, Menu $menu): RedirectResponse
    {
        $user = $request->user();
        $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

        if ((int) $menu->tenant_id !== (int) $tenantId) {
            abort(403, 'Anda tidak memiliki hak akses untuk mengubah status rekomendasi menu ini.');
        }

        try {
            $newRecommended = ! $menu->is_recommended;
            $menu->update(['is_recommended' => $newRecommended]);

            $statusText = $newRecommended ? 'Ditandai Rekomendasi (Best Seller)' : 'Dihapus dari Rekomendasi';
            $toast = [
                'type' => 'success',
                'message' => "Menu \"{$menu->name}\" kini {$statusText}.",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error('Gagal ubah rekomendasi menu tenant: '.$e->getMessage(), ['exception' => $e, 'menu_id' => $menu->id]);

            $toast = [
                'type' => 'error',
                'message' => 'Gagal mengubah status rekomendasi: '.$e->getMessage(),
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Soft delete menu item (move to trashed).
     */
    public function destroy(Request $request, Menu $menu): RedirectResponse
    {
        $user = $request->user();
        $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

        if ((int) $menu->tenant_id !== (int) $tenantId) {
            abort(403, 'Anda tidak memiliki hak akses untuk menghapus menu ini.');
        }

        try {
            $name = $menu->name;
            $menu->delete();

            $toast = [
                'type' => 'success',
                'message' => "Menu \"{$name}\" berhasil dipindahkan ke sampah (Soft Delete).",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error('Gagal hapus menu tenant: '.$e->getMessage(), ['exception' => $e, 'menu_id' => $menu->id]);

            $toast = [
                'type' => 'error',
                'message' => 'Gagal menghapus menu: '.$e->getMessage(),
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Restore soft-deleted menu item.
     */
    public function restore(Request $request, Menu $menu): RedirectResponse
    {
        $user = $request->user();
        $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

        try {
            if ($menu->tenant_id !== $tenantId) {
                abort(403);
            }

            $menu->restore();

            $toast = [
                'type' => 'success',
                'message' => "Menu \"{$menu->name}\" berhasil dipulihkan.",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error('Gagal pulihkan menu tenant: '.$e->getMessage(), ['exception' => $e, 'menu_id' => $id]);

            $toast = [
                'type' => 'error',
                'message' => 'Gagal memulihkan menu: '.$e->getMessage(),
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }
}
