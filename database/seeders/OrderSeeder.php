<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mahasiswa = User::where('email', 'mahasiswa@feb.ac.id')->first();
        $budi = User::where('email', 'budi@feb.ac.id')->first();
        $tenant1 = Tenant::where('slug', 'kantin-bu-siti-feb')->first() ?? Tenant::first();

        if (! $mahasiswa || ! $tenant1) {
            return;
        }

        $menus = $tenant1->menus()->get();
        if ($menus->isEmpty()) {
            return;
        }

        // 1. Skenario Cashless Midtrans (Paid, Siap Diambil / Processing)
        $order1 = Order::query()->create([
            'order_number' => 'SC-'.now()->format('Ymd').'-0001',
            'pickup_code' => 'FEB-1001',
            'user_id' => $mahasiswa->id,
            'tenant_id' => $tenant1->id,
            'total_amount' => 27000.00,
            'payment_method' => PaymentMethod::Cashless,
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Processing,
            'snap_token' => 'snap-demo-token-12345',
            'paid_at' => now()->subMinutes(15),
            'processing_at' => now()->subMinutes(10),
            'ready_at' => null,
            'completed_at' => null,
        ]);

        $item1 = $menus->first();
        OrderItem::query()->create([
            'order_id' => $order1->id,
            'menu_id' => $item1->id,
            'menu_name' => $item1->name,
            'price' => $item1->price,
            'quantity' => 1,
            'subtotal' => $item1->price,
        ]);

        if ($menus->count() > 1) {
            $item2 = $menus->get(1);
            OrderItem::query()->create([
                'order_id' => $order1->id,
                'menu_id' => $item2->id,
                'menu_name' => $item2->name,
                'price' => $item2->price,
                'quantity' => 1,
                'subtotal' => $item2->price,
            ]);
        }

        // 2. Skenario Cash (QR Code Scan oleh Tenant: Pending, Belum Bayar)
        $order2 = Order::query()->create([
            'order_number' => 'SC-'.now()->format('Ymd').'-0002',
            'pickup_code' => 'FEB-8821',
            'user_id' => $budi ? $budi->id : $mahasiswa->id,
            'tenant_id' => $tenant1->id,
            'total_amount' => 15000.00,
            'payment_method' => PaymentMethod::Cash,
            'payment_status' => PaymentStatus::Unpaid,
            'status' => OrderStatus::Pending,
            'snap_token' => null,
            'paid_at' => null,
            'processing_at' => null,
            'ready_at' => null,
            'completed_at' => null,
        ]);

        OrderItem::query()->create([
            'order_id' => $order2->id,
            'menu_id' => $item1->id,
            'menu_name' => $item1->name,
            'price' => $item1->price,
            'quantity' => 1,
            'subtotal' => $item1->price,
        ]);

        // 3. Skenario Selesai (Completed)
        $order3 = Order::query()->create([
            'order_number' => 'SC-'.now()->format('Ymd').'-0003',
            'pickup_code' => 'FEB-9901',
            'user_id' => $mahasiswa->id,
            'tenant_id' => $tenant1->id,
            'total_amount' => 12000.00,
            'payment_method' => PaymentMethod::Cashless,
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Completed,
            'snap_token' => 'snap-completed-token-999',
            'paid_at' => now()->subHours(2),
            'processing_at' => now()->subHours(2)->addMinutes(5),
            'ready_at' => now()->subHours(2)->addMinutes(20),
            'completed_at' => now()->subHours(1)->addMinutes(45),
        ]);

        OrderItem::query()->create([
            'order_id' => $order3->id,
            'menu_id' => $item1->id,
            'menu_name' => $item1->name,
            'price' => 12000.00,
            'quantity' => 1,
            'subtotal' => 12000.00,
        ]);

        // 4. Seed 55+ realistic orders distributed across all tenants, students, statuses, and dates
        $allTenants = Tenant::with('menus')->has('menus')->get();
        $allStudents = User::role(UserRole::Mahasiswa->value)->get();

        if ($allTenants->isEmpty() || $allStudents->isEmpty()) {
            return;
        }

        $orderConfigs = [
            ['status' => OrderStatus::Completed, 'method' => PaymentMethod::Cashless, 'payment' => PaymentStatus::Paid],
            ['status' => OrderStatus::Completed, 'method' => PaymentMethod::Cash, 'payment' => PaymentStatus::Paid],
            ['status' => OrderStatus::Processing, 'method' => PaymentMethod::Cashless, 'payment' => PaymentStatus::Paid],
            ['status' => OrderStatus::Ready, 'method' => PaymentMethod::Cashless, 'payment' => PaymentStatus::Paid],
            ['status' => OrderStatus::Ready, 'method' => PaymentMethod::Cash, 'payment' => PaymentStatus::Paid],
            ['status' => OrderStatus::Pending, 'method' => PaymentMethod::Cash, 'payment' => PaymentStatus::Unpaid],
            ['status' => OrderStatus::Pending, 'method' => PaymentMethod::Cashless, 'payment' => PaymentStatus::Paid],
            ['status' => OrderStatus::Failed, 'method' => PaymentMethod::Cashless, 'payment' => PaymentStatus::Failed],
        ];

        for ($i = 4; $i <= 60; $i++) {
            $tenant = $allTenants->random();
            $customer = $allStudents->random();
            $tenantMenus = $tenant->menus;

            if ($tenantMenus->isEmpty()) {
                continue;
            }

            // Date distribution
            if ($i <= 25) {
                // Today
                $orderDate = now()->copy()->startOfDay()->addHours(fake()->numberBetween(7, 16))->addMinutes(fake()->numberBetween(0, 59));
                if ($orderDate->isFuture()) {
                    $orderDate = now()->subMinutes(fake()->numberBetween(5, 180));
                }
            } elseif ($i <= 42) {
                // This week
                $orderDate = now()->subDays(fake()->numberBetween(1, 5))->setTime(fake()->numberBetween(8, 16), fake()->numberBetween(0, 59));
            } else {
                // Earlier this month
                $orderDate = now()->subDays(fake()->numberBetween(6, 25))->setTime(fake()->numberBetween(8, 16), fake()->numberBetween(0, 59));
            }

            $config = fake()->randomElement($orderConfigs);
            $status = $config['status'];
            $paymentMethod = $config['method'];
            $paymentStatus = $config['payment'];

            $paidAt = ($paymentStatus === PaymentStatus::Paid)
                ? (clone $orderDate)->addMinutes(1)
                : null;
            $processingAt = in_array($status, [OrderStatus::Processing, OrderStatus::Ready, OrderStatus::Completed])
                ? (clone $orderDate)->addMinutes(5)
                : null;
            $readyAt = in_array($status, [OrderStatus::Ready, OrderStatus::Completed])
                ? (clone $orderDate)->addMinutes(18)
                : null;
            $completedAt = ($status === OrderStatus::Completed)
                ? (clone $orderDate)->addMinutes(30)
                : null;

            $itemCount = min($tenantMenus->count(), fake()->numberBetween(1, 3));
            $selectedMenus = $tenantMenus->random($itemCount);

            $totalAmount = 0;
            $orderItemsData = [];

            foreach ($selectedMenus as $menu) {
                $qty = fake()->numberBetween(1, 2);
                $subtotal = $menu->price * $qty;
                $totalAmount += $subtotal;
                $orderItemsData[] = [
                    'menu_id' => $menu->id,
                    'menu_name' => $menu->name,
                    'price' => $menu->price,
                    'quantity' => $qty,
                    'subtotal' => $subtotal,
                ];
            }

            $orderNumber = 'SC-'.$orderDate->format('Ymd').'-'.str_pad((string) $i, 4, '0', STR_PAD_LEFT);
            $pickupCode = 'FEB-'.str_pad((string) (1000 + $i), 4, '0', STR_PAD_LEFT);

            $order = Order::query()->create([
                'order_number' => $orderNumber,
                'pickup_code' => $pickupCode,
                'user_id' => $customer->id,
                'tenant_id' => $tenant->id,
                'total_amount' => $totalAmount,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentStatus,
                'status' => $status,
                'snap_token' => $paymentMethod === PaymentMethod::Cashless ? 'snap-'.Str::random(24) : null,
                'paid_at' => $paidAt,
                'processing_at' => $processingAt,
                'ready_at' => $readyAt,
                'completed_at' => $completedAt,
            ]);

            $order->forceFill([
                'created_at' => $orderDate,
                'updated_at' => $completedAt ?? $readyAt ?? $processingAt ?? $paidAt ?? $orderDate,
            ])->save();

            foreach ($orderItemsData as $itemData) {
                OrderItem::query()->create([
                    'order_id' => $order->id,
                    'menu_id' => $itemData['menu_id'],
                    'menu_name' => $itemData['menu_name'],
                    'price' => $itemData['price'],
                    'quantity' => $itemData['quantity'],
                    'subtotal' => $itemData['subtotal'],
                ]);
            }
        }
    }
}
