<?php

namespace Database\Seeders;

use App\Models\AppSetting;
use Illuminate\Database\Seeder;

class AppSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AppSetting::set(
            'app_fee',
            '1000',
            'Biaya Admin Aplikasi (Pengembangan)'
        );
    }
}
