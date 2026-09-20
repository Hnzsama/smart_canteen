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
        Schema::table('menus', function (Blueprint $table) {
            $table->decimal('original_price', 12, 2)->nullable()->after('price');
            $table->boolean('is_recommended')->default(false)->after('is_available');
            $table->integer('estimated_time')->default(15)->after('is_recommended');
            $table->json('options')->nullable()->after('estimated_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menus', function (Blueprint $table) {
            $table->dropColumn(['original_price', 'is_recommended', 'estimated_time', 'options']);
        });
    }
};
