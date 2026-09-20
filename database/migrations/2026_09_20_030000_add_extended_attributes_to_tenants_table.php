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
        Schema::table('tenants', function (Blueprint $table) {
            $table->string('banner_image')->nullable()->after('image');
            $table->string('logo_image')->nullable()->after('banner_image');
            $table->string('phone')->nullable()->after('logo_image');
            $table->string('opening_hours')->nullable()->default('08:00 - 17:00')->after('phone');
            $table->boolean('is_open')->default(true)->after('is_active');
            $table->decimal('rating', 3, 2)->default(5.00)->after('is_open');
            $table->unsignedInteger('reviews_count')->default(0)->after('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn([
                'banner_image',
                'logo_image',
                'phone',
                'opening_hours',
                'is_open',
                'rating',
                'reviews_count',
            ]);
        });
    }
};
