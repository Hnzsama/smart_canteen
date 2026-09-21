import { Store, Loader2 } from 'lucide-react';
import TenantListCard from './tenant-list-card';
import { TenantItem } from '../types';

interface TenantSectionProps {
    tenants: TenantItem[];
    visibleTenantsCount: number;
    tenantFallback: string;
    onSelectTenant: (tenant: TenantItem | null) => void;
}

export default function TenantSection({
    tenants,
    visibleTenantsCount,
    tenantFallback,
    onSelectTenant,
}: TenantSectionProps) {
    return (
        <div className="space-y-4 pt-6 mt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-black text-foreground flex items-center gap-1.5">
                    <Store className="h-4 w-4 text-primary" />
                    <span>Stand Toko Kantin FEB (Tersedia)</span>
                </h2>
                <span className="text-[10px] text-muted-foreground font-mono">
                    {tenants.length} Stand Toko
                </span>
            </div>

            <div className="space-y-3">
                {tenants.slice(0, visibleTenantsCount).map((tenant) => (
                    <TenantListCard
                        key={tenant.id}
                        tenant={tenant}
                        tenantFallback={tenantFallback}
                        onSelectTenant={onSelectTenant}
                    />
                ))}

                {visibleTenantsCount < tenants.length && (
                    <div className="py-3 flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium animate-pulse bg-muted/20 rounded-xl border border-dashed border-border">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span>
                            Scroll untuk memuat 5 stand berikutnya ({visibleTenantsCount}/{tenants.length})
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
