import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Clock,
    Plus,
    Search,
    ShoppingBag,
    Sparkles,
    Star,
    Store,
    Tag,
    Utensils,
    X,
} from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

type TenantItem = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    banner_image: string | null;
    logo_image: string | null;
    phone: string | null;
    opening_hours: string | null;
    is_open: boolean;
    rating: number;
    reviews_count: number;
};

type CategoryItem = {
    id: number;
    tenant_id: number;
    name: string;
    slug: string;
};

type MenuItem = {
    id: number;
    tenant_id: number;
    tenant_name: string;
    tenant_logo: string;
    is_tenant_open: boolean;
    category_id: number | null;
    category_name: string;
    name: string;
    description: string | null;
    price: number;
    original_price: number | null;
    image: string | null;
    is_recommended: boolean;
    estimated_time: number;
    options: Array<{
        name: string;
        type?: string;
        required?: boolean;
        choices: Array<{ name: string; price: number }>;
    }>;
};

type Props = {
    tenants?: TenantItem[];
    categories?: CategoryItem[];
    menus?: MenuItem[];
    filters?: {
        search?: string;
        tenant_id?: string;
        category_id?: string;
    };
};

export default function StudentDashboard({
    tenants = [],
    categories = [],
    menus = [],
    filters = { search: '', tenant_id: 'all', category_id: 'all' },
}: Props) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedTenantId, setSelectedTenantId] = useState<string>(filters.tenant_id || 'all');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(filters.category_id || 'all');

    // Add-on Order Modal state
    const [selectedMenuModal, setSelectedMenuModal] = useState<MenuItem | null>(null);
    const [selectedChoices, setSelectedChoices] = useState<Record<string, { name: string; price: number }>>({});
    const [itemQuantity, setItemQuantity] = useState(1);
    const [orderNote, setOrderNote] = useState('');
    const [cartCount, setCartCount] = useState(0);

    const filteredMenus = useMemo(() => {
        return menus.filter((menu) => {
            const matchesSearch =
                !searchQuery.trim() ||
                menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (menu.description && menu.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                menu.tenant_name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTenant =
                selectedTenantId === 'all' || String(menu.tenant_id) === selectedTenantId;

            const matchesCategory =
                selectedCategoryId === 'all' ||
                (selectedCategoryId === 'recommended' && menu.is_recommended) ||
                String(menu.category_id) === selectedCategoryId;

            return matchesSearch && matchesTenant && matchesCategory;
        });
    }, [menus, searchQuery, selectedTenantId, selectedCategoryId]);

    const activeTenant = tenants.find((t) => String(t.id) === selectedTenantId);

    const handleOpenOptionModal = (menu: MenuItem) => {
        setSelectedMenuModal(menu);
        setItemQuantity(1);
        setOrderNote('');
        const initialChoices: Record<string, { name: string; price: number }> = {};
        if (menu.options && menu.options.length > 0) {
            menu.options.forEach((group) => {
                if (group.choices && group.choices.length > 0) {
                    initialChoices[group.name] = group.choices[0];
                }
            });
        }
        setSelectedChoices(initialChoices);
    };

    const calculateModalTotalPrice = () => {
        if (!selectedMenuModal) return 0;
        let base = selectedMenuModal.price;
        Object.values(selectedChoices).forEach((choice) => {
            base += choice.price || 0;
        });
        return base * itemQuantity;
    };

    const handleAddToCart = () => {
        setCartCount((c) => c + itemQuantity);
        setSelectedMenuModal(null);
    };

    return (
        <>
            <Head title="Smart Canteen FEB - Katalog Kantin & Menu Mahasiswa" />

            <div className="flex h-full flex-1 flex-col gap-6 pb-16 w-full max-w-7xl mx-auto px-4 md:px-6 pt-4">
                {/* Stand Banner & Canteen Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-6 sm:p-8 text-white shadow-xl">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md text-xs font-bold gap-1">
                                    <Sparkles className="h-3.5 w-3.5 fill-amber-200" />
                                    Kantin Digital Fakultas Ekonomi & Bisnis
                                </Badge>
                            </div>
                            <h1 className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-xs">
                                Mau Makan Apa Hari Ini di Kantin FEB? 🍛
                            </h1>
                            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                                Pesan makanan favoritmu secara online tanpa perlu antre panjang di stand. Ambil pesanan langsung saat siap!
                            </p>
                        </div>

                        {/* Cart Quick Shortcut Widget */}
                        <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 self-start md:self-auto">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-amber-600 shadow-md font-bold relative">
                                <ShoppingBag className="h-6 w-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-extrabold text-white shadow-md">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] text-amber-100 font-semibold uppercase">Keranjang Pesanan</span>
                                <span className="text-sm font-extrabold text-white">
                                    {cartCount > 0 ? `${cartCount} Porsi Terpilih` : 'Kosong'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
                        <Utensils className="h-64 w-64 text-white" />
                    </div>
                </div>

                {/* Stand / Tenant Switcher Tabs */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                            <Store className="h-4 w-4 text-amber-500" />
                            Pilih Stand Toko Kantin FEB
                        </h2>
                        <span className="text-xs text-muted-foreground font-mono">
                            {tenants.length} Stand Terdaftar
                        </span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <button
                            type="button"
                            onClick={() => setSelectedTenantId('all')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                                selectedTenantId === 'all'
                                    ? 'bg-amber-500 text-white shadow-md'
                                    : 'bg-card border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <span>Semua Stand Kantin</span>
                        </button>

                        {tenants.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setSelectedTenantId(String(t.id))}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                                    selectedTenantId === String(t.id)
                                        ? 'bg-amber-500 text-white shadow-md'
                                        : 'bg-card border border-border/80 hover:bg-muted text-foreground'
                                }`}
                            >
                                <span className={`h-2 w-2 rounded-full ${t.is_open ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <span>{t.name}</span>
                                <span className="flex items-center text-[10px] opacity-90">
                                    <Star className="h-3 w-3 fill-amber-300 mr-0.5" />
                                    {t.rating ? Number(t.rating).toFixed(1) : '5.0'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active Selected Stand Banner Header (If Tenant Selected) */}
                {activeTenant && (
                    <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={activeTenant.logo_image || activeTenant.image || ''}
                                    alt={activeTenant.name}
                                    className="h-14 w-14 rounded-2xl object-cover border shadow-xs bg-muted"
                                    onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                    }}
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-black text-lg text-foreground">{activeTenant.name}</h3>
                                        <Badge className={`text-[10px] font-bold ${activeTenant.is_open ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                            {activeTenant.is_open ? 'STAND BUKA' : 'STAND TUTUP'}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                        {activeTenant.description || 'Stand Kantin FEB Universitas.'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                                    {activeTenant.opening_hours || '08:00 - 17:00'}
                                </span>
                                <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                                    {activeTenant.rating.toFixed(1)} ({activeTenant.reviews_count} ulasan)
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Live Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari menu makanan, minuman, promo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 text-xs sm:text-sm rounded-xl"
                        />
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        <Button
                            type="button"
                            variant={selectedCategoryId === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategoryId('all')}
                            className="h-8 text-xs font-bold rounded-lg"
                        >
                            Semua Menu
                        </Button>
                        <Button
                            type="button"
                            variant={selectedCategoryId === 'recommended' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategoryId('recommended')}
                            className="h-8 text-xs font-bold rounded-lg gap-1 bg-amber-500 hover:bg-amber-600 text-white"
                        >
                            <Star className="h-3.5 w-3.5 fill-amber-200" />
                            Best Seller
                        </Button>
                        {categories.map((c) => (
                            <Button
                                key={c.id}
                                type="button"
                                variant={selectedCategoryId === String(c.id) ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedCategoryId(String(c.id))}
                                className="h-8 text-xs font-semibold rounded-lg shrink-0"
                            >
                                {c.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Food Menu Catalog Grid */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            Menampilkan {filteredMenus.length} Menu Makanan
                        </span>
                    </div>

                    {filteredMenus.length === 0 ? (
                        <div className="p-12 text-center border border-dashed rounded-3xl bg-muted/10 text-muted-foreground space-y-2">
                            <Utensils className="h-10 w-10 mx-auto opacity-30" />
                            <p className="text-sm font-semibold">Menu tidak ditemukan.</p>
                            <p className="text-xs">Coba gunakan kata kunci pencarian lain atau pilih kategori stand yang tersedia.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredMenus.map((menu) => {
                                const numPrice = menu.price;
                                const numOrigPrice = menu.original_price;
                                const formattedPrice = `Rp ${numPrice.toLocaleString('id-ID')}`;
                                const formattedOriginalPrice =
                                    numOrigPrice && numOrigPrice > numPrice
                                        ? `Rp ${numOrigPrice.toLocaleString('id-ID')}`
                                        : null;

                                return (
                                    <div
                                        key={menu.id}
                                        className="group rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                                    >
                                        <div>
                                            {/* 1:1 Aspect Ratio Food Photo */}
                                            <div className="relative aspect-square w-full bg-muted/40 overflow-hidden">
                                                {menu.image ? (
                                                    <img
                                                        src={menu.image}
                                                        alt={menu.name}
                                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            (e.target as HTMLElement).style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                        <Utensils className="h-12 w-12 opacity-30" />
                                                    </div>
                                                )}

                                                {/* Overlay Badges */}
                                                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                                                    {menu.is_recommended && (
                                                        <Badge className="bg-amber-500 text-white font-bold text-[10px] shadow-sm gap-1 border-none">
                                                            <Star className="h-3 w-3 fill-amber-200" />
                                                            Best Seller
                                                        </Badge>
                                                    )}
                                                    {formattedOriginalPrice && (
                                                        <Badge className="bg-rose-500 text-white font-bold text-[10px] shadow-sm border-none">
                                                            PROMO DISKON
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                                                    <Clock className="h-3 w-3 text-amber-400" />
                                                    <span>{menu.estimated_time}m</span>
                                                </div>
                                            </div>

                                            {/* Food Card Details */}
                                            <div className="p-4 space-y-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                                                        {menu.tenant_name}
                                                    </Badge>
                                                    <Badge variant="secondary" className="text-[10px] font-normal">
                                                        {menu.category_name}
                                                    </Badge>
                                                </div>

                                                <h3 className="font-extrabold text-base text-foreground line-clamp-1 group-hover:text-amber-600 transition-colors">
                                                    {menu.name}
                                                </h3>

                                                <p className="text-xs text-muted-foreground line-clamp-2 min-h-8">
                                                    {menu.description || 'Menu lezat siap disajikan hangat dari stand kantin FEB.'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Price & Order Action */}
                                        <div className="p-4 pt-0 border-t border-border/40 mt-2 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                {formattedOriginalPrice && (
                                                    <span className="font-mono text-xs text-muted-foreground line-through">
                                                        {formattedOriginalPrice}
                                                    </span>
                                                )}
                                                <span className="font-mono font-extrabold text-base text-foreground">
                                                    {formattedPrice}
                                                </span>
                                            </div>

                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => handleOpenOptionModal(menu)}
                                                className="h-9 px-3 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl gap-1 shadow-2xs"
                                            >
                                                <Plus className="h-4 w-4" />
                                                <span>Tambah</span>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Add-On & Varian Modal Preview */}
            <Dialog open={Boolean(selectedMenuModal)} onOpenChange={() => setSelectedMenuModal(null)}>
                {selectedMenuModal && (
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
                                <span>{selectedMenuModal.name}</span>
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Dari Stand <span className="font-bold text-foreground">{selectedMenuModal.tenant_name}</span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            {/* Food Preview Banner inside Modal */}
                            {selectedMenuModal.image && (
                                <div className="h-40 w-full overflow-hidden rounded-xl border">
                                    <img
                                        src={selectedMenuModal.image}
                                        alt={selectedMenuModal.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}

                            <p className="text-xs text-muted-foreground">
                                {selectedMenuModal.description || 'Disajikan cepat dan hangat dari dapur stand kantin FEB.'}
                            </p>

                            {/* Varian / Add-on Options Selector */}
                            {selectedMenuModal.options && selectedMenuModal.options.length > 0 && (
                                <div className="space-y-4 pt-2 border-t border-border/50">
                                    {selectedMenuModal.options.map((group, groupIdx) => (
                                        <div key={groupIdx} className="space-y-2">
                                            <Label className="text-xs font-bold text-foreground">
                                                {group.name} {group.required && <span className="text-destructive">*</span>}
                                            </Label>
                                            <RadioGroup
                                                value={selectedChoices[group.name]?.name}
                                                onValueChange={(choiceName: string) => {
                                                    const choiceObj = group.choices.find((c) => c.name === choiceName);
                                                    if (choiceObj) {
                                                        setSelectedChoices({
                                                            ...selectedChoices,
                                                            [group.name]: choiceObj,
                                                        });
                                                    }
                                                }}
                                                className="space-y-1.5"
                                            >
                                                {group.choices.map((choice, cIdx) => (
                                                    <div
                                                        key={cIdx}
                                                        className="flex items-center justify-between p-2.5 rounded-xl border border-border/70 hover:bg-muted/40 cursor-pointer"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value={choice.name} id={`choice-${groupIdx}-${cIdx}`} />
                                                            <Label htmlFor={`choice-${groupIdx}-${cIdx}`} className="text-xs font-medium cursor-pointer">
                                                                {choice.name}
                                                            </Label>
                                                        </div>
                                                        <span className="text-xs font-mono font-semibold text-muted-foreground">
                                                            {choice.price > 0 ? `+Rp ${choice.price.toLocaleString('id-ID')}` : 'Gratis'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Special Note */}
                            <div className="space-y-1.5 pt-2 border-t border-border/50">
                                <Label htmlFor="order-note" className="text-xs font-semibold">
                                    Catatan Khusus untuk Dapur (Opsional)
                                </Label>
                                <Textarea
                                    id="order-note"
                                    placeholder="Cth: Sambal dipisah, jangan pakai timun, es sedikit..."
                                    value={orderNote}
                                    onChange={(e) => setOrderNote(e.target.value)}
                                    rows={2}
                                    className="text-xs resize-none"
                                />
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                <span className="text-xs font-bold text-foreground">Jumlah Porsi</span>
                                <div className="flex items-center gap-3 bg-muted p-1 rounded-xl border">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 text-xs font-bold"
                                        onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                                    >
                                        -
                                    </Button>
                                    <span className="font-mono text-xs font-bold w-6 text-center">
                                        {itemQuantity}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 text-xs font-bold"
                                        onClick={() => setItemQuantity((q) => q + 1)}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/50">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Harga Porsi</span>
                                    <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
                                        Rp {calculateModalTotalPrice().toLocaleString('id-ID')}
                                    </span>
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleAddToCart}
                                    className="h-10 px-6 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl gap-1.5 shadow-md"
                                >
                                    <ShoppingBag className="h-4 w-4" />
                                    <span>Masukkan ke Keranjang</span>
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
}

StudentDashboard.layout = (page: React.ReactNode) => (
    <StudentLayout>{page}</StudentLayout>
);
