<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('subtotal_amount', 12, 2)->default(0)->after('tenant_id');
            $table->decimal('app_fee', 12, 2)->default(0)->after('subtotal_amount');
            $table->decimal('channel_fee', 12, 2)->default(0)->after('app_fee');
            $table->string('dining_option')->default('dine_in')->after('payment_method');
            $table->string('payment_channel_code')->nullable()->after('payment_method');
            $table->text('notes')->nullable()->after('snap_token');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->json('options')->nullable()->after('quantity');
            $table->text('note')->nullable()->after('options');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'subtotal_amount',
                'app_fee',
                'channel_fee',
                'dining_option',
                'payment_channel_code',
                'notes',
            ]);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn(['options', 'note']);
        });
    }
};
