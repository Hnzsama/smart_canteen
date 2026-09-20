import { useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Building2, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import { dashboard as adminDashboard } from '@/routes/admin';
import type { TenantOption } from '../../types';

type Option = {
    label: string;
    value: string;
    is_active?: boolean;
};

type Props = {
    tenants: TenantOption[];
    selectedTenantId: number | null;
};

export function DashboardTenantCombobox({ tenants, selectedTenantId }: Props) {
    const options: Option[] = useMemo(() => {
        const allOption: Option = {
            label: 'Semua Mitra Stand Kantin (Konsolidasi)',
            value: 'all',
            is_active: true,
        };

        const tenantOptions: Option[] = tenants.map((t) => ({
            label: t.name,
            value: String(t.id),
            is_active: t.is_active,
        }));

        return [allOption, ...tenantOptions];
    }, [tenants]);

    const selectedOption = useMemo(() => {
        if (!selectedTenantId) {
            return options[0];
        }
        return options.find((opt) => opt.value === String(selectedTenantId)) || options[0];
    }, [options, selectedTenantId]);

    const handleSelect = (item: Option | null) => {
        if (!item || item.value === 'all') {
            router.get(
                adminDashboard.url(),
                {},
                { preserveState: true, replace: true }
            );
        } else {
            router.get(
                adminDashboard.url({
                    query: { tenant_id: item.value },
                }),
                {},
                { preserveState: true, replace: true }
            );
        }
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Store className="h-4 w-4 text-primary" />
                <span>Filter Stand Kantin:</span>
            </div>

            <div className="w-full sm:w-80">
                <Combobox
                    items={options}
                    value={selectedOption}
                    onValueChange={handleSelect}
                >
                    <ComboboxInput
                        placeholder="Pilih atau cari mitra stand..."
                        showClear={selectedTenantId !== null}
                        className="bg-card shadow-xs"
                    />
                    <ComboboxContent className="w-80">
                        <ComboboxEmpty className="py-4 text-xs text-muted-foreground text-center">
                            Mitra stand tidak ditemukan.
                        </ComboboxEmpty>
                        <ComboboxList>
                            {(item: Option) => (
                                <ComboboxItem key={item.value} value={item} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2 truncate">
                                        {item.value === 'all' ? (
                                            <Building2 className="h-4 w-4 text-primary shrink-0" />
                                        ) : (
                                            <Store className="h-4 w-4 text-muted-foreground shrink-0" />
                                        )}
                                        <span className="truncate text-xs font-medium">{item.label}</span>
                                    </div>
                                    {item.value !== 'all' && (
                                        <Badge
                                            variant={item.is_active ? 'secondary' : 'outline'}
                                            className="text-[10px] px-1.5 py-0 shrink-0"
                                        >
                                            {item.is_active ? 'Buka' : 'Tutup'}
                                        </Badge>
                                    )}
                                </ComboboxItem>
                            )}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
            </div>
        </div>
    );
}
