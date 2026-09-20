<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $key
 * @property string|null $value
 * @property string|null $label
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'key',
    'value',
    'label',
])]
class AppSetting extends Model
{
    use HasFactory;

    /**
     * Get setting value by key with default fallback.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::query()->where('key', $key)->first();

        return $setting ? $setting->value : $default;
    }

    /**
     * Set or update setting value by key.
     */
    public static function set(string $key, mixed $value, ?string $label = null): static
    {
        return static::query()->updateOrCreate(
            ['key' => $key],
            [
                'value' => (string) $value,
                'label' => $label,
            ]
        );
    }
}
