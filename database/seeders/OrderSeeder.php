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

        // 1. Skenario Cashless Midtrans VA (Contoh spesifik: PKP-646 Rp 16.000 + Rp 1.000 + Rp 4.000 = Rp 21.000)
        $order1 = Order::query()->create([
            'order_number' => 'ORD-'.now()->format('Ymd').'-DMJUZK',
            'pickup_code' => 'PKP-646',
            'user_id' => $budi ? $budi->id : $mahasiswa->id,
            'tenant_id' => $tenant1->id,
            'subtotal_amount' => 16000.00,
            'app_fee' => 1000.00,
            'channel_fee' => 4000.00,
            'total_amount' => 21000.00,
            'payment_method' => PaymentMethod::Cashless,
            'payment_channel_code' => 'bca_va',
            'dining_option' => 'dine_in',
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Completed,
            'snap_token' => 'snap-demo-token-va-646',
            'paid_at' => now()->subMinutes(25),
            'processing_at' => now()->subMinutes(20),
            'ready_at' => now()->subMinutes(10),
            'completed_at' => now()->subMinutes(3),
            'created_at' => now()->subMinutes(26),
            'updated_at' => now()->subMinutes(3),
        ]);

        $item1 = $menus->first();
        OrderItem::query()->create([
            'order_id' => $order1->id,
            'menu_id' => $item1 ? $item1->id : 1,
            'menu_name' => 'Nasi Rames Telur Balado',
            'price' => 16000.00,
            'quantity' => 1,
            'subtotal' => 16000.00,
        ]);

        // 2. Skenario Cash (Tunai di Kasir - Tanpa potongan)
        $order2 = Order::query()->create([
            'order_number' => 'SC-'.now()->format('Ymd').'-00319',
            'pickup_code' => 'FEB-002319',
            'user_id' => $mahasiswa->id,
            'tenant_id' => $tenant1->id,
            'subtotal_amount' => 33000.00,
            'app_fee' => 0.00,
            'channel_fee' => 0.00,
            'total_amount' => 33000.00,
            'payment_method' => PaymentMethod::Cash,
            'payment_channel_code' => 'cash',
            'dining_option' => 'take_away',
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Completed,
            'snap_token' => null,
            'paid_at' => now()->subHours(1)->addMinutes(15),
            'processing_at' => now()->subHours(1)->addMinutes(20),
            'ready_at' => now()->subHours(1)->addMinutes(35),
            'completed_at' => now()->subHours(1)->addMinutes(50),
            'created_at' => now()->subHours(1)->addMinutes(10),
            'updated_at' => now()->subHours(1)->addMinutes(50),
        ]);

        OrderItem::query()->create([
            'order_id' => $order2->id,
            'menu_id' => $menus->count() > 1 ? $menus->get(1)->id : ($item1 ? $item1->id : 1),
            'menu_name' => 'Nasi Rendang Sapi Empuk',
            'price' => 25000.00,
            'quantity' => 1,
            'subtotal' => 25000.00,
        ]);
        OrderItem::query()->create([
            'order_id' => $order2->id,
            'menu_id' => $menus->count() > 2 ? $menus->get(2)->id : ($item1 ? $item1->id : 1),
            'menu_name' => 'Tempe Mendoan Hangat',
            'price' => 8000.00,
            'quantity' => 1,
            'subtotal' => 8000.00,
        ]);

        // 3. Skenario QRIS Cashless (Fee QRIS Rp 700 + App fee Rp 1.000)
        $order3 = Order::query()->create([
            'order_number' => 'SC-'.now()->format('Ymd').'-00173',
            'pickup_code' => 'FEB-002173',
            'user_id' => $budi ? $budi->id : $mahasiswa->id,
            'tenant_id' => $tenant1->id,
            'subtotal_amount' => 50000.00,
            'app_fee' => 1000.00,
            'channel_fee' => 700.00,
            'total_amount' => 51700.00,
            'payment_method' => PaymentMethod::Cashless,
            'payment_channel_code' => 'qris',
            'dining_option' => 'dine_in',
            'payment_status' => PaymentStatus::Paid,
            'status' => OrderStatus::Completed,
            'snap_token' => 'snap-qris-demo-173',
            'paid_at' => now()->subHours(2),
            'processing_at' => now()->subHours(2)->addMinutes(5),
            'ready_at' => now()->subHours(2)->addMinutes(20),
            'completed_at' => now()->subHours(1)->addMinutes(45),
            'created_at' => now()->subHours(2)->addMinutes(2),
            'updated_at' => now()->subHours(1)->addMinutes(45),
        ]);

        OrderItem::query()->create([
            'order_id' => $order3->id,
            'menu_id' => $item1 ? $item1->id : 1,
            'menu_name' => 'Nasi Rendang Sapi Empuk',
            'price' => 25000.00,
            'quantity' => 2,
            'subtotal' => 50000.00,
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

                if ($paymentMethod === PaymentMethod::Cashless) {
                    $channel = Arr::random($paymentChannels);
                    $appFee = 1000.00;
                    if (str_ends_with($channel, '_va')) {
                        // Fee Bank Virtual Account Midtrans
                        $channelFee = 4000.00;
                    } else {
                        // Fee QRIS / E-Wallet Midtrans
                        $channelFee = 700.00;
                    }
                } else {
                    $channel = 'cash';
                    $appFee = 0.00;
                    $channelFee = 0.00;
                }

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
                    'payment_channel_code' => $channel,
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
