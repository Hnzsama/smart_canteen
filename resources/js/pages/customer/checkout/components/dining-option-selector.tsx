import { Utensils, Package } from 'lucide-react';

interface DiningOptionSelectorProps {
    diningOption: 'dine_in' | 'takeaway';
    onSelectOption: (option: 'dine_in' | 'takeaway') => void;
}

export default function DiningOptionSelector({
    diningOption,
    onSelectOption,
}: DiningOptionSelectorProps) {
    return (
        <div className="p-1 bg-muted/60 dark:bg-neutral-900 rounded-2xl border border-border/60 grid grid-cols-2 gap-1">
            <button
                type="button"
                onClick={() => onSelectOption('dine_in')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all text-center flex items-center justify-center gap-1.5 ${
                    diningOption === 'dine_in'
                        ? 'bg-card text-primary shadow-xs ring-1 ring-border font-black'
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                <Utensils className="size-3.5" />
                <span>Makan di Tempat</span>
            </button>

            <button
                type="button"
                onClick={() => onSelectOption('takeaway')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all text-center flex items-center justify-center gap-1.5 ${
                    diningOption === 'takeaway'
                        ? 'bg-card text-primary shadow-xs ring-1 ring-border font-black'
                        : 'text-muted-foreground hover:text-foreground'
                }`}
            >
                <Package className="size-3.5" />
                <span>Bawa Pulang</span>
            </button>
        </div>
    );
}
