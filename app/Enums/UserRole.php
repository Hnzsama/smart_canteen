<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Tenant = 'tenant';
    case Mahasiswa = 'mahasiswa';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::Tenant => 'Penjual / Tenant Stand',
            self::Mahasiswa => 'Mahasiswa / Customer',
        };
    }
}
