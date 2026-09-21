import React from 'react';
import {
    Ban,
    Clock,
    Flame,
    Minus,
    Package,
    Plus,
    ShoppingBag,
    Snowflake,
    Soup,
    Sparkles,
    Star,
    Store,
    UtensilsCrossed,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MenuItem } from '../types';

type MenuOptionsDialogProps = {
    selectedMenuModal: MenuItem | null;
    foodFallback: string;
    selectedChoices: Record<string, { name: string; price: number }>;
    setSelectedChoices: React.Dispatch<React.SetStateAction<Record<string, { name: string; price: number }>>>;
    itemQuantity: number;
    setItemQuantity: React.Dispatch<React.SetStateAction<number>>;
    orderNote: string;
    setOrderNote: (note: string) => void;
    onClose: () => void;
    onAddToCart: () => void;
    calculateModalTotalPrice: () => number;
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

export default function MenuOptionsDialog({
    selectedMenuModal,
    foodFallback,
    selectedChoices,
    setSelectedChoices,
    itemQuantity,
    setItemQuantity,
    orderNote,
    setOrderNote,
    onClose,
    onAddToCart,
    calculateModalTotalPrice,
}: MenuOptionsDialogProps) {
    const togglePresetNote = (presetText: string) => {
        if (orderNote.includes(presetText)) {
            setOrderNote(
                orderNote
                    .replace(presetText, '')
                    .replace(/,\s*,/g, ',')
                    .replace(/^,\s*/, '')
                    .replace(/,\s*$/, '')
                    .trim()
            );
        } else {
            setOrderNote(orderNote ? `${orderNote}, ${presetText}` : presetText);
        }
    };

    const handleAddWithToast = () => {
        if (!selectedMenuModal) return;
        if (selectedMenuModal.is_tenant_open === false) {
            toast.error('Stand ini sedang tutup!', {
                description: 'Anda tidak dapat memesan dari stand yang sedang tutup.',
            });
            return;
        }
        toast.success(`${selectedMenuModal.name} (${itemQuantity} porsi) ditambahkan!`, {
            description: 'Menu tersimpan di keranjang belanja.',
        });
        onAddToCart();
    };

    return (
        <Dialog open={Boolean(selectedMenuModal)} onOpenChange={(open) => !open && onClose()}>
            {selectedMenuModal && (
                <DialogContent className="w-[calc(100%-1.5rem)] max-w-[390px] rounded-[28px] p-0 overflow-hidden shadow-2xl border-border/80 gap-0 [&>button[data-slot=dialog-close]]:hidden">
                    {/* Hero Food Image Header */}
                    <div className="relative h-48 w-full bg-muted overflow-hidden">
                        <img
                            src={selectedMenuModal.image || foodFallback}
                            alt={selectedMenuModal.name}
                            className={`h-full w-full object-cover ${selectedMenuModal.is_tenant_open === false ? 'grayscale opacity-75' : ''}`}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = foodFallback;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-black/50 pointer-events-none" />

                        {/* Top Badges Overlay */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                            {selectedMenuModal.is_tenant_open === false ? (
                                <Badge variant="destructive" className="text-[10px] font-black bg-rose-600 text-white border-none shadow-sm">
                                    STAND TUTUP
                                </Badge>
                            ) : (
                                <>
                                    {selectedMenuModal.is_recommended && (
                                        <Badge variant="default" className="text-[10px] font-black bg-amber-500 text-slate-950 border-none shadow-sm gap-1">
                                            <Star className="size-3 fill-current" />
                                            Hits
                                        </Badge>
                                    )}
                                    <Badge variant="secondary" className="text-[10px] font-bold bg-black/50 text-white backdrop-blur-md border border-white/20 gap-1 font-mono">
                                        <Clock className="size-3 text-amber-400" />
                                        {selectedMenuModal.estimated_time} mnt
                                    </Badge>
                                </>
                            )}
                        </div>

                        {/* Glass Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-3.5 right-3.5 z-10 size-8 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md flex items-center justify-center transition-all active:scale-90 border border-white/20 shadow-md"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    {/* Scrollable Body Content with Hidden Scrollbars */}
                    <div className="p-4 space-y-4 max-h-[56vh] overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {/* Closed Stand Notice Banner */}
                        {selectedMenuModal.is_tenant_open === false && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2 text-rose-500 text-xs font-bold">
                                <Ban className="size-4 shrink-0 text-rose-500" />
                                <span>Stand ini sedang TUTUP. Penjual tidak menerima pesanan saat ini.</span>
                            </div>
                        )}

                        {/* Title & Tenant Info Header */}
                        <div className="space-y-1 border-b border-border/60 pb-3">
                            <span className="text-[10px] font-black text-primary uppercase tracking-wider flex items-center gap-1">
                                <Store className="size-3 text-primary" />
                                {selectedMenuModal.tenant_name}
                            </span>
                            <div className="flex items-start justify-between gap-2">
                                <DialogTitle className="text-base font-black text-foreground tracking-tight leading-snug">
                                    {selectedMenuModal.name}
                                </DialogTitle>
                                <span className="font-mono text-base font-black text-primary shrink-0">
                                    Rp {selectedMenuModal.price.toLocaleString('id-ID')}
                                </span>
                            </div>
                            {selectedMenuModal.description && (
                                <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-0.5">
                                    {selectedMenuModal.description}
                                </DialogDescription>
                            )}
                        </div>

                        {/* Option Groups (Varian / Add-on) */}
                        {selectedMenuModal.options && selectedMenuModal.options.length > 0 && (
                            <div className="space-y-3.5">
                                {selectedMenuModal.options.map((optGroup, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                                                <Sparkles className="size-3 text-primary" />
                                                <span>{optGroup.name}</span>
                                            </h4>
                                            {optGroup.required ? (
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
                                            {optGroup.choices.map((choice, cIdx) => {
                                                const isSelected = selectedChoices[optGroup.name]?.name === choice.name;
                                                return (
                                                    <div
                                                        key={cIdx}
                                                        onClick={() => {
                                                            const currentChoice = selectedChoices[optGroup.name];
                                                            if (currentChoice && currentChoice.name === choice.name) {
                                                                if (!optGroup.required) {
                                                                    setSelectedChoices((prev) => {
                                                                        const copy = { ...prev };
                                                                        delete copy[optGroup.name];
                                                                        return copy;
                                                                    });
                                                                    return;
                                                                }
                                                            }
                                                            setSelectedChoices((prev) => ({
                                                                ...prev,
                                                                [optGroup.name]: choice,
                                                            }));
                                                        }}
                                                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                                                            isSelected
                                                                ? 'bg-primary/10 border-primary shadow-2xs'
                                                                : 'bg-card border-border hover:border-primary/50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <div
                                                                className={`size-4 rounded-full border flex items-center justify-center transition-all ${
                                                                    isSelected
                                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                                        : 'border-muted-foreground/40 bg-transparent'
                                                                }`}
                                                            >
                                                                {isSelected && (
                                                                    <div className="size-1.5 rounded-full bg-primary-foreground" />
                                                                )}
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

                        {/* Special Note & Presets */}
                        <div className="space-y-2 pt-2 border-t border-border/60">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="modal-order-note" className="text-xs font-black text-foreground">
                                    Catatan Khusus Dapur
                                </Label>
                                <span className="text-[10px] text-muted-foreground font-mono">Opsional</span>
                            </div>

                            {/* Preset Note Chips with Lucide Icons */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x">
                                {NOTE_PRESETS.map((preset) => {
                                    const IconComponent = preset.icon;
                                    const isSelected = orderNote.includes(preset.text);
                                    return (
                                        <button
                                            key={preset.id}
                                            type="button"
                                            onClick={() => togglePresetNote(preset.text)}
                                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-200 border shrink-0 flex items-center gap-1.5 ${
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
                                id="modal-order-note"
                                placeholder="Tulis catatan khusus (cth: jangan terlalu pedas)..."
                                value={orderNote}
                                onChange={(e) => setOrderNote(e.target.value)}
                                rows={2}
                                className="text-xs rounded-xl border-border resize-none bg-background focus:ring-primary"
                            />
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/60">
                            <span className="text-xs font-black text-foreground">Jumlah Porsi</span>
                            <div className="flex items-center gap-3 bg-muted/60 p-1.5 rounded-2xl border border-border">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 rounded-xl font-black text-foreground active:scale-90 hover:bg-card"
                                    onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                                >
                                    <Minus className="size-3.5" />
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
                                    <Plus className="size-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Clean Action Footer */}
                    <DialogFooter className="p-3.5 bg-card border-t border-border flex flex-row items-center justify-between gap-3 sm:justify-between">
                        <div className="flex flex-col">
                            <span className="text-[9.5px] text-muted-foreground uppercase font-bold tracking-wider">
                                Total {itemQuantity} Porsi
                            </span>
                            <span className="font-mono font-black text-base text-primary leading-tight">
                                Rp {calculateModalTotalPrice().toLocaleString('id-ID')}
                            </span>
                        </div>

                        <Button
                            type="button"
                            onClick={handleAddWithToast}
                            disabled={selectedMenuModal.is_tenant_open === false}
                            className={`h-11 px-5 text-xs font-black rounded-2xl gap-2 shadow-md transition-transform ${
                                selectedMenuModal.is_tenant_open === false
                                    ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-70'
                                    : 'bg-primary hover:bg-primary/90 text-primary-foreground active:scale-95'
                            }`}
                        >
                            {selectedMenuModal.is_tenant_open === false ? (
                                <>
                                    <Ban className="size-4" />
                                    <span>Stand Tutup</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="size-4" />
                                    <span>Tambah Pesanan</span>
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
}
