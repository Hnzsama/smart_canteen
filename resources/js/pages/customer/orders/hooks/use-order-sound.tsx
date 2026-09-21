import React, { useEffect, useRef } from 'react';
import { ChefHat, PartyPopper, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export type SimpleOrderSummary = {
    id: number;
    order_number: string;
    status: string;
};

export const playCookingNotificationSound = () => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(440, now);
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.25);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(554.37, now + 0.12);
        gain2.gain.setValueAtTime(0.35, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.5);
    } catch (e) {
        console.error('Audio playback error:', e);
    }
};

export const playPickupNotificationSound = () => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.frequency.setValueAtTime(523.25, now);
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.3);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.frequency.setValueAtTime(659.25, now + 0.15);
        gain2.gain.setValueAtTime(0.35, now + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.15);
        osc2.stop(now + 0.45);

        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.frequency.setValueAtTime(783.99, now + 0.3);
        gain3.gain.setValueAtTime(0.4, now + 0.3);
        gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.start(now + 0.3);
        osc3.stop(now + 0.8);
    } catch (e) {
        console.error('Audio playback error:', e);
    }
};

export function useOrderSound(orders: SimpleOrderSummary[]) {
    const prevStatusMapRef = useRef<Map<number, string> | null>(null);

    useEffect(() => {
        const currentMap = new Map<number, string>();
        orders.forEach((o) => currentMap.set(o.id, o.status));

        if (prevStatusMapRef.current !== null) {
            orders.forEach((o) => {
                const prevStatus = prevStatusMapRef.current?.get(o.id);
                if (prevStatus && prevStatus !== o.status) {
                    const orderNum = o.order_number ? `#${o.order_number}` : '';
                    if (o.status === 'processing') {
                        playCookingNotificationSound();
                        toast.info(`Pesanan ${orderNum} Diterima & Sedang Dimasak!`, {
                            icon: <ChefHat className="size-5 text-amber-500 shrink-0" />,
                            description: 'Stand kantin sedang menyiapkan hidanganmu.',
                            duration: 5000,
                        });
                    } else if (o.status === 'ready') {
                        playPickupNotificationSound();
                        toast.success(`Pesanan ${orderNum} Sudah Siap Diambil!`, {
                            icon: <PartyPopper className="size-5 text-emerald-500 shrink-0" />,
                            description: 'Silakan tunjukkan QR Code atau nomor pesanan ke stand kantin.',
                            duration: 7000,
                        });
                    } else if (o.status === 'completed') {
                        toast.success(`Pesanan ${orderNum} Selesai!`, {
                            icon: <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />,
                            description: 'Terima kasih telah memesan di Smart Canteen FEB.',
                            duration: 4000,
                        });
                    }
                }
            });
        }

        prevStatusMapRef.current = currentMap;
    }, [orders]);
}
