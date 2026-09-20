import { useState, type FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff, ShieldCheck, Store, UserCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store as storeTenant } from '@/routes/admin/tenants';
import type { AvailableUser } from '../../types';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    availableUsers?: AvailableUser[];
};

export function TenantCreateDialog({ open, onOpenChange, availableUsers = [] }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        name: '',
        description: '',
        is_active: true,
        manager_mode: 'new' as 'new' | 'existing',
        manager_name: '',
        manager_email: '',
        manager_password: '',
        manager_user_id: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post(storeTenant.url(), {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
                setShowPassword(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <form onSubmit={submit}>
                    <DialogHeader className="gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
                                <Store className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-foreground">
                                    Tambah Mitra Stand Kantin
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                    Daftarkan nama stand, status operasional, dan akun pengelola wajib penanggung jawab stand.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-5 py-4">
                        {/* Stand Information Section */}
                        <div className="space-y-4">
                            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Informasi Mitra Stand
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create-name">
                                    Nama Stand Kantin <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="create-name"
                                    placeholder="Contoh: Stand Ayam Geprek Bu Siti"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    aria-invalid={!!form.errors.name}
                                />
                                {form.errors.name && (
                                    <p className="text-xs text-destructive">{form.errors.name}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create-description">Deskripsi Singkat (Opsional)</Label>
                                <Input
                                    id="create-description"
                                    placeholder="Contoh: Aneka olahan ayam dan sambal nusantara"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    aria-invalid={!!form.errors.description}
                                />
                                {form.errors.description && (
                                    <p className="text-xs text-destructive">{form.errors.description}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 pt-1">
                                <Checkbox
                                    id="create-active"
                                    checked={form.data.is_active}
                                    onCheckedChange={(checked) => form.setData('is_active', Boolean(checked))}
                                />
                                <Label htmlFor="create-active" className="text-sm font-medium leading-none cursor-pointer">
                                    Langsung aktifkan status operasional stand (Buka menerima pesanan)
                                </Label>
                            </div>
                        </div>

                        {/* Manager Account Section (REQUIRED) */}
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                                        Akun Pengelola Stand <span className="text-destructive">* (Wajib)</span>
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Setiap stand wajib memiliki akun pengelola untuk login ke panel tenant dan memproses pesanan masuk.
                            </p>

                            {/* Segmented Mode Selector */}
                            <div className="grid grid-cols-2 gap-2 rounded-lg bg-background p-1 border">
                                <button
                                    type="button"
                                    onClick={() => form.setData('manager_mode', 'new')}
                                    className={`flex items-center justify-center gap-2 rounded-md py-1.5 text-xs font-medium transition-all ${
                                        form.data.manager_mode === 'new'
                                            ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <UserPlus className="h-3.5 w-3.5" />
                                    Buat Akun Baru
                                </button>
                                <button
                                    type="button"
                                    onClick={() => form.setData('manager_mode', 'existing')}
                                    className={`flex items-center justify-center gap-2 rounded-md py-1.5 text-xs font-medium transition-all ${
                                        form.data.manager_mode === 'existing'
                                            ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <UserCheck className="h-3.5 w-3.5" />
                                    Pilih Akun Terdaftar
                                </button>
                            </div>

                            {form.data.manager_mode === 'new' ? (
                                <div className="space-y-3 pt-1">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="manager_name" className="text-xs">
                                            Nama Lengkap Pengelola <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="manager_name"
                                            placeholder="Nama lengkap penjual / pengelola"
                                            value={form.data.manager_name}
                                            onChange={(e) => form.setData('manager_name', e.target.value)}
                                            aria-invalid={!!form.errors.manager_name}
                                            className="h-9 bg-background"
                                        />
                                        {form.errors.manager_name && (
                                            <p className="text-xs text-destructive">{form.errors.manager_name}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="manager_email" className="text-xs">
                                            Email Login Pengelola <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="manager_email"
                                            type="email"
                                            placeholder="pengelola@feb.ac.id"
                                            value={form.data.manager_email}
                                            onChange={(e) => form.setData('manager_email', e.target.value)}
                                            aria-invalid={!!form.errors.manager_email}
                                            className="h-9 bg-background"
                                        />
                                        {form.errors.manager_email && (
                                            <p className="text-xs text-destructive">{form.errors.manager_email}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="manager_password" className="text-xs">
                                            Password Awal Login <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="manager_password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Minimal 8 karakter"
                                                value={form.data.manager_password}
                                                onChange={(e) => form.setData('manager_password', e.target.value)}
                                                aria-invalid={!!form.errors.manager_password}
                                                className="h-9 pr-9 bg-background"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        {form.errors.manager_password && (
                                            <p className="text-xs text-destructive">{form.errors.manager_password}</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3 pt-1">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="manager_user_id" className="text-xs">
                                            Pilih Pengguna Terdaftar <span className="text-destructive">*</span>
                                        </Label>
                                        <select
                                            id="manager_user_id"
                                            value={form.data.manager_user_id}
                                            onChange={(e) => form.setData('manager_user_id', e.target.value)}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        >
                                            <option value="">-- Pilih Akun Pengguna --</option>
                                            {availableUsers.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} ({user.email}) - Peran: {user.role} {user.tenant_id ? '(Sudah punya stand)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {form.errors.manager_user_id && (
                                            <p className="text-xs text-destructive">{form.errors.manager_user_id}</p>
                                        )}
                                        <p className="text-[11px] text-muted-foreground">
                                            Pengguna yang dipilih akan diberikan peran <b>Tenant</b> dan ditugaskan mengelola stand ini.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Menyimpan...' : 'Simpan & Daftarkan Stand'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
