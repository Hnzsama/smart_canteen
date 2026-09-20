<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Tenant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenantsData = [
            [
                'name' => 'Kantin Bu Siti FEB',
                'description' => 'Spesialis olahan ayam geprek, nasi rames lauk rumahan, dan aneka gorengan hangat khas kampus FEB.',
                'categories' => [
                    'Makanan Utama' => [
                        [
                            'name' => 'Nasi Ayam Geprek Sambal Korek',
                            'description' => 'Ayam goreng renyah digeprek dengan sambal korek pedas gurih, disajikan dengan nasi hangat dan lalapan.',
                            'price' => 15000,
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Nasi Rames Telur Balado',
                            'description' => 'Nasi putih dengan lauk telur balado, sayur tumis buncis, dan orek tempe manis.',
                            'price' => 12000,
                            'is_available' => true,
                        ],
                    ],
                    'Camilan & Gorengan' => [
                        [
                            'name' => 'Tahu Bakso Crispy',
                            'description' => 'Tahu isi adonan bakso sapi gurih digoreng renyah dengan cocolan sambal kecap pedas.',
                            'price' => 8000,
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Tempe Mendoan Hangat (Isi 3)',
                            'description' => 'Tempe mendoan digoreng setengah matang dengan daun bawang dan sambal rawit.',
                            'price' => 5000,
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Dapur Nusantara FEB',
                'description' => 'Masakan kuah rempah khas Nusantara: Soto Ayam Lamongan, Rawon Jawa Timur, dan Pecel Sayur Segar.',
                'categories' => [
                    'Aneka Kuah & Soto' => [
                        [
                            'name' => 'Soto Ayam Lamongan Komplit',
                            'description' => 'Soto ayam kuah kuning berempah dengan suwiran ayam, soun, koya gurih, dan sambal cabai rawit.',
                            'price' => 14000,
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Rawon Daging Sapi Klasik',
                            'description' => 'Rawon khas Jawa Timur dengan kuah kluwek pekat dan potongan daging sapi empuk.',
                            'price' => 20000,
                            'is_available' => true,
                        ],
                    ],
                    'Menu Sehat & Tradisional' => [
                        [
                            'name' => 'Nasi Pecel Sayur Madiun',
                            'description' => 'Sayuran rebus segar disiram bumbu kacang gurih pedas, rempeyek kacang, dan tempe goreng.',
                            'price' => 11000,
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Kopi & Minuman Mahasiswa FEB',
                'description' => 'Tempat nongkrong dan pelepas dahaga dengan racikan kopi susu lokal, teh segar jumbo, dan aneka jus buah.',
                'is_active' => true,
                'categories' => [
                    'Kopi & Racikan Susu' => [
                        [
                            'name' => 'Kopi Susu Kampus Gula Aren',
                            'description' => 'Espresso robusta lokal dipadu susu segar creamy dan sirup gula aren alami.',
                            'price' => 12000,
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Ice Matcha Creamy Latte',
                            'description' => 'Bubuk matcha murni berpadu dengan susu kental manis dan es batu menyegarkan.',
                            'price' => 14000,
                            'is_available' => true,
                        ],
                    ],
                    'Minuman Segar' => [
                        [
                            'name' => 'Es Teh Manis Jumbo',
                            'description' => 'Teh melati wangi khas kantin disajikan dalam cup jumbo dingin.',
                            'price' => 4000,
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Es Jeruk Peras Murni',
                            'description' => 'Jeruk peras manis segar tanpa pemanis buatan, kaya vitamin C.',
                            'price' => 6000,
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Ayam Geprek Juara Kampus',
                'description' => 'Ayam geprek krispi level 1-10 dengan aneka pilihan sambal: matah, ijo, bawang, dan bumbu rendang.',
                'is_active' => true,
                'categories' => [
                    'Paket Geprek Nasi' => [
                        [
                            'name' => 'Paket Geprek Sambal Bawang + Es Teh',
                            'description' => 'Nasi, ayam geprek dada/paha sambal bawang pedas nampol, lalap timun dan es teh manis.',
                            'price' => 17000,
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Geprek Sambal Matah Bali',
                            'description' => 'Ayam krispi gurih disiram irisan cabai, serai, dan minyak kelapa wangi khas Bali.',
                            'price' => 18000,
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Geprek Keju Mozarella Leleh',
                            'description' => 'Ayam geprek pedas dibakar dengan topping keju mozarella melimpah.',
                            'price' => 22000,
                            'is_available' => true,
                        ],
                    ],
                    'Ekstra & Topping' => [
                        [
                            'name' => 'Kol Goreng Crispy Gurih',
                            'description' => 'Kol segar digoreng renyah dengan taburan bumbu penyedap.',
                            'price' => 4000,
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Kulit Ayam Crispy Renyah',
                            'description' => 'Kulit ayam goreng tepung garing gurih bikin nagih.',
                            'price' => 7000,
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Bakso & Mie Ayam Mas Dono FEB',
                'description' => 'Bakso sapi asli daging segar, urat kenyal, tetelan melimpah, dan mie ayam pangsit khas Solo.',
                'is_active' => true,
                'categories' => [
                    'Aneka Bakso' => [
                        [
                            'name' => 'Bakso Urat Super + Tetelan Sapi',
                            'description' => '1 bakso urat besar, 4 bakso halus, kuah kaldu sapi gurih, dan tetelan melimpah.',
                            'price' => 18000,
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Bakso Campur Telur Utuh',
                            'description' => 'Bakso isi telur ayam rebus utuh dengan tahu bakso dan mie kuning bihun.',
                            'price' => 16000,
                            'is_available' => true,
                        ],
                    ],
                    'Mie Ayam Spesial' => [
                        [
                            'name' => 'Mie Ayam Pangsit Goreng Renyah',
                            'description' => 'Mie kenyal gurih dengan tumis ayam bumbu semur manis gurih dan 2 pangsit goreng.',
                            'price' => 13000,
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Mie Ayam Bakso Komplit',
                            'description' => 'Mie ayam ditambah 2 bakso sapi halus dan ceker ayam empuk.',
                            'price' => 16000,
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Dimsum & Siomay Corner FEB',
                'description' => 'Kudapan hangat dimsum kukus kukusan bambu, siomay bandung bumbu kacang gurih, dan batagor ikan tenggiri.',
                'is_active' => true,
                'categories' => [
                    'Aneka Dimsum' => [
                        [
                            'name' => 'Dimsum Ayam Udang Campur (Isi 4)',
                            'description' => 'Dimsum siomay ayam, nori roll, hakau, dan kani dumpling dengan chili oil autentik.',
                            'price' => 16000,
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Lumpia Kulit Tahu Krispi (Isi 3)',
                            'description' => 'Lumpia isi daging ayam cincang berbalut kulit tahu tipis renyah digoreng hangat.',
                            'price' => 14000,
                            'is_available' => true,
                        ],
                    ],
                    'Siomay & Batagor' => [
                        [
                            'name' => 'Siomay Bandung Bumbu Kacang Kental',
                            'description' => 'Siomay tenggiri, kentang, pare, tahu, telur rebus, disiram saus kacang gurih pedas manis.',
                            'price' => 15000,
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Batagor Kuah Pedas Segar',
                            'description' => 'Bakso tahu goreng disajikan dalam kuah hangat pedas asam manis berempah.',
                            'price' => 13000,
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Juice Corner & Salad Segar FEB',
                'description' => 'Aneka jus buah asli 100% tanpa pengawet, smoothie bowl granola sehat, dan salad buah segar saus mayo yogurt.',
                'is_active' => true,
                'categories' => [
                    'Jus Buah Murni' => [
                        [
                            'name' => 'Jus Alpukat Kocok Cokelat Melimpah',
                            'description' => 'Alpukat mentega matang lembut diblender kental dengan lelehan saus cokelat.',
                            'price' => 12000,
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Jus Mangga Harum Manis Dingin',
                            'description' => 'Mangga manis segar dipadu sedikit susu evaporasi dan es batu serut.',
                            'price' => 10000,
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Jus Buah Naga Merah Booster',
                            'description' => 'Buah naga merah segar tinggi serat dan antioksidan untuk stamina belajar.',
                            'price' => 10000,
                            'is_available' => true,
                        ],
                    ],
                    'Salad & Healthy Bowl' => [
                        [
                            'name' => 'Salad Buah Keju Saus Yogurt',
                            'description' => 'Potongan melon, apel, anggur, pir, nata de coco, disiram dressing creamy dan parutan keju.',
                            'price' => 15000,
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Penyetan & Lele Terbang Cak Malik',
                'description' => 'Spesialis penyetan lele goreng garing, bebek kremes, dan ati ampela dengan sambal terasi matang uleg dadakan.',
                'is_active' => false,
                'categories' => [
                    'Menu Penyet' => [
                        [
                            'name' => 'Nasi Lele Goreng Kremes Sambal Terasi',
                            'description' => 'Ikan lele gurih digoreng renyah dengan taburan kremesan garing dan sambal terasi khas Lamongan.',
                            'price' => 14000,
                            'is_available' => false,
                        ],
                        [
                            'name' => 'Nasi Bebek Goreng Bumbu Hitam Madura',
                            'description' => 'Potongan bebek empuk bumbu rempah hitam pedas gurih gurih asin mantap.',
                            'price' => 24000,
                            'is_available' => false,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Roti Bakar & Camilan Malam FEB',
                'description' => 'Roti bakar khas Bandung aneka rasa, pisang nugget coklat keju, dan aneka mie instan racikan spesial warkop.',
                'is_active' => true,
                'categories' => [
                    'Roti & Pisang' => [
                        [
                            'name' => 'Roti Bakar Cokelat Keju Susu',
                            'description' => 'Roti tawar tebal dipanggang renyah isi meses coklat premium dan keju cheddar tebal.',
                            'price' => 12000,
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Pisang Crispy Keju Karamel',
                            'description' => 'Pisang raja goreng tepung renyah disiram saus karamel manis dan parutan keju gurih.',
                            'price' => 10000,
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
        ];

        foreach ($tenantsData as $tenantInfo) {
            $tenant = Tenant::query()->create([
                'name' => $tenantInfo['name'],
                'slug' => Str::slug($tenantInfo['name']),
                'description' => $tenantInfo['description'],
                'image' => null,
                'is_active' => $tenantInfo['is_active'] ?? true,
            ]);

            foreach ($tenantInfo['categories'] as $categoryName => $menus) {
                $category = Category::query()->create([
                    'tenant_id' => $tenant->id,
                    'name' => $categoryName,
                    'slug' => Str::slug($categoryName),
                ]);

                foreach ($menus as $menuItem) {
                    $name = $menuItem['name'];
                    $image = match (true) {
                        str_contains($name, 'Geprek') => 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Soto') => 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Rawon') => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Bakso') => 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Mie Ayam') => 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Kopi') => 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Es Teh') => 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Jus') => 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Dimsum') => 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Roti') => 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=600&auto=format&fit=crop&q=80',
                        default => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
                    };

                    $isRecommended = $menuItem['is_recommended'] ?? (str_contains($name, 'Komplit') || str_contains($name, 'Spesial') || str_contains($name, 'Geprek Sambal') || str_contains($name, 'Gula Aren') || str_contains($name, 'Super'));
                    $originalPrice = $menuItem['original_price'] ?? ($isRecommended ? round($menuItem['price'] * 1.25, -3) : null);

                    Menu::query()->create([
                        'tenant_id' => $tenant->id,
                        'category_id' => $category->id,
                        'name' => $menuItem['name'],
                        'description' => $menuItem['description'],
                        'price' => $menuItem['price'],
                        'original_price' => $originalPrice,
                        'image' => $image,
                        'is_available' => $menuItem['is_available'],
                        'is_recommended' => $isRecommended,
                        'estimated_time' => $menuItem['estimated_time'] ?? rand(10, 20),
                        'options' => $menuItem['options'] ?? [
                            [
                                'name' => 'Level Pedas',
                                'type' => 'radio',
                                'required' => true,
                                'choices' => [
                                    ['name' => 'Tidak Pedas', 'price' => 0],
                                    ['name' => 'Sedang (Cabai 3)', 'price' => 0],
                                    ['name' => 'Pedas Banget (Cabai 8)', 'price' => 2000],
                                ],
                            ],
                            [
                                'name' => 'Ekstra Topping',
                                'type' => 'checkbox',
                                'required' => false,
                                'choices' => [
                                    ['name' => 'Telur Ceplok', 'price' => 4000],
                                    ['name' => 'Keju Mozarella', 'price' => 5000],
                                ],
                            ],
                        ],
                    ]);
                }
            }
        }
    }
}
