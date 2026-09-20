import { GraduationCap, Shield, Store, TrendingUp, Users } from 'lucide-react';
import type { UserCounts } from '../../types';

type Props = {
    counts: UserCounts;
};

export function UserSummaryCards({ counts }: Props) {
    const studentPercentage =
        counts.all > 0 ? Math.round((counts.mahasiswa / counts.all) * 100) : 0;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Pengguna */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Total Pengguna Terdaftar
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                        <Users className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.all}
                    <span className="text-sm font-normal text-muted-foreground font-sans">
                        {' '}akun
                    </span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {counts.mahasiswa}
                    </span>{' '}
                    mhs •{' '}
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {counts.tenant}
                    </span>{' '}
                    penjual •{' '}
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {counts.admin}
                    </span>{' '}
                    admin
                </div>
            </div>

            {/* Mahasiswa */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Akun Mahasiswa
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-600 border border-blue-500/20 dark:text-blue-400 group-hover:scale-105 transition-transform">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.mahasiswa}
                    <span className="text-sm font-normal text-muted-foreground font-sans">
                        {' '}civitas
                    </span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-blue-700 dark:text-blue-400">
                        {studentPercentage}%
                    </span>
                    <span>konsumen kantin FEB</span>
                </div>
            </div>

            {/* Penjual Stand Kantin */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Penjual Stand Kantin
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-600 border border-amber-500/20 dark:text-amber-400 group-hover:scale-105 transition-transform">
                        <Store className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.tenant}
                    <span className="text-sm font-normal text-muted-foreground font-sans">
                        {' '}mitra
                    </span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>Pengelola menu & pesanan stand</span>
                </div>
            </div>

            {/* Administrator FEB */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Administrator FEB
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-600 border border-purple-500/20 dark:text-purple-400 group-hover:scale-105 transition-transform">
                        <Shield className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.admin}
                    <span className="text-sm font-normal text-muted-foreground font-sans">
                        {' '}admin
                    </span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>Hak akses pengawasan & supervisi</span>
                </div>
            </div>
        </div>
    );
}
