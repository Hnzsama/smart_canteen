<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Cashless = 'cashless';
    case Cash = 'cash';

    public function label(): string
    {
        return match ($this) {
            self::Cashless => 'Cashless (Midtrans)',
            self::Cash => 'Tunai / Cash (QR Scan)',
        };
    }
}
