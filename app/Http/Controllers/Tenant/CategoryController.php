<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories for the logged in tenant.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

        $search = $request->query('search');

        $query = Category::query()
            ->where('tenant_id', $tenantId)
            ->withCount('menus');

        if (! empty($search)) {
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->latest('id')->get()->map(fn (Category $cat) => [
            'id' => $cat->id,
            'name' => $cat->name,
            'slug' => $cat->slug,
            'menus_count' => $cat->menus_count,
            'created_at' => $cat->created_at?->format('d M Y'),
        ]);

        return Inertia::render('tenant/categories', [
            'categories' => $categories,
            'filters' => [
                'search' => $search ?? '',
            ],
            'counts' => [
                'total' => $categories->count(),
            ],
        ]);
    }

    /**
     * Store a newly created category for the tenant.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $counter = 1;

        while (Category::where('tenant_id', $tenantId)->where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        Category::create([
            'tenant_id' => $tenantId,
            'name' => $validated['name'],
            'slug' => $slug,
        ]);

        return back()->with('toast', [
            'type' => 'success',
            'message' => "Kategori '{$validated['name']}' berhasil ditambahkan!",
        ]);
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        $user = $request->user();
        $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

        if ($category->tenant_id !== $tenantId) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $counter = 1;

        while (Category::where('tenant_id', $tenantId)->where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $category->update([
            'name' => $validated['name'],
            'slug' => $slug,
        ]);

        return back()->with('toast', [
            'type' => 'success',
            'message' => 'Kategori berhasil diperbarui!',
        ]);
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Request $request, Category $category): RedirectResponse
    {
        $user = $request->user();
        $tenantId = $user->tenant_id ?? Tenant::query()->value('id');

        if ($category->tenant_id !== $tenantId) {
            abort(403);
        }

        $categoryName = $category->name;
        $category->delete();

        return back()->with('toast', [
            'type' => 'success',
            'message' => "Kategori '{$categoryName}' berhasil dihapus!",
        ]);
    }
}
