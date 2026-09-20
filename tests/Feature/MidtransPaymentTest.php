<?php

use App\Models\Order;
use App\Models\Tenant;
use App\Models\User;

test('midtrans configuration file exists and has correct credentials', function () {
    expect(config('midtrans.merchant_id'))->toBe('G310931764')
        ->and(config('midtrans.client_key'))->toBe('SB-Mid-client-mLtNF46YCaa4knpj')
        ->and(config('midtrans.server_key'))->toBe('SB-Mid-server-wDTOjN4Q5ZfAU-cn5VLr_r8n')
        ->and(config('midtrans.is_production'))->toBeFalse();
});

test('midtrans callback endpoint route responds to notification request', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create();

    $order = Order::factory()->create([
        'order_number' => 'SC-20260920-9999',
        'tenant_id' => $tenant->id,
        'user_id' => $user->id,
        'total_amount' => 50000,
        'payment_method' => 'cashless',
        'payment_status' => 'unpaid',
        'status' => 'pending',
    ]);

    $response = $this->postJson(route('midtrans.callback'), [
        'order_id' => 'NON_EXISTENT_ORDER',
        'transaction_status' => 'settlement',
        'payment_type' => 'qris',
        'fraud_status' => 'accept',
    ]);

    $response->assertStatus(400)
        ->assertJson([
            'status' => 'error',
        ]);
});
