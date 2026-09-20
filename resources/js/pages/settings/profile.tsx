import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Mail, Save, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';
import { send } from '@/routes/verification';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-4">
                <div className="rounded-3xl border border-border/80 bg-card p-4 sm:p-5 space-y-4 shadow-2xs">
                    <div className="border-b border-border/60 pb-3">
                        <Heading
                            variant="small"
                            title="Informasi Profil"
                            description="Perbarui nama lengkap dan alamat email akun Anda."
                        />
                    </div>

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        onSuccess={() => {
                            toast.success('Profil berhasil diperbarui!', {
                                description: 'Data akun Anda telah disimpan.',
                            });
                        }}
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="name" className="text-xs font-black text-foreground flex items-center gap-1.5">
                                        <UserIcon className="size-3.5 text-primary" />
                                        <span>Nama Lengkap</span>
                                    </Label>

                                    <Input
                                        id="name"
                                        className="text-xs rounded-xl border-border bg-muted/20 focus:ring-primary h-10"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Nama Lengkap"
                                    />

                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="email" className="text-xs font-black text-foreground flex items-center gap-1.5">
                                        <Mail className="size-3.5 text-primary" />
                                        <span>Alamat Email</span>
                                    </Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="text-xs rounded-xl border-border bg-muted/20 focus:ring-primary h-10"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="alamat@email.com"
                                    />

                                    <InputError message={errors.email} />
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 space-y-1">
                                        <p>
                                            Email Anda belum diverifikasi.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="font-bold underline hover:text-amber-700"
                                            >
                                                Kirim ulang email verifikasi.
                                            </Link>
                                        </p>

                                        {status === 'verification-link-sent' && (
                                            <div className="font-bold text-emerald-600">
                                                Link verifikasi baru telah dikirim ke email Anda.
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="pt-2 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-10 px-5 text-xs font-black rounded-xl gap-2 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground active:scale-95 transition-transform"
                                    >
                                        <Save className="size-3.5" />
                                        <span>Simpan Profil</span>
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </div>
        </>
    );
}

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import StudentLayout from '@/layouts/student-layout';

Profile.layout = (page: any) => {
    const roles: string[] = page.props?.auth?.user?.roles || [];
    const isAdminOrTenant = roles.includes('admin') || roles.includes('tenant');

    if (isAdminOrTenant) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Profile settings', href: edit().url }]}>
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
