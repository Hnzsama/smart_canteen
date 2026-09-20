import { useState, type FormEvent } from 'react';
import { router } from '@inertiajs/react';
import { Clock, Image as ImageIcon, Loader2, Plus, Star, Trash2, Utensils } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { store as storeMenuRoute } from '@/routes/tenant/menus';
import type { MenuOptionGroup } from '../../types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    categories: { id: number; name: string }[];
};

export function MenuCreateDialog({ isOpen, onClose, categories }: Props) {
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState<string>('none');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [isAvailable, setIsAvailable] = useState<boolean>(true);
    const [isRecommended, setIsRecommended] = useState<boolean>(false);
    const [estimatedTime, setEstimatedTime] = useState('15');
    const [image, setImage] = useState('');
    const [options, setOptions] = useState<MenuOptionGroup[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const resetForm = () => {
        setName('');
        setCategoryId('none');
        setDescription('');
        setPrice('');
        setOriginalPrice('');
        setIsAvailable(true);
        setIsRecommended(false);
        setEstimatedTime('15');
        setImage('');
        setOptions([]);
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

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

        router.post(
            storeMenuRoute.url(),
            {
                name,
                category_id: categoryId === 'none' ? null : Number(categoryId),
                description: description.trim() || null,
                price: Number(price),
                original_price: originalPrice ? Number(originalPrice) : null,
                is_available: isAvailable,
                is_recommended: isRecommended,
                estimated_time: Number(estimatedTime) || 15,
                image: image.trim() || null,
                options: options.length > 0 ? options : null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    handleClose();
                },
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

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-xl max-h-[85vh] p-0 flex flex-col gap-0 overflow-hidden">
                {/* Fixed Header */}
                <DialogHeader className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                            <Utensils className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-foreground">
                                Tambah Menu Baru Stand
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                Daftarkan menu baru dengan foto thumbnail, harga porsi, diskon, dan add-on.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto">
                    <ScrollArea className="h-[calc(85vh-130px)] px-4 py-4 sm:px-5">
                        <form id="create-menu-form" onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm pb-6">
                            {/* URL Gambar Thumbnail */}
                            <div className="space-y-1.5">
                                <Label htmlFor="create-menu-image" className="text-xs font-semibold flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        <ImageIcon className="h-3.5 w-3.5 text-primary" />
                                        URL Foto Makanan (Thumbnail GoFood)
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-normal">Unsplash / Image URL</span>
                                </Label>
                                <Input
                                    id="create-menu-image"
                                    placeholder="https://images.unsplash.com/photo-..."
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    className="h-9 text-xs font-mono"
                                />
                                {image && (
                                    <div className="flex items-center gap-3 p-2.5 border border-border/70 rounded-xl bg-muted/30">
                                        <img
                                            src={image}
                                            alt="Preview"
                                            className="h-12 w-12 rounded-lg object-cover border border-border"
                                            onError={(e) => {
                                                (e.target as HTMLElement).style.display = 'none';
                                            }}
                                        />
                                        <span className="text-xs text-muted-foreground">Preview foto thumbnail menu</span>
                                    </div>
                                )}
                            </div>

                            {/* Nama Menu */}
                            <div className="space-y-1.5">
                                <Label htmlFor="create-menu-name" className="text-xs font-semibold">
                                    Nama Menu Makanan / Minuman <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="create-menu-name"
                                    placeholder="Cth: Nasi Ayam Geprek Sambal Korek"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="h-9 text-xs"
                                />
                                {errors.name && (
                                    <span className="text-[11px] text-destructive font-medium">{errors.name}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Kategori Menu */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="create-menu-category" className="text-xs font-semibold">
                                        Kategori Menu
                                    </Label>
                                    <Select value={categoryId} onValueChange={setCategoryId}>
                                        <SelectTrigger id="create-menu-category" className="h-9 text-xs">
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

                                {/* Waktu Est. Memasak */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="create-menu-time" className="text-xs font-semibold flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                                        Est. Memasak (Menit)
                                    </Label>
                                    <Input
                                        id="create-menu-time"
                                        type="number"
                                        min="1"
                                        max="120"
                                        placeholder="15"
                                        value={estimatedTime}
                                        onChange={(e) => setEstimatedTime(e.target.value)}
                                        className="h-9 text-xs font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Harga Jual */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="create-menu-price" className="text-xs font-semibold">
                                        Harga Jual Porsi (Rp) <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="create-menu-price"
                                        type="number"
                                        min="0"
                                        step="500"
                                        placeholder="Cth: 15000"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                        className="h-9 text-xs font-mono"
                                    />
                                </div>

                                {/* Harga Asli Coret (Diskon) */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="create-menu-original-price" className="text-xs font-semibold">
                                        Harga Asli Coret (Diskon)
                                    </Label>
                                    <Input
                                        id="create-menu-original-price"
                                        type="number"
                                        min="0"
                                        step="500"
                                        placeholder="Cth: 20000"
                                        value={originalPrice}
                                        onChange={(e) => setOriginalPrice(e.target.value)}
                                        className="h-9 text-xs font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Status Stok */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="create-menu-availability" className="text-xs font-semibold">
                                        Status Stok Ketersediaan
                                    </Label>
                                    <Select
                                        value={isAvailable ? '1' : '0'}
                                        onValueChange={(val) => setIsAvailable(val === '1')}
                                    >
                                        <SelectTrigger id="create-menu-availability" className="h-9 text-xs">
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
                                    <Label htmlFor="create-menu-recommended" className="text-xs font-semibold flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                        Rekomendasi Stand
                                    </Label>
                                    <Select
                                        value={isRecommended ? '1' : '0'}
                                        onValueChange={(val) => setIsRecommended(val === '1')}
                                    >
                                        <SelectTrigger id="create-menu-recommended" className="h-9 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">⭐ Ya (Tandai Best Seller)</SelectItem>
                                            <SelectItem value="0">Tidak (Menu Biasa)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Deskripsi Menu */}
                            <div className="space-y-1.5">
                                <Label htmlFor="create-menu-description" className="text-xs font-semibold">
                                    Deskripsi Singkat / Komposisi
                                </Label>
                                <Textarea
                                    id="create-menu-description"
                                    placeholder="Cth: Nasi putih hangat + ayam geprek krispi + sambal korek pedas gurih."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={2}
                                    className="text-xs resize-none"
                                />
                            </div>

                            {/* Add-on & Varian Section */}
                            <div className="space-y-3 pt-3 border-t border-border/60">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-xs text-foreground">Pilihan Add-On & Varian</h4>
                                        <p className="text-[11px] text-muted-foreground">Level pedas, topping ekstra, atau ukuran porsi.</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddOptionGroup}
                                        className="h-8 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        <span>Tambah Kelompok</span>
                                    </Button>
                                </div>

                                {options.map((group, groupIdx) => (
                                    <div key={groupIdx} className="p-3.5 border border-border/80 rounded-xl bg-muted/20 space-y-3 shadow-2xs">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={group.name}
                                                onChange={(e) => handleOptionGroupNameChange(groupIdx, e.target.value)}
                                                placeholder="Nama Kelompok (Cth: Level Pedas)"
                                                className="h-8 text-xs font-bold bg-background flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveOptionGroup(groupIdx)}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="space-y-2 pl-2 border-l-2 border-primary/30">
                                            {group.choices.map((choice, choiceIdx) => (
                                                <div key={choiceIdx} className="flex items-center gap-2">
                                                    <Input
                                                        value={choice.name}
                                                        onChange={(e) => handleChoiceNameChange(groupIdx, choiceIdx, e.target.value)}
                                                        placeholder="Nama Varian (Cth: Extra Pedas)"
                                                        className="h-8 text-xs bg-background flex-1"
                                                    />
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        <span className="text-xs font-mono text-muted-foreground">+Rp</span>
                                                        <Input
                                                            type="number"
                                                            value={choice.price}
                                                            onChange={(e) => handleChoicePriceChange(groupIdx, choiceIdx, e.target.value)}
                                                            placeholder="0"
                                                            className="h-8 w-24 text-xs font-mono bg-background"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveChoice(groupIdx, choiceIdx)}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
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
                                                className="h-7 text-xs text-primary gap-1 px-2 hover:bg-primary/10 font-medium"
                                            >
                                                <Plus className="h-3.5 w-3.5" /> Tambah Pilihan Varian
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </form>
                    </ScrollArea>
                </div>

                {/* Fixed Footer */}
                <DialogFooter className="p-4 sm:p-5 border-t border-border/60 bg-muted/20 shrink-0 flex items-center justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={handleClose} className="h-9 text-xs">
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        form="create-menu-form"
                        size="sm"
                        disabled={isSubmitting}
                        className="h-9 gap-1.5 text-xs font-semibold"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="h-4 w-4" />
                        )}
                        <span>Simpan Menu Baru</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
