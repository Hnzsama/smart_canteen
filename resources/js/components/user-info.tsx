import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user?: User | null;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                        T
                    </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold text-foreground">Pengunjung / Tamu</span>
                    <span className="text-muted-foreground truncate text-xs">Belum Masuk Akun</span>
                </div>
            </div>
        );
    }

    const roleBadge = (() => {
        if (user.roles?.includes('admin')) {
            return 'Administrator';
        }
        if (user.roles?.includes('tenant')) {
            return user.tenant?.name ? `Stand: ${user.tenant.name}` : 'Mitra Tenant';
        }
        return 'Mahasiswa FEB';
    })();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name ?? 'M')}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail ? (
                    <span className="text-muted-foreground truncate text-xs">
                        {user.email} &bull; {roleBadge}
                    </span>
                ) : (
                    <span className="text-muted-foreground truncate text-xs">
                        {roleBadge}
                    </span>
                )}
            </div>
        </>
    );
}
