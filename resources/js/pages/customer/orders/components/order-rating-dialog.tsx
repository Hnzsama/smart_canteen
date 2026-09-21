import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { HistoryOrder } from '../types';

interface OrderRatingDialogProps {
    order: HistoryOrder | null;
    onClose: () => void;
}

export function OrderRatingDialog({ order, onClose }: OrderRatingDialogProps) {
    const [ratingValue, setRatingValue] = useState<number>(5);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const ratingLabels = ['Sangat Buruk', 'Buruk', 'Cukup Baik', 'Enak & Bagus', 'Sangat Memuaskan!'];

    const submitRating = () => {
        if (!order) return;
        setIsSubmitting(true);

        router.post(
            `/orders/${order.id}/rate`,
            {
                rating: ratingValue,
                comment,
            },
            {
                onFinish: () => {
                    setIsSubmitting(false);
                    onClose();
                },
            }
        );
    };

    return (
        <Dialog open={order !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md rounded-3xl p-6">
                <DialogHeader className="space-y-1.5">
                    <DialogTitle className="text-center text-lg font-black tracking-tight">
                        Beri Rating & Ulasan
                    </DialogTitle>
                    <DialogDescription className="text-center text-xs text-muted-foreground">
                        Bagikan pengalaman kamu memesan di{' '}
                        <span className="font-bold text-foreground">{order?.tenant_name}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-5">
                    {/* Interactive Stars Selection */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const isFilled = (hoveredRating || ratingValue) >= star;
                                return (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRatingValue(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="p-1 text-amber-400 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                                    >
                                        <Star
                                            className={`size-8 ${
                                                isFilled ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                                            }`}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                        <span className="text-xs font-extrabold text-amber-500">
                            {ratingLabels[(hoveredRating || ratingValue) - 1]} ({hoveredRating || ratingValue}/5)
                        </span>
                    </div>

                    {/* Comment Textarea */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground block">
                            Ulasan Kamu{' '}
                            <span className="text-muted-foreground text-[10px] font-normal">(Opsional)</span>
                        </label>
                        <textarea
                            placeholder="Makanannya enak, porsi kenyang, penjual ramah..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full text-xs rounded-2xl min-h-[90px] p-3 border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                            maxLength={500}
                        />
                    </div>
                </div>

                <DialogFooter className="flex-row gap-2 sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 sm:flex-none font-bold text-xs rounded-xl h-10"
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={submitRating}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none font-black text-xs rounded-xl h-10 gap-1.5 bg-amber-500 hover:bg-amber-600 text-black shadow-xs"
                    >
                        <Star className="size-4 fill-black text-black" />
                        <span>{isSubmitting ? 'Mengirim...' : 'Kirim Rating'}</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
