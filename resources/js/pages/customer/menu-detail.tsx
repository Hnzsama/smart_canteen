import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Ban,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock,
    Flame,
    Heart,
    Minus,
    Package,
    Plus,
    Share2,
    ShoppingBag,
    Snowflake,
    Soup,
    Sparkles,
    Star,
    Store,
    Utensils,
    UtensilsCrossed,
} from 'lucide-react';
import { addToCart } from '@/hooks/use-cart';
import { toast } from 'sonner';
import StudentLayout from '@/layouts/student-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type MenuDetailProps = {
    menu: {
        id: number;
        tenant_id: number;
        tenant_name: string;
        tenant_slug: string;
        tenant_logo: string;
        is_tenant_open: boolean;
        tenant_rating: number;
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
        is_favorite?: boolean;
    };
    related_menus?: Array<{
        id: number;
        name: string;
        price: number;
        image: string | null;
        estimated_time: number;
    }>;
};

type NotePresetItem = {
    id: string;
    text: string;
    icon: React.ElementType;
};

const NOTE_PRESETS: NotePresetItem[] = [
    { id: 'pedas', text: 'Pedas banget', icon: Flame },
    { id: 'tanpa_bawang', text: 'Tanpa bawang', icon: Ban },
    { id: 'sambal_pisah', text: 'Sambal dipisah', icon: UtensilsCrossed },
    { id: 'es_sedikit', text: 'Es sedikit', icon: Snowflake },
    { id: 'bungkus', text: 'Bungkus rapi', icon: Package },
    { id: 'kuah_banyak', text: 'Kuah banyak', icon: Soup },
];

