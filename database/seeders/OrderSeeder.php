<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Tenant;
use App\Models\TenantRating;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
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

        // Bersihkan data order & ulasan lama agar idempotent
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        OrderItem::truncate();
        TenantRating::truncate();
        Order::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Skenario Cashless Midtrans (Selesai / Completed)
        $order1 = Order::query()->create([
            'order_number' => 'SC-'.now()->format('Ymd').'-0001',
            'pickup_code' => 'FEB-1001',
            'user_id' => $mahasiswa->id,
            'tenant_id' => $tenant1->id,
            'subtotal_amount' => 26000.00,
            'app_fee' => 1000.00,
            'channel_fee' => 0.00,
            'total_amount' => 27000.00,
            'payment_method' => PaymentMethod::Cashless,
            'payment_channel_code' => 'qris',
            'dining_option' => 'dine_in',
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Completed,
            'snap_token' => 'snap-demo-token-12345',
            'paid_at' => now()->subHours(3),
            'processing_at' => now()->subHours(3)->addMinutes(5),
            'ready_at' => now()->subHours(3)->addMinutes(20),
            'completed_at' => now()->subHours(2)->addMinutes(45),
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

        // 2. Skenario Cash (Selesai / Completed)
        $order2 = Order::query()->create([
            'order_number' => 'SC-'.now()->format('Ymd').'-0002',
            'pickup_code' => 'FEB-8821',
            'user_id' => $budi ? $budi->id : $mahasiswa->id,
            'tenant_id' => $tenant1->id,
            'subtotal_amount' => 14000.00,
            'app_fee' => 1000.00,
            'channel_fee' => 0.00,
            'total_amount' => 15000.00,
            'payment_method' => PaymentMethod::Cash,
            'payment_channel_code' => 'cash',
            'dining_option' => 'take_away',
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Completed,
            'snap_token' => null,
            'paid_at' => now()->subHours(2)->addMinutes(5),
            'processing_at' => now()->subHours(2)->addMinutes(5),
            'ready_at' => now()->subHours(2)->addMinutes(20),
            'completed_at' => now()->subHours(1)->addMinutes(30),
        ]);

        OrderItem::query()->create([
            'order_id' => $order2->id,
            'menu_id' => $item1->id,
            'menu_name' => $item1->name,
            'price' => 15000.00,
            'quantity' => 1,
            'subtotal' => 15000.00,
        ]);

        // 3. Skenario Selesai (Completed)
        $order3 = Order::query()->create([
            'order_number' => 'SC-'.now()->format('Ymd').'-0003',
            'pickup_code' => 'FEB-9901',
            'user_id' => $mahasiswa->id,
            'tenant_id' => $tenant1->id,
            'subtotal_amount' => 12000.00,
            'app_fee' => 0.00,
            'channel_fee' => 0.00,
            'total_amount' => 12000.00,
            'payment_method' => PaymentMethod::Cashless,
            'payment_channel_code' => 'gopay',
            'dining_option' => 'dine_in',
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

        // 4. Seeding 550 realistic orders across all 100 tenants and 100 students
        $allTenants = Tenant::with('menus')->has('menus')->get();
        $allStudents = User::role(UserRole::Mahasiswa->value)->get();

        if ($allTenants->isEmpty() || $allStudents->isEmpty()) {
            return;
        }

        $reviewComments = [
            'Makanannya enak banget, bumbunya pas dan porsi ngenyangin!',
            'Pelayanan ramah dan pesanan cepat jadi, mantap.',
            'Harga mahasiswa tapi rasanya bintang lima, langganan tetap!',
            'Paling cocok buat makan siang cepat sebelum kuliah.',
            'Penyajian bersih, higienis, dan masih hangat saat diambil.',
            'Sambalnya mantap nampol, recommended pol!',
            'Minumannya segar banget, manisnya pas nggak bikin seret.',
            'Rasa autentik khas rumahan, porsinya pas di perut.',
            'Kemasan rapi, siap takeaway tanpa takut tumpah.',
            'Sangat recommended buat teman-teman kampus FEB!',
        ];

        $paymentChannels = ['qris', 'gopay', 'shopeepay', 'bca_va', 'mandiri_va'];
        $diningOptions = ['dine_in', 'take_away'];

        DB::transaction(function () use ($allTenants, $allStudents, $reviewComments, $paymentChannels, $diningOptions) {
            // Seed 550 order transaksi
            for ($i = 4; $i <= 550; $i++) {
                $tenant = $allTenants->random();
                $customer = $allStudents->random();
                $tenantMenus = $tenant->menus;

                if ($tenantMenus->isEmpty()) {
                    continue;
                }

                // Distribusi tanggal yang realistis:
                // 150 order hari ini, 150 minggu ini, 250 sebulan ke belakang
                if ($i <= 150) {
                    $orderDate = now()->copy()->startOfDay()->addHours(rand(7, 16))->addMinutes(rand(0, 59));
                    if ($orderDate->isFuture()) {
                        $orderDate = now()->subMinutes(rand(5, 120));
                    }
                } elseif ($i <= 300) {
                    $orderDate = now()->subDays(rand(1, 6))->setTime(rand(8, 16), rand(0, 59));
                } else {
                    $orderDate = now()->subDays(rand(7, 28))->setTime(rand(8, 16), rand(0, 59));
                }

                // Distribusi status
                $randStatus = rand(1, 100);
                if ($i <= 30 && $randStatus <= 25) {
                    $status = OrderStatus::Processing;
                    $paymentStatus = PaymentStatus::Paid;
                    $paymentMethod = rand(1, 10) <= 7 ? PaymentMethod::Cashless : PaymentMethod::Cash;
                } elseif ($i <= 30 && $randStatus <= 50) {
                    $status = OrderStatus::Ready;
                    $paymentStatus = PaymentStatus::Paid;
                    $paymentMethod = rand(1, 10) <= 7 ? PaymentMethod::Cashless : PaymentMethod::Cash;
                } elseif ($randStatus <= 92) {
                    $status = OrderStatus::Completed;
                    $paymentStatus = PaymentStatus::Paid;
                    $paymentMethod = rand(1, 10) <= 7 ? PaymentMethod::Cashless : PaymentMethod::Cash;
                } elseif ($randStatus <= 96) {
                    $status = OrderStatus::Paid;
                    $paymentStatus = PaymentStatus::Paid;
                    $paymentMethod = PaymentMethod::Cashless;
                } else {
                    $status = OrderStatus::Pending;
                    $paymentStatus = PaymentStatus::Unpaid;
                    $paymentMethod = PaymentMethod::Cashless;
                }

                $paidAt = ($paymentStatus === PaymentStatus::Paid)
                    ? (clone $orderDate)->addMinutes(1)
                    : null;
                $processingAt = in_array($status, [OrderStatus::Processing, OrderStatus::Ready, OrderStatus::Completed])
                    ? (clone $orderDate)->addMinutes(4)
                    : null;
                $readyAt = in_array($status, [OrderStatus::Ready, OrderStatus::Completed])
                    ? (clone $orderDate)->addMinutes(15)
                    : null;
                $completedAt = ($status === OrderStatus::Completed)
                    ? (clone $orderDate)->addMinutes(25)
                    : null;

                $itemCount = min($tenantMenus->count(), rand(1, 3));
                $selectedMenus = $tenantMenus->random($itemCount);

                $subtotalAmount = 0;
                $orderItemsData = [];

                foreach ($selectedMenus as $menu) {
                    $qty = rand(1, 2);
                    $sub = $menu->price * $qty;
                    $subtotalAmount += $sub;
                    $orderItemsData[] = [
                        'menu_id' => $menu->id,
                        'menu_name' => $menu->name,
                        'price' => $menu->price,
                        'quantity' => $qty,
                        'subtotal' => $sub,
                    ];
                }

                $appFee = 1000.00;
                $channelFee = ($paymentMethod === PaymentMethod::Cashless && rand(1, 2) === 1) ? 500.00 : 0.00;
                $totalAmount = $subtotalAmount + $appFee + $channelFee;

                $orderNumber = 'SC-'.$orderDate->format('Ymd').'-'.str_pad((string) $i, 5, '0', STR_PAD_LEFT);
                $pickupCode = 'FEB-'.str_pad((string) (2000 + $i), 6, '0', STR_PAD_LEFT);

                $order = Order::query()->create([
                    'order_number' => $orderNumber,
                    'pickup_code' => $pickupCode,
                    'user_id' => $customer->id,
                    'tenant_id' => $tenant->id,
                    'subtotal_amount' => $subtotalAmount,
                    'app_fee' => $appFee,
                    'channel_fee' => $channelFee,
                    'total_amount' => $totalAmount,
                    'payment_method' => $paymentMethod,
                    'payment_channel_code' => $paymentMethod === PaymentMethod::Cashless ? Arr::random($paymentChannels) : 'cash',
                    'dining_option' => Arr::random($diningOptions),
                    'payment_status' => $paymentStatus,
                    'status' => $status,
                    'snap_token' => $paymentMethod === PaymentMethod::Cashless ? 'snap-'.Str::random(24) : null,
                    'paid_at' => $paidAt,
                    'processing_at' => $processingAt,
                    'ready_at' => $readyAt,
                    'completed_at' => $completedAt,
                    'created_at' => $orderDate,
                    'updated_at' => $completedAt ?? $readyAt ?? $processingAt ?? $paidAt ?? $orderDate,
                ]);

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

                // Berikan rating ulasan untuk ~35% order yang selesai
                if ($status === OrderStatus::Completed && rand(1, 100) <= 35) {
                    TenantRating::query()->create([
                        'tenant_id' => $tenant->id,
                        'user_id' => $customer->id,
                        'order_id' => $order->id,
                        'rating' => rand(4, 5),
                        'comment' => Arr::random($reviewComments),
                        'created_at' => $completedAt ?? $orderDate,
                        'updated_at' => $completedAt ?? $orderDate,
                    ]);
                }
            }
        });

        // Sinkronisasi rating & reviews_count di masing-masing tenant
        foreach ($allTenants as $tenant) {
            $avg = TenantRating::where('tenant_id', $tenant->id)->avg('rating');
            $count = TenantRating::where('tenant_id', $tenant->id)->count();

            if ($count > 0) {
                $tenant->update([
                    'rating' => round($avg, 2),
                    'reviews_count' => $count,
                ]);
            }
        }
    }
}
