<?php

return [
    'merchant_id' => env('MIDTRANS_MERCHANT_ID', 'G310931764'),
    'client_key' => env('MIDTRANS_CLIENT_KEY', 'SB-Mid-client-mLtNF46YCaa4knpj'),
    'server_key' => env('MIDTRANS_SERVER_KEY', 'SB-Mid-server-wDTOjN4Q5ZfAU-cn5VLr_r8n'),
    'is_production' => filter_var(env('MIDTRANS_IS_PRODUCTION', false), FILTER_VALIDATE_BOOLEAN),
    'is_sanitized' => filter_var(env('MIDTRANS_IS_SANITIZED', true), FILTER_VALIDATE_BOOLEAN),
    'is_3ds' => filter_var(env('MIDTRANS_IS_3DS', true), FILTER_VALIDATE_BOOLEAN),
];