export default function MenuDetail({ menu, related_menus = [] }: MenuDetailProps) {
    const foodFallback = '/images/food-placeholder.jpg';
    const tenantFallback = '/images/tenant-placeholder.jpg';

    const [isFavorite, setIsFavorite] = useState(Boolean(menu.is_favorite));

    const handleToggleFavorite = async () => {
        const nextState = !isFavorite;
        setIsFavorite(nextState);
        try {
            const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const res = await fetch(`/favorites/${menu.id}/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
            });
            const data = await res.json();
            if (data.message) {
                toast.success(data.message);
            }
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };
    const [selectedChoices, setSelectedChoices] = useState<Record<string, { name: string; price: number }>>(() => {
        const initial: Record<string, { name: string; price: number }> = {};
        if (menu.options && menu.options.length > 0) {
            menu.options.forEach((group) => {
                // Only pre-select first choice if the option group is required
                if (group.required && group.choices && group.choices.length > 0) {
                    initial[group.name] = group.choices[0];
                }
            });
        }
        return initial;
    });

    const [itemQuantity, setItemQuantity] = useState(1);
    const [orderNote, setOrderNote] = useState('');
    const [isAdded, setIsAdded] = useState(false);
    const [isCopiedShare, setIsCopiedShare] = useState(false);

    const handleChoiceSelect = (
        groupName: string,
        isRequired: boolean | undefined,
        choice: { name: string; price: number }
    ) => {
        const currentChoice = selectedChoices[groupName];
        if (currentChoice && currentChoice.name === choice.name) {
            if (!isRequired) {
                // Optional group: toggle OFF (unselect)
                setSelectedChoices((prev) => {
                    const copy = { ...prev };
                    delete copy[groupName];
                    return copy;
                });
                return;
            }
        }
        setSelectedChoices((prev) => ({
            ...prev,
            [groupName]: choice,
        }));
    };

    const calculateTotalPrice = () => {
        let base = menu.price;
        Object.values(selectedChoices).forEach((choice) => {
            base += choice.price || 0;
        });
        return base * itemQuantity;
    };

    const handleAddToCart = () => {
        if (!menu.is_tenant_open) {
            toast.error('Stand ini sedang tutup!', {
                description: 'Anda tidak dapat memesan dari stand yang sedang tutup.',
            });
            return;
        }
        addToCart(menu as any, itemQuantity, calculateTotalPrice(), selectedChoices, orderNote);
        toast.success(`${menu.name} (${itemQuantity} porsi) ditambahkan!`, {
            description: 'Menu tersimpan di keranjang belanja.',
        });
    };

    const togglePresetNote = (presetText: string) => {
        if (orderNote.includes(presetText)) {
            setOrderNote((prev) =>
                prev
                    .replace(presetText, '')
                    .replace(/,\s*,/g, ',')
                    .replace(/^,\s*/, '')
                    .replace(/,\s*$/, '')
                    .trim()
            );
        } else {
            setOrderNote((prev) => (prev ? `${prev}, ${presetText}` : presetText));
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: menu.name,
                text: `Cek menu ${menu.name} di ${menu.tenant_name} Smart Canteen FEB!`,
                url: window.location.href,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            setIsCopiedShare(true);
            setTimeout(() => setIsCopiedShare(false), 2000);
        }
    };

    const discountPercentage =
        menu.original_price && menu.original_price > menu.price
            ? Math.round(((menu.original_price - menu.price) / menu.original_price) * 100)
            : 0;

    const rawMenuImg = menu.image || '/images/food-placeholder.jpg';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const imageUrl = rawMenuImg.startsWith('http')
        ? rawMenuImg
        : `${origin}${rawMenuImg.startsWith('/') ? '' : '/'}${rawMenuImg}`;
    const menuDescription =
        menu.description || `Pesan ${menu.name} dari ${menu.tenant_name} di Smart Canteen FEB.`;

    return (
        <>
            <Head title={`${menu.name} - ${menu.tenant_name} | Smart Canteen FEB`}>
                <meta name="description" content={menuDescription} />
                <meta property="og:title" content={`${menu.name} - ${menu.tenant_name} | Smart Canteen FEB`} />
                <meta property="og:description" content={menuDescription} />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:image:secure_url" content={imageUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${menu.name} - ${menu.tenant_name} | Smart Canteen FEB`} />
                <meta name="twitter:description" content={menuDescription} />
                <meta name="twitter:image" content={imageUrl} />
            </Head>

            <div className="flex flex-col gap-5 w-full pb-36">
                {/* Gen-Z Top Header Nav */}
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => window.history.back()}
                        className="h-9 px-3 text-xs font-bold gap-1.5 rounded-full border border-border bg-card/80 text-foreground shadow-2xs hover:bg-accent active:scale-95 transition-transform"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali</span>
                    </Button>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={handleToggleFavorite}
                            className={`size-9 rounded-full border border-border flex items-center justify-center transition-all active:scale-90 shadow-2xs ${
                                isFavorite
                                    ? 'bg-rose-500 text-white border-rose-500'
                                    : 'bg-card text-muted-foreground hover:text-foreground hover:bg-accent'
                            }`}
                        >
                            <Heart className={`size-4 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>

                        <button
                            type="button"
                            onClick={handleShare}
                            className="size-9 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground flex items-center justify-center transition-all active:scale-90 shadow-2xs"
                        >
                            {isCopiedShare ? <Check className="size-4 text-emerald-500" /> : <Share2 className="size-4" />}
                        </button>
                    </div>
                </div>

                {/* Hero Product Photo Card (Aspect 4:3 with Floating Badges & Vignette) */}
                <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-border bg-card shadow-xs">
                    <img
                        src={menu.image || foodFallback}
                        alt={menu.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = foodFallback;
                        }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                        {menu.is_recommended && (
                            <Badge variant="default" className="text-[10px] font-black px-2.5 py-1 bg-amber-500 text-slate-950 border-none shadow-md gap-1">
                                <Star className="h-3 w-3 fill-current" />
                                Best Seller
                            </Badge>
                        )}
                        {discountPercentage > 0 && (
                            <Badge variant="destructive" className="text-[10px] font-black px-2.5 py-1 shadow-md gap-1">
                                <Flame className="h-3 w-3 fill-current" />
                                DISKON {discountPercentage}%
                            </Badge>
                        )}
                    </div>

                    {/* Bottom Floating Time Badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                            {menu.category_name}
                        </span>
                        <div className="bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-mono border border-white/20 shadow-xs">
                            <Clock className="h-3.5 w-3.5 text-amber-400" />
                            <span>{menu.estimated_time} mnt siap</span>
                        </div>
                    </div>
                </div>

                {/* Main Info Card */}
                <div className="rounded-3xl border border-border bg-card p-4 space-y-3.5 shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0 flex-1">
                            <h1 className="text-lg font-black text-foreground tracking-tight leading-snug">
                                {menu.name}
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                <span className="flex items-center gap-1 text-amber-500 font-bold">
                                    <Star className="size-3.5 fill-current" />
                                    {menu.tenant_rating.toFixed(1)}
                                </span>
                                <span>•</span>
                                <span>{menu.tenant_name}</span>
                            </div>
                        </div>

                        {/* Price Tag */}
                        <div className="flex flex-col items-end shrink-0">
                            {menu.original_price && menu.original_price > menu.price && (
                                <span className="font-mono text-xs text-muted-foreground line-through">
                                    Rp {menu.original_price.toLocaleString('id-ID')}
                                </span>
                            )}
                            <span className="font-mono text-xl font-black text-primary">
                                Rp {menu.price.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {menu.description ||
                            'Menu makanan lezat yang siap disajikan segar dan hangat dari dapur stand kantin FEB.'}
                    </p>

                    {/* Stand Closed Warning Banner */}
                    {!menu.is_tenant_open && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2 text-rose-500 text-xs font-bold">
                            <Ban className="size-4 shrink-0 text-rose-500" />
                            <span>Stand ini sedang TUTUP. Penjual tidak menerima pesanan saat ini.</span>
                        </div>
                    )}

                    {/* Stand Info Link Strip */}
                    <Link
                        href={`/${menu.tenant_slug}`}
                        className="flex items-center justify-between p-3 rounded-2xl border border-border bg-accent/40 hover:bg-accent cursor-pointer transition-all group"
                    >
                        <div className="flex items-center gap-2.5">
                            <img
                                src={menu.tenant_logo || tenantFallback}
                                alt={menu.tenant_name}
                                className="h-9 w-9 rounded-xl object-cover border border-border shadow-2xs group-hover:scale-105 transition-transform"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = tenantFallback;
                                }}
                            />
                            <div>
                                <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                                    <span>{menu.tenant_name}</span>
                                    <Badge variant="outline" className={`text-[9px] px-1 py-0 h-3.5 font-bold ${
                                        menu.is_tenant_open
                                            ? 'text-emerald-300 border-emerald-800/40 bg-emerald-950/40'
                                            : 'text-rose-300 border-rose-800/40 bg-rose-950/40'
                                    }`}>
                                        {menu.is_tenant_open ? 'BUKA' : 'TUTUP'}
                                    </Badge>
                                </h4>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Store className="h-3 w-3 text-primary" />
                                    Kunjungi Stand Penjual &rarr;
                                </span>
                            </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Varian & Add-on Selection Section */}
                {menu.options && menu.options.length > 0 && (
                    <div className="rounded-3xl border border-border bg-card p-4 space-y-4 shadow-xs">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="size-3.5 text-primary" />
                                <span>Pilih Varian / Add-on</span>
                            </h3>
                            <span className="text-[10px] text-muted-foreground font-medium">Klik untuk memilih/membatalkan</span>
                        </div>

                        {menu.options.map((group, groupIdx) => (
                            <div key={groupIdx} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-extrabold text-foreground">
                                        {group.name}
                                    </Label>
                                    {group.required ? (
                                        <Badge variant="destructive" className="text-[9px] px-1.5 py-0 h-4 font-bold">
                                            Wajib
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-bold text-muted-foreground">
                                            Opsional
                                        </Badge>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    {group.choices.map((choice, cIdx) => {
                                        const isSelected = selectedChoices[group.name]?.name === choice.name;
                                        return (
                                            <div
                                                key={cIdx}
                                                onClick={() => handleChoiceSelect(group.name, group.required, choice)}
                                                className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-primary/10 border-primary shadow-xs'
                                                        : 'bg-card border-border hover:border-primary/50'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-2.5">
                                                    <div
                                                        className={`size-4 rounded-full border flex items-center justify-center transition-all ${
                                                            isSelected
                                                                ? 'border-primary bg-primary text-primary-foreground'
                                                                : 'border-muted-foreground/40 bg-transparent'
                                                        }`}
                                                    >
                                                        {isSelected && <div className="size-1.5 rounded-full bg-primary-foreground" />}
                                                    </div>
                                                    <span
                                                        className={`text-xs ${
                                                            isSelected ? 'font-black text-foreground' : 'font-medium text-foreground'
                                                        }`}
                                                    >
                                                        {choice.name}
                                                    </span>
                                                </div>
                                                <span
                                                    className={`text-xs font-mono font-bold ${
                                                        isSelected ? 'text-primary' : 'text-muted-foreground'
                                                    }`}
                                                >
                                                    {choice.price > 0
                                                        ? `+Rp ${choice.price.toLocaleString('id-ID')}`
                                                        : 'Gratis'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Special Instructions & Note Presets */}
                <div className="rounded-3xl border border-border bg-card p-4 space-y-3.5 shadow-xs">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="order-note" className="text-xs font-black text-foreground">
                                Catatan Khusus Dapur
                            </Label>
                            <span className="text-[10px] text-muted-foreground font-mono">Opsional</span>
                        </div>

                        {/* Preset Note Chips with Lucide Icons */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
                            {NOTE_PRESETS.map((preset) => {
                                const IconComponent = preset.icon;
                                const isSelected = orderNote.includes(preset.text);
                                return (
                                    <button
                                        key={preset.id}
                                        type="button"
                                        onClick={() => togglePresetNote(preset.text)}
                                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-200 border shrink-0 flex items-center gap-1.5 ${
                                            isSelected
                                                ? 'bg-primary text-primary-foreground border-primary shadow-2xs scale-102'
                                                : 'bg-muted/50 text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                                        }`}
                                    >
                                        <IconComponent
                                            className={`size-3.5 ${
                                                isSelected ? 'text-primary-foreground' : 'text-primary'
                                            }`}
                                        />
                                        <span>{preset.text}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <Textarea
                            id="order-note"
                            placeholder="Tulis catatan tambahan untuk koki dapur..."
                            value={orderNote}
                            onChange={(e) => setOrderNote(e.target.value)}
                            rows={2}
                            className="text-xs rounded-xl border-border resize-none bg-background focus:ring-primary"
                        />
                    </div>

                    {/* Quantity Counter */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-xs font-black text-foreground">Jumlah Porsi</span>
                        <div className="flex items-center gap-3 bg-muted/60 p-1.5 rounded-2xl border border-border">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-xl font-black text-foreground active:scale-90 hover:bg-card"
                                onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                            >
                                <Minus className="h-3.5 w-3.5" />
                            </Button>
                            <span className="font-mono text-sm font-black w-6 text-center text-foreground">
                                {itemQuantity}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-xl font-black text-foreground active:scale-90 hover:bg-card"
                                onClick={() => setItemQuantity((q) => q + 1)}
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Related Menus Grid */}
                {related_menus.length > 0 && (
                    <div className="space-y-3.5 pt-4 mt-2 border-t border-border/80">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-foreground flex items-center gap-1.5">
                                <Utensils className="size-3.5 text-primary" />
                                <span>Menu Lain di Stand Ini</span>
                            </span>
                            <Link href={`/${menu.tenant_slug}`} className="text-[10px] text-primary font-bold hover:underline">
                                Lihat Semua &rarr;
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            {related_menus.map((r) => (
                                <div
                                    key={r.id}
                                    onClick={() => router.get(`/menu/${r.id}`)}
                                    className="p-2.5 rounded-2xl border border-border bg-card flex items-center gap-2.5 cursor-pointer hover:border-primary/50 transition-all group"
                                >
                                    <img
                                        src={r.image || foodFallback}
                                        alt={r.name}
                                        className="h-11 w-11 rounded-xl object-cover border border-border shrink-0 group-hover:scale-105 transition-transform"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = foodFallback;
                                        }}
                                    />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-bold truncate text-foreground group-hover:text-primary transition-colors">
                                            {r.name}
                                        </span>
                                        <span className="text-[11px] font-mono font-black text-primary">
                                            Rp {r.price.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Gen-Z Sticky Floating Add-to-Cart Action Strip */}
            <div className="fixed bottom-[84px] z-40 w-full max-w-[430px] left-1/2 -translate-x-1/2 px-3.5 pointer-events-none">
                <div className="pointer-events-auto bg-card/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-border/80 dark:border-white/15 h-16 rounded-3xl px-4 shadow-[0_8px_30px_rgba(0,0,0,0.15)] flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                            Total {itemQuantity} Porsi
                        </span>
                        <span className="text-base font-black font-mono text-primary leading-tight">
                            Rp {calculateTotalPrice().toLocaleString('id-ID')}
                        </span>
                    </div>

                    <Button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!menu.is_tenant_open}
                        className={`h-11 px-5 text-xs font-black rounded-2xl gap-2 shadow-md transition-all ${
                            !menu.is_tenant_open
                                ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-70'
                                : 'bg-primary hover:bg-primary/90 text-primary-foreground active:scale-95'
                        }`}
                    >
                        {!menu.is_tenant_open ? (
                            <>
                                <Ban className="h-4 w-4" />
                                <span>Stand Tutup</span>
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="h-4 w-4" />
                                <span>Tambah ke Keranjang</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </>
    );
}

MenuDetail.layout = (page: React.ReactNode) => <StudentLayout>{page}</StudentLayout>;
