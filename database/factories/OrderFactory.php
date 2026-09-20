<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_number' => 'SC-'.now()->format('Ymd').'-'.fake()->unique()->numerify('#####'),
            'pickup_code' => 'FEB-'.fake()->unique()->numerify('####'),
            'user_id' => User::factory()->mahasiswa(),
            'tenant_id' => Tenant::factory(),
            'subtotal_amount' => fn (array $attributes) => $attributes['total_amount'] ?? 25000.00,
            'app_fee' => 0.00,
            'channel_fee' => 0.00,
            'total_amount' => 25000.00,
            'payment_method' => PaymentMethod::Cashless,
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Pending,
            'snap_token' => null,
            'paid_at' => now(),
            'processing_at' => null,
            'ready_at' => null,
            'completed_at' => null,
        ];
    }

    /**
     * Set Cash payment method and unpaid pending status.
     */
    public function cash(): static
    {
        return $this->state(fn () => [
            'payment_method' => PaymentMethod::Cash,
            'payment_status' => PaymentStatus::Unpaid,
            'status' => OrderStatus::Pending,
            'paid_at' => null,
        ]);
    }

    /**
     * Set Cashless payment method with snap token.
     */
    public function cashless(): static
    {
        return $this->state(fn () => [
            'payment_method' => PaymentMethod::Cashless,
            'snap_token' => 'snap-'.fake()->uuid(),
        ]);
    }

    /**
     * Indicate that the order is being processed by the tenant.
     */
    public function processing(): static
    {
        return $this->state(fn () => [
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Processing,
            'paid_at' => now()->subMinutes(10),
            'processing_at' => now()->subMinutes(5),
        ]);
    }

    /**
     * Indicate that the order is ready for pickup.
     */
    public function ready(): static
    {
        return $this->state(fn () => [
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Ready,
            'paid_at' => now()->subMinutes(20),
            'processing_at' => now()->subMinutes(15),
            'ready_at' => now()->subMinutes(2),
        ]);
    }

    /**
     * Indicate that the order is completed.
     */
    public function completed(): static
    {
        return $this->state(fn () => [
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Completed,
            'paid_at' => now()->subHours(1),
            'processing_at' => now()->subMinutes(50),
            'ready_at' => now()->subMinutes(30),
            'completed_at' => now()->subMinutes(10),
        ]);
    }

    /**
     * Indicate that the order failed.
     */
    public function failed(): static
    {
        return $this->state(fn () => [
            'payment_status' => PaymentStatus::Failed,
            'status' => OrderStatus::Failed,
            'paid_at' => null,
        ]);
    }
}
