<?php

namespace App\Http\Middleware;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $queueCount = 0;
        $verifyPaymentCount = 0;

        if ($user) {
            $user->loadMissing('tenant');
            $roles = $user->getRoleNames()->values()->all();

            if (in_array('tenant', $roles)) {
                $tenantId = $user->tenant_id ?? Tenant::query()->value('id');
                if ($tenantId) {
                    $queueCount = Order::query()
                        ->where('tenant_id', $tenantId)
                        ->whereIn('status', [
                            OrderStatus::Paid,
                            OrderStatus::Processing,
                            OrderStatus::Ready,
                        ])
                        ->count();

                    $verifyPaymentCount = Order::query()
                        ->where('tenant_id', $tenantId)
                        ->where('payment_method', PaymentMethod::Cash)
                        ->where('payment_status', PaymentStatus::Unpaid)
                        ->count();
                }
            } elseif (in_array('admin', $roles)) {
                $queueCount = Order::query()
                    ->whereIn('status', [
                        OrderStatus::Paid,
                        OrderStatus::Processing,
                        OrderStatus::Ready,
                    ])
                    ->count();

                $verifyPaymentCount = Order::query()
                    ->where('payment_method', PaymentMethod::Cash)
                    ->where('payment_status', PaymentStatus::Unpaid)
                    ->count();
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? array_merge($user->toArray(), [
                    'roles' => $user->getRoleNames()->values()->all(),
                    'tenant' => $user->tenant?->only([
                        'id',
                        'name',
                        'slug',
                        'description',
                        'image',
                        'banner_image',
                        'logo_image',
                        'phone',
                        'opening_hours',
                        'is_open',
                        'rating',
                        'reviews_count',
                    ]),
                ]) : null,
            ],
            'queueCount' => $queueCount,
            'verifyPaymentCount' => $verifyPaymentCount,
            'flash' => [
                'toast' => fn () => $request->session()->get('toast'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
