<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Menu;
use App\Models\Tenant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TenantSeeder extends Seeder
{
    public function run(): void
    {
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
                    ['name' => 'Ice Cream Vanilla Float', 'price' => 4000],
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
                    ['name' => 'Saus Mayonnaise Creamy', 'price' => 0],
                    ['name' => 'Chili Oil Autentik', 'price' => 0],
                ],
            ],
            [
                'name' => 'Ekstra Tambahan Snack',
                'type' => 'checkbox',
                'required' => false,
                'choices' => [
                    ['name' => 'Extra Chili Oil', 'price' => 3000],
                    ['name' => 'Bumbu Tabur Balado Pedas', 'price' => 2000],
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
                            'description' => 'Ayam renyah dengan sambal korek gurih pedas dan lalapan.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Nasi Rames Telur Balado',
                            'description' => 'Nasi putih hangat dengan lauk telur balado, orek tempe, dan buncis.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Nasi Rendang Sapi Empuk',
                            'description' => 'Rendang daging sapi santan pekat rempah Minang.',
                            'price' => 22000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                    ],
                    'Camilan & Dessert' => [
                        [
                            'name' => 'Tempe Mendoan Hangat (Isi 3)',
                            'description' => 'Tempe mendoan gurih dengan cocolan sambal kecap pedas.',
                            'price' => 5000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Es Cendol Dawet Durian',
                            'description' => 'Cendol pandan dengan santan gurih, gula aren, dan durian.',
                            'price' => 10000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman' => [
                        [
                            'name' => 'Es Teh Manis Segar',
                            'description' => 'Es teh melati segar manis pas.',
                            'price' => 4000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Es Jeruk Peras Murni',
                            'description' => 'Jeruk peras asli manis segar.',
                            'price' => 6000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Dapur Nusantara FEB',
                'description' => 'Masakan kuah rempah khas Nusantara: Soto Ayam Lamongan, Rawon Jawa Timur, Pecel Madiun, dan Dessert Tradisional.',
                'categories' => [
                    'Aneka Kuah & Soto' => [
                        [
                            'name' => 'Soto Ayam Lamongan Komplit',
                            'description' => 'Soto ayam kuah kuning koya gurih dan sambal rawit.',
                            'price' => 14000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Rawon Daging Sapi Klasik',
                            'description' => 'Rawon khas Jatim kuah kluwek hitam dengan tauge pendek dan sambal.',
                            'price' => 20000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Sop Buntut Sapi Rempah',
                            'description' => 'Sop kuah bening kaya rempah kapulaga wortel kentang.',
                            'price' => 26000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                    ],
                    'Pelengkap & Minum' => [
                        [
                            'name' => 'Perkedel Kentang Daging',
                            'description' => 'Perkedel kentang lembut padat gurih.',
                            'price' => 4000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Es Sinom Segar Herbal',
                            'description' => 'Minuman tradisional asam manis daun asam jawa.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Es Beras Kencur Wangi',
                            'description' => 'Beras kencur manis legit menghangatkan badan.',
                            'price' => 6000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Kopi & Minuman FEB',
                'description' => 'Kedai aneka racikan kopi kekinian, artisan tea, mocktail segar, dan minuman segar pelepas dahaga.',
                'categories' => [
                    'Signature Coffee' => [
                        [
                            'name' => 'Es Kopi Susu Gula Aren FEB',
                            'description' => 'Double espresso, susu segar creamy, dan sirup gula aren murni.',
                            'price' => 13000,
                            'global_category' => 'kopi',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Caramel Macchiato Iced',
                            'description' => 'Espresso pekat dengan saus karamel leleh dan vanilla syrup.',
                            'price' => 16000,
                            'global_category' => 'kopi',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Americano Dingin Arabika',
                            'description' => 'Espresso arabika segar dengan es batu melimpah.',
                            'price' => 10000,
                            'global_category' => 'kopi',
                            'is_available' => true,
                        ],
                    ],
                    'Non Coffee & Pastry' => [
                        [
                            'name' => 'Matcha Green Tea Latte',
                            'description' => 'Matcha jepang creamy manis legit.',
                            'price' => 15000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Croissant Cokelat Warm',
                            'description' => 'Croissant butter renyah dengan lelehan cokelat.',
                            'price' => 12000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Ayam Geprek Juara Kampus',
                'description' => 'Ayam goreng krispi dengan pilihan sambal korek, sambal bawang, dan keju mozarella leleh.',
                'categories' => [
                    'Menu Ayam Geprek' => [
                        [
                            'name' => 'Paket Geprek Sambal Korek + Nasi',
                            'description' => 'Ayam krispi digeprek cabai rawit pedas pol plus nasi lalapan.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Geprek Mozarella Leleh + Nasi',
                            'description' => 'Ayam geprek diselimuti keju mozarella bakar gurih mulur.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Geprek Sambal Matah Bali',
                            'description' => 'Ayam krispi dengan rajangan serai daun jeruk sambal matah.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                    ],
                    'Side Dish & Minuman' => [
                        [
                            'name' => 'Jamur Crispy Sambal Bawang',
                            'description' => 'Jamur tiram goreng tepung garing gurih.',
                            'price' => 8000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Terong Crispy Geprek',
                            'description' => 'Irisan terong goreng garing dengan sambal.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Es Teh Manis Jumbo',
                            'description' => 'Es teh ukuran cup 22oz segar memuaskan.',
                            'price' => 4000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Bakso & Mie Ayam Mas Dono',
                'description' => 'Bakso urat daging sapi asli, mie ayam bakso pangsit komplit, dan tetelan gurih melimpah.',
                'categories' => [
                    'Bakso & Mie Ayam' => [
                        [
                            'name' => 'Mie Ayam Pangsit Komplit',
                            'description' => 'Mie kenyal dengan topping ayam semur gurih manis dan pangsit rebus.',
                            'price' => 13000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Mie Ayam Bakso Urat Jumbo',
                            'description' => 'Mie ayam dengan 1 butir bakso urat besar berdaging padat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Bakso Campur Tetelan Sapi',
                            'description' => 'Bakso halus, bakso urat, tahu, mie, dan tetelan sapi gurih.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                    ],
                    'Camilan & Es' => [
                        [
                            'name' => 'Pangsit Goreng Renyah (Isi 5)',
                            'description' => 'Pangsit goreng mekar dengan saus asam manis cocol.',
                            'price' => 7000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Es Campur Santan Buah',
                            'description' => 'Es serut dengan alpukat, kelapa, nangka, dan sirup merah.',
                            'price' => 9000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Dimsum Corner FEB',
                'description' => 'Aneka dimsum kukus dan goreng autentik: siomay ayam udang, hakau, lumpia kulit tahu, dan mantau.',
                'categories' => [
                    'Dimsum Kukus' => [
                        [
                            'name' => 'Siomay Dimsum Ayam Udang (Isi 4)',
                            'description' => 'Adonan daging ayam udang padat gurih dengan saus chili oil.',
                            'price' => 14000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Hakau Udang Transparan (Isi 3)',
                            'description' => 'Kulit transparan kenyal dengan udang utuh segar renyah.',
                            'price' => 16000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Xiao Long Bao Kuah Kaldu (Isi 3)',
                            'description' => 'Dimsum berkantong kuah kaldu sapi lezat hangat.',
                            'price' => 16000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                    ],
                    'Dimsum Goreng & Minuman' => [
                        [
                            'name' => 'Lumpia Kulit Tahu Goreng Crispy',
                            'description' => 'Kulit kembang tahu renyah isi ayam cincang.',
                            'price' => 13000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Es Liang Teh Herbal',
                            'description' => 'Liang teh manis herbal penurun panas dalam.',
                            'price' => 6000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Juice Corner Mbak Maya',
                'description' => 'Aneka jus buah segar murni tanpa pemanis buatan, cold-pressed juice, dan smoothies bernutrisi.',
                'categories' => [
                    'Jus Buah Segar' => [
                        [
                            'name' => 'Jus Alpukat Kocok Cokelat',
                            'description' => 'Alpukat mentega kental dengan saus cokelat susu kental manis.',
                            'price' => 12000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Jus Mangga Arumanis Murni',
                            'description' => 'Mangga manis harum diblender kental segar kaya vitamin.',
                            'price' => 10000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Jus Buah Naga Merah Segar',
                            'description' => 'Buah naga merah segar penambah energi.',
                            'price' => 10000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                    'Healthy Booster' => [
                        [
                            'name' => 'Green Detox Juice (Apel Nanas Pokcoy)',
                            'description' => 'Jus kombinasi segar membersihkan tubuh.',
                            'price' => 13000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Fruit Salad Cup Mayo Keju',
                            'description' => 'Aneka potongan melon semangka pir disiram mayo keju.',
                            'price' => 11000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Penyetan Lamongan Cak Malik',
                'description' => 'Penyetan lele goreng garing, bebek bumbu kuning, ati ampela, dan sambal terasi ulek segar.',
                'categories' => [
                    'Menu Penyet Lamongan' => [
                        [
                            'name' => 'Penyet Lele Goreng Krispi + Nasi',
                            'description' => 'Lele garing gurih dipenyet sambal terasi khas Lamongan.',
                            'price' => 13000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Penyet Ayam Goreng Kampung + Nasi',
                            'description' => 'Ayam bumbu kuning gurih dipenyet sambal tomat terasi.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Penyet Bebek Goreng Bumbu Hitam',
                            'description' => 'Bebek empuk goreng bumbu rempah hitam pedas gurih.',
                            'price' => 22000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                    ],
                    'Lalapan & Minuman' => [
                        [
                            'name' => 'Tahu & Tempe Goreng Penyet',
                            'description' => 'Tahu tempe goreng gurih sambal ulek segar.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Es Jeruk Nipis Madu',
                            'description' => 'Jeruk nipis asli madu dingin penghilang amis.',
                            'price' => 6000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Roti Bakar FEB Bang Jay',
                'description' => 'Roti bakar bandung premium aneka filling, french toast madu, pisang bakar keju, dan cemilan manis.',
                'categories' => [
                    'Roti Bakar Bandung' => [
                        [
                            'name' => 'Roti Bakar Cokelat Keju Susu',
                            'description' => 'Roti empuk dipanggang mentega dengan meses dan keju lumer.',
                            'price' => 13000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Roti Bakar Nutella Pisang',
                            'description' => 'Filling cokelat hazelnut nutella dan irisan pisang manis.',
                            'price' => 15000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Roti Toast Smoked Beef Telur',
                            'description' => 'Toast gurih dengan smoked beef keju cheddar dan saus mayo.',
                            'price' => 16000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Dessert & Minuman' => [
                        [
                            'name' => 'Pisang Bakar Keju Brown Sugar',
                            'description' => 'Pisang raja manis dipanggang tabur gula aren dan keju.',
                            'price' => 10000,
                            'global_category' => 'dessert',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Es Milo Dinosaurus Kental',
                            'description' => 'Susu milo dingin kental bertabur bubuk milo melimpah.',
                            'price' => 9000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Nasi Padang Sederhana Bundo',
                'description' => 'Masakan Minang otentik: Rendang Daging Sapi empuk, Ayam Pop gurih, Gulai Tunjang, dan Telur Dadar tebal.',
                'categories' => [
                    'Lauk Minang Autentik' => [
                        [
                            'name' => 'Nasi Padang Rendang Daging Sapi',
                            'description' => 'Nasi padang komplit dengan rendang empuk kuah gulai dan daun singkong.',
                            'price' => 22000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Nasi Padang Ayam Pop Minang',
                            'description' => 'Ayam pop gurih empuk dengan sambal tomat merah khas Minang.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Nasi Telur Dadar Padang Tebal',
                            'description' => 'Telur dadar tebal harum daun bawang cabai merah.',
                            'price' => 12000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                    ],
                    'Pelengkap & Minum' => [
                        [
                            'name' => 'Perkedel Padang Kentang Gurih',
                            'description' => 'Perkedel kentang padat khas rumah makan Minang.',
                            'price' => 4000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Es Teh Manis Padang Jumbo',
                            'description' => 'Es teh wangi pekat khas ranah Minang.',
                            'price' => 4000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Warung Seblak Teh Euis',
                'description' => 'Seblak prasmanan kuah kencur pedas berlevel dengan topping kerupuk, ceker, suki, dan mie kuning.',
                'categories' => [
                    'Spesial Warung' => [
                        [
                            'name' => 'Paket Spesial Warung Seblak Teh Euis',
                            'description' => 'Menu andalan terenak dari Warung Seblak Teh Euis porsi kenyang memuaskan.',
                            'price' => 21000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Warung',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #11',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Warung',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Warung',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Mie Gacoan Kampus',
                'description' => 'Mie pedas level gurih dan manis bertabur ayam cincang, pangsit goreng renyah, dan udang keju.',
                'categories' => [
                    'Spesial Mie' => [
                        [
                            'name' => 'Paket Spesial Mie Gacoan Kampus',
                            'description' => 'Menu andalan terenak dari Mie Gacoan Kampus porsi kenyang memuaskan.',
                            'price' => 21500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Mie',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #12',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Mie',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Mie',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Sate Madura Cak Hasan',
                'description' => 'Sate ayam bumbu kacang kental gurih, sate kambing muda empuk bumbu kecap pedas, dan lontong.',
                'categories' => [
                    'Spesial Sate' => [
                        [
                            'name' => 'Paket Spesial Sate Madura Cak Hasan',
                            'description' => 'Menu andalan terenak dari Sate Madura Cak Hasan porsi kenyang memuaskan.',
                            'price' => 22000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Sate',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #13',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Sate',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Sate',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Soto Betawi Bang Ali',
                'description' => 'Soto daging sapi kuah santan campur susu creamy gurih dengan emping, tomat, dan acar segar.',
                'categories' => [
                    'Spesial Soto' => [
                        [
                            'name' => 'Paket Spesial Soto Betawi Bang Ali',
                            'description' => 'Menu andalan terenak dari Soto Betawi Bang Ali porsi kenyang memuaskan.',
                            'price' => 22500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Soto',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #14',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Soto',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Soto',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Gudeg Jogja Bu Tjitro',
                'description' => 'Gudeg nangka manis legit khas Jogja, telur opor, sambal goreng krecek pedas, dan tahu bacem.',
                'categories' => [
                    'Spesial Gudeg' => [
                        [
                            'name' => 'Paket Spesial Gudeg Jogja Bu Tjitro',
                            'description' => 'Menu andalan terenak dari Gudeg Jogja Bu Tjitro porsi kenyang memuaskan.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Gudeg',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #15',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Gudeg',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Gudeg',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Bebek Sinjay Madura',
                'description' => 'Bebek goreng empuk bertabur kremes rempah melimpah disajikan dengan sambal mangga muda (pencit).',
                'categories' => [
                    'Spesial Bebek' => [
                        [
                            'name' => 'Paket Spesial Bebek Sinjay Madura',
                            'description' => 'Menu andalan terenak dari Bebek Sinjay Madura porsi kenyang memuaskan.',
                            'price' => 16500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Bebek',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #16',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Bebek',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Bebek',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Kebab Turki Baba Rafi FEB',
                'description' => 'Kebab daging sapi panggang kaya rempah, kebab ayam saus keju, canai manis, dan burger lezat.',
                'categories' => [
                    'Spesial Kebab' => [
                        [
                            'name' => 'Paket Spesial Kebab Turki Baba Rafi FEB',
                            'description' => 'Menu andalan terenak dari Kebab Turki Baba Rafi FEB porsi kenyang memuaskan.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Kebab',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #17',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Kebab',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Kebab',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Pempek Wong Kito Palembang',
                'description' => 'Pempek ikan tenggiri asli: Kapal Selam telur utuh, Lenjer besar, Pempek Kulit, disiram kuah cuko pekat.',
                'categories' => [
                    'Spesial Pempek' => [
                        [
                            'name' => 'Paket Spesial Pempek Wong Kito Palembang',
                            'description' => 'Menu andalan terenak dari Pempek Wong Kito Palembang porsi kenyang memuaskan.',
                            'price' => 17500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Pempek',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #18',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Pempek',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Pempek',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Nasi Uduk Kebon Kacang Mpok Jenab',
                'description' => 'Nasi uduk harum santan berdaun pandan dengan lauk ayam goreng lengkuas, semur tahu, dan emping.',
                'categories' => [
                    'Spesial Nasi' => [
                        [
                            'name' => 'Paket Spesial Nasi Uduk Kebon Kacang Mpok Jenab',
                            'description' => 'Menu andalan terenak dari Nasi Uduk Kebon Kacang Mpok Jenab porsi kenyang memuaskan.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Nasi',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #19',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Nasi',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Nasi',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Siomay & Batagor Bandung Kang Asep',
                'description' => 'Siomay ikan kukus komplit dan batagor goreng renyah disiram kuah kacang mede gurih pedas.',
                'categories' => [
                    'Spesial Siomay' => [
                        [
                            'name' => 'Paket Spesial Siomay & Batagor Bandung Kang Asep',
                            'description' => 'Menu andalan terenak dari Siomay & Batagor Bandung Kang Asep porsi kenyang memuaskan.',
                            'price' => 18500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Siomay',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #20',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Siomay',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Siomay',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Es Teh Solo Wasgitel Kampus',
                'description' => 'Es teh wangi, sepet, legi, dan kental khas Solo disajikan porsi jumbo segar penumpas dahaga.',
                'categories' => [
                    'Spesial Es' => [
                        [
                            'name' => 'Paket Spesial Es Teh Solo Wasgitel Kampus',
                            'description' => 'Menu andalan terenak dari Es Teh Solo Wasgitel Kampus porsi kenyang memuaskan.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Es',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #21',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Es',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Es',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Dapur Bento & Katsu Osaka',
                'description' => 'Japanese fast food favorit: Chicken Katsu Curry, Beef Teriyaki Rice Bowl, dan Egg Chicken Roll gurih.',
                'categories' => [
                    'Spesial Dapur' => [
                        [
                            'name' => 'Paket Spesial Dapur Bento & Katsu Osaka',
                            'description' => 'Menu andalan terenak dari Dapur Bento & Katsu Osaka porsi kenyang memuaskan.',
                            'price' => 19500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Dapur',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #22',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Dapur',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Dapur',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Ramen Bar Ichiraku FEB',
                'description' => 'Ramen kuah kaldu toripaitan kental gurih, shoyu ramen pedas, gyoza ayam, dan telur ajitama meleleh.',
                'categories' => [
                    'Spesial Ramen' => [
                        [
                            'name' => 'Paket Spesial Ramen Bar Ichiraku FEB',
                            'description' => 'Menu andalan terenak dari Ramen Bar Ichiraku FEB porsi kenyang memuaskan.',
                            'price' => 20000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Ramen',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #23',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Ramen',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Ramen',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Takoyaki & Okonomiyaki Tokyo',
                'description' => 'Jajanan khas Jepang: Takoyaki isi potongan gurita mekar dengan katsuobushi dan okonomiyaki gurih.',
                'categories' => [
                    'Spesial Takoyaki' => [
                        [
                            'name' => 'Paket Spesial Takoyaki & Okonomiyaki Tokyo',
                            'description' => 'Menu andalan terenak dari Takoyaki & Okonomiyaki Tokyo porsi kenyang memuaskan.',
                            'price' => 20500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Takoyaki',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #24',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Takoyaki',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Takoyaki',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Warung Nasi Kuning Cakalang Manado',
                'description' => 'Nasi kuning rempah disajikan dengan cakalang fufu suwir pedas, perkedel jagung krispi, dan sambal roa.',
                'categories' => [
                    'Spesial Warung' => [
                        [
                            'name' => 'Paket Spesial Warung Nasi Kuning Cakalang Manado',
                            'description' => 'Menu andalan terenak dari Warung Nasi Kuning Cakalang Manado porsi kenyang memuaskan.',
                            'price' => 21000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Warung',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #25',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Warung',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Warung',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Soto Kudus Menara Asli',
                'description' => 'Soto ayam mangkuk mini khas Kudus dengan kuah bening gurih, taburan bawang putih goreng, dan sate puyuh.',
                'categories' => [
                    'Spesial Soto' => [
                        [
                            'name' => 'Paket Spesial Soto Kudus Menara Asli',
                            'description' => 'Menu andalan terenak dari Soto Kudus Menara Asli porsi kenyang memuaskan.',
                            'price' => 21500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Soto',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #26',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Soto',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Soto',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Bakso Malang Arema Komplit',
                'description' => 'Bakso halus kenyal, bakso urat, bakso goreng mekar krispi, siomay kukus, dan kekian goreng.',
                'categories' => [
                    'Spesial Bakso' => [
                        [
                            'name' => 'Paket Spesial Bakso Malang Arema Komplit',
                            'description' => 'Menu andalan terenak dari Bakso Malang Arema Komplit porsi kenyang memuaskan.',
                            'price' => 22000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Bakso',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #27',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Bakso',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Bakso',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Mie Aceh Seulawah FEB',
                'description' => 'Mie tebal kuning khas Aceh ditumis bumbu kari kental pekat dengan irisan daging sapi dan emping.',
                'categories' => [
                    'Spesial Mie' => [
                        [
                            'name' => 'Paket Spesial Mie Aceh Seulawah FEB',
                            'description' => 'Menu andalan terenak dari Mie Aceh Seulawah FEB porsi kenyang memuaskan.',
                            'price' => 22500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Mie',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #28',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Mie',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Mie',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Nasi Liwet Solo Bu Wongso',
                'description' => 'Nasi liwet gurih santan khas Solo disajikan dengan suwiran ayam opor, sayur labu siam pedas, dan areh gurih.',
                'categories' => [
                    'Spesial Nasi' => [
                        [
                            'name' => 'Paket Spesial Nasi Liwet Solo Bu Wongso',
                            'description' => 'Menu andalan terenak dari Nasi Liwet Solo Bu Wongso porsi kenyang memuaskan.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Nasi',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #29',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Nasi',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Nasi',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Rawon Nguling Surabaya',
                'description' => 'Rawon daging sapi kuah kluwek hitam legendaris dengan tauge pendek renyah, sambal terasi, dan empal.',
                'categories' => [
                    'Spesial Rawon' => [
                        [
                            'name' => 'Paket Spesial Rawon Nguling Surabaya',
                            'description' => 'Menu andalan terenak dari Rawon Nguling Surabaya porsi kenyang memuaskan.',
                            'price' => 16500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Rawon',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #30',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Rawon',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Rawon',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Warteg Barokah Modern FEB',
                'description' => 'Aneka masakan rumahan higienis puluhan pilihan lauk: sayur lodeh, tongkol balado, dan kentang mustofa.',
                'categories' => [
                    'Spesial Warteg' => [
                        [
                            'name' => 'Paket Spesial Warteg Barokah Modern FEB',
                            'description' => 'Menu andalan terenak dari Warteg Barokah Modern FEB porsi kenyang memuaskan.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Warteg',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #31',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Warteg',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Warteg',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Kopi Kenangan Kampus',
                'description' => 'Kopi susu gula aren terbaik, latte creamy, teh aroma buah, dan aneka roti toast lembut.',
                'categories' => [
                    'Spesial Kopi' => [
                        [
                            'name' => 'Paket Spesial Kopi Kenangan Kampus',
                            'description' => 'Menu andalan terenak dari Kopi Kenangan Kampus porsi kenyang memuaskan.',
                            'price' => 17500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Kopi',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #32',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Kopi',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Kopi',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Boba Time FEB',
                'description' => 'Minuman brown sugar boba fresh milk lembut kenyal, taro cheese cream, dan fruity green tea segar.',
                'categories' => [
                    'Spesial Boba' => [
                        [
                            'name' => 'Paket Spesial Boba Time FEB',
                            'description' => 'Menu andalan terenak dari Boba Time FEB porsi kenyang memuaskan.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Boba',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #33',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Boba',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Boba',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Toast & Sandwich Box',
                'description' => 'Sandwich roti brioche panggang isi ayam krispi mentai, smoked beef cheese, dan scramble egg gurih.',
                'categories' => [
                    'Spesial Toast' => [
                        [
                            'name' => 'Paket Spesial Toast & Sandwich Box',
                            'description' => 'Menu andalan terenak dari Toast & Sandwich Box porsi kenyang memuaskan.',
                            'price' => 18500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Toast',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #34',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Toast',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Toast',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Salad Buah & Acai Fresh',
                'description' => 'Salad aneka buah segar disiram saus creamy keju parut melimpah dan acai berry bowl kaya vitamin.',
                'categories' => [
                    'Spesial Salad' => [
                        [
                            'name' => 'Paket Spesial Salad Buah & Acai Fresh',
                            'description' => 'Menu andalan terenak dari Salad Buah & Acai Fresh porsi kenyang memuaskan.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Salad',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #35',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Salad',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Salad',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Martabak & Terang Bulan Bangka',
                'description' => 'Martabak manis tebal empuk bertabur keju cokelat kacang dan martabak telur daging bebek gurih.',
                'categories' => [
                    'Spesial Martabak' => [
                        [
                            'name' => 'Paket Spesial Martabak & Terang Bulan Bangka',
                            'description' => 'Menu andalan terenak dari Martabak & Terang Bulan Bangka porsi kenyang memuaskan.',
                            'price' => 19500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Martabak',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #36',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Martabak',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Martabak',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Cuanki & Batagor Serayu',
                'description' => 'Cuanki kuah kaldu gurih berisikan tahu bakso rebus, siomay kering renyah, dan bakso aci.',
                'categories' => [
                    'Spesial Cuanki' => [
                        [
                            'name' => 'Paket Spesial Cuanki & Batagor Serayu',
                            'description' => 'Menu andalan terenak dari Cuanki & Batagor Serayu porsi kenyang memuaskan.',
                            'price' => 20000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Cuanki',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #37',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Cuanki',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Cuanki',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Gado-Gado & Karedok Ibu Enny',
                'description' => 'Sayuran rebus dan mentah segar disiram bumbu kacang mede gurih dengan telur rebus dan kerupuk.',
                'categories' => [
                    'Spesial Gado-Gado' => [
                        [
                            'name' => 'Paket Spesial Gado-Gado & Karedok Ibu Enny',
                            'description' => 'Menu andalan terenak dari Gado-Gado & Karedok Ibu Enny porsi kenyang memuaskan.',
                            'price' => 20500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Gado-Gado',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #38',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Gado-Gado',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Gado-Gado',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Bakso Aci Juara Garut',
                'description' => 'Baso aci kenyal gurih kuah pedas segar berlimpah perasan jeruk limau, cuanki lidah, dan sukro cikur.',
                'categories' => [
                    'Spesial Bakso' => [
                        [
                            'name' => 'Paket Spesial Bakso Aci Juara Garut',
                            'description' => 'Menu andalan terenak dari Bakso Aci Juara Garut porsi kenyang memuaskan.',
                            'price' => 21000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Bakso',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #39',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Bakso',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Bakso',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Pisang Keju Lumer & Crispy',
                'description' => 'Pisang goreng tanduk krispi bertabur parutan keju cheddar, susu kental manis, dan meses cokelat mekar.',
                'categories' => [
                    'Spesial Pisang' => [
                        [
                            'name' => 'Paket Spesial Pisang Keju Lumer & Crispy',
                            'description' => 'Menu andalan terenak dari Pisang Keju Lumer & Crispy porsi kenyang memuaskan.',
                            'price' => 21500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Pisang',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #40',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Pisang',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Pisang',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Steak & Chicken Hotplate',
                'description' => 'Steak ayam krispi dan daging sapi sirloin disajikan di atas hotplate panas dengan siraman saus gravy.',
                'categories' => [
                    'Spesial Steak' => [
                        [
                            'name' => 'Paket Spesial Steak & Chicken Hotplate',
                            'description' => 'Menu andalan terenak dari Steak & Chicken Hotplate porsi kenyang memuaskan.',
                            'price' => 22000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Steak',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #41',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Steak',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Steak',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Korean Street Food Oppa',
                'description' => 'Jajanan Korea hits: Tteokbokki pedas manis gochujang, Odeng rebus kuah kaldu, dan Corndog mozarella.',
                'categories' => [
                    'Spesial Korean' => [
                        [
                            'name' => 'Paket Spesial Korean Street Food Oppa',
                            'description' => 'Menu andalan terenak dari Korean Street Food Oppa porsi kenyang memuaskan.',
                            'price' => 22500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Korean',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #42',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Korean',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Korean',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Ayam Bakar Madu Bu Endang',
                'description' => 'Ayam panggang bumbu manis madu meresap sampai tulang disajikan dengan nasi timbel dan lalapan.',
                'categories' => [
                    'Spesial Ayam' => [
                        [
                            'name' => 'Paket Spesial Ayam Bakar Madu Bu Endang',
                            'description' => 'Menu andalan terenak dari Ayam Bakar Madu Bu Endang porsi kenyang memuaskan.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Ayam',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #43',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Ayam',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Ayam',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Nasi Pecel Madiun Yu Sri',
                'description' => 'Pecel sayuran hijau segar disiram saus kacang gurih khas Jawa Timur, rempeyek kacang, dan mendoan.',
                'categories' => [
                    'Spesial Nasi' => [
                        [
                            'name' => 'Paket Spesial Nasi Pecel Madiun Yu Sri',
                            'description' => 'Menu andalan terenak dari Nasi Pecel Madiun Yu Sri porsi kenyang memuaskan.',
                            'price' => 16500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Nasi',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #44',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Nasi',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Nasi',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Ayam Gepuk Pak Gembus FEB',
                'description' => 'Ayam goreng empuk digepuk dengan sambal kacang mete gurih pedas nampol dan kol goreng krispi.',
                'categories' => [
                    'Spesial Ayam' => [
                        [
                            'name' => 'Paket Spesial Ayam Gepuk Pak Gembus FEB',
                            'description' => 'Menu andalan terenak dari Ayam Gepuk Pak Gembus FEB porsi kenyang memuaskan.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Ayam',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #45',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Ayam',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Ayam',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Sop Buntut & Iga Pak Ndut',
                'description' => 'Sop buntut dan iga sapi empuk kuah bening kaya rempah kapulaga pala, wortel, dan emping melinjo.',
                'categories' => [
                    'Spesial Sop' => [
                        [
                            'name' => 'Paket Spesial Sop Buntut & Iga Pak Ndut',
                            'description' => 'Menu andalan terenak dari Sop Buntut & Iga Pak Ndut porsi kenyang memuaskan.',
                            'price' => 17500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Sop',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #46',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Sop',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Sop',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Soto Mie Bogor Kang Dadang',
                'description' => 'Soto mie kuah kaldu merah gurih dengan daging sapi, kikil, risol bihun krispi, dan emping melinjo.',
                'categories' => [
                    'Spesial Soto' => [
                        [
                            'name' => 'Paket Spesial Soto Mie Bogor Kang Dadang',
                            'description' => 'Menu andalan terenak dari Soto Mie Bogor Kang Dadang porsi kenyang memuaskan.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Soto',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #47',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Soto',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Soto',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Cireng Bumbu Rujak & Cilok Crispy',
                'description' => 'Cireng salju renyah dicocol bumbu rujak manis pedas asam dan cilok goreng bumbu kacang pedas.',
                'categories' => [
                    'Spesial Cireng' => [
                        [
                            'name' => 'Paket Spesial Cireng Bumbu Rujak & Cilok Crispy',
                            'description' => 'Menu andalan terenak dari Cireng Bumbu Rujak & Cilok Crispy porsi kenyang memuaskan.',
                            'price' => 18500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Cireng',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #48',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Cireng',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Cireng',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Croissant & Bakery FEB',
                'description' => 'Freshly baked butter croissant, pain au chocolat, cinnamon roll harum, dan aneka pastry lezat.',
                'categories' => [
                    'Spesial Croissant' => [
                        [
                            'name' => 'Paket Spesial Croissant & Bakery FEB',
                            'description' => 'Menu andalan terenak dari Croissant & Bakery FEB porsi kenyang memuaskan.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Croissant',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #49',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Croissant',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Croissant',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Kedai Cincau & Dawet Aren',
                'description' => 'Es cincau hijau segar alami santan gula kelapa dan es dawet ireng kenyal penghilang dahaga.',
                'categories' => [
                    'Spesial Kedai' => [
                        [
                            'name' => 'Paket Spesial Kedai Cincau & Dawet Aren',
                            'description' => 'Menu andalan terenak dari Kedai Cincau & Dawet Aren porsi kenyang memuaskan.',
                            'price' => 19500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Kedai',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #50',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Kedai',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Kedai',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Susu Segar Murni Boyolali',
                'description' => 'Susu sapi murni pasteurisasi varian cokelat, madu jahe, strawberry, dan camilan roti maryam.',
                'categories' => [
                    'Spesial Susu' => [
                        [
                            'name' => 'Paket Spesial Susu Segar Murni Boyolali',
                            'description' => 'Menu andalan terenak dari Susu Segar Murni Boyolali porsi kenyang memuaskan.',
                            'price' => 20000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Susu',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #51',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Susu',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Susu',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Es Cokelat Klasik & Roti Sobek',
                'description' => 'Es cokelat kental pahit manis pekat disajikan dengan roti sobek hangat siap celup.',
                'categories' => [
                    'Spesial Es' => [
                        [
                            'name' => 'Paket Spesial Es Cokelat Klasik & Roti Sobek',
                            'description' => 'Menu andalan terenak dari Es Cokelat Klasik & Roti Sobek porsi kenyang memuaskan.',
                            'price' => 20500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Es',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #52',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Es',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Es',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Burger & Wings Kampus',
                'description' => 'Cheeseburger daging sapi gurih juicy, ayam crispy wings saus bbq pedas, dan french fries gurih.',
                'categories' => [
                    'Spesial Burger' => [
                        [
                            'name' => 'Paket Spesial Burger & Wings Kampus',
                            'description' => 'Menu andalan terenak dari Burger & Wings Kampus porsi kenyang memuaskan.',
                            'price' => 21000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Burger',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #53',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Burger',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Burger',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Pasta & Spaghetti Italiano',
                'description' => 'Spaghetti carbonara creamy lezat, penne arrabbiata pedas, dan macaroni schotel panggang keju.',
                'categories' => [
                    'Spesial Pasta' => [
                        [
                            'name' => 'Paket Spesial Pasta & Spaghetti Italiano',
                            'description' => 'Menu andalan terenak dari Pasta & Spaghetti Italiano porsi kenyang memuaskan.',
                            'price' => 21500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Pasta',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #54',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Pasta',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Pasta',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Tahu Gejrot & Tahu Pletok Cirebon',
                'description' => 'Tahu pong garing disiram kuah gula aren rawit asam pedas khas Cirebon dan tahu pletok aci.',
                'categories' => [
                    'Spesial Tahu' => [
                        [
                            'name' => 'Paket Spesial Tahu Gejrot & Tahu Pletok Cirebon',
                            'description' => 'Menu andalan terenak dari Tahu Gejrot & Tahu Pletok Cirebon porsi kenyang memuaskan.',
                            'price' => 22000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Tahu',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #55',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Tahu',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Tahu',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Waffle & Pancake House',
                'description' => 'Waffle belgia garing lembut bertabur es krim vanilla dan fluffy pancake sirup maple manis.',
                'categories' => [
                    'Spesial Waffle' => [
                        [
                            'name' => 'Paket Spesial Waffle & Pancake House',
                            'description' => 'Menu andalan terenak dari Waffle & Pancake House porsi kenyang memuaskan.',
                            'price' => 22500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Waffle',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #56',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Waffle',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Waffle',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Lumpia Basah & Goreng Semarang',
                'description' => 'Lumpia basah dan goreng isi rebung ayam telur gurih disajikan dengan saus cokelat kental khas.',
                'categories' => [
                    'Spesial Lumpia' => [
                        [
                            'name' => 'Paket Spesial Lumpia Basah & Goreng Semarang',
                            'description' => 'Menu andalan terenak dari Lumpia Basah & Goreng Semarang porsi kenyang memuaskan.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Lumpia',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #57',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Lumpia',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Lumpia',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Risol Mayo Meler Bu Diah',
                'description' => 'Risol isi telur, smoked beef, dan saus mayo creamy lumer berlimpah dengan kulit tepung panir krispi.',
                'categories' => [
                    'Spesial Risol' => [
                        [
                            'name' => 'Paket Spesial Risol Mayo Meler Bu Diah',
                            'description' => 'Menu andalan terenak dari Risol Mayo Meler Bu Diah porsi kenyang memuaskan.',
                            'price' => 16500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Risol',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #58',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Risol',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Risol',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Singkong Keju D-9 Salatiga',
                'description' => 'Singkong merekah empuk gurih digoreng garing keemasan bertabur bubuk keju dan sambal cocol.',
                'categories' => [
                    'Spesial Singkong' => [
                        [
                            'name' => 'Paket Spesial Singkong Keju D-9 Salatiga',
                            'description' => 'Menu andalan terenak dari Singkong Keju D-9 Salatiga porsi kenyang memuaskan.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Singkong',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #59',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Singkong',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Singkong',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Kue Cubit & Pukis Lumer Banyumas',
                'description' => 'Pukis lembut empuk beraroma pandan topping keju cokelat dan kue cubit setengah matang lumer.',
                'categories' => [
                    'Spesial Kue' => [
                        [
                            'name' => 'Paket Spesial Kue Cubit & Pukis Lumer Banyumas',
                            'description' => 'Menu andalan terenak dari Kue Cubit & Pukis Lumer Banyumas porsi kenyang memuaskan.',
                            'price' => 17500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Kue',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #60',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Kue',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Kue',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Donat Kampung & Bomboloni Bu Yanti',
                'description' => 'Donat kentang empuk tabur gula halus klasik dan bomboloni montok isi pasta cokelat nutella.',
                'categories' => [
                    'Spesial Donat' => [
                        [
                            'name' => 'Paket Spesial Donat Kampung & Bomboloni Bu Yanti',
                            'description' => 'Menu andalan terenak dari Donat Kampung & Bomboloni Bu Yanti porsi kenyang memuaskan.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Donat',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #61',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Donat',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Donat',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Nasi Goreng Mafia Rempah',
                'description' => 'Nasi goreng racikan rempah nusantara: Nasgor Kambing, Nasgor Gila, dan Nasgor Hongkong mantap.',
                'categories' => [
                    'Spesial Nasi' => [
                        [
                            'name' => 'Paket Spesial Nasi Goreng Mafia Rempah',
                            'description' => 'Menu andalan terenak dari Nasi Goreng Mafia Rempah porsi kenyang memuaskan.',
                            'price' => 18500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Nasi',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #62',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Nasi',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Nasi',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Nasi Gandul Pati Pak Mei',
                'description' => 'Nasi gandul khas Pati berkuah santan rempah gurih manis dengan potongan empal daging dan tempe bacem.',
                'categories' => [
                    'Spesial Nasi' => [
                        [
                            'name' => 'Paket Spesial Nasi Gandul Pati Pak Mei',
                            'description' => 'Menu andalan terenak dari Nasi Gandul Pati Pak Mei porsi kenyang memuaskan.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Nasi',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #63',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Nasi',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Nasi',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Nasi Tutug Oncom Tasikmalaya',
                'description' => 'Nasi pulen ditumbuk oncom bakar beraroma kencur gurih dengan lauk ayam goreng lengkuas dan pete.',
                'categories' => [
                    'Spesial Nasi' => [
                        [
                            'name' => 'Paket Spesial Nasi Tutug Oncom Tasikmalaya',
                            'description' => 'Menu andalan terenak dari Nasi Tutug Oncom Tasikmalaya porsi kenyang memuaskan.',
                            'price' => 19500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Nasi',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #64',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Nasi',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Nasi',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Warung Prasmanan Sedap Malam',
                'description' => 'Prasmanan lengkap masakan rumahan Jawa-Sunda: cumi asin cabe ijo, balado telur, dan urap sayur.',
                'categories' => [
                    'Spesial Warung' => [
                        [
                            'name' => 'Paket Spesial Warung Prasmanan Sedap Malam',
                            'description' => 'Menu andalan terenak dari Warung Prasmanan Sedap Malam porsi kenyang memuaskan.',
                            'price' => 20000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Warung',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #65',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Warung',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Warung',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Nasi Kebuli & Briyani Al-Fatih',
                'description' => 'Nasi beras basmati wangi kapulaga dan kismis disajikan dengan ayam panggang rempah dan acar nanas.',
                'categories' => [
                    'Spesial Nasi' => [
                        [
                            'name' => 'Paket Spesial Nasi Kebuli & Briyani Al-Fatih',
                            'description' => 'Menu andalan terenak dari Nasi Kebuli & Briyani Al-Fatih porsi kenyang memuaskan.',
                            'price' => 20500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Nasi',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #66',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Nasi',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Nasi',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Rice Bowl Donburi Kampus',
                'description' => 'Nasi pulen hangat dalam mangkuk topped beef gyudon teriyaki, chicken nanban tartar, dan telur onsen.',
                'categories' => [
                    'Spesial Rice' => [
                        [
                            'name' => 'Paket Spesial Rice Bowl Donburi Kampus',
                            'description' => 'Menu andalan terenak dari Rice Bowl Donburi Kampus porsi kenyang memuaskan.',
                            'price' => 21000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Rice',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #67',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Rice',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Rice',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Soto Tangkar Daging Bang Udin',
                'description' => 'Soto tangkar iga dan daging sapi kuah santan kuning kemerahan gurih berempah khas Betawi.',
                'categories' => [
                    'Spesial Soto' => [
                        [
                            'name' => 'Paket Spesial Soto Tangkar Daging Bang Udin',
                            'description' => 'Menu andalan terenak dari Soto Tangkar Daging Bang Udin porsi kenyang memuaskan.',
                            'price' => 21500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Soto',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #68',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Soto',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Soto',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Fish & Chips Canteen',
                'description' => 'Ikan dori fillet goreng tepung krispi keemasan disajikan dengan kentang goreng dan saus tartar segar.',
                'categories' => [
                    'Spesial Fish' => [
                        [
                            'name' => 'Paket Spesial Fish & Chips Canteen',
                            'description' => 'Menu andalan terenak dari Fish & Chips Canteen porsi kenyang memuaskan.',
                            'price' => 22000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Fish',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #69',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Fish',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Fish',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Western Grill & Potato Corner',
                'description' => 'Ayam bakar saus barbekyu, sosis bratwurst bakar, mashed potato lembut, dan salad jagung manis.',
                'categories' => [
                    'Spesial Western' => [
                        [
                            'name' => 'Paket Spesial Western Grill & Potato Corner',
                            'description' => 'Menu andalan terenak dari Western Grill & Potato Corner porsi kenyang memuaskan.',
                            'price' => 22500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Western',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #70',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Western',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Western',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Sandwich Sub & Panini FEB',
                'description' => 'Roti baguette panggang isi irisan daging sapi panggang, keju cheddar meleleh, dan sayuran selada segar.',
                'categories' => [
                    'Spesial Sandwich' => [
                        [
                            'name' => 'Paket Spesial Sandwich Sub & Panini FEB',
                            'description' => 'Menu andalan terenak dari Sandwich Sub & Panini FEB porsi kenyang memuaskan.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Sandwich',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #71',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Sandwich',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Sandwich',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Tteokbokki & Rabokki House',
                'description' => 'Kue beras kenyal tteokbokki dimasak saus pedas korea dengan mie ramen, fish cake, dan telur rebus.',
                'categories' => [
                    'Spesial Tteokbokki' => [
                        [
                            'name' => 'Paket Spesial Tteokbokki & Rabokki House',
                            'description' => 'Menu andalan terenak dari Tteokbokki & Rabokki House porsi kenyang memuaskan.',
                            'price' => 16500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Tteokbokki',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #72',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Tteokbokki',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Tteokbokki',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Corndog Mozarella Seoul',
                'description' => 'Corndog sosis balut keju mozarella tebal digoreng renyah dengan taburan gula halus dan saus saus.',
                'categories' => [
                    'Spesial Corndog' => [
                        [
                            'name' => 'Paket Spesial Corndog Mozarella Seoul',
                            'description' => 'Menu andalan terenak dari Corndog Mozarella Seoul porsi kenyang memuaskan.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Corndog',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #73',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Corndog',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Corndog',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Sushi Roll Kampus',
                'description' => 'Sushi roll ramah kantong: California roll, spicy salmon roll matang, dan kani mentai roll.',
                'categories' => [
                    'Spesial Sushi' => [
                        [
                            'name' => 'Paket Spesial Sushi Roll Kampus',
                            'description' => 'Menu andalan terenak dari Sushi Roll Kampus porsi kenyang memuaskan.',
                            'price' => 17500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Sushi',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #74',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Sushi',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Sushi',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Toast Box & Kopi O',
                'description' => 'Roti panggang mentega selai srikaya autentik, telur rebus setengah matang, dan kopi hitam pekat.',
                'categories' => [
                    'Spesial Toast' => [
                        [
                            'name' => 'Paket Spesial Toast Box & Kopi O',
                            'description' => 'Menu andalan terenak dari Toast Box & Kopi O porsi kenyang memuaskan.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Toast',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #75',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Toast',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Toast',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Matcha & Tea Lab',
                'description' => 'Minuman matcha asli Kyoto, hojicha roasted milk tea, dan aneka teh bunga melati seduh segar.',
                'categories' => [
                    'Spesial Matcha' => [
                        [
                            'name' => 'Paket Spesial Matcha & Tea Lab',
                            'description' => 'Menu andalan terenak dari Matcha & Tea Lab porsi kenyang memuaskan.',
                            'price' => 18500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Matcha',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #76',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Matcha',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Matcha',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Kopi Tubruk & Warung Kopi Senja',
                'description' => 'Kopi tubruk robusta Lampung dan arabika Gayo disajikan bersama tempe mendoan dan pisang goreng.',
                'categories' => [
                    'Spesial Kopi' => [
                        [
                            'name' => 'Paket Spesial Kopi Tubruk & Warung Kopi Senja',
                            'description' => 'Menu andalan terenak dari Kopi Tubruk & Warung Kopi Senja porsi kenyang memuaskan.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Kopi',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #77',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Kopi',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Kopi',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Artisan Pastry & Cookies',
                'description' => 'Soft baked cookies renyah di luar chewy di dalam dengan lelehan cokelat belgia dan red velvet.',
                'categories' => [
                    'Spesial Artisan' => [
                        [
                            'name' => 'Paket Spesial Artisan Pastry & Cookies',
                            'description' => 'Menu andalan terenak dari Artisan Pastry & Cookies porsi kenyang memuaskan.',
                            'price' => 19500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Artisan',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #78',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Artisan',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Artisan',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Coconut Shake & Kelapa Muda Segar',
                'description' => 'Kelapa muda asli diblender creamy dengan es krim vanilla dan air kelapa murni tanpa sirup.',
                'categories' => [
                    'Spesial Coconut' => [
                        [
                            'name' => 'Paket Spesial Coconut Shake & Kelapa Muda Segar',
                            'description' => 'Menu andalan terenak dari Coconut Shake & Kelapa Muda Segar porsi kenyang memuaskan.',
                            'price' => 20000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Coconut',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #79',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Coconut',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Coconut',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Es Campur & Es Oyen Bandung',
                'description' => 'Es serut manis bertabur alpukat mentega, kelapa muda, nangka harum, pacar cina, dan tape singkong.',
                'categories' => [
                    'Spesial Es' => [
                        [
                            'name' => 'Paket Spesial Es Campur & Es Oyen Bandung',
                            'description' => 'Menu andalan terenak dari Es Campur & Es Oyen Bandung porsi kenyang memuaskan.',
                            'price' => 20500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Es',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #80',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Es',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Es',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Es Goyobod & Es Doger Priangan',
                'description' => 'Es tradisional priangan: es goyobod hunkwe santan dan es doger tape ketan hitam manis segar.',
                'categories' => [
                    'Spesial Es' => [
                        [
                            'name' => 'Paket Spesial Es Goyobod & Es Doger Priangan',
                            'description' => 'Menu andalan terenak dari Es Goyobod & Es Doger Priangan porsi kenyang memuaskan.',
                            'price' => 21000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Es',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #81',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Es',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Es',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Fresh Mango & Fruit Shake',
                'description' => 'Jus mangga arumanis kental berlapis whipped cream lembut dan potongan buah mangga segar melimpah.',
                'categories' => [
                    'Spesial Fresh' => [
                        [
                            'name' => 'Paket Spesial Fresh Mango & Fruit Shake',
                            'description' => 'Menu andalan terenak dari Fresh Mango & Fruit Shake porsi kenyang memuaskan.',
                            'price' => 21500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Fresh',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #82',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Fresh',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Fresh',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Chatime Style Tea House',
                'description' => 'Roasted milk tea dengan topping grass jelly lembut, jasmine green tea, dan passionfruit tea.',
                'categories' => [
                    'Spesial Chatime' => [
                        [
                            'name' => 'Paket Spesial Chatime Style Tea House',
                            'description' => 'Menu andalan terenak dari Chatime Style Tea House porsi kenyang memuaskan.',
                            'price' => 22000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Chatime',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #83',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Chatime',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Chatime',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Es Jeruk & Lemonade Bar',
                'description' => 'Jeruk peras murni dan sari buah lemon segar dipadukan madu hutan serta daun mint segar.',
                'categories' => [
                    'Spesial Es' => [
                        [
                            'name' => 'Paket Spesial Es Jeruk & Lemonade Bar',
                            'description' => 'Menu andalan terenak dari Es Jeruk & Lemonade Bar porsi kenyang memuaskan.',
                            'price' => 22500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Es',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #84',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Es',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Es',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Wedang Ronde & Jahe Anget',
                'description' => 'Wedang jahe wangi hangat berisikan bulatan ronde kenyal isi kacang tanah tumbuk gurih manis.',
                'categories' => [
                    'Spesial Wedang' => [
                        [
                            'name' => 'Paket Spesial Wedang Ronde & Jahe Anget',
                            'description' => 'Menu andalan terenak dari Wedang Ronde & Jahe Anget porsi kenyang memuaskan.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Wedang',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #85',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Wedang',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Wedang',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Smoothie Bowl & Berry Boost',
                'description' => 'Smoothie bowl naga merah dan pisang bertabur chia seed, granola renyah, dan irisan buah kiwi.',
                'categories' => [
                    'Spesial Smoothie' => [
                        [
                            'name' => 'Paket Spesial Smoothie Bowl & Berry Boost',
                            'description' => 'Menu andalan terenak dari Smoothie Bowl & Berry Boost porsi kenyang memuaskan.',
                            'price' => 16500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Smoothie',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #86',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Smoothie',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Smoothie',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Yogurt & Fruit Blend Bar',
                'description' => 'Greek yogurt kental asam manis dipadukan madu murni, potongan buah strawberry segar, dan kacang almond.',
                'categories' => [
                    'Spesial Yogurt' => [
                        [
                            'name' => 'Paket Spesial Yogurt & Fruit Blend Bar',
                            'description' => 'Menu andalan terenak dari Yogurt & Fruit Blend Bar porsi kenyang memuaskan.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Yogurt',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #87',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Yogurt',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Yogurt',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Jasuke & Jagung Bakar Manis',
                'description' => 'Jagung manis pipil kukus hangat diaduk mentega, susu kental manis, dan keju cheddar melimpah.',
                'categories' => [
                    'Spesial Jasuke' => [
                        [
                            'name' => 'Paket Spesial Jasuke & Jagung Bakar Manis',
                            'description' => 'Menu andalan terenak dari Jasuke & Jagung Bakar Manis porsi kenyang memuaskan.',
                            'price' => 17500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Jasuke',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #88',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Jasuke',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Jasuke',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Tahu Bakso & Tahu Walik Banyuwangi',
                'description' => 'Tahu walik goreng renyah isi adonan daging ayam kenyal disajikan dengan sambal kecap rawit pedas.',
                'categories' => [
                    'Spesial Tahu' => [
                        [
                            'name' => 'Paket Spesial Tahu Bakso & Tahu Walik Banyuwangi',
                            'description' => 'Menu andalan terenak dari Tahu Bakso & Tahu Walik Banyuwangi porsi kenyang memuaskan.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Tahu',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #89',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Tahu',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Tahu',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Kerak Telor & Ketoprak Ciragil',
                'description' => 'Ketoprak tahu bihun tauge bumbu kacang gurih pekat dan kerak telor bebek khas Betawi harum gurih.',
                'categories' => [
                    'Spesial Kerak' => [
                        [
                            'name' => 'Paket Spesial Kerak Telor & Ketoprak Ciragil',
                            'description' => 'Menu andalan terenak dari Kerak Telor & Ketoprak Ciragil porsi kenyang memuaskan.',
                            'price' => 18500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Kerak',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #90',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Kerak',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Kerak',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Asinan Bogor & Buah Segar',
                'description' => 'Asinan sayur dan asinan buah segar berkuah cuka merah cabai rawit pedas asam manis segar.',
                'categories' => [
                    'Spesial Asinan' => [
                        [
                            'name' => 'Paket Spesial Asinan Bogor & Buah Segar',
                            'description' => 'Menu andalan terenak dari Asinan Bogor & Buah Segar porsi kenyang memuaskan.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Asinan',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #91',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Asinan',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Asinan',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Makaroni Ngehe Pedas Level',
                'description' => 'Makaroni goreng renyah bumbu asin gurih pedas daun jeruk berlevel dan makaroni basah kenyal.',
                'categories' => [
                    'Spesial Makaroni' => [
                        [
                            'name' => 'Paket Spesial Makaroni Ngehe Pedas Level',
                            'description' => 'Menu andalan terenak dari Makaroni Ngehe Pedas Level porsi kenyang memuaskan.',
                            'price' => 19500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Makaroni',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #92',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Makaroni',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Makaroni',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Crepes Crispy & D Crepes Style',
                'description' => 'Crepes tipis super renyah dengan isian pisang cokelat keju atau smoked beef mozarella mayo.',
                'categories' => [
                    'Spesial Crepes' => [
                        [
                            'name' => 'Paket Spesial Crepes Crispy & D Crepes Style',
                            'description' => 'Menu andalan terenak dari Crepes Crispy & D Crepes Style porsi kenyang memuaskan.',
                            'price' => 20000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Crepes',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #93',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Crepes',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Crepes',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Ayam Penyet Surabaya Cak Man',
                'description' => 'Ayam goreng kremes dipenyet sambal bajak terasi matang pedas harum dengan lalapan lengkap.',
                'categories' => [
                    'Spesial Ayam' => [
                        [
                            'name' => 'Paket Spesial Ayam Penyet Surabaya Cak Man',
                            'description' => 'Menu andalan terenak dari Ayam Penyet Surabaya Cak Man porsi kenyang memuaskan.',
                            'price' => 20500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Ayam',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #94',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Ayam',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Ayam',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Bakmi GM Style Pangsit Juara',
                'description' => 'Bakmi kenyal disiram tumisan ayam jamur manis gurih dilengkapi pangsit goreng saus asam manis.',
                'categories' => [
                    'Spesial Bakmi' => [
                        [
                            'name' => 'Paket Spesial Bakmi GM Style Pangsit Juara',
                            'description' => 'Menu andalan terenak dari Bakmi GM Style Pangsit Juara porsi kenyang memuaskan.',
                            'price' => 21000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Bakmi',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 18000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #95',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Bakmi',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Bakmi',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Nasi Campur Bali Men Tempeh',
                'description' => 'Nasi campur ayam betutu suwir bumbu genep Bali, sate lilit ayam, sayur urap lawar, dan sambal matah.',
                'categories' => [
                    'Spesial Nasi' => [
                        [
                            'name' => 'Paket Spesial Nasi Campur Bali Men Tempeh',
                            'description' => 'Menu andalan terenak dari Nasi Campur Bali Men Tempeh porsi kenyang memuaskan.',
                            'price' => 21500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Nasi',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 19000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #96',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Nasi',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Nasi',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Tongseng & Tengkleng Solo',
                'description' => 'Tongseng daging sapi kuah gulai rempah manis dengan rajangan kol tomat dan tengkleng iga gurih.',
                'categories' => [
                    'Spesial Tongseng' => [
                        [
                            'name' => 'Paket Spesial Tongseng & Tengkleng Solo',
                            'description' => 'Menu andalan terenak dari Tongseng & Tengkleng Solo porsi kenyang memuaskan.',
                            'price' => 22000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Tongseng',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 14000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #97',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Tongseng',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Tongseng',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Es Pisang Ijo Makassar Asli',
                'description' => 'Pisang raja manis berbalut adonan pandan hijau lembut disajikan bersama bubuk sumsum dan sirup DHT.',
                'categories' => [
                    'Spesial Es' => [
                        [
                            'name' => 'Paket Spesial Es Pisang Ijo Makassar Asli',
                            'description' => 'Menu andalan terenak dari Es Pisang Ijo Makassar Asli porsi kenyang memuaskan.',
                            'price' => 22500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Es',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 15000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #98',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Es',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Es',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Ayam Serundeng Bu Endang',
                'description' => 'Ayam goreng kampung bumbu rempah kuning bertabur serundeng kelapa manis gurih dan sambal terasi.',
                'categories' => [
                    'Spesial Ayam' => [
                        [
                            'name' => 'Paket Spesial Ayam Serundeng Bu Endang',
                            'description' => 'Menu andalan terenak dari Ayam Serundeng Bu Endang porsi kenyang memuaskan.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Ayam',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 16000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #99',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Ayam',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Ayam',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Geprek Mozarella Mas Bowo',
                'description' => 'Ayam geprek krispi dibakar dengan lapisan keju mozarella leleh mulur dan sambal bawang ekstra pedas.',
                'categories' => [
                    'Spesial Geprek' => [
                        [
                            'name' => 'Paket Spesial Geprek Mozarella Mas Bowo',
                            'description' => 'Menu andalan terenak dari Geprek Mozarella Mas Bowo porsi kenyang memuaskan.',
                            'price' => 16500,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Menu Favorit Geprek',
                            'description' => 'Pilihan terfavorit mahasiswa bumbu khas gurih lezat.',
                            'price' => 17000,
                            'global_category' => 'makanan',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Paket Hemat Kampus #100',
                            'description' => 'Pilihan ramah kantong bergizi dan bikin kenyang seharian.',
                            'price' => 12000,
                            'global_category' => 'sarapan',
                            'is_available' => true,
                        ],
                    ],
                    'Minuman & Camilan' => [
                        [
                            'name' => 'Camilan Renyah Geprek',
                            'description' => 'Gorengan atau camilan garing lezat gurih siap santap.',
                            'price' => 6000,
                            'global_category' => 'snack',
                            'is_available' => true,
                        ],
                        [
                            'name' => 'Minuman Segar Dingin Geprek',
                            'description' => 'Minuman manis dingin menyegarkan penghilang dahaga.',
                            'price' => 5000,
                            'global_category' => 'minuman',
                            'is_available' => true,
                        ],
                    ],
                ],
            ],
        ];

        $sampleImages = [
            'makanan' => [
                'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80',
            ],
            'minuman' => [
                'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
            ],
            'kopi' => [
                'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
            ],
            'snack' => [
                'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80',
            ],
            'dessert' => [
                'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=600&auto=format&fit=crop&q=80',
            ],
            'sarapan' => [
                'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80',
            ],
        ];

        foreach ($tenantsData as $idx => $tenantInfo) {
            $rating = round(4.5 + (($idx % 5) * 0.1), 2);
            $reviewsCount = 20 + (($idx * 7) % 80);

            $tenant = Tenant::query()->updateOrCreate(
                ['name' => $tenantInfo['name']],
                [
                    'slug' => Str::slug($tenantInfo['name']),
                    'description' => $tenantInfo['description'],
                    'image' => null,
                    'banner_image' => null,
                    'logo_image' => null,
                    'phone' => '0812' . str_pad((string) (1000000 + $idx), 8, '0', STR_PAD_LEFT),
                    'opening_hours' => '08:00 - 17:00',
                    'is_active' => true,
                    'is_open' => true,
                    'rating' => $rating,
                    'reviews_count' => $reviewsCount,
                    'midtrans_merchant_id' => null,
                    'midtrans_client_key' => null,
                    'midtrans_server_key' => null,
                    'midtrans_is_production' => false,
                    'midtrans_is_active' => false,
                ]
            );

            foreach ($tenantInfo['categories'] as $categoryName => $menus) {
                $category = Category::query()->firstOrCreate(
                    [
                        'tenant_id' => $tenant->id,
                        'name' => $categoryName,
                    ],
                    [
                        'slug' => Str::slug($categoryName),
                    ]
                );

                foreach ($menus as $menuIndex => $menuItem) {
                    $globalCategory = $menuItem['global_category'] ?? 'makanan';
                    $categoryImages = $sampleImages[$globalCategory] ?? $sampleImages['makanan'];
                    $image = $categoryImages[$menuIndex % count($categoryImages)];

                    $isRecommended = ($menuIndex === 0);
                    $originalPrice = $isRecommended ? round($menuItem['price'] * 1.2, -3) : null;

                    $options = match ($globalCategory) {
                        'kopi', 'minuman' => $minumanOptions,
                        'snack' => $snackOptions,
                        default => $makananOptions,
                    };

                    Menu::query()->firstOrCreate(
                        [
                            'tenant_id' => $tenant->id,
                            'name' => $menuItem['name'],
                        ],
                        [
                            'category_id' => $category->id,
                            'global_category' => $globalCategory,
                            'description' => $menuItem['description'],
                            'price' => $menuItem['price'],
                            'original_price' => $originalPrice,
                            'image' => $image,
                            'is_available' => true,
                            'is_recommended' => $isRecommended,
                            'estimated_time' => 10 + (($menuIndex * 3) % 15),
                            'options' => $options,
                        ]
                    );
                }
            }
        }
    }
}
