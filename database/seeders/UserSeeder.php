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
        $tenants = Tenant::query()->orderBy('id')->get();

        // 1. Admin System
        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@feb.ac.id'],
            [
                'name' => 'Admin FEB',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole(UserRole::Admin->value);

        $admin2 = User::query()->firstOrCreate(
            ['email' => 'supervisor@feb.ac.id'],
            [
                'name' => 'Supervisor Kantin FEB',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin2->assignRole(UserRole::Admin->value);

        // 2. Tenant Staff / Owner for all tenants
        $tenantStaffData = [
            0 => ['name' => 'Bu Siti (Kantin FEB)', 'email' => 'tenant@feb.ac.id'],
            1 => ['name' => 'Pengelola Dapur Nusantara', 'email' => 'tenant2@feb.ac.id'],
            2 => ['name' => 'Pengelola Kopi & Minuman FEB', 'email' => 'kopi@feb.ac.id'],
            3 => ['name' => 'Mas Rian (Ayam Geprek Juara)', 'email' => 'geprek@feb.ac.id'],
            4 => ['name' => 'Mas Dono (Bakso & Mie Ayam)', 'email' => 'bakso@feb.ac.id'],
            5 => ['name' => 'Chef Hendra (Dimsum Corner)', 'email' => 'dimsum@feb.ac.id'],
            6 => ['name' => 'Mbak Maya (Juice Corner)', 'email' => 'juice@feb.ac.id'],
            7 => ['name' => 'Cak Malik (Penyetan Lamongan)', 'email' => 'cakmalik@feb.ac.id'],
            8 => ['name' => 'Bang Jay (Roti Bakar FEB)', 'email' => 'rotibakar@feb.ac.id'],
        ];

        foreach ($tenants as $idx => $tenant) {
            $staff = $tenantStaffData[$idx] ?? [
                'name' => 'Pengelola '.$tenant->name,
                'email' => 'staff'.$tenant->id.'@feb.ac.id',
            ];

            $user = User::query()->firstOrCreate(
                ['email' => $staff['email']],
                [
                    'name' => $staff['name'],
                    'tenant_id' => $tenant->id,
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user->assignRole(UserRole::Tenant->value);
        }

        // 3. Mahasiswa (Customers)
        $mahasiswaList = [
            ['name' => 'Ahmad Mahasiswa FEB', 'email' => 'mahasiswa@feb.ac.id'],
            ['name' => 'Budi Santoso', 'email' => 'budi@feb.ac.id'],
            ['name' => 'Siti Nurhaliza', 'email' => 'siti.nur@student.feb.ac.id'],
            ['name' => 'Rizky Ramadhan', 'email' => 'rizky.r@student.feb.ac.id'],
            ['name' => 'Putri Ayu Lestari', 'email' => 'putri.ayu@student.feb.ac.id'],
            ['name' => 'Dimas Anggara', 'email' => 'dimas.a@student.feb.ac.id'],
            ['name' => 'Anisa Rahmawati', 'email' => 'anisa.r@student.feb.ac.id'],
            ['name' => 'Farhan Pratama', 'email' => 'farhan.p@student.feb.ac.id'],
            ['name' => 'Tiara Andini', 'email' => 'tiara.a@student.feb.ac.id'],
            ['name' => 'Kevin Sanjaya', 'email' => 'kevin.s@student.feb.ac.id'],
            ['name' => 'Nabila Syakieb', 'email' => 'nabila.s@student.feb.ac.id'],
            ['name' => 'Aditya Wicaksono', 'email' => 'aditya.w@student.feb.ac.id'],
            ['name' => 'Maya Indah Permata', 'email' => 'maya.i@student.feb.ac.id'],
            ['name' => 'Daffa Alfarizi', 'email' => 'daffa.a@student.feb.ac.id'],
            ['name' => 'Salsa Bila', 'email' => 'salsa.b@student.feb.ac.id'],
            ['name' => 'Rio Dewanto', 'email' => 'rio.d@student.feb.ac.id'],
            ['name' => 'Fitri Handayani', 'email' => 'fitri.h@student.feb.ac.id'],
            ['name' => 'Bagas Maulana', 'email' => 'bagas.m@student.feb.ac.id'],
            ['name' => 'Citra Kirana', 'email' => 'citra.k@student.feb.ac.id'],
            ['name' => 'Eko Prasetyo', 'email' => 'eko.p@student.feb.ac.id'],
            ['name' => 'Gita Gutawa', 'email' => 'gita.g@student.feb.ac.id'],
            ['name' => 'Haikal Kamil', 'email' => 'haikal.k@student.feb.ac.id'],
            ['name' => 'Indah Permatasari', 'email' => 'indah.p@student.feb.ac.id'],
            ['name' => 'Joko Anwar', 'email' => 'joko.a@student.feb.ac.id'],
        ];

        foreach ($mahasiswaList as $mhs) {
            $user = User::query()->firstOrCreate(
                ['email' => $mhs['email']],
                [
                    'name' => $mhs['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            $user->assignRole(UserRole::Mahasiswa->value);
        }
    }
}
