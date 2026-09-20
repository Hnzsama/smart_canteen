<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class CategoryController extends Controller
{
    /**
     * Display a listing of master menu categories with filters and metrics.
     */
    public function index(Request $request): Response
    {
        try {
            $search = $request->query('search');
            $tenantId = $request->query('tenant_id') ? (int) $request->query('tenant_id') : null;

            $query = Category::query()
                ->with(['tenant:id,name,slug,is_active'])
                ->withCount('menus');

            if (! empty($tenantId)) {
                $query->where('tenant_id', $tenantId);
            }

            if (! empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                });
            }

            $perPage = (int) $request->query('per_page', 10);
            $paginator = $query->latest('id')->paginate($perPage)->withQueryString();

            $categories = collect($paginator->items())->map(fn (Category $category) => [
                'id' => $category->id,
                'tenant_id' => $category->tenant_id,
                'tenant_name' => $category->tenant?->name ?? 'Tidak Ada Tenant',
                'name' => $category->name,
                'slug' => $category->slug,
                'menus_count' => (int) $category->menus_count,
                'created_at' => $category->created_at?->format('d M Y H:i'),
                'updated_at' => $category->updated_at?->format('d M Y H:i'),
            ])->values()->all();

            $tenants = Tenant::query()
                ->select(['id', 'name', 'slug', 'is_active'])
                ->orderBy('name')
                ->get()
                ->map(fn (Tenant $tenant) => [
                    'id' => $tenant->id,
                    'name' => $tenant->name,
                    'slug' => $tenant->slug,
                    'is_active' => (bool) $tenant->is_active,
                ]);

            return Inertia::render('admin/categories', [
                'categories' => $categories,
                'pagination' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'from' => $paginator->firstItem(),
                    'to' => $paginator->lastItem(),
                ],
                'tenants' => $tenants,
                'filters' => [
                    'search' => $search ?? '',
                    'tenant_id' => $tenantId,
                    'per_page' => $perPage,
                    'page' => $paginator->currentPage(),
                ],
                'counts' => [
                    'total' => Category::count(),
                    'total_tenants' => Tenant::has('categories')->count(),
                    'total_menus' => Category::withCount('menus')->get()->sum('menus_count'),
                ],
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal memuat master data kategori menu admin: '.$e->getMessage(), [
                'exception' => $e,
                'query_params' => $request->all(),
            ]);

            return Inertia::render('admin/categories', [
                'categories' => [],
                'pagination' => [
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 10,
                    'total' => 0,
                    'from' => 0,
                    'to' => 0,
                ],
                'tenants' => [],
                'filters' => [
                    'search' => '',
                    'tenant_id' => null,
                ],
                'counts' => [
                    'total' => 0,
                    'total_tenants' => 0,
                    'total_menus' => 0,
                ],
                'error' => 'Gagal memuat master data kategori dari server.',
            ]);
        }
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tenant_id' => ['required', 'exists:tenants,id'],
            'name' => ['required', 'string', 'max:255'],
        ], [
            'tenant_id.required' => 'Mitra stand kantin wajib dipilih.',
            'tenant_id.exists' => 'Stand kantin yang dipilih tidak valid.',
            'name.required' => 'Nama kategori menu wajib diisi.',
            'name.max' => 'Nama kategori maksimal 255 karakter.',
        ]);

        try {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug;
            $count = 1;

            while (Category::where('tenant_id', $validated['tenant_id'])->where('slug', $slug)->exists()) {
                $slug = $baseSlug.'-'.$count;
                $count++;
            }

            Category::create([
                'tenant_id' => $validated['tenant_id'],
                'name' => $validated['name'],
                'slug' => $slug,
            ]);

            $toast = [
                'type' => 'success',
                'message' => 'Kategori menu baru berhasil ditambahkan.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error('Gagal menambahkan kategori menu admin: '.$e->getMessage(), [
                'exception' => $e,
                'request' => $request->all(),
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Gagal menyimpan kategori menu baru: '.$e->getMessage(),
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Update the specified category in storage.
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'tenant_id' => ['required', 'exists:tenants,id'],
            'name' => ['required', 'string', 'max:255'],
        ], [
            'tenant_id.required' => 'Mitra stand kantin wajib dipilih.',
            'tenant_id.exists' => 'Stand kantin yang dipilih tidak valid.',
            'name.required' => 'Nama kategori menu wajib diisi.',
        ]);

        try {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug;
            $count = 1;

            while (Category::where('tenant_id', $validated['tenant_id'])
                ->where('slug', $slug)
                ->where('id', '!=', $category->id)
                ->exists()) {
                $slug = $baseSlug.'-'.$count;
                $count++;
            }

            $category->update([
                'tenant_id' => $validated['tenant_id'],
                'name' => $validated['name'],
                'slug' => $slug,
            ]);

            $toast = [
                'type' => 'success',
                'message' => 'Data kategori menu berhasil diperbarui.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error('Gagal memperbarui kategori menu admin: '.$e->getMessage(), [
                'exception' => $e,
                'category_id' => $category->id,
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Gagal memperbarui kategori menu: '.$e->getMessage(),
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(Category $category): RedirectResponse
    {
        try {
            $name = $category->name;
            $category->delete();

            $toast = [
                'type' => 'success',
                'message' => "Kategori \"{$name}\" berhasil dihapus.",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error('Gagal menghapus kategori menu admin: '.$e->getMessage(), [
                'exception' => $e,
                'category_id' => $category->id,
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Gagal menghapus kategori menu: '.$e->getMessage(),
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }
}
