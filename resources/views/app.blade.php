<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">

        @php
            $pageProps = $page['props'] ?? [];
            $ogTitle = 'Smart Canteen FEB - Platform Pemesanan Makanan Kantin Kampus';
            $ogDescription = 'Pesan makanan & minuman secara praktis dan cepat di Kantin FEB. Cari tenant, lihat menu, dan bayar secara tunai atau QRIS.';
            $ogUrl = request()->url();

            if (
                request()->isSecure() ||
                request()->header('x-forwarded-proto') === 'https' ||
                str_contains($ogUrl, '.trycloudflare.com') ||
                str_contains($ogUrl, '.ngrok-free.dev')
            ) {
                $ogUrl = preg_replace('/^http:/i', 'https:', $ogUrl);
            }

            $formatImageUrl = function (?string $path) {
                if (empty($path)) {
                    return null;
                }
                if (str_contains(strtolower($path), '.svg')) {
                    return null;
                }
                $fullUrl = str_starts_with($path, 'http') ? $path : asset(ltrim($path, '/'));
                if (
                    request()->isSecure() ||
                    request()->header('x-forwarded-proto') === 'https' ||
                    str_contains($fullUrl, '.trycloudflare.com') ||
                    str_contains($fullUrl, '.ngrok-free.dev')
                ) {
                    $fullUrl = preg_replace('/^http:/i', 'https:', $fullUrl);
                }
                return $fullUrl;
            };

            $defaultOgImage = $formatImageUrl('og-banner.jpg');
            $ogImage = $defaultOgImage;
            $ogImageWidth = 1200;
            $ogImageHeight = 630;
            $ogImageType = 'image/jpeg';

            $schemaData = [
                '@context' => 'https://schema.org',
                '@type' => 'WebSite',
                'name' => $ogTitle,
                'url' => $ogUrl,
                'description' => $ogDescription,
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => 'Smart Canteen FEB',
                    'logo' => [
                        '@type' => 'ImageObject',
                        'url' => $formatImageUrl('web-app-manifest-512x512.png'),
                    ],
                ],
            ];

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

                $schemaData = [
                    '@context' => 'https://schema.org',
                    '@type' => 'Restaurant',
                    'name' => $ogTitle,
                    'description' => $ogDescription,
                    'image' => $ogImage,
                    'url' => $ogUrl,
                    'servesCuisine' => 'Indonesian Canteen Food',
                    'priceRange' => 'Rp 5.000 - Rp 30.000',
                ];
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

                $schemaData = [
                    '@context' => 'https://schema.org',
                    '@type' => 'MenuItem',
                    'name' => $ogTitle,
                    'description' => $ogDescription,
                    'image' => $ogImage,
                    'url' => $ogUrl,
                ];
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

        {{-- Open Graph / Facebook / LinkedIn / WhatsApp --}}
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ $ogUrl }}">
        <meta property="og:site_name" content="Smart Canteen FEB">
        <meta property="og:title" content="{{ $ogTitle }}">
        <meta property="og:description" content="{{ $ogDescription }}">
        <meta property="og:image" content="{{ $ogImage }}">
        <meta property="og:image:secure_url" content="{{ $ogImage }}">
        <meta property="og:image:type" content="{{ $ogImageType }}">
        <meta property="og:image:width" content="{{ $ogImageWidth }}">
        <meta property="og:image:height" content="{{ $ogImageHeight }}">
        <meta property="og:image:alt" content="{{ $ogTitle }}">
        <meta property="og:locale" content="id_ID">
        <meta property="og:locale:alternate" content="en_US">

        {{-- Twitter --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="{{ $ogUrl }}">
        <meta name="twitter:title" content="{{ $ogTitle }}">
        <meta name="twitter:description" content="{{ $ogDescription }}">
        <meta name="twitter:image" content="{{ $ogImage }}">
        <meta name="twitter:image:alt" content="{{ $ogTitle }}">
        <meta name="twitter:site" content="@smartcanteen_feb">
        <meta name="twitter:creator" content="@smartcanteen_feb">

        {{-- Structured Data (JSON-LD) --}}
        <script type="application/ld+json">
        {!! json_encode($schemaData, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) !!}
        </script>

        {{-- Inline script to detect system dark mode preference --}}
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
        <h1 class="sr-only" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">{{ $ogTitle }}</h1>
        <x-inertia::app />
    </body>
</html>
