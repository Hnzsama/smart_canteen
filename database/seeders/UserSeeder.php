<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pre-hash password once for ultra-fast seeding
        $password = Hash::make('password');

        // 1. Tepat 2 Admin System
        $admin1 = User::query()->firstOrCreate(
            ['email' => 'admin@feb.ac.id'],
            [
                'name' => 'Admin FEB',
                'password' => $password,
                'email_verified_at' => now(),
            ]
        );
        $admin1->syncRoles([UserRole::Admin->value]);

        $admin2 = User::query()->firstOrCreate(
            ['email' => 'supervisor@feb.ac.id'],
            [
                'name' => 'Supervisor Kantin FEB',
                'password' => $password,
                'email_verified_at' => now(),
            ]
        );
        $admin2->syncRoles([UserRole::Admin->value]);

        // 2. Tenant Staff / Owner untuk 100 tenant
        $tenants = Tenant::query()->orderBy('id')->get();
        $specialTenantEmails = [
            'kantin-bu-siti-feb' => ['name' => 'Bu Siti (Kantin FEB)', 'email' => 'tenant@feb.ac.id'],
            'dapur-nusantara-feb' => ['name' => 'Pengelola Dapur Nusantara', 'email' => 'tenant2@feb.ac.id'],
            'kopi-minuman-feb' => ['name' => 'Pengelola Kopi & Minuman FEB', 'email' => 'kopi@feb.ac.id'],
            'ayam-geprek-juara-kampus' => ['name' => 'Mas Rian (Ayam Geprek Juara)', 'email' => 'geprek@feb.ac.id'],
            'bakso-mie-ayam-mas-dono' => ['name' => 'Mas Dono (Bakso & Mie Ayam)', 'email' => 'bakso@feb.ac.id'],
            'dimsum-corner-feb' => ['name' => 'Chef Hendra (Dimsum Corner)', 'email' => 'dimsum@feb.ac.id'],
            'juice-corner-mbak-maya' => ['name' => 'Mbak Maya (Juice Corner)', 'email' => 'juice@feb.ac.id'],
            'penyetan-lamongan-cak-malik' => ['name' => 'Cak Malik (Penyetan Lamongan)', 'email' => 'cakmalik@feb.ac.id'],
            'roti-bakar-feb-bang-jay' => ['name' => 'Bang Jay (Roti Bakar FEB)', 'email' => 'rotibakar@feb.ac.id'],
        ];

        foreach ($tenants as $tenant) {
            $staff = $specialTenantEmails[$tenant->slug] ?? [
                'name' => 'Pengelola ' . $tenant->name,
                'email' => 'staff' . $tenant->id . '@feb.ac.id',
            ];

            $user = User::query()->firstOrCreate(
                ['email' => $staff['email']],
                [
                    'name' => $staff['name'],
                    'tenant_id' => $tenant->id,
                    'password' => $password,
                    'email_verified_at' => now(),
                ]
            );
            $user->tenant_id = $tenant->id;
            $user->save();
            $user->syncRoles([UserRole::Tenant->value]);
        }

        // 3. Tepat 100 Mahasiswa
        $mahasiswaNames = [
            'Ahmad Mahasiswa FEB', 'Budi Santoso', 'Siti Nurhaliza', 'Rizky Ramadhan', 'Putri Ayu Lestari',
            'Dimas Anggara', 'Anisa Rahmawati', 'Farhan Pratama', 'Tiara Andini', 'Kevin Sanjaya',
            'Nabila Syakieb', 'Aditya Wicaksono', 'Maya Indah Permata', 'Daffa Alfarizi', 'Salsa Bila',
            'Rio Dewanto', 'Fitri Handayani', 'Bagas Maulana', 'Citra Kirana', 'Eko Prasetyo',
            'Gita Gutawa', 'Haikal Kamil', 'Indah Permatasari', 'Joko Anwar', 'Alifia Zahra',
            'Bayu Segara', 'Cynthia Dewi', 'Doni Tata Pradita', 'Erina Gudono', 'Fajar Alfian',
            'Galih Ginanjar', 'Hana Saraswati', 'Irfan Bachdim', 'Jessica Mila', 'Kurnia Meiga',
            'Larasati Nugroho', 'Muhammad Ridwan', 'Nadia Vega', 'Oki Setiana', 'Prilly Latuconsina',
            'Qonita Isman', 'Raffi Ahmad', 'Syifa Hadju', 'Taufik Hidayat', 'Umar Wirahadi',
            'Vanesha Prescilla', 'Wahyu Subo Seto', 'Xavier Marks', 'Yoga Pratama', 'Zaskia Sungkar',
            'Agung Hercules', 'Bella Saphira', 'Chandra Liow', 'Dian Sastrowardoyo', 'Endah N Rhesa',
            'Fachri Albar', 'Gading Marten', 'Hesti Purwadinata', 'Indra Bekti', 'Jefri Nichol',
            'Kaesang Pangarep', 'Luna Maya', 'Marcell Siahaan', 'Nicholas Saputra', 'Onadio Leonardo',
            'Pevita Pearce', 'Raditya Dika', 'Sule Prikitiw', 'Tara Basro', 'Uus Kartobi',
            'Vino G Bastian', 'Wulan Guritno', 'Yayan Ruhian', 'Zulham Zamrun', 'Ardhito Pramono',
            'Baim Wong', 'Chelsea Islan', 'Desta Mahendra', 'Enzy Storia', 'Fedi Nuril',
            'Giring Ganesha', 'Hanggini Purinda', 'Isyana Sarasvati', 'Judika Sihotang', 'Kunto Aji',
            'Lesti Kejora', 'Maudy Ayunda', 'Najwa Shihab', 'Omesh Ananda', 'Pamungkas',
            'Raisa Andriana', 'Sal Priadi', 'Tulus Rusydi', 'Uut Permatasari', 'Vidi Aldiano',
            'Wira Nagara', 'Yura Yunita', 'Ziva Magnolya', 'Angga Yunanda', 'Brisia Jodie',
        ];

        // Pastikan pas 100
        $mahasiswaNames = array_slice($mahasiswaNames, 0, 100);

        foreach ($mahasiswaNames as $index => $name) {
            $email = match ($index) {
                0 => 'mahasiswa@feb.ac.id',
                1 => 'budi@feb.ac.id',
                default => 'mhs' . ($index + 1) . '@student.feb.ac.id',
            };

            $user = User::query()->firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => $password,
                    'email_verified_at' => now(),
                ]
            );
            $user->syncRoles([UserRole::Mahasiswa->value]);
        }
    }
}
