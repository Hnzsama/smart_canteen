<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $order_number
 * @property string $pickup_code
 * @property int $user_id
 * @property int $tenant_id
 * @property string $total_amount
 * @property PaymentMethod $payment_method
 * @property PaymentStatus $payment_status
 * @property OrderStatus $status
 * @property string|null $snap_token
 * @property Carbon|null $paid_at
 * @property Carbon|null $processing_at
 * @property Carbon|null $ready_at
 * @property Carbon|null $completed_at
 * @property Carbon|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'order_number',
    'pickup_code',
    'user_id',
    'tenant_id',
    'subtotal_amount',
    'app_fee',
    'channel_fee',
    'total_amount',
    'payment_method',
    'payment_channel_code',
    'payment_details',
    'dining_option',
    'payment_status',
    'status',
    'snap_token',
    'notes',
    'paid_at',
    'processing_at',
    'ready_at',
    'completed_at',
])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'subtotal_amount' => 'decimal:2',
            'app_fee' => 'decimal:2',
            'channel_fee' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'payment_method' => PaymentMethod::class,
            'payment_status' => PaymentStatus::class,
            'status' => OrderStatus::class,
            'payment_details' => 'array',
            'paid_at' => 'datetime',
            'processing_at' => 'datetime',
            'ready_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Tenant, $this>
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Check and auto-expire order if unpaid (15 mins for cash, 10 mins for cashless).
     */
    public function checkAutoExpire(): bool
    {
        $minutes = $this->payment_method === PaymentMethod::Cash ? 15 : 10;

        if ($this->payment_status === PaymentStatus::Unpaid && $this->created_at?->copy()->addMinutes($minutes)->isPast()) {
            $this->update([
                'payment_status' => PaymentStatus::Failed,
                'status' => OrderStatus::Failed,
            ]);

            return true;
        }

        return false;
    }

    /**
     * Check if the order is expired.
     */
    public function isExpired(): bool
    {
        if ($this->status === OrderStatus::Failed || $this->payment_status === PaymentStatus::Failed) {
            return true;
        }

        $minutes = $this->payment_method === PaymentMethod::Cash ? 15 : 10;

        if ($this->payment_status === PaymentStatus::Unpaid && $this->created_at?->copy()->addMinutes($minutes)->isPast()) {
            return true;
        }

        return false;
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * @return HasOne<TenantRating, $this>
     */
    public function tenantRating(): HasOne
    {
        return $this->hasOne(TenantRating::class);
    }
}
