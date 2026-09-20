<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $methods = [
            // Bank Transfer (IDR 4.000 / transaksi)
            [
                'code' => 'bca',
                'name' => 'BCA Virtual Account',
                'category' => 'bank_transfer',
                'fee_type' => 'fixed',
                'fee_amount' => 4000.00,
                'is_active' => true,
            ],
            [
                'code' => 'briva',
                'name' => 'BRI Virtual Account',
                'category' => 'bank_transfer',
                'fee_type' => 'fixed',
                'fee_amount' => 4000.00,
                'is_active' => false,
            ],
            [
                'code' => 'bni',
                'name' => 'BNI Virtual Account',
                'category' => 'bank_transfer',
                'fee_type' => 'fixed',
                'fee_amount' => 4000.00,
                'is_active' => false,
            ],
            [
                'code' => 'mandiri',
                'name' => 'Mandiri Bill Payment',
                'category' => 'bank_transfer',
                'fee_type' => 'fixed',
                'fee_amount' => 4000.00,
                'is_active' => false,
            ],
            [
                'code' => 'permata',
                'name' => 'Permata Virtual Account',
                'category' => 'bank_transfer',
                'fee_type' => 'fixed',
                'fee_amount' => 4000.00,
                'is_active' => false,
            ],
            [
                'code' => 'cimb',
                'name' => 'CIMB Niaga Virtual Account',
                'category' => 'bank_transfer',
                'fee_type' => 'fixed',
                'fee_amount' => 4000.00,
                'is_active' => false,
            ],
            [
                'code' => 'danamon',
                'name' => 'Danamon Virtual Account',
                'category' => 'bank_transfer',
                'fee_type' => 'fixed',
                'fee_amount' => 4000.00,
                'is_active' => false,
            ],
            [
                'code' => 'bsi',
                'name' => 'BSI Virtual Account',
                'category' => 'bank_transfer',
                'fee_type' => 'fixed',
                'fee_amount' => 4000.00,
                'is_active' => false,
            ],
            [
                'code' => 'seabank',
                'name' => 'SeaBank Virtual Account',
                'category' => 'bank_transfer',
                'fee_type' => 'fixed',
                'fee_amount' => 4000.00,
                'is_active' => false,
            ],
            [
                'code' => 'saqu',
                'name' => 'Bank Saqu Virtual Account',
                'category' => 'bank_transfer',
                'fee_type' => 'fixed',
                'fee_amount' => 4000.00,
                'is_active' => false,
            ],

            // E-Wallet & QRIS
            [
                'code' => 'qris',
                'name' => 'QRIS (Standard Nasional)',
                'category' => 'ewallet',
                'fee_type' => 'percentage',
                'fee_amount' => 0.70,
                'is_active' => true,
            ],
            [
                'code' => 'gopay',
                'name' => 'GoPay',
                'category' => 'ewallet',
                'fee_type' => 'percentage',
                'fee_amount' => 2.00,
                'is_active' => false,
            ],
            [
                'code' => 'shopeepay',
                'name' => 'ShopeePay',
                'category' => 'ewallet',
                'fee_type' => 'percentage',
                'fee_amount' => 2.00,
                'is_active' => false,
            ],
            [
                'code' => 'dana',
                'name' => 'DANA',
                'category' => 'ewallet',
                'fee_type' => 'percentage',
                'fee_amount' => 1.50,
                'is_active' => false,
            ],
            [
                'code' => 'ovo',
                'name' => 'OVO',
                'category' => 'ewallet',
                'fee_type' => 'percentage',
                'fee_amount' => 1.50,
                'is_active' => false,
            ],
        ];

        foreach ($methods as $method) {
            PaymentMethod::updateOrCreate(
                ['code' => $method['code']],
                $method
            );
        }
    }
}
