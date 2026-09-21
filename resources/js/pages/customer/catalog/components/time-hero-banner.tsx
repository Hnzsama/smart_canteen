import React from 'react';
import { Clock, Moon, Sparkles, Sun, Sunrise, Sunset, Utensils } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TimeMode } from '../types';

type TimeHeroBannerProps = {
    userName: string;
    timeMode: TimeMode;
};

export default function TimeHeroBanner({
    userName,
    timeMode,
}: TimeHeroBannerProps) {
    const timeConfigs: Record<
        TimeMode,
        { greeting: string; caption: string; icon: React.ElementType; rowTitle: string; badge: string }
    > = {
        pagi: {
            greeting: `Selamat Pagi, ${userName}!`,
            caption: 'Yuk sarapan hangat dulu sebelum kelas pagi dimulai...',
            icon: Sunrise,
            rowTitle: 'Rekomendasi Sarapan Pagi',
            badge: 'Pagi Hari',
        },
        siang: {
            greeting: `Habis Matkul Siang, ${userName}?`,
            caption: 'Laper banget? Makanan kenyang favoritmu siap bikin semangat lagi!',
            icon: Sun,
            rowTitle: 'Rekomendasi Makan Siang Kenyang',
            badge: 'Siang Hari',
        },
        sore: {
            greeting: `Cuaca Panas Habis Kuliah?`,
            caption: 'Yang seger-seger & cemilan hangat siap nemenin nongkrong sore!',
            icon: Sunset,
            rowTitle: 'Minuman Segar & Cemilan Sore',
            badge: 'Sore Hari',
        },
        malam: {
            greeting: `Lembur Tugas / Nongkrong, ${userName}?`,
            caption: 'Cemilan malam & kopi hangat siap menemani belajar kelompok!',
            icon: Moon,
            rowTitle: 'Kopi & Cemilan Lembur Malam',
            badge: 'Malam Hari',
        },
    };

    const currentVibe = timeConfigs[timeMode];
    const IconComponent = currentVibe.icon;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-4 shadow-md transition-all duration-300">
            <div className="relative z-10 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5 h-4 font-bold gap-1 rounded-full">
                        <Sparkles className="h-3 w-3 fill-current" />
                        {currentVibe.badge}
                    </Badge>

                    {/* Automatic Time Mode Indicator (Non-clickable) */}
                    <Badge
                        variant="outline"
                        className="text-[10px] font-mono font-bold px-2.5 py-0.5 h-5 rounded-full border-primary-foreground/30 bg-primary-foreground/15 text-primary-foreground flex items-center gap-1.5 shadow-2xs"
                    >
                        <Clock className="h-3 w-3" />
                        <span>Otomatis Sesuai Waktu</span>
                    </Badge>
                </div>

                <div className="space-y-0.5">
                    <h1 className="text-lg font-black tracking-tight leading-snug flex items-center gap-1.5">
                        <span>{currentVibe.greeting}</span>
                        <IconComponent className="h-5 w-5 text-amber-300 shrink-0 inline-block" />
                    </h1>
                    <p className="text-[11px] opacity-90 leading-tight">
                        {currentVibe.caption}
                    </p>
                </div>
            </div>

            <div className="absolute -bottom-8 -right-8 opacity-10 pointer-events-none">
                <Utensils className="h-40 w-40 fill-current" />
            </div>
        </div>
    );
}
