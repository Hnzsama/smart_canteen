import { Head } from '@inertiajs/react';
import { Monitor, Moon, Sun } from 'lucide-react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
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

                    {/* Theme options */}
                    <AppearanceTabs className="w-full justify-center sm:justify-start" />

                    {/* Visual previews */}
                    <div className="grid grid-cols-3 gap-3 pt-1">
                        {[
                            { icon: Sun, label: 'Terang', value: 'light', gradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30', border: 'border-amber-200/60 dark:border-amber-800/40', iconColor: 'text-amber-500' },
                            { icon: Moon, label: 'Gelap', value: 'dark', gradient: 'from-slate-800 to-slate-900', border: 'border-slate-700/60', iconColor: 'text-slate-300' },
                            { icon: Monitor, label: 'Sistem', value: 'system', gradient: 'from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30', border: 'border-violet-200/60 dark:border-violet-800/40', iconColor: 'text-violet-500' },
                        ].map(({ icon: Icon, label, gradient, border, iconColor }) => (
                            <div
                                key={label}
                                className={`flex flex-col items-center gap-2 rounded-2xl border ${border} bg-gradient-to-br ${gradient} p-3 text-center`}
                            >
                                <Icon className={`size-5 ${iconColor}`} />
                                <span className="text-xs font-semibold text-foreground">{label}</span>
                            </div>
                        ))}
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
