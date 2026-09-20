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
        // Standard Option Sets (Add-ons) categorized by menu type
        $makananOptions = [
            [
                'name' => 'Level Pedas',
                'type' => 'radio',
                'required' => true,
                'choices' => [
                    ['name' => 'Tidak Pedas', 'price' => 0],
                    ['name' => 'Sedang (Cabai 3)', 'price' => 0],
                    ['name' => 'Pedas Nampol (Cabai 8)', 'price' => 2000],
                ],
            ],
            [
                'name' => 'Pilihan Topping Makanan',
                'type' => 'checkbox',
                'required' => false,
                'choices' => [
                    ['name' => 'Telur Ceplok Goreng', 'price' => 4000],
                    ['name' => 'Keju Mozarella Leleh', 'price' => 5000],
                    ['name' => 'Ekstra Nasi Putih', 'price' => 4000],
                    ['name' => 'Kerupuk Udang Renyah', 'price' => 2000],
                ],
            ],
        ];

        $minumanOptions = [
            [
                'name' => 'Tingkat Manis (Sugar Level)',
                'type' => 'radio',
                'required' => true,
                'choices' => [
                    ['name' => 'Normal Sugar (100%)', 'price' => 0],
                    ['name' => 'Less Sugar (50%)', 'price' => 0],
                    ['name' => 'No Sugar (0%)', 'price' => 0],
                ],
            ],
            [
                'name' => 'Level Es (Ice Level)',
                'type' => 'radio',
                'required' => true,
                'choices' => [
                    ['name' => 'Normal Ice', 'price' => 0],
                    ['name' => 'Less Ice', 'price' => 0],
                    ['name' => 'Hangat / Panas', 'price' => 0],
                ],
            ],
            [
                'name' => 'Topping Tambahan Minuman',
                'type' => 'checkbox',
                'required' => false,
                'choices' => [
                    ['name' => 'Boba Brown Sugar Creamy', 'price' => 4000],
                    ['name' => 'Cincau Hitam (Grass Jelly)', 'price' => 3000],
                    ['name' => 'Shot Espresso Extra', 'price' => 5000],
                    ['name' => 'Ice Cream Vanilla Float', 'price' => 4000],
                ],
            ],
        ];

        $dessertOptions = [
            [
                'name' => 'Suhu Penyajian',
                'type' => 'radio',
                'required' => true,
                'choices' => [
                    ['name' => 'Penyajian Hangat (Warm)', 'price' => 0],
                    ['name' => 'Penyajian Dingin / Es', 'price' => 0],
                ],
            ],
            [
                'name' => 'Topping & Parutan Dessert',
                'type' => 'checkbox',
                'required' => false,
                'choices' => [
                    ['name' => 'Parutan Keju Cheddar', 'price' => 4000],
                    ['name' => 'Saus Cokelat Nutella', 'price' => 5000],
                    ['name' => '1 Scoop Ice Cream Vanilla', 'price' => 5000],
                    ['name' => 'Kacang Almond Sangrai', 'price' => 3000],
                ],
            ],
        ];

        $snackOptions = [
            [
                'name' => 'Pilihan Saus & Cocolan',
                'type' => 'radio',
                'required' => true,
                'choices' => [
                    ['name' => 'Sambal Kecap Pedas Rawit', 'price' => 0],
                    ['name' => 'Saus Kacang Gurih', 'price' => 0],
                    ['name' => 'Chili Oil Autentik', 'price' => 0],
                    ['name' => 'Saus Mayonnaise Creamy', 'price' => 0],
                ],
            ],
            [
                'name' => 'Ekstra Tambahan Snack',
                'type' => 'checkbox',
                'required' => false,
                'choices' => [
                    ['name' => 'Extra Chili Oil', 'price' => 3000],
                    ['name' => 'Bumbu Tabur Balado Pedas', 'price' => 2000],
                    ['name' => 'Extra Saus Mayo', 'price' => 2000],
                ],
            ],
        ];

        $tenantsData = [
            [
                'name' => 'Kantin Bu Siti FEB',
                'description' => 'Spesialis olahan ayam geprek, nasi rames lauk rumahan, dessert dawet durian, dan gorengan hangat khas kampus FEB.',
                'categories' => [
                    'Makanan Utama' => [
                        [
                            'name' => 'Nasi Ayam Geprek Sambal Korek',
                            'description' => 'Ayam goreng renyah digeprek dengan sambal korek pedas gurih, disajikan dengan nasi hangat dan lalapan.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Nasi Rames Telur Balado & Orek Tempe',
                            'description' => 'Nasi putih dengan lauk telur balado, sayur tumis buncis, dan orek tempe manis.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Nasi Rendang Daging Sapi Empuk',
                            'description' => 'Nasi hangat disajikan dengan rendang daging sapi kaya rempah khas Minang.',
                            'price' => 22000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                    ],
                    'Camilan & Gorengan' => [
                        [
                            'name' => 'Tahu Bakso Crispy Daging Sapi',
                            'description' => 'Tahu isi adonan bakso sapi gurih digoreng renyah dengan cocolan sambal kecap pedas.',
                            'price' => 8000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Tempe Mendoan Hangat (Isi 3)',
                            'description' => 'Tempe mendoan digoreng setengah matang dengan daun bawang dan sambal rawit.',
                            'price' => 5000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                    ],
                    'Dessert & Pencuci Mulut' => [
                        [
                            'name' => 'Es Cendol Dawet Ayu Durian',
                            'description' => 'Cendol kenyal harum pandan dengan santan gurih, gula aren cair, dan topping daging durian murni.',
                            'price' => 10000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Puding Cokelat VLA Vanilla',
                            'description' => 'Puding lembut rasa cokelat pekat disiram saus vla manis haram vanilla.',
                            'price' => 7000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman Kantin' => [
                        [
                            'name' => 'Es Teh Manis Segar',
                            'description' => 'Teh melati wangi khas kantin disajikan dalam cup es segar.',
                            'price' => 4000,
                            'global_category' => 'kopi',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Es Jeruk Peras Murni',
                            'description' => 'Jeruk peras manis segar tanpa pemanis buatan, kaya vitamin C.',
                            'price' => 6000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Dapur Nusantara FEB',
                'description' => 'Masakan kuah rempah khas Nusantara: Soto Ayam Lamongan, Rawon Jawa Timur, Pecel Madiun, dan Dessert Tradisional kapuk.',
                'categories' => [
                    'Aneka Kuah & Soto' => [
                        [
                            'name' => 'Soto Ayam Lamongan Komplit',
                            'description' => 'Soto ayam kuah kuning berempah dengan suwiran ayam, soun, koya gurih, dan sambal cabai rawit.',
                            'price' => 14000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Rawon Daging Sapi Klasik',
                            'description' => 'Rawon khas Jawa Timur dengan kuah kluwek pekat dan potongan daging sapi empuk.',
                            'price' => 20000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Sop Buntut Sapi Rempah Empuk',
                            'description' => 'Sop kuah bening kaya rempah dengan buntut sapi empuk, kentang, dan wortel segar.',
                            'price' => 28000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                    ],
                    'Menu Sehat & Tradisional' => [
                        [
                            'name' => 'Nasi Pecel Sayur Madiun Rempeyek',
                            'description' => 'Sayuran rebus segar disiram bumbu kacang gurih pedas, rempeyek kacang, dan tempe goreng.',
                            'price' => 11000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Dessert Tradisional' => [
                        [
                            'name' => 'Es Teler Kapuk Komplit Nangka Kelapa',
                            'description' => 'Es serut dengan serutan alpukat, nangka manis, kelapa muda, dan sirup cocopandan kental manis.',
                            'price' => 13000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Bubur Sumsum Gula Merah Nangka',
                            'description' => 'Bubur tepung beras lembut gurih disiram kuah gula merah cair dan irisan nangka harum.',
                            'price' => 8000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman Tradisional' => [
                        [
                            'name' => 'Wedang Jahe Merah Rempah Hangat',
                            'description' => 'Rebusan jahe merah murni dengan sereh dan kayu manis, hangat berkhasiat.',
                            'price' => 7000,
                            'global_category' => 'kopi',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Es Sinom Asli Kunyit Asam Segar',
                            'description' => 'Minuman herbal tradisional racikan kunyit dan asam jawa dingin menyegarkan.',
                            'price' => 6000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Kopi & Minuman Mahasiswa FEB',
                'description' => 'Racikan kopi susu lokal, teh segar jumbo, aneka dessert brownies & pastry tempat favorit mahasiswa FEB.',
                'is_active' => true,
                'categories' => [
                    'Kopi & Racikan Susu' => [
                        [
                            'name' => 'Kopi Susu Kampus Gula Aren',
                            'description' => 'Espresso robusta lokal dipadu susu segar creamy dan sirup gula aren alami.',
                            'price' => 12000,
                            'global_category' => 'kopi',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Ice Matcha Creamy Latte',
                            'description' => 'Bubuk matcha murni berpadu dengan susu kental manis dan es batu menyegarkan.',
                            'price' => 14000,
                            'global_category' => 'kopi',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Avocado Coffee Ice Cream Float',
                            'description' => 'Jus alpukat dipadu espresso shot murni dan 1 scoop es krim vanilla di atasnya.',
                            'price' => 18000,
                            'global_category' => 'kopi',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman Segar & Mocktail' => [
                        [
                            'name' => 'Tropical Mango Sparkling Soda',
                            'description' => 'Sirup mangga tropis dipadu air soda dingin dan boba selasih menyegarkan.',
                            'price' => 13000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Es Teh Lemon Tea Jumbo',
                            'description' => 'Seduhan teh berkualitas dengan perasan jeruk lemon asli dingin jumbo.',
                            'price' => 6000,
                            'global_category' => 'kopi',
                            'is_available' => true,
                        ],
                    ],
                    'Dessert Companion' => [
                        [
                            'name' => 'Fudgy Brownies Cokelat Melted',
                            'description' => 'Brownies panggang tekstur fudgy dengan lelehan cokelat di tengah dan parutan keju.',
                            'price' => 12000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Cheese Danish Pastry Renyah',
                            'description' => 'Pastry renyah berlapis dengan isian krim keju gurih manis hangat.',
                            'price' => 14000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Ayam Geprek Juara Kampus',
                'description' => 'Ayam geprek krispi level 1-10, ricebowl teriyaki, kol goreng, dan dessert segar Mango Sago.',
                'is_active' => true,
                'categories' => [
                    'Paket Geprek Nasi' => [
                        [
                            'name' => 'Paket Geprek Sambal Bawang + Es Teh',
                            'description' => 'Nasi, ayam geprek dada/paha sambal bawang pedas nampol, lalap timun dan es teh manis.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Geprek Sambal Matah Bali',
                            'description' => 'Ayam krispi gurih disiram irisan cabai, serai, dan minyak kelapa wangi khas Bali.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Geprek Keju Mozarella Leleh',
                            'description' => 'Ayam geprek pedas dibakar dengan topping keju mozarella melimpah.',
                            'price' => 22000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Ricebowl Chicken Katsu Teriyaki',
                            'description' => 'Nasi hangat dengan chicken katsu goreng garing disiram saus teriyaki manis gurih.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                    ],
                    'Camilan & Ekstra' => [
                        [
                            'name' => 'Kol Goreng Crispy Gurih',
                            'description' => 'Kol segar digoreng renyah dengan taburan bumbu penyedap.',
                            'price' => 4000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Kulit Ayam Crispy Renyah',
                            'description' => 'Kulit ayam goreng tepung garing gurih bikin nagih.',
                            'price' => 7000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Jamur Crispy Bumbu Balado',
                            'description' => 'Jamur tiram goreng tepung renyah dengan taburan bumbu balado pedas manis.',
                            'price' => 8000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                    ],
                    'Dessert Segar' => [
                        [
                            'name' => 'Mango Sago Dessert Creamy Box',
                            'description' => 'Puding mangga segar dengan mutiara sagu, kuah susu manis creamy, dan irisan buah mangga.',
                            'price' => 15000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Bakso & Mie Ayam Mas Dono FEB',
                'description' => 'Bakso sapi asli daging segar, mie ayam pangsit, tahu walik, dan hidangan es campur Bandung.',
                'is_active' => true,
                'categories' => [
                    'Aneka Bakso & Mie' => [
                        [
                            'name' => 'Bakso Urat Super + Tetelan Sapi',
                            'description' => '1 bakso urat besar, 4 bakso halus, kuah kaldu sapi gurih, dan tetelan melimpah.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Bakso Campur Telur Utuh',
                            'description' => 'Bakso isi telur ayam rebus utuh dengan tahu bakso dan mie kuning bihun.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Mie Ayam Pangsit Goreng Renyah',
                            'description' => 'Mie kenyal gurih dengan tumis ayam bumbu semur manis gurih dan 2 pangsit goreng.',
                            'price' => 13000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Mie Ayam Bakso Komplit',
                            'description' => 'Mie ayam ditambah 2 bakso sapi halus dan ceker ayam empuk.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                    ],
                    'Side Dish & Snack' => [
                        [
                            'name' => 'Pangsit Goreng Mayonnaise (Isi 4)',
                            'description' => 'Pangsit isi ayam udang digoreng garing renyah dengan cocolan saus mayo.',
                            'price' => 9000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Tahu Walik Ayam Crispy (Isi 5)',
                            'description' => 'Tahu dibalik dengan isian daging ayam krispi disajikan dengan petis cabe rawit.',
                            'price' => 10000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Dessert Es' => [
                        [
                            'name' => 'Es Campur Bandung Segar',
                            'description' => 'Es serut dengan alpukat, cincau, tape singkong, kolang-kaling, dan sirup cocopandan.',
                            'price' => 10000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Es Blewah Selasih Segar',
                            'description' => 'Serutan buah blewah manis dingin dengan biji selasih dan es serut.',
                            'price' => 7000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Dimsum & Siomay Corner FEB',
                'description' => 'Dimsum kukus bambu, siomay bandung bumbu kacang, batagor kuah, serta dessert onde-onde cokelat.',
                'is_active' => true,
                'categories' => [
                    'Aneka Dimsum & Siomay' => [
                        [
                            'name' => 'Dimsum Ayam Udang Campur (Isi 4)',
                            'description' => 'Dimsum siomay ayam, nori roll, hakau, dan kani dumpling dengan chili oil autentik.',
                            'price' => 16000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Lumpia Kulit Tahu Krispi (Isi 3)',
                            'description' => 'Lumpia isi daging ayam cincang berbalut kulit tahu tipis renyah digoreng hangat.',
                            'price' => 14000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Siomay Bandung Bumbu Kacang Kental',
                            'description' => 'Siomay tenggiri, kentang, pare, tahu, telur rebus, disiram saus kacang gurih pedas manis.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Batagor Kuah Pedas Segar',
                            'description' => 'Bakso tahu goreng disajikan dalam kuah hangat pedas asam manis berempah.',
                            'price' => 13000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                    ],
                    'Dessert Dimsum' => [
                        [
                            'name' => 'Onde-onde Wijen Isi Cokelat Lumer (Isi 3)',
                            'description' => 'Onde-onde hangat bertabur wijen dengan isian pasta cokelat lumer manis.',
                            'price' => 10000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Bapao Kukus Lembut Isi Srikaya',
                            'description' => 'Bakpao kukus hangat tekstur empuk lembut dengan isian selai srikaya manis harum.',
                            'price' => 9000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Juice Corner & Salad Segar FEB',
                'description' => 'Jus buah asli 100% tanpa pengawet, smoothie bowl granola sehat, dan salad buah segar saus mayo yogurt.',
                'is_active' => true,
                'categories' => [
                    'Jus Buah Murni' => [
                        [
                            'name' => 'Jus Alpukat Kocok Cokelat Melimpah',
                            'description' => 'Alpukat mentega matang lembut diblender kental dengan lelehan saus cokelat.',
                            'price' => 12000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Jus Mangga Harum Manis Dingin',
                            'description' => 'Mangga manis segar dipadu sedikit susu evaporasi dan es batu serut.',
                            'price' => 10000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Jus Buah Naga Merah Booster',
                            'description' => 'Buah naga merah segar tinggi serat dan antioksidan untuk stamina belajar.',
                            'price' => 10000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Smoothies Strawberry Banana Cream',
                            'description' => 'Perpaduan strawberry segar dan pisang manis diblender lembut dengan yogurt.',
                            'price' => 15000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                    'Salad & Healthy Dessert' => [
                        [
                            'name' => 'Salad Buah Keju Saus Yogurt',
                            'description' => 'Potongan melon, apel, anggur, pir, nata de coco, disiram dressing creamy dan parutan keju.',
                            'price' => 15000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Acai Berry Smoothie Bowl Granola',
                            'description' => 'Smoothie bowl berry dingin ditata dengan irisan pisang, kiwi, chia seed, dan granola garing.',
                            'price' => 22000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Penyetan & Lele Terbang Cak Malik',
                'description' => 'Penyetan lele goreng garing, bebek bumbu hitam Madura, dan terong crispy sambal terasi matang uleg.',
                'is_active' => false,
                'categories' => [
                    'Menu Penyet' => [
                        [
                            'name' => 'Nasi Lele Goreng Kremes Sambal Terasi',
                            'description' => 'Ikan lele gurih digoreng renyah dengan taburan kremesan garing dan sambal terasi khas Lamongan.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => false,
                        ],
                        [
                            'name' => 'Nasi Bebek Goreng Bumbu Hitam Madura',
                            'description' => 'Potongan bebek empuk bumbu rempah hitam pedas gurih asin mantap.',
                            'price' => 24000,
                            'global_category' => 'makanan',
                            'is_available' => false,
                        ],
                    ],
                    'Camilan Penyet' => [
                        [
                            'name' => 'Terong Goreng Crispy Sambal',
                            'description' => 'Terong ungu diiris tipis digoreng krispi dengan cocolan sambal terasi.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => false,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Roti Bakar & Dessert Cafe FEB',
                'description' => 'Roti bakar khas Bandung, pisang crispy keju karamel, waffle es krim, dan camilan french fries hangat.',
                'is_active' => true,
                'categories' => [
                    'Roti & Dessert Manis' => [
                        [
                            'name' => 'Roti Bakar Cokelat Keju Susu',
                            'description' => 'Roti tawar tebal dipanggang renyah isi meses coklat premium dan keju cheddar tebal.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Pisang Crispy Keju Karamel',
                            'description' => 'Pisang raja goreng tepung renyah disiram saus karamel manis dan parutan keju gurih.',
                            'price' => 10000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Belgian Waffle Ice Cream Vanilla',
                            'description' => 'Waffle empuk ala Belgia disajikan hangat dengan 1 scoop es krim vanilla & saus cokelat.',
                            'price' => 16000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Pancake Soft Fluffy Maple Syrup',
                            'description' => 'Pancake lembut bergaya Jepang dengan lelehan mentega gurih dan sirup maple manis.',
                            'price' => 15000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Camilan Gurih & Snack' => [
                        [
                            'name' => 'French Fries / Kentang Goreng Keju',
                            'description' => 'Kentang goreng stik renyah bertabur bumbu keju gurih disajikan dengan saus sambal mayo.',
                            'price' => 12000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Sosis Goreng Jumbo Mayo',
                            'description' => 'Sosis sapi jumbo dipanggang mekar disiram saus BBQ dan keju cair.',
                            'price' => 11000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman Cafe' => [
                        [
                            'name' => 'Milkshake Vanilla Caramel Shake',
                            'description' => 'Susu segar kocok kental dengan es krim vanilla dan sirup karamel gurih manis.',
                            'price' => 14000,
                            'global_category' => 'minuman',
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
                    $globalCategory = $menuItem['global_category'] ?? 'makanan';

                    $image = match (true) {
                        str_contains($name, 'Geprek') => 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Soto') => 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Rawon') => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Bakso') => 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Mie Ayam') => 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Kopi') || str_contains($name, 'Latte') => 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Es Teh') || str_contains($name, 'Lemon') || str_contains($name, 'Wedang') => 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Jus') || str_contains($name, 'Smoothie') || str_contains($name, 'Soda') => 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Dimsum') || str_contains($name, 'Lumpia') || str_contains($name, 'Siomay') => 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Roti') || str_contains($name, 'Waffle') || str_contains($name, 'Pancake') || str_contains($name, 'Pisang') || str_contains($name, 'Brownies') => 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=600&auto=format&fit=crop&q=80',
                        str_contains($name, 'Salad') || str_contains($name, 'Acai') || str_contains($name, 'Es Cendol') || str_contains($name, 'Es Teler') || str_contains($name, 'Puding') => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
                        default => 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
                    };

                    $isRecommended = $menuItem['is_recommended'] ?? (str_contains($name, 'Komplit') || str_contains($name, 'Spesial') || str_contains($name, 'Geprek Sambal') || str_contains($name, 'Gula Aren') || str_contains($name, 'Super') || str_contains($name, 'Kocok'));
                    $originalPrice = $menuItem['original_price'] ?? ($isRecommended ? round($menuItem['price'] * 1.2, -3) : null);

                    $options = match ($globalCategory) {
                        'kopi', 'minuman' => $minumanOptions,
                        'dessert' => $dessertOptions,
                        'snack' => $snackOptions,
                        default => $makananOptions,
                    };

                    Menu::query()->create([
                        'tenant_id' => $tenant->id,
                        'category_id' => $category->id,
                        'global_category' => $globalCategory,
                        'name' => $menuItem['name'],
                        'description' => $menuItem['description'],
                        'price' => $menuItem['price'],
                        'original_price' => $originalPrice,
                        'image' => $image,
                        'is_available' => $menuItem['is_available'],
                        'is_recommended' => $isRecommended,
                        'estimated_time' => $menuItem['estimated_time'] ?? rand(10, 20),
                        'options' => $menuItem['options'] ?? $options,
                    ]);
                }
            }
        }
    }
}
