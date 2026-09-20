<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\TenantRating;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RatingController extends Controller
{
    /**
     * Display a listing of ratings and reviews for the logged-in tenant stand.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $tenantId = $user->tenant_id ?? Tenant::query()->value('id');
        $tenant = Tenant::query()->find($tenantId);

        $ratingsQuery = TenantRating::query()
            ->where('tenant_id', $tenantId)
            ->with(['user:id,name', 'order:id,order_number']);

        $ratings = $ratingsQuery->latest('id')->get()->map(fn (TenantRating $r) => [
            'id' => $r->id,
            'user_name' => $r->user?->name ?? 'Mahasiswa FEB',
            'order_number' => $r->order?->order_number ?? '-',
            'rating' => $r->rating,
            'comment' => $r->comment,
            'created_at' => $r->created_at?->diffForHumans() ?? $r->created_at?->format('d M Y H:i'),
        ]);

        $ratingStats = [
            'average' => $tenant ? (float) $tenant->rating : 5.0,
            'total_reviews' => $tenant ? (int) $tenant->reviews_count : $ratings->count(),
            'breakdown' => [
                5 => $ratings->where('rating', 5)->count(),
                4 => $ratings->where('rating', 4)->count(),
                3 => $ratings->where('rating', 3)->count(),
                2 => $ratings->where('rating', 2)->count(),
                1 => $ratings->where('rating', 1)->count(),
            ],
        ];

        return Inertia::render('tenant/ratings', [
            'ratings' => $ratings,
            'stats' => $ratingStats,
        ]);
    }
}
