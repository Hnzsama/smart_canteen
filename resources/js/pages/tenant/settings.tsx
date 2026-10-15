import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import {
    AlertCircle,
    Building2,
    Check,
    Clock,
    CreditCard,
    Eye,
    EyeOff,
    Image as ImageIcon,
    Info,
    Loader2,
    Phone,
    Save,
    Settings,
    ShieldCheck,
    Star,
    Store,
    Upload,
    Utensils,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import { ImageCropperModal } from '@/components/image-cropper-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toggleOpen as toggleOpenRoute, update as updateSettingsRoute } from '@/routes/tenant/settings';
import { TenantPageHeader } from './components/tenant-page-header';

type TenantSettingsData = {
    id: number;
    name: string;
    slug: string;
    description: string;
    phone: string;
    opening_hours: string;
    is_open: boolean;
    image: string;
    banner_image: string;
    logo_image: string;
    rating: number;
    reviews_count: number;
    midtrans_merchant_id?: string;
    midtrans_client_key?: string;
    has_midtrans_server_key?: boolean;
    midtrans_is_production?: boolean;
    midtrans_is_active?: boolean;
    has_active_midtrans?: boolean;
};

type Props = {
    tenant: TenantSettingsData;
};

export default function TenantSettings({ tenant }: Props) {
    const [name, setName] = useState(tenant?.name || '');
    const [description, setDescription] = useState(tenant?.description || '');
    const [phone, setPhone] = useState(tenant?.phone || '');
    const [openingHours, setOpeningHours] = useState(tenant?.opening_hours || '08:00 - 17:00');
    const [isOpen, setIsOpen] = useState<boolean>(tenant?.is_open ?? true);

    // Banner file & preview
    const [bannerUrl, setBannerUrl] = useState(tenant?.banner_image || '');
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState(tenant?.banner_image || '');

    // Logo file & preview with 1:1 Cropper
    const [logoUrl, setLogoUrl] = useState(tenant?.logo_image || tenant?.image || '');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState(tenant?.logo_image || tenant?.image || '');
    const [rawLogoSrc, setRawLogoSrc] = useState<string>('');
    const [isLogoCropperOpen, setIsLogoCropperOpen] = useState(false);

    // Midtrans Payment Gateway credentials
    const [midtransMerchantId, setMidtransMerchantId] = useState(tenant?.midtrans_merchant_id || '');
    const [midtransClientKey, setMidtransClientKey] = useState(tenant?.midtrans_client_key || '');
    const [midtransServerKey, setMidtransServerKey] = useState('');
    const [midtransIsProduction, setMidtransIsProduction] = useState<boolean>(tenant?.midtrans_is_production ?? false);
    const [midtransIsActive, setMidtransIsActive] = useState<boolean>(tenant?.midtrans_is_active ?? true);
    const [showServerKey, setShowServerKey] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTogglingOpen, setIsTogglingOpen] = useState(false);
    const [isJustSaved, setIsJustSaved] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleBannerFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setBannerFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setBannerPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleLogoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setRawLogoSrc(reader.result as string);
            setIsLogoCropperOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const handleLogoCropComplete = (croppedFile: File, previewUrl: string) => {
        setLogoFile(croppedFile);
        setLogoPreview(previewUrl);
    };

    const handleToggleOpenStatus = () => {
        setIsTogglingOpen(true);
        router.post(
            toggleOpenRoute().url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    const nextOpen = !isOpen;
                    setIsOpen(nextOpen);
                    toast.success(`Status stand berhasil diubah menjadi ${nextOpen ? 'BUKA 🟢' : 'TUTUP 🔴'}!`, {
                        description: nextOpen
                            ? 'Stand Anda sekarang aktif dan dapat menerima pesanan pelanggan.'
                            : 'Stand Anda ditandai tutup di katalog menu.',
                    });
                },
                onError: () => {
                    toast.error('Gagal memperbarui status buka/tutup stand!');
                },
                onFinish: () => {
                    setIsTogglingOpen(false);
                },
            }
        );
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        const payload: Record<string, any> = {
            name,
            description: description.trim() || null,
            phone: phone.trim() || null,
            opening_hours: openingHours.trim() || null,
            is_open: isOpen,
            banner_image: bannerUrl.trim() || null,
            logo_image: logoUrl.trim() || null,
            midtrans_merchant_id: midtransMerchantId.trim() || null,
            midtrans_client_key: midtransClientKey.trim() || null,
            midtrans_is_production: midtransIsProduction,
            midtrans_is_active: midtransIsActive,
        };

        if (midtransServerKey.trim()) {
            payload.midtrans_server_key = midtransServerKey.trim();
        }

        if (bannerFile) {
            payload.banner_file = bannerFile;
        }
        if (logoFile) {
            payload.logo_file = logoFile;
        }

        router.post(updateSettingsRoute().url, payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setIsJustSaved(true);
                setTimeout(() => setIsJustSaved(false), 3000);
                toast.success('Pengaturan stand & pembayaran berhasil disimpan!', {
                    description: 'Profil toko, jam operasional, dan integrasi Midtrans telah diperbarui.',
                });
            },
            onError: (errs) => {
                setIsSubmitting(false);
                setErrors(errs);
                const firstError = Object.values(errs)[0];
                toast.error(firstError || 'Gagal menyimpan pengaturan stand!', {
                    description: 'Silakan periksa kembali formulir input Anda.',
                });
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <>
            <Head title={`Pengaturan Stand: ${tenant.name} - Smart Canteen FEB`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8 w-full">
                <TenantPageHeader
                    icon={Store}
                    iconVariant="amber"
                    title="Pengaturan Stand & Profil Toko"
                    description="Atur banner, logo, status buka/tutup, dan kontak stand."
                    actions={
                        <div className="flex items-center gap-3 bg-muted/40 p-2 rounded-xl border border-border/70">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-foreground">Status Stand</span>
                                <span className={`text-[11px] font-semibold ${isOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                    {isOpen ? '🟢 BUKA' : '🔴 TUTUP'}
                                </span>
                            </div>
                            <Switch
                                checked={isOpen}
                                onCheckedChange={handleToggleOpenStatus}
                                disabled={isTogglingOpen}
                            />
                        </div>
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Settings Form (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        <form id="tenant-settings-form" onSubmit={handleSubmit} className="space-y-6">
                            {/* Banner & Logo Visual Header */}
                            <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs space-y-4">
                                <div className="relative h-44 sm:h-52 w-full bg-muted/50">
                                    {bannerPreview ? (
                                        <img
                                            src={bannerPreview}
                                            alt="Banner Stand"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                            <ImageIcon className="h-10 w-10 opacity-30" />
                                            <span className="ml-2 text-xs">Belum ada banner toko</span>
                                        </div>
                                    )}

                                    {/* Upload Banner Button */}
                                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs rounded-lg p-1">
                                        <label className="cursor-pointer text-[11px] text-white font-semibold flex items-center gap-1.5 px-2.5 py-1 hover:bg-white/20 rounded-md transition-colors">
                                            <Upload className="h-3.5 w-3.5" />
                                            <span>Upload Banner Toko</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleBannerFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {/* Logo Stand Overlay (1:1 Square) */}
                                    <div className="absolute -bottom-6 left-6 flex items-end gap-3">
                                        <div className="relative h-20 w-20 rounded-2xl border-4 border-background bg-card shadow-md overflow-hidden flex items-center justify-center">
                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo Stand"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Building2 className="h-8 w-8 text-muted-foreground" />
                                            )}
                                            <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                                <Upload className="h-5 w-5 text-white" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 pt-8 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="tenant-name" className="text-xs font-semibold">
                                                Nama Stand / Toko Kantin <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="tenant-name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                className="h-10 text-xs sm:text-sm font-bold"
                                            />
                                            {errors.name && (
                                                <span className="text-[11px] text-destructive font-medium">
                                                    {errors.name}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="tenant-phone" className="text-xs font-semibold flex items-center gap-1.5">
                                                <Phone className="h-3.5 w-3.5 text-emerald-500" />
                                                No. WhatsApp / Kontak Stand
                                            </Label>
                                            <Input
                                                id="tenant-phone"
                                                placeholder="Cth: 081234567890"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="h-10 text-xs sm:text-sm font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="tenant-hours" className="text-xs font-semibold flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                                            Jam Operasional Toko
                                        </Label>
                                        <Input
                                            id="tenant-hours"
                                            placeholder="Cth: Senin - Jumat (07:30 - 16:30)"
                                            value={openingHours}
                                            onChange={(e) => setOpeningHours(e.target.value)}
                                            className="h-10 text-xs sm:text-sm"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="tenant-description" className="text-xs font-semibold">
                                            Deskripsi Profil Stand Kantin
                                        </Label>
                                        <Textarea
                                            id="tenant-description"
                                            placeholder="Jelaskan menu andalan stand, lokasi counter di kantin FEB, atau keunikan rasa makanan Anda."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={4}
                                            className="text-xs sm:text-sm resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Midtrans Cashless Gateway Configuration Card */}
                            <div className="rounded-xl border border-border/70 bg-card p-5 sm:p-6 shadow-sm space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-amber-500" />
                                            <span className="text-sm font-bold text-foreground">
                                                Integrasi Pembayaran Cashless (Midtrans)
                                            </span>
                                            {tenant.has_active_midtrans ? (
                                                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                                                    Aktif (Midtrans + Tunai)
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-muted-foreground text-[10px]">
                                                    Eksklusif Tunai (Cash Only)
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Hubungkan akun merchant Midtrans toko Anda untuk menerima pembayaran QRIS, GoPay, ShopeePay, dan VA secara langsung.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 self-start sm:self-auto bg-muted/40 px-3 py-1.5 rounded-lg border border-border/40">
                                        <Label htmlFor="midtrans-active-switch" className="text-xs font-semibold cursor-pointer">
                                            {midtransIsActive ? 'Gateway Aktif' : 'Nonaktif'}
                                        </Label>
                                        <Switch
                                            id="midtrans-active-switch"
                                            checked={midtransIsActive}
                                            onCheckedChange={setMidtransIsActive}
                                        />
                                    </div>
                                </div>

                                {/* Centralized Fee Governance Notice */}
                                <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 flex items-start gap-2.5 text-xs text-blue-700 dark:text-blue-300">
                                    <Info className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
                                    <div className="space-y-1">
                                        <span className="font-semibold block">Tata Kelola Tarif Terpusat (Standardisasi Kampus)</span>
                                        <p className="text-[11px] leading-relaxed text-blue-600 dark:text-blue-300/90">
                                            Biaya Layanan Aplikasi (<code className="font-mono">app_fee</code>) dan Biaya Payment Gateway (<code className="font-mono">channel_fee</code>) dikelola secara terpusat oleh Admin Universitas. Stand Anda tidak perlu membebankan biaya tambahan sepihak kepada mahasiswa.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-1">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="midtrans-merchant-id" className="text-xs font-semibold">
                                                Merchant ID (Opsional)
                                            </Label>
                                            <Input
                                                id="midtrans-merchant-id"
                                                placeholder="Cth: G123456789"
                                                value={midtransMerchantId}
                                                onChange={(e) => setMidtransMerchantId(e.target.value)}
                                                className="h-10 text-xs sm:text-sm font-mono"
                                            />
                                            {errors.midtrans_merchant_id && (
                                                <span className="text-[11px] text-destructive font-medium">
                                                    {errors.midtrans_merchant_id}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="midtrans-mode" className="text-xs font-semibold flex items-center justify-between">
                                                <span>Environment Gateway</span>
                                                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                                                    {midtransIsProduction ? 'Production Live' : 'Sandbox Testing'}
                                                </Badge>
                                            </Label>
                                            <div className="flex items-center justify-between h-10 px-3 rounded-md border border-input bg-background">
                                                <span className="text-xs text-muted-foreground font-medium">
                                                    {midtransIsProduction ? 'Gunakan Transaksi Nyata (Production)' : 'Gunakan Simulasi (Sandbox)'}
                                                </span>
                                                <Switch
                                                    id="midtrans-mode"
                                                    checked={midtransIsProduction}
                                                    onCheckedChange={setMidtransIsProduction}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="midtrans-client-key" className="text-xs font-semibold flex items-center gap-1.5">
                                            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                                            Midtrans Client Key
                                        </Label>
                                        <Input
                                            id="midtrans-client-key"
                                            placeholder="Cth: SB-Mid-client-xxxxxxxxxxxx"
                                            value={midtransClientKey}
                                            onChange={(e) => setMidtransClientKey(e.target.value)}
                                            className="h-10 text-xs sm:text-sm font-mono"
                                        />
                                        {errors.midtrans_client_key && (
                                            <span className="text-[11px] text-destructive font-medium">
                                                {errors.midtrans_client_key}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="midtrans-server-key" className="text-xs font-semibold flex items-center gap-1.5">
                                                <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                                                Midtrans Server Key (Rahasia & Terenkripsi)
                                            </Label>
                                            {tenant.has_midtrans_server_key && !midtransServerKey && (
                                                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                                    ✓ Server key tersimpan rapi
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="midtrans-server-key"
                                                type={showServerKey ? 'text' : 'password'}
                                                placeholder={
                                                    tenant.has_midtrans_server_key
                                                        ? '•••••••••••••••••••••••• (Isi hanya jika ingin mengganti)'
                                                        : 'Cth: SB-Mid-server-xxxxxxxxxxxx'
                                                }
                                                value={midtransServerKey}
                                                onChange={(e) => setMidtransServerKey(e.target.value)}
                                                className="h-10 text-xs sm:text-sm font-mono pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowServerKey(!showServerKey)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                title={showServerKey ? 'Sembunyikan' : 'Tampilkan'}
                                            >
                                                {showServerKey ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.midtrans_server_key && (
                                            <span className="text-[11px] text-destructive font-medium">
                                                {errors.midtrans_server_key}
                                            </span>
                                        )}
                                        <p className="text-[11px] text-muted-foreground">
                                            Server key akan dienkripsi menggunakan standar AES-256 sebelum disimpan di database dan tidak akan pernah dibocorkan ke browser.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`h-10 px-6 gap-2 text-xs font-bold transition-all shadow-sm ${
                                        isJustSaved
                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : isJustSaved ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    <span>
                                        {isSubmitting
                                            ? 'Menyimpan Perubahan...'
                                            : isJustSaved
                                            ? 'Perubahan Berhasil Disimpan!'
                                            : 'Simpan Perubahan Pengaturan & Pembayaran'}
                                    </span>
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Live GoFood ShopeeFood Header Card Preview */}
                    <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-4">
                        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm space-y-4">
                            <span className="text-xs font-bold text-foreground flex items-center gap-1.5 border-b border-border/50 pb-2.5">
                                <Store className="h-4 w-4 text-amber-500" />
                                Tampilan Header Stand di Aplikasi Mahasiswa
                            </span>

                            {/* Store Header Card */}
                            <div className="overflow-hidden rounded-2xl border border-border/80 bg-background shadow-sm">
                                <div className="relative h-32 w-full bg-muted/40">
                                    {bannerPreview ? (
                                        <img src={bannerPreview} alt="Preview Banner" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                                            Header Banner
                                        </div>
                                    )}
                                    <div className="absolute top-2.5 right-2.5">
                                        <Badge
                                            className={`text-[10px] font-bold border-none ${
                                                isOpen
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-rose-500 text-white'
                                            }`}
                                        >
                                            {isOpen ? 'BUKA' : 'TUTUP'}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="p-4 space-y-2 relative pt-6">
                                    <div className="absolute -top-7 left-4 h-12 w-12 rounded-xl border-2 border-background bg-card overflow-hidden shadow-sm">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                                        ) : (
                                            <Utensils className="h-6 w-6 m-auto text-muted-foreground" />
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <h3 className="font-extrabold text-base text-foreground line-clamp-1">
                                            {name || 'Nama Stand Toko'}
                                        </h3>
                                        <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs font-bold">
                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                            <span>{tenant.rating.toFixed(1)}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {description || 'Deskripsi profil toko stand kantin.'}
                                    </p>

                                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3 text-amber-500" />
                                            {openingHours || '08:00 - 17:00'}
                                        </span>
                                        <span>{phone || 'WhatsApp Stand'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ImageCropperModal
                isOpen={isLogoCropperOpen}
                onClose={() => setIsLogoCropperOpen(false)}
                imageSrc={rawLogoSrc}
                onCropComplete={handleLogoCropComplete}
                title="Potong Logo Stand 1:1 (Presisi Square)"
            />
        </>
    );
}

TenantSettings.layout = {
    breadcrumbs: [
        {
            title: 'Tenant Dashboard',
            href: '/tenant/dashboard',
        },
        {
            title: 'Pengaturan Stand',
            href: '/tenant/settings',
        },
    ],
};
