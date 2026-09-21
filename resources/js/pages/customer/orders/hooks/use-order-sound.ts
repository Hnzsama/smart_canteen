import { useEffect, useRef } from 'react';
import { ActiveOrder } from '../types';

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

export function useOrderSound(activeOrders: ActiveOrder[]) {
    const prevReadyOrderIdsRef = useRef<Set<number> | null>(null);

    useEffect(() => {
        const readyOrders = activeOrders.filter((o) => o.status === 'ready');
        if (prevReadyOrderIdsRef.current !== null) {
            const hasNewReadyOrder = readyOrders.some((o) => !prevReadyOrderIdsRef.current?.has(o.id));
            if (hasNewReadyOrder) {
                playPickupNotificationSound();
            }
        }
        prevReadyOrderIdsRef.current = new Set(readyOrders.map((o) => o.id));
    }, [activeOrders]);
}
