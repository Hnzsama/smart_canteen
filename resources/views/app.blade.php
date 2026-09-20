<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">

        @php
            $pageProps = $page['props'] ?? [];
            $ogTitle = config('app.name', 'Smart Canteen FEB');
            $ogDescription = 'Smart Canteen FEB - Platform Pemesanan Makanan & Kantin Kampus Cepat, Praktis, dan Cashless.';
            $ogUrl = request()->url();

            $formatImageUrl = function (?string $path) {
                if (empty($path)) {
                    return null;
                }
                // Social media link preview crawlers (WhatsApp, FB, etc.) do NOT support SVG images
                if (str_contains(strtolower($path), '.svg')) {
                    return null;
                }
                $fullUrl = str_starts_with($path, 'http') ? $path : asset(ltrim($path, '/'));
                if (request()->isSecure() || request()->header('x-forwarded-proto') === 'https') {
                    $fullUrl = str_replace('http://', 'https://', $fullUrl);
                }
                return $fullUrl;
            };

            $defaultOgImage = $formatImageUrl('web-app-manifest-512x512.png');
            $ogImage = $defaultOgImage;

            if (isset($pageProps['tenant']) && is_array($pageProps['tenant'])) {
                $tenant = $pageProps['tenant'];
                $ogTitle = ($tenant['name'] ?? 'Stand Kantin') . ' - Smart Canteen FEB';
                if (!empty($tenant['description'])) {
                    $ogDescription = \Illuminate\Support\Str::limit(strip_tags($tenant['description']), 160);
                }
                $imgCandidate = $tenant['banner_image'] ?? $tenant['image'] ?? $tenant['logo_image'] ?? null;
                $formatted = $formatImageUrl($imgCandidate);
                if ($formatted) {
                    $ogImage = $formatted;
                } else {
                    $ogImage = $formatImageUrl('images/tenant-placeholder.jpg');
                }
            } elseif (isset($pageProps['menu']) && is_array($pageProps['menu'])) {
                $menu = $pageProps['menu'];
                $ogTitle = ($menu['name'] ?? 'Menu') . ' - ' . ($menu['tenant_name'] ?? 'Kantin FEB') . ' | Smart Canteen FEB';
                if (!empty($menu['description'])) {
                    $ogDescription = \Illuminate\Support\Str::limit(strip_tags($menu['description']), 160);
                }
                $imgCandidate = $menu['image'] ?? null;
                $formatted = $formatImageUrl($imgCandidate);
                if ($formatted) {
                    $ogImage = $formatted;
                } else {
                    $ogImage = $formatImageUrl('images/food-placeholder.jpg');
                }
            }
        @endphp

        <meta name="description" content="{{ $ogDescription }}">
        <meta name="keywords" content="smart canteen, kantin feb, pesan makanan kampus, kantin digital, ordering system">
        <meta name="author" content="Smart Canteen FEB">

        {{-- PWA & Mobile --}}
        <meta name="theme-color" content="#0891b2" media="(prefers-color-scheme: light)">
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)">
        <link rel="manifest" href="/site.webmanifest">
        <link rel="canonical" href="{{ $ogUrl }}">

        {{-- Open Graph / Facebook / WhatsApp --}}
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ $ogUrl }}">
        <meta property="og:site_name" content="Smart Canteen FEB">
        <meta property="og:title" content="{{ $ogTitle }}">
        <meta property="og:description" content="{{ $ogDescription }}">
        <meta property="og:image" content="{{ $ogImage }}">
        <meta property="og:image:secure_url" content="{{ $ogImage }}">
        <meta property="og:image:type" content="image/png">

        {{-- Twitter --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="{{ $ogUrl }}">
        <meta name="twitter:title" content="{{ $ogTitle }}">
        <meta name="twitter:description" content="{{ $ogDescription }}">
        <meta name="twitter:image" content="{{ $ogImage }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ $ogTitle }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
