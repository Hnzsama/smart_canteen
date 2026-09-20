<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Throwable;

class TenantController extends Controller
{
    /**
     * Display a listing of tenants with filters and counts.
     */
    public function index(Request $request): Response
    {
        try {
            $status = $request->query('status', 'all');
            $search = $request->query('search');

            $query = Tenant::query()
                ->with(['users:id,name,email,tenant_id'])
                ->withCount(['menus', 'orders']);

            if ($status === 'trashed') {
                $query->onlyTrashed();
            } elseif ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }

            if (! empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            }

            $perPage = (int) $request->query('per_page', 10);
            $paginator = $query->latest('id')->paginate($perPage)->withQueryString();

            $tenants = collect($paginator->items())->map(fn (Tenant $tenant) => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'slug' => $tenant->slug,
                'description' => $tenant->description,
                'is_active' => (bool) $tenant->is_active,
                'is_trashed' => $tenant->trashed(),
                'menus_count' => (int) $tenant->menus_count,
                'orders_count' => (int) $tenant->orders_count,
                'managers' => $tenant->users->map(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ])->values()->all(),
                'deleted_at' => $tenant->deleted_at?->format('d M Y H:i'),
                'created_at' => $tenant->created_at?->format('d M Y'),
            ])->values()->all();

            $availableUsers = User::query()
                ->select(['id', 'name', 'email', 'tenant_id'])
                ->with('roles:name')
                ->orderBy('name')
                ->get()
                ->map(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->first()?->name ?? 'mahasiswa',
                    'tenant_id' => $user->tenant_id,
                ]);

            return Inertia::render('admin/tenants', [
                'tenants' => $tenants,
                'pagination' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'from' => $paginator->firstItem(),
                    'to' => $paginator->lastItem(),
                ],
                'available_users' => $availableUsers,
                'filters' => [
                    'status' => $status,
                    'search' => $search ?? '',
                    'per_page' => $perPage,
                    'page' => $paginator->currentPage(),
                ],
                'counts' => [
                    'all' => Tenant::count(),
                    'active' => Tenant::where('is_active', true)->count(),
                    'inactive' => Tenant::where('is_active', false)->count(),
                    'trashed' => Tenant::onlyTrashed()->count(),
                ],
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal memuat daftar stand kantin: '.$e->getMessage(), [
                'exception' => $e,
                'query_params' => $request->all(),
            ]);

            return Inertia::render('admin/tenants', [
                'tenants' => [],
                'available_users' => [],
                'filters' => [
                    'status' => 'all',
                    'search' => '',
                ],
                'counts' => [
                    'all' => 0,
                    'active' => 0,
                    'inactive' => 0,
                    'trashed' => 0,
                ],
                'error' => 'Gagal memuat data stand kantin dari server.',
            ]);
        }
    }

    /**
     * Store a newly created tenant in storage with required manager account.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:tenants,name'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
            'manager_mode' => ['required', 'in:new,existing'],
            'manager_name' => ['required_if:manager_mode,new', 'nullable', 'string', 'max:255'],
            'manager_email' => ['required_if:manager_mode,new', 'nullable', 'email', 'max:255', 'unique:users,email'],
            'manager_password' => ['required_if:manager_mode,new', 'nullable', 'string', 'min:8'],
            'manager_user_id' => ['required_if:manager_mode,existing', 'nullable', 'exists:users,id'],
        ], [
            'manager_mode.required' => 'Pilihan akun pengelola stand wajib ditentukan.',
            'manager_name.required_if' => 'Nama pengelola stand wajib diisi.',
            'manager_email.required_if' => 'Email pengelola stand wajib diisi.',
            'manager_email.unique' => 'Email ini sudah terdaftar sebagai pengguna lain.',
            'manager_password.required_if' => 'Password akun pengelola wajib diisi.',
            'manager_password.min' => 'Password akun pengelola minimal 8 karakter.',
            'manager_user_id.required_if' => 'Pengguna yang akan dijadikan pengelola wajib dipilih.',
            'manager_user_id.exists' => 'Pengguna yang dipilih tidak ditemukan di sistem.',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $baseSlug = Str::slug($validated['name']);
                $slug = $baseSlug;
                $count = 1;

                while (Tenant::withTrashed()->where('slug', $slug)->exists()) {
                    $slug = $baseSlug.'-'.$count;
                    $count++;
                }

                $tenant = Tenant::create([
                    'name' => $validated['name'],
                    'slug' => $slug,
                    'description' => $validated['description'] ?? null,
                    'is_active' => $validated['is_active'] ?? true,
                ]);

                Role::findOrCreate(UserRole::Tenant->value, 'web');

                if ($validated['manager_mode'] === 'new') {
                    $manager = User::create([
                        'name' => $validated['manager_name'],
                        'email' => $validated['manager_email'],
                        'password' => Hash::make($validated['manager_password']),
                        'tenant_id' => $tenant->id,
                        'email_verified_at' => now(),
                    ]);
                    $manager->assignRole(UserRole::Tenant->value);
                } else {
                    $manager = User::findOrFail($validated['manager_user_id']);
                    $manager->update(['tenant_id' => $tenant->id]);
                    $manager->syncRoles([UserRole::Tenant->value]);
                }
            });

            $toast = [
                'type' => 'success',
                'message' => 'Stand kantin dan akun pengelola berhasil ditambahkan.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error('Gagal menambahkan stand kantin: '.$e->getMessage(), [
                'exception' => $e,
                'request_data' => $validated,
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Terjadi kesalahan sistem saat menambahkan stand kantin. Silakan coba beberapa saat lagi.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Update the specified tenant and manage manager account.
     */
    public function update(Request $request, Tenant $tenant): RedirectResponse
    {
        $hasExistingManager = $tenant->users()->exists();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:tenants,name,'.$tenant->id],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
            'manager_mode' => [$hasExistingManager ? 'nullable' : 'required', 'in:keep,new,existing'],
            'manager_name' => ['required_if:manager_mode,new', 'nullable', 'string', 'max:255'],
            'manager_email' => ['required_if:manager_mode,new', 'nullable', 'email', 'max:255', 'unique:users,email'],
            'manager_password' => ['required_if:manager_mode,new', 'nullable', 'string', 'min:8'],
            'manager_user_id' => ['required_if:manager_mode,existing', 'nullable', 'exists:users,id'],
        ], [
            'manager_mode.required' => 'Stand ini belum memiliki akun pengelola. Wajib membuat atau memilih akun pengelola.',
            'manager_name.required_if' => 'Nama pengelola stand wajib diisi.',
            'manager_email.required_if' => 'Email pengelola stand wajib diisi.',
            'manager_email.unique' => 'Email ini sudah terdaftar sebagai pengguna lain.',
            'manager_password.required_if' => 'Password akun pengelola wajib diisi.',
            'manager_password.min' => 'Password akun pengelola minimal 8 karakter.',
            'manager_user_id.required_if' => 'Pengguna yang akan dijadikan pengelola wajib dipilih.',
            'manager_user_id.exists' => 'Pengguna yang dipilih tidak ditemukan di sistem.',
        ]);

        try {
            DB::transaction(function () use ($validated, $tenant) {
                if ($validated['name'] !== $tenant->name) {
                    $baseSlug = Str::slug($validated['name']);
                    $slug = $baseSlug;
                    $count = 1;

                    while (Tenant::withTrashed()->where('slug', $slug)->where('id', '!=', $tenant->id)->exists()) {
                        $slug = $baseSlug.'-'.$count;
                        $count++;
                    }
                    $tenant->slug = $slug;
                }

                $tenant->name = $validated['name'];
                $tenant->description = $validated['description'] ?? null;
                if (isset($validated['is_active'])) {
                    $tenant->is_active = (bool) $validated['is_active'];
                }
                $tenant->save();

                Role::findOrCreate(UserRole::Tenant->value, 'web');

                $managerMode = $validated['manager_mode'] ?? 'keep';

                if ($managerMode === 'new') {
                    $manager = User::create([
                        'name' => $validated['manager_name'],
                        'email' => $validated['manager_email'],
                        'password' => Hash::make($validated['manager_password']),
                        'tenant_id' => $tenant->id,
                        'email_verified_at' => now(),
                    ]);
                    $manager->assignRole(UserRole::Tenant->value);
                } elseif ($managerMode === 'existing') {
                    $manager = User::findOrFail($validated['manager_user_id']);
                    $manager->update(['tenant_id' => $tenant->id]);
                    $manager->syncRoles([UserRole::Tenant->value]);
                }
            });

            $toast = [
                'type' => 'success',
                'message' => 'Informasi stand kantin berhasil diperbarui.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error("Gagal memperbarui stand kantin [ID: {$tenant->id}]: ".$e->getMessage(), [
                'exception' => $e,
                'tenant_id' => $tenant->id,
                'request_data' => $validated,
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Terjadi kesalahan sistem saat memperbarui stand kantin. Silakan coba beberapa saat lagi.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Soft delete the specified tenant.
     */
    public function destroy(Tenant $tenant): RedirectResponse
    {
        try {
            DB::transaction(function () use ($tenant) {
                $tenant->delete();
            });

            $toast = [
                'type' => 'success',
                'message' => "Stand kantin {$tenant->name} berhasil dipindahkan ke tempat sampah.",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error("Gagal menghapus stand kantin [ID: {$tenant->id}]: ".$e->getMessage(), [
                'exception' => $e,
                'tenant_id' => $tenant->id,
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Terjadi kesalahan sistem saat menghapus stand kantin. Silakan coba beberapa saat lagi.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Restore the specified soft-deleted tenant.
     */
    public function restore(Tenant $tenant): RedirectResponse
    {
        try {
            DB::transaction(function () use ($tenant) {
                $tenant->restore();
            });

            $toast = [
                'type' => 'success',
                'message' => "Stand kantin {$tenant->name} berhasil dipulihkan.",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error("Gagal memulihkan stand kantin [ID: {$tenant->id}]: ".$e->getMessage(), [
                'exception' => $e,
                'tenant_id' => $tenant->id,
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Terjadi kesalahan sistem saat memulihkan stand kantin. Silakan coba beberapa saat lagi.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Toggle active/inactive operational status.
     */
    public function toggleStatus(Tenant $tenant): RedirectResponse
    {
        try {
            DB::transaction(function () use ($tenant) {
                $tenant->update([
                    'is_active' => ! $tenant->is_active,
                ]);
            });

            $statusText = $tenant->is_active ? 'diaktifkan' : 'dinonaktifkan';
            $toast = [
                'type' => 'success',
                'message' => "Stand kantin {$tenant->name} berhasil {$statusText}.",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error("Gagal mengubah status operasional stand kantin [ID: {$tenant->id}]: ".$e->getMessage(), [
                'exception' => $e,
                'tenant_id' => $tenant->id,
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Terjadi kesalahan sistem saat mengubah status operasional stand kantin. Silakan coba beberapa saat lagi.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }
}
