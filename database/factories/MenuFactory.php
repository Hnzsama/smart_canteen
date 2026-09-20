<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Menu>
 */
class MenuFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $foodNames = [
            'Nasi Ayam Geprek Sambal Korek',
            'Nasi Goreng Spesial FEB',
            'Mie Goreng Telur Sosis',
            'Soto Ayam Lamongan Komplit',
            'Ayam Bakar Madu',
            'Es Teh Manis Jumbo',
            'Es Jeruk Peras Segar',
            'Kopi Susu Kampus Gula Aren',
            'Tahu Crispy Gurih',
            'Pisang Coklat Lumer',
        ];

        $price = fake()->randomElement([5000, 8000, 10000, 12000, 15000, 18000, 20000]);
        $hasDiscount = fake()->boolean(40);

        return [
            'tenant_id' => Tenant::factory(),
            'category_id' => null,
            'global_category' => 'makanan',
            'name' => fake()->randomElement($foodNames),
            'description' => fake()->sentence(6),
            'price' => $price,
            'original_price' => $hasDiscount ? $price + fake()->randomElement([2000, 3000, 5000]) : null,
            'image' => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
            'is_available' => true,
            'is_recommended' => fake()->boolean(30),
            'estimated_time' => fake()->randomElement([10, 15, 20, 25]),
            'options' => [
                [
                    'name' => 'Tingkat Kepedasan',
                    'type' => 'radio',
                    'required' => true,
                    'choices' => [
                        ['name' => 'Tidak Pedas', 'price' => 0],
                        ['name' => 'Sedang', 'price' => 0],
                        ['name' => 'Pedas', 'price' => 1000],
                    ],
                ],
            ],
        ];
    }

    /**
     * Associate with a category (and keep same tenant).
     */
    public function forCategory(Category $category): static
    {
        return $this->state(fn () => [
            'tenant_id' => $category->tenant_id,
            'category_id' => $category->id,
        ]);
    }

    /**
     * Indicate that the menu item is out of stock.
     */
    public function unavailable(): static
    {
        return $this->state(fn () => [
            'is_available' => false,
        ]);
    }
}
