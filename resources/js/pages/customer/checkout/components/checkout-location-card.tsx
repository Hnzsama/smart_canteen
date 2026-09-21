import { MapPin, Clock } from 'lucide-react';

interface CheckoutLocationCardProps {
    tenantNamesStr: string;
}

export default function CheckoutLocationCard({ tenantNamesStr }: CheckoutLocationCardProps) {
    return (
        <div className="p-3.5 bg-card rounded-2xl border border-border/70 space-y-2 shadow-2xs">
            <div className="flex items-start gap-2.5">
                <MapPin className="size-4.5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5 flex-1 min-w-0">
                    <h3 className="text-xs font-extrabold text-foreground leading-snug truncate">
                        {tenantNamesStr}
                    </h3>
                    <p className="text-[10.5px] text-muted-foreground leading-tight truncate">
                        Kantin FEB • Universitas Negeri Surabaya
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 text-[10.5px] text-muted-foreground pt-2 border-t border-border/40 font-medium">
                <Clock className="size-3.5 text-amber-500 shrink-0" />
                <span>
                    Estimasi Waktu Penyiapan:{' '}
                    <strong className="text-foreground font-bold">10-15 Min</strong>
                </span>
            </div>
        </div>
    );
}
