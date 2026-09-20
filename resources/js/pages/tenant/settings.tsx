import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import {
    Building2,
    Clock,
    Image as ImageIcon,
    Loader2,
    Phone,
    Save,
    Settings,
    Star,
    Store,
    Upload,
    Utensils,
    X,
} from 'lucide-react';
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

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTogglingOpen, setIsTogglingOpen] = useState(false);
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
                    setIsOpen(!isOpen);
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
        };

        if (bannerFile) {
            payload.banner_file = bannerFile;
        }
        if (logoFile) {
            payload.logo_file = logoFile;
        }

        router.post(updateSettingsRoute().url, payload, {
            forceFormData: true,
            preserveScroll: true,
            onError: (errs) => {
                setIsSubmitting(false);
                setErrors(errs);
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

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-10 px-6 gap-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    <span>Simpan Perubahan Profil Stand</span>
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
