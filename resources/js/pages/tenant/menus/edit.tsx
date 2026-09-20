import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    Edit2,
    Image as ImageIcon,
    Loader2,
    Plus,
    Save,
    Sparkles,
    Star,
    Tag,
    Trash2,
    Upload,
    Utensils,
    X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { menus as menusIndexRoute } from '@/routes/tenant';
import { update as updateMenuRoute } from '@/routes/tenant/menus';
import type { MenuOptionGroup, TenantMenuItem } from '../types';

type Props = {
    menu: TenantMenuItem;
    categories: { id: number; name: string }[];
};

import { ImageCropperModal } from '@/components/image-cropper-modal';

export default function TenantMenusEdit({ menu, categories = [] }: Props) {
    const [name, setName] = useState(menu?.name || '');
    const [categoryId, setCategoryId] = useState<string>(
        menu?.category_id ? String(menu.category_id) : 'none'
    );
    const [globalCategory, setGlobalCategory] = useState<string>(
        (menu as any)?.global_category || 'makanan'
    );
    const [description, setDescription] = useState(menu?.description || '');
    const [price, setPrice] = useState(String(menu?.price || '0'));
    const [originalPrice, setOriginalPrice] = useState(
        menu?.original_price ? String(menu.original_price) : ''
    );
    const [isAvailable, setIsAvailable] = useState<boolean>(Boolean(menu?.is_available));
    const [isRecommended, setIsRecommended] = useState<boolean>(Boolean(menu?.is_recommended));
    const [estimatedTime, setEstimatedTime] = useState(String(menu?.estimated_time || 15));

    // Image handling states
    const [imageMode, setImageMode] = useState<'upload' | 'url'>('url');
    const [imageUrl, setImageUrl] = useState(menu?.image || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(menu?.image || '');
    const [rawFileSrc, setRawFileSrc] = useState<string>('');
    const [isCropperOpen, setIsCropperOpen] = useState(false);

    const [options, setOptions] = useState<MenuOptionGroup[]>(menu?.options || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (menu) {
            setName(menu.name || '');
            setCategoryId(menu.category_id ? String(menu.category_id) : 'none');
            setDescription(menu.description || '');
            setPrice(String(menu.price || '0'));
            setOriginalPrice(menu.original_price ? String(menu.original_price) : '');
            setIsAvailable(Boolean(menu.is_available));
            setIsRecommended(Boolean(menu.is_recommended));
            setEstimatedTime(String(menu.estimated_time || 15));
            setImageUrl(menu.image || '');
            setImagePreview(menu.image || '');
            setOptions(menu.options || []);
        }
    }, [menu]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setRawFileSrc(reader.result as string);
            setIsCropperOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = (croppedFile: File, previewUrl: string) => {
        setImageFile(croppedFile);
        setImagePreview(previewUrl);
    };

    const handleRemoveFile = () => {
        setImageFile(null);
        setImagePreview(menu?.image || '');
        setRawFileSrc('');
    };

    const selectedCategoryName =
        categories.find((c) => String(c.id) === categoryId)?.name ?? menu?.category_name ?? 'Tanpa Kategori';

    const handleAddOptionGroup = () => {
        setOptions([
            ...options,
            {
                name: 'Level Pedas / Topping',
                type: 'radio',
                required: true,
                choices: [
                    { name: 'Normal', price: 0 },
                    { name: 'Extra Pedas', price: 2000 },
                ],
            },
        ]);
    };

    const handleRemoveOptionGroup = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleOptionGroupNameChange = (index: number, val: string) => {
        const updated = [...options];
        updated[index].name = val;
        setOptions(updated);
    };

    const handleAddChoice = (groupIndex: number) => {
        const updated = [...options];
        updated[groupIndex].choices.push({ name: 'Pilihan Baru', price: 0 });
        setOptions(updated);
    };

    const handleRemoveChoice = (groupIndex: number, choiceIndex: number) => {
        const updated = [...options];
        updated[groupIndex].choices = updated[groupIndex].choices.filter((_, cI) => cI !== choiceIndex);
        setOptions(updated);
    };

    const handleChoiceNameChange = (groupIndex: number, choiceIndex: number, val: string) => {
        const updated = [...options];
        updated[groupIndex].choices[choiceIndex].name = val;
        setOptions(updated);
    };

    const handleChoicePriceChange = (groupIndex: number, choiceIndex: number, val: string) => {
        const updated = [...options];
        updated[groupIndex].choices[choiceIndex].price = Number(val) || 0;
        setOptions(updated);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        const payload: Record<string, any> = {
            _method: 'put',
            name,
            category_id: categoryId === 'none' ? null : Number(categoryId),
            global_category: globalCategory,
            description: description.trim() || null,
            price: Number(price),
            original_price: originalPrice ? Number(originalPrice) : null,
            is_available: isAvailable,
            is_recommended: isRecommended,
            estimated_time: Number(estimatedTime) || 15,
            options: options.length > 0 ? options : null,
        };

        if (imageMode === 'upload' && imageFile) {
            payload.image_file = imageFile;
        } else if (imageMode === 'url') {
            payload.image = imageUrl.trim() || null;
        }

        router.post(
            updateMenuRoute.url(menu.id),
            payload,
            {
                forceFormData: true,
                preserveScroll: true,
                onError: (errs) => {
                    setIsSubmitting(false);
                    setErrors(errs);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    const numPrice = Number(price) || 0;
    const numOrigPrice = Number(originalPrice) || 0;
    const formattedPrice = `Rp ${numPrice.toLocaleString('id-ID')}`;
    const formattedOriginalPrice = numOrigPrice > 0 ? `Rp ${numOrigPrice.toLocaleString('id-ID')}` : null;
    const displayPreviewImage = imageMode === 'upload' ? imagePreview : imageUrl;

    return (
        <>
            <Head title={`Edit Menu: ${menu.name} - Smart Canteen FEB`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8 w-full">
                {/* Navigation Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={menusIndexRoute.url()}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground flex items-center gap-1.5">
                                <span className="truncate max-w-[180px] sm:max-w-none">Edit: {menu.name}</span>
                                <Edit2 className="h-4 w-4 text-blue-500 shrink-0" />
                            </h1>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Perbarui informasi harga, diskon, foto thumbnail, dan varian add-on menu.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Link href={menusIndexRoute.url()}>
                            <Button variant="outline" size="sm" className="h-9 text-xs">
                                Batal
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            form="edit-menu-form"
                            size="sm"
                            disabled={isSubmitting}
                            className="h-9 gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            <span>Simpan Perubahan</span>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Form Editor (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        <form id="edit-menu-form" onSubmit={handleSubmit} className="space-y-6">
                            {/* Card 1: Informasi Dasar */}
                            <div className="rounded-xl border border-border/70 bg-card p-6 shadow-xs space-y-4">
                                <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                                    <Utensils className="h-5 w-5 text-blue-500" />
                                    <h2 className="font-bold text-base text-foreground">Detail Utama Menu</h2>
                                </div>

                                <div className="space-y-4 text-xs sm:text-sm">
                                    {/* Nama Menu */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="menu-name" className="text-xs font-semibold">
                                            Nama Menu Makanan / Minuman <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="menu-name"
                                            placeholder="Cth: Nasi Ayam Geprek Sambal Korek Spesial"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="h-10 text-xs sm:text-sm"
                                        />
                                        {errors.name && (
                                            <span className="text-[11px] text-destructive font-medium">
                                                {errors.name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Kategori Menu */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="menu-category" className="text-xs font-semibold">
                                                Kategori Menu
                                            </Label>
                                            <Select value={categoryId} onValueChange={setCategoryId}>
                                                <SelectTrigger id="menu-category" className="h-10 text-xs sm:text-sm">
                                                    <SelectValue placeholder="Pilih Kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Tanpa Kategori</SelectItem>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Est Waktu Memasak */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="menu-time" className="text-xs font-semibold flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5 text-amber-500" />
                                                Waktu Est. Memasak (Menit)
                                            </Label>
                                            <Input
                                                id="menu-time"
                                                type="number"
                                                min="1"
                                                max="120"
                                                placeholder="15"
                                                value={estimatedTime}
                                                onChange={(e) => setEstimatedTime(e.target.value)}
                                                className="h-10 text-xs sm:text-sm font-mono"
                                            />
                                        </div>
                                    </div>

                                    {/* Deskripsi */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="menu-description" className="text-xs font-semibold">
                                            Deskripsi Menu / Komposisi
                                        </Label>
                                        <Textarea
                                            id="menu-description"
                                            placeholder="Cth: Nasi putih hangat disajikan dengan ayam goreng renyah digeprek sambal korek pedas gurih, timun dan tempe."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={3}
                                            className="text-xs sm:text-sm resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Harga & Promo Diskon */}
                            <div className="rounded-xl border border-border/70 bg-card p-6 shadow-xs space-y-4">
                                <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                                    <Tag className="h-5 w-5 text-emerald-500" />
                                    <h2 className="font-bold text-base text-foreground">Harga Porsi & Diskon</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                                    {/* Harga Jual */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="menu-price" className="text-xs font-semibold">
                                            Harga Jual (Rp) <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="menu-price"
                                            type="number"
                                            min="0"
                                            step="500"
                                            placeholder="Cth: 15000"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required
                                            className="h-10 text-xs sm:text-sm font-mono"
                                        />
                                        {errors.price && (
                                            <span className="text-[11px] text-destructive font-medium">
                                                {errors.price}
                                            </span>
                                        )}
                                    </div>

                                    {/* Harga Asli Coret */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="menu-original-price" className="text-xs font-semibold flex items-center justify-between">
                                            <span>Harga Asli Coret (Opsional)</span>
                                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">Badge Promo</span>
                                        </Label>
                                        <Input
                                            id="menu-original-price"
                                            type="number"
                                            min="0"
                                            step="500"
                                            placeholder="Cth: 20000 (Tampil Coret)"
                                            value={originalPrice}
                                            onChange={(e) => setOriginalPrice(e.target.value)}
                                            className="h-10 text-xs sm:text-sm font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Foto & Status Menu */}
                            <div className="rounded-xl border border-border/70 bg-card p-6 shadow-xs space-y-4">
                                <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                                    <ImageIcon className="h-5 w-5 text-blue-500" />
                                    <h2 className="font-bold text-base text-foreground">Foto Makanan & Status Stand</h2>
                                </div>

                                <div className="space-y-4 text-xs sm:text-sm">
                                    {/* Dual Mode Foto Selector */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-semibold">Foto Thumbnail Menu</Label>
                                            <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border">
                                                <button
                                                    type="button"
                                                    onClick={() => setImageMode('upload')}
                                                    className={`px-2.5 py-1 text-[11px] rounded-md font-medium transition-colors ${
                                                        imageMode === 'upload'
                                                            ? 'bg-background text-foreground shadow-2xs font-semibold'
                                                            : 'text-muted-foreground hover:text-foreground'
                                                    }`}
                                                >
                                                    Upload File Foto
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setImageMode('url')}
                                                    className={`px-2.5 py-1 text-[11px] rounded-md font-medium transition-colors ${
                                                        imageMode === 'url'
                                                            ? 'bg-background text-foreground shadow-2xs font-semibold'
                                                            : 'text-muted-foreground hover:text-foreground'
                                                    }`}
                                                >
                                                    Gunakan URL External
                                                </button>
                                            </div>
                                        </div>

                                        {imageMode === 'upload' ? (
                                            <div className="space-y-2">
                                                <div className="border-2 border-dashed border-border/80 hover:border-primary/50 rounded-xl p-6 text-center transition-colors bg-muted/10 relative">
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                                        onChange={handleFileChange}
                                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                    />
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                                                            <Upload className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-xs text-foreground">
                                                                Klik atau tarik file gambar baru ke sini
                                                            </span>
                                                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                                                Format JPG, PNG, WEBP (Maksimal 5 MB)
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {imagePreview && (
                                                    <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/30">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Upload Preview"
                                                                className="h-12 w-12 rounded-lg object-cover border"
                                                            />
                                                            <div>
                                                                <span className="text-xs font-semibold text-foreground">
                                                                    {imageFile?.name ?? 'Foto Menu Saat Ini'}
                                                                </span>
                                                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                                                    {imageFile ? 'Siap diperbarui ke server' : 'Foto saat ini aktif'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {imageFile && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={handleRemoveFile}
                                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-1.5">
                                                <Input
                                                    placeholder="https://images.unsplash.com/photo-..."
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                    className="h-10 text-xs font-mono"
                                                />
                                            </div>
                                        )}

                                        {errors.image_file && (
                                            <span className="text-[11px] text-destructive font-medium">
                                                {errors.image_file}
                                            </span>
                                        )}
                                        {errors.image && (
                                            <span className="text-[11px] text-destructive font-medium">
                                                {errors.image}
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {/* Kategori Utama (Global) */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="menu-global-category" className="text-xs font-semibold flex items-center gap-1">
                                                <Tag className="h-3.5 w-3.5 text-primary" />
                                                <span>Kategori Utama (Global)</span>
                                                <span className="text-destructive">*</span>
                                            </Label>
                                            <Select
                                                value={globalCategory}
                                                onValueChange={(val) => setGlobalCategory(val)}
                                            >
                                                <SelectTrigger id="menu-global-category" className="h-10 text-xs sm:text-sm">
                                                    <SelectValue placeholder="Pilih Kategori Utama" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="makanan">🍽️ Makanan (Nasi, Ayam, Mie, Soto, Daging, dll)</SelectItem>
                                                    <SelectItem value="minuman">🥤 Minuman (Es, Jus, Boba, Susu, Soda, dll)</SelectItem>
                                                    <SelectItem value="snack">🍟 Snack & Cemilan (Roti, Pisang, Siomay, Gorengan, dll)</SelectItem>
                                                    <SelectItem value="dessert">🍦 Dessert & Manis (Es Krim, Pudding, Cake, Waffle, dll)</SelectItem>
                                                    <SelectItem value="sarapan">🍳 Sarapan (Bubur, Lontong, Nasi Uduk, Roti, dll)</SelectItem>
                                                    <SelectItem value="kopi">☕ Kopi & Teh (Espresso, Latte, Matcha, Teh, dll)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.global_category && (
                                                <span className="text-[11px] text-destructive font-medium">
                                                    {errors.global_category}
                                                </span>
                                            )}
                                        </div>

                                        {/* Status Stok */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="menu-available" className="text-xs font-semibold">
                                                Status Stok Ketersediaan
                                            </Label>
                                            <Select
                                                value={isAvailable ? '1' : '0'}
                                                onValueChange={(val) => setIsAvailable(val === '1')}
                                            >
                                                <SelectTrigger id="menu-available" className="h-10 text-xs sm:text-sm">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Ready / Stok Tersedia</SelectItem>
                                                    <SelectItem value="0">Stok Habis (Out of Stock)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Best Seller / Rekomendasi */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="menu-recommended" className="text-xs font-semibold flex items-center gap-1">
                                                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                                Rekomendasi Stand
                                            </Label>
                                            <Select
                                                value={isRecommended ? '1' : '0'}
                                                onValueChange={(val) => setIsRecommended(val === '1')}
                                            >
                                                <SelectTrigger id="menu-recommended" className="h-10 text-xs sm:text-sm">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">⭐ Ya (Tandai Best Seller)</SelectItem>
                                                    <SelectItem value="0">Tidak (Menu Biasa)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Add-On & Varian Editor */}
                            <div className="rounded-xl border border-border/70 bg-card p-6 shadow-xs space-y-4">
                                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Plus className="h-5 w-5 text-purple-500" />
                                        <div>
                                            <h2 className="font-bold text-base text-foreground">Kelompok Add-On & Varian</h2>
                                            <p className="text-xs text-muted-foreground">Pilihan level pedas, topping ekstra, atau varian rasa saat mahasiswa memesan.</p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddOptionGroup}
                                        className="h-9 text-xs gap-1.5 border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Tambah Kelompok Varian</span>
                                    </Button>
                                </div>

                                {options.length === 0 ? (
                                    <div className="p-8 text-center border border-dashed rounded-xl bg-muted/20 text-muted-foreground">
                                        <p className="text-sm font-medium">Belum ada kelompok varian/add-on.</p>
                                        <p className="text-xs mt-1">Klik tombol "+ Tambah Kelompok Varian" di atas untuk menambahkan (misal: Level Pedas, Extra Topping).</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {options.map((group, groupIdx) => (
                                            <div key={groupIdx} className="p-4 border border-border/80 rounded-xl bg-muted/20 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        value={group.name}
                                                        onChange={(e) => handleOptionGroupNameChange(groupIdx, e.target.value)}
                                                        placeholder="Nama Kelompok Varian (Cth: Level Pedas)"
                                                        className="h-10 text-xs sm:text-sm font-bold bg-background flex-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveOptionGroup(groupIdx)}
                                                        className="h-10 text-xs text-destructive hover:bg-destructive/10 gap-1 px-3"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span>Hapus Group</span>
                                                    </Button>
                                                </div>

                                                <div className="space-y-2 pt-2 border-t border-border/40">
                                                    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                                                        <span>Opsi Pilihan (Choices)</span>
                                                        <span>Harga Tambahan (Rp)</span>
                                                    </div>

                                                    {group.choices.map((choice, choiceIdx) => (
                                                        <div key={choiceIdx} className="flex items-center gap-2">
                                                            <Input
                                                                value={choice.name}
                                                                onChange={(e) => handleChoiceNameChange(groupIdx, choiceIdx, e.target.value)}
                                                                placeholder="Nama Pilihan (Cth: Level 1 / Keju)"
                                                                className="h-9 text-xs bg-background flex-1"
                                                            />
                                                            <div className="flex items-center gap-1.5 w-36">
                                                                <span className="text-xs text-muted-foreground">+</span>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="500"
                                                                    value={choice.price}
                                                                    onChange={(e) => handleChoicePriceChange(groupIdx, choiceIdx, e.target.value)}
                                                                    placeholder="0"
                                                                    className="h-9 text-xs font-mono bg-background"
                                                                />
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRemoveChoice(groupIdx, choiceIdx)}
                                                                className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    ))}

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleAddChoice(groupIdx)}
                                                        className="h-8 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 gap-1 mt-1"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                        <span>Tambah Opsi Pilihan</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Live GoFood Preview Card (4 cols) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-4">
                        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-border/50 pb-3">
                                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                    <Sparkles className="h-4 w-4 text-amber-500" />
                                    Live Preview Tampilan Mahasiswa
                                </span>
                                <Badge variant="outline" className="text-[10px] font-normal">
                                    GoFood Style
                                </Badge>
                            </div>

                            {/* Food Card Preview */}
                            <div className="overflow-hidden rounded-xl border border-border/80 bg-background shadow-xs transition-all">
                                <div className="relative h-48 w-full bg-muted/40 overflow-hidden">
                                    {displayPreviewImage ? (
                                        <img
                                            src={displayPreviewImage}
                                            alt={name || 'Preview Menu'}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLElement).style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                            <Utensils className="h-12 w-12 opacity-30" />
                                        </div>
                                    )}

                                    {/* Badges Overlay */}
                                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                                        {isRecommended && (
                                            <Badge className="bg-amber-500 text-white dark:bg-amber-600 border-none text-[10px] font-bold shadow-xs gap-1">
                                                <Star className="h-3 w-3 fill-amber-200" />
                                                <span>Best Seller</span>
                                            </Badge>
                                        )}
                                        {numOrigPrice > numPrice && (
                                            <Badge className="bg-rose-500 text-white border-none text-[10px] font-bold shadow-xs">
                                                PROMO DISKON
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                                        <Clock className="h-3 w-3 text-amber-400" />
                                        <span>{estimatedTime || 15}m</span>
                                    </div>
                                </div>

                                <div className="p-4 space-y-2.5">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground mb-1">
                                                {selectedCategoryName}
                                            </Badge>
                                            <h3 className="font-bold text-base text-foreground line-clamp-1">
                                                {name || 'Nama Menu Makanan'}
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-8">
                                        {description || 'Deskripsi singkat komposisi porsi makanan.'}
                                    </p>

                                    <div className="pt-2.5 border-t border-border/50 flex items-center justify-between">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="font-mono font-bold text-lg text-foreground">
                                                {formattedPrice}
                                            </span>
                                            {formattedOriginalPrice && (
                                                <span className="font-mono text-xs text-muted-foreground line-through">
                                                    {formattedOriginalPrice}
                                                </span>
                                            )}
                                        </div>

                                        <Badge
                                            variant={isAvailable ? 'secondary' : 'outline'}
                                            className={`text-[10px] ${
                                                isAvailable
                                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                            }`}
                                        >
                                            {isAvailable ? 'Ready Stock' : 'Stok Habis'}
                                        </Badge>
                                    </div>

                                    {/* Options Summary Preview */}
                                    {options.length > 0 && (
                                        <div className="mt-2 pt-2.5 border-t border-border/40 space-y-1.5">
                                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                                                {options.length} Kelompok Varian / Add-on:
                                            </span>
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {options.map((opt, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-[10px] bg-muted px-2 py-0.5 rounded-md text-foreground font-medium"
                                                    >
                                                        {opt.name} ({opt.choices.length})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ImageCropperModal
                isOpen={isCropperOpen}
                onClose={() => setIsCropperOpen(false)}
                imageSrc={rawFileSrc}
                onCropComplete={handleCropComplete}
                title="Potong Foto Menu 1:1 (Presisi Square)"
            />
        </>
    );
}

TenantMenusEdit.layout = {
    breadcrumbs: [
        {
            title: 'Tenant Dashboard',
            href: '/tenant/dashboard',
        },
        {
            title: 'Kelola Menu Stand',
            href: '/tenant/menus',
        },
        {
            title: 'Edit Data Menu',
            href: '#',
        },
    ],
};
