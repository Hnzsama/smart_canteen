<?php

namespace Database\Factories;

use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 3);
        $price = 15000.00;

        return [
            'order_id' => Order::factory(),
            'menu_id' => Menu::factory(),
            'menu_name' => 'Nasi Ayam Geprek Sambal Korek',
            'price' => $price,
            'quantity' => $quantity,
            'subtotal' => $price * $quantity,
        ];
    }

    /**
     * Snapshot from a specific menu item.
     */
    public function forMenu(Menu $menu, int $quantity = 1): static
    {
        return $this->state(fn () => [
            'menu_id' => $menu->id,
            'menu_name' => $menu->name,
            'price' => (float) $menu->price,
            'quantity' => $quantity,
            'subtotal' => (float) $menu->price * $quantity,
        ]);
    }
}
