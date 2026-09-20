<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Throwable;

class UserController extends Controller
{
    /**
     * Display a listing of users with filters and counts.
     */
    public function index(Request $request): Response
    {
        try {
            $roleFilter = $request->query('role', 'all');
            $search = $request->query('search');

            $query = User::query()
                ->with(['roles', 'tenant:id,name,slug'])
                ->withCount('orders');

            if ($roleFilter === 'trashed') {
                $query->onlyTrashed();
            } elseif (in_array($roleFilter, [UserRole::Admin->value, UserRole::Tenant->value, UserRole::Mahasiswa->value], true)) {
                $query->whereHas('roles', fn ($q) => $q->where('name', $roleFilter));
            }

            if (! empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $perPage = (int) $request->query('per_page', 10);
            $paginator = $query->latest('id')->paginate($perPage)->withQueryString();

            $users = collect($paginator->items())->map(function (User $user) {
                $primaryRole = $user->roles->first()?->name ?? UserRole::Mahasiswa->value;
                $roleEnum = UserRole::tryFrom($primaryRole) ?? UserRole::Mahasiswa;

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $roleEnum->value,
                    'role_label' => $roleEnum->label(),
                    'tenant_id' => $user->tenant_id,
                    'tenant_name' => $user->tenant?->name,
                    'is_verified' => $user->hasVerifiedEmail(),
                    'email_verified_at' => $user->email_verified_at?->format('d M Y H:i'),
                    'orders_count' => (int) $user->orders_count,
                    'is_trashed' => $user->trashed(),
                    'deleted_at' => $user->deleted_at?->format('d M Y H:i'),
                    'created_at' => $user->created_at?->format('d M Y'),
                ];
            })->values()->all();

            $tenants = Tenant::select(['id', 'name'])->orderBy('name')->get();

            return Inertia::render('admin/users', [
                'users' => $users,
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
                    'role' => $roleFilter,
                    'search' => $search ?? '',
                    'per_page' => $perPage,
                    'page' => $paginator->currentPage(),
                ],
                'counts' => [
                    'all' => User::count(),
                    'admin' => User::whereHas('roles', fn ($q) => $q->where('name', UserRole::Admin->value))->count(),
                    'tenant' => User::whereHas('roles', fn ($q) => $q->where('name', UserRole::Tenant->value))->count(),
                    'mahasiswa' => User::whereHas('roles', fn ($q) => $q->where('name', UserRole::Mahasiswa->value))->count(),
                    'trashed' => User::onlyTrashed()->count(),
                ],
                'currentUserId' => $request->user()->id,
            ]);
        } catch (Throwable $e) {
            Log::error('Gagal memuat daftar pengguna: '.$e->getMessage(), [
                'exception' => $e,
                'query_params' => $request->all(),
            ]);

            return Inertia::render('admin/users', [
                'users' => [],
                'tenants' => [],
                'filters' => [
                    'role' => 'all',
                    'search' => '',
                ],
                'counts' => [
                    'all' => 0,
                    'admin' => 0,
                    'tenant' => 0,
                    'mahasiswa' => 0,
                    'trashed' => 0,
                ],
                'currentUserId' => $request->user()?->id ?? 0,
                'error' => 'Gagal memuat data pengguna dari server.',
            ]);
        }
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', Password::defaults()],
            'role' => ['required', 'string', Rule::enum(UserRole::class)],
            'tenant_id' => [
                'nullable',
                Rule::requiredIf(fn () => $request->input('role') === UserRole::Tenant->value),
                'exists:tenants,id',
            ],
            'verify_email_now' => ['nullable', 'boolean'],
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => $validated['password'],
                    'tenant_id' => $validated['role'] === UserRole::Tenant->value ? $validated['tenant_id'] : null,
                    'email_verified_at' => ! empty($validated['verify_email_now']) ? now() : null,
                ]);

                Role::findOrCreate($validated['role'], 'web');
                $user->syncRoles([$validated['role']]);
            });

            $toast = [
                'type' => 'success',
                'message' => "Pengguna {$validated['name']} berhasil ditambahkan.",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error('Gagal menambahkan pengguna baru: '.$e->getMessage(), [
                'exception' => $e,
                'request_data' => [
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'role' => $validated['role'],
                ],
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Terjadi kesalahan sistem saat membuat akun pengguna. Silakan coba beberapa saat lagi.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'password' => ['nullable', 'string', Password::defaults()],
            'role' => ['required', 'string', Rule::enum(UserRole::class)],
            'tenant_id' => [
                'nullable',
                Rule::requiredIf(fn () => $request->input('role') === UserRole::Tenant->value),
                'exists:tenants,id',
            ],
            'verify_email_now' => ['nullable', 'boolean'],
        ]);

        // Prevent self-demotion from admin
        if ($request->user()->id === $user->id && $validated['role'] !== UserRole::Admin->value) {
            $toast = [
                'type' => 'error',
                'message' => 'Anda tidak dapat mengubah role akun administrator Anda sendiri.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }

        try {
            DB::transaction(function () use ($validated, $user) {
                $user->name = $validated['name'];
                $user->email = $validated['email'];

                if (! empty($validated['password'])) {
                    $user->password = $validated['password'];
                }

                $user->tenant_id = $validated['role'] === UserRole::Tenant->value ? $validated['tenant_id'] : null;

                if (! empty($validated['verify_email_now']) && ! $user->hasVerifiedEmail()) {
                    $user->email_verified_at = now();
                }

                $user->save();
                Role::findOrCreate($validated['role'], 'web');
                $user->syncRoles([$validated['role']]);
            });

            $toast = [
                'type' => 'success',
                'message' => "Data pengguna {$user->name} berhasil diperbarui.",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error("Gagal memperbarui pengguna [ID: {$user->id}]: ".$e->getMessage(), [
                'exception' => $e,
                'user_id' => $user->id,
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Terjadi kesalahan sistem saat memperbarui data pengguna. Silakan coba beberapa saat lagi.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Soft delete the specified user.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        // Prevent self-deletion
        if ($request->user()->id === $user->id) {
            $toast = [
                'type' => 'error',
                'message' => 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }

        try {
            DB::transaction(function () use ($user) {
                $user->delete();
            });

            $toast = [
                'type' => 'success',
                'message' => "Pengguna {$user->name} berhasil dipindahkan ke tempat sampah.",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error("Gagal menghapus pengguna [ID: {$user->id}]: ".$e->getMessage(), [
                'exception' => $e,
                'user_id' => $user->id,
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Terjadi kesalahan sistem saat menghapus akun pengguna. Silakan coba beberapa saat lagi.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Restore the soft-deleted user.
     */
    public function restore(User $user): RedirectResponse
    {
        try {
            DB::transaction(function () use ($user) {
                $user->restore();
            });

            $toast = [
                'type' => 'success',
                'message' => "Akun pengguna {$user->name} berhasil dipulihkan.",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error("Gagal memulihkan pengguna [ID: {$user->id}]: ".$e->getMessage(), [
                'exception' => $e,
                'user_id' => $user->id,
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Terjadi kesalahan sistem saat memulihkan akun pengguna. Silakan coba beberapa saat lagi.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }

    /**
     * Toggle email verification status manually.
     */
    public function toggleVerify(User $user): RedirectResponse
    {
        try {
            DB::transaction(function () use ($user) {
                if ($user->hasVerifiedEmail()) {
                    $user->email_verified_at = null;
                } else {
                    $user->email_verified_at = now();
                }
                $user->save();
            });

            $statusText = $user->hasVerifiedEmail() ? 'terverifikasi' : 'belum diverifikasi';
            $toast = [
                'type' => 'success',
                'message' => "Status email {$user->name} diubah menjadi {$statusText}.",
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        } catch (Throwable $e) {
            Log::error("Gagal mengubah status verifikasi email pengguna [ID: {$user->id}]: ".$e->getMessage(), [
                'exception' => $e,
                'user_id' => $user->id,
            ]);

            $toast = [
                'type' => 'error',
                'message' => 'Terjadi kesalahan sistem saat memperbarui status verifikasi email.',
            ];
            Inertia::flash('toast', $toast);

            return back()->with('toast', $toast);
        }
    }
}
