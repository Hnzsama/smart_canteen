import { Head } from '@inertiajs/react';
import { Monitor, Moon, Sun } from 'lucide-react';
import Heading from '@/components/heading';
import { useAppearance, type Appearance as AppearanceType } from '@/hooks/use-appearance';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    const { appearance, updateAppearance } = useAppearance();

    const themeOptions: Array<{
        icon: typeof Sun;
        label: string;
        value: AppearanceType;
        gradient: string;
        border: string;
        iconColor: string;
        textColor: string;
    }> = [
        {
            icon: Sun,
            label: 'Terang',
            value: 'light',
            gradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
            border: 'border-amber-200/60 dark:border-amber-800/40',
            iconColor: 'text-amber-500',
            textColor: 'text-foreground',
        },
        {
            icon: Moon,
            label: 'Gelap',
            value: 'dark',
            gradient: 'from-slate-800 to-slate-900',
            border: 'border-slate-700/60',
            iconColor: 'text-slate-300',
            textColor: 'text-white',
        },
        {
            icon: Monitor,
            label: 'Sistem',
            value: 'system',
            gradient: 'from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30',
            border: 'border-violet-200/60 dark:border-violet-800/40',
            iconColor: 'text-violet-500',
            textColor: 'text-foreground',
        },
    ];

    return (
        <>
            <Head title="Appearance settings" />

            <h1 className="sr-only">Appearance settings</h1>

            <div className="space-y-4">
                {/* Appearance Card */}
                <div className="rounded-3xl border border-border/80 bg-card p-4 sm:p-5 space-y-5 shadow-2xs">
                    <div className="border-b border-border/60 pb-3">
                        <Heading
                            variant="small"
                            title="Tampilan"
                            description="Pilih tema yang paling nyaman untuk Anda."
                        />
                    </div>

                    {/* Interactive theme card buttons */}
                    <div className="grid grid-cols-3 gap-3 pt-1">
                        {themeOptions.map(({ icon: Icon, label, value, gradient, border, iconColor, textColor }) => {
                            const isActive = appearance === value;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => updateAppearance(value)}
                                    className={`group relative flex flex-col items-center gap-2.5 rounded-2xl border ${border} bg-gradient-to-br ${gradient} p-4 text-center transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                                        isActive
                                            ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-card shadow-md'
                                            : 'opacity-85 hover:opacity-100'
                                    }`}
                                >
                                    <Icon className={`size-6 transition-transform group-hover:scale-110 ${iconColor}`} />
                                    <span className={`text-xs font-semibold ${textColor}`}>{label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import StudentLayout from '@/layouts/student-layout';

Appearance.layout = (page: any) => {
    const roles: string[] = page.props?.auth?.user?.roles || [];
    const isAdminOrTenant = roles.includes('admin') || roles.includes('tenant');

    if (isAdminOrTenant) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Appearance settings', href: editAppearance().url }]}>
                <SettingsLayout>{page}</SettingsLayout>
            </AppLayout>
        );
    }

    return (
        <StudentLayout>
            <SettingsLayout>{page}</SettingsLayout>
        </StudentLayout>
    );
};
