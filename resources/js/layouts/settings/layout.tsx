import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { BadgeCheck, Lock, LogOut, Palette, User as UserIcon } from 'lucide-react';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn, toUrl } from '@/lib/utils';
import { logout } from '@/routes';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { User } from '@/types';

const sidebarNavItems: Array<{ title: string; href: any; icon: any }> = [
    {
        title: 'Profil',
        href: edit(),
        icon: UserIcon,
    },
    {
        title: 'Keamanan',
        href: editSecurity(),
        icon: Lock,
    },
    {
        title: 'Tampilan',
        href: editAppearance(),
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const page = usePage();
    const auth = page.props.auth as { user: User | null };
    const getInitials = useInitials();
    const roles: string[] = auth?.user?.roles || [];
    const isStudent = !roles.includes('admin') && !roles.includes('tenant');

    if (isStudent) {
        return (
            <div className="space-y-4 pb-8 font-sans">
                {/* Student Profile Header Card */}
                <div className="rounded-3xl border border-border/80 bg-card p-4 shadow-2xs relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between gap-3 relative z-10">
                        <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="size-13 rounded-2xl border-2 border-primary/30 shadow-2xs">
                                <AvatarImage src={auth?.user?.avatar} alt={auth?.user?.name} />
                                <AvatarFallback className="bg-primary text-primary-foreground font-black text-sm">
                                    {getInitials(auth?.user?.name ?? 'M')}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-0.5 min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                    <h2 className="font-extrabold text-sm sm:text-base text-foreground tracking-tight truncate">
                                        {auth?.user?.name}
                                    </h2>
                                    <BadgeCheck className="size-4 text-primary shrink-0" />
                                </div>
                                <p className="text-[11px] text-muted-foreground truncate font-mono">
                                    {auth?.user?.email}
                                </p>
                                <div className="flex items-center gap-1.5 pt-0.5">
                                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-bold bg-primary/10 text-primary border-primary/20">
                                        Mahasiswa FEB
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Quick Logout Button */}
                        <Link
                            href={logout().url}
                            method="post"
                            as="button"
                            className="size-8.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all active:scale-90 shrink-0 shadow-2xs"
                            title="Keluar dari Akun"
                        >
                            <LogOut className="size-4" />
                        </Link>
                    </div>
                </div>

                {/* Horizontal Segmented Pill Navigation Tab Strip */}
                <div className="p-1 bg-muted/60 dark:bg-neutral-900 rounded-2xl border border-border/60 grid grid-cols-3 gap-1">
                    {sidebarNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = isCurrentOrParentUrl(item.href);
                        return (
                            <Link
                                key={toUrl(item.href)}
                                href={item.href}
                                className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 select-none ${
                                    isActive
                                        ? 'bg-card text-primary shadow-xs ring-1 ring-border font-black scale-[1.02]'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Icon className={`size-3.5 ${isActive ? 'text-primary' : 'opacity-75'}`} />
                                <span className="truncate">{item.title}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Tab Content Section */}
                <div className="pt-1">
                    {children}
                </div>
            </div>
        );
    }

    // Default Desktop Admin / Tenant Layout
    return (
        <div className="px-4 py-6">
            <Heading
                title="Settings"
                description="Manage your profile and account settings"
            />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav
                        className="flex flex-col space-y-1 space-x-0"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Button
                                    key={`${toUrl(item.href)}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn('w-full justify-start gap-2 font-bold', {
                                        'bg-muted font-black text-primary': isCurrentOrParentUrl(item.href),
                                    })}
                                >
                                    <Link href={item.href}>
                                        <Icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
