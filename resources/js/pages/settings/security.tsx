import { Form, Head } from '@inertiajs/react';
import { KeyRound, Lock, ShieldCheck } from 'lucide-react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/security';

// oxfmt-ignore
type Props = {
    passwordRules: string;
} &
    ManageTwoFactorProps;

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Security settings" />

            <h1 className="sr-only">Security settings</h1>

            <div className="space-y-4">
                {/* Password Card */}
                <div className="rounded-3xl border border-border/80 bg-card p-4 sm:p-5 space-y-4 shadow-2xs">
                    <div className="border-b border-border/60 pb-3">
                        <Heading
                            variant="small"
                            title="Ubah Password"
                            description="Pastikan akun Anda menggunakan kata sandi yang panjang dan acak."
                        />
                    </div>

                    <Form
                        {...SecurityController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                        className="space-y-4"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="current_password" className="text-xs font-black text-foreground flex items-center gap-1.5">
                                        <KeyRound className="size-3.5 text-primary" />
                                        <span>Password Saat Ini</span>
                                    </Label>

                                    <PasswordInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        className="text-xs rounded-xl border-border bg-muted/20 focus:ring-primary h-10"
                                        autoComplete="current-password"
                                        placeholder="Password saat ini"
                                    />

                                    <InputError message={errors.current_password} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="password" className="text-xs font-black text-foreground flex items-center gap-1.5">
                                        <Lock className="size-3.5 text-primary" />
                                        <span>Password Baru</span>
                                    </Label>

                                    <PasswordInput
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        className="text-xs rounded-xl border-border bg-muted/20 focus:ring-primary h-10"
                                        autoComplete="new-password"
                                        placeholder="Password baru"
                                        passwordrules={props.passwordRules}
                                    />

                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="password_confirmation" className="text-xs font-black text-foreground flex items-center gap-1.5">
                                        <ShieldCheck className="size-3.5 text-primary" />
                                        <span>Konfirmasi Password</span>
                                    </Label>

                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        className="text-xs rounded-xl border-border bg-muted/20 focus:ring-primary h-10"
                                        autoComplete="new-password"
                                        placeholder="Konfirmasi password baru"
                                        passwordrules={props.passwordRules}
                                    />

                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        data-test="update-password-button"
                                        className="h-10 px-5 text-xs font-black rounded-xl gap-2 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground active:scale-95 transition-transform"
                                    >
                                        <ShieldCheck className="size-3.5" />
                                        <span>Simpan Password</span>
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* 2FA Section */}
                <ManageTwoFactor
                    canManageTwoFactor={props.canManageTwoFactor}
                    requiresConfirmation={props.requiresConfirmation}
                    twoFactorEnabled={props.twoFactorEnabled}
                />
            </div>
        </>
    );
}

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import StudentLayout from '@/layouts/student-layout';

Security.layout = (page: any) => {
    const roles: string[] = page.props?.auth?.user?.roles || [];
    const isAdminOrTenant = roles.includes('admin') || roles.includes('tenant');

    if (isAdminOrTenant) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Security settings', href: edit().url }]}>
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
