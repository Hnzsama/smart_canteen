<?php

namespace App\Models;

use Database\Factories\TenantFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $image
 * @property string|null $midtrans_merchant_id
 * @property string|null $midtrans_client_key
 * @property string|null $midtrans_server_key
 * @property bool $midtrans_is_production
 * @property bool $midtrans_is_active
 * @property bool $is_active
 * @property Carbon|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'name',
    'slug',
    'description',
    'image',
    'banner_image',
    'logo_image',
    'phone',
    'opening_hours',
    'is_active',
    'is_open',
    'rating',
    'reviews_count',
    'midtrans_merchant_id',
    'midtrans_client_key',
    'midtrans_server_key',
    'midtrans_is_production',
    'midtrans_is_active',
])]
class Tenant extends Model
{
    /** @use HasFactory<TenantFactory> */
    use HasFactory, SoftDeletes;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'midtrans_server_key',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_open' => 'boolean',
            'rating' => 'float',
            'reviews_count' => 'integer',
            'midtrans_server_key' => 'encrypted',
            'midtrans_is_production' => 'boolean',
            'midtrans_is_active' => 'boolean',
        ];
    }

    /**
     * Check if this tenant has a valid and active Midtrans configuration.
     */
    public function hasActiveMidtrans(): bool
    {
        return (bool) $this->midtrans_is_active
            && !empty($this->midtrans_server_key)
            && !empty($this->midtrans_client_key);
    }

    /**
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * @return HasMany<Category, $this>
     */
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    /**
     * @return HasMany<Menu, $this>
     */
    public function menus(): HasMany
    {
        return $this->hasMany(Menu::class);
    }

    /**
     * @return HasMany<Order, $this>
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * @return HasMany<TenantRating, $this>
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(TenantRating::class);
    }
}
