import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login, register } from '@/routes';
import { store as storeTenant } from '@/routes/register/tenant';

type Props = {
    passwordRules: string;
};

export default function RegisterTenant({ passwordRules }: Props) {
    return (
        <>
            <Head title="Daftar Stand Kantin" />

            <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-muted p-1 text-sm font-medium">
                <TextLink
                    href={register()}
                    className="flex-1 rounded-md py-1.5 text-center text-muted-foreground transition hover:text-foreground"
                >
                    Mahasiswa
                </TextLink>
                <span className="flex-1 rounded-md bg-background py-1.5 text-center font-semibold shadow-sm text-foreground">
                    Stand Kantin / Tenant
                </span>
            </div>

            <Form
                {...storeTenant.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4">
                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground">Pendaftaran Mitra Tenant:</span> Lengkapi data pengelola dan informasi stand kantin FEB Anda di bawah ini.
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tenant_name">Nama Stand Kantin</Label>
                                <Input
                                    id="tenant_name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    name="tenant_name"
                                    placeholder="cth: Kantin Bu Siti FEB"
                                />
                                <InputError message={errors.tenant_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tenant_description">Deskripsi Stand (Opsional)</Label>
                                <Input
                                    id="tenant_description"
                                    type="text"
                                    tabIndex={2}
                                    name="tenant_description"
                                    placeholder="cth: Masakan rumahan, ayam geprek & lauk pauk"
                                />
                                <InputError message={errors.tenant_description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama Lengkap Pemilik / Pengelola</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    tabIndex={3}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nama Lengkap Penjual"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Stand / Pengelola</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={4}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="nama@email.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password akun"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Ulangi password"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={7}
                                data-test="register-tenant-button"
                            >
                                {processing && <Spinner />}
                                Daftar Sebagai Stand Kantin
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Sudah memiliki akun?{' '}
                            <TextLink href={login()} tabIndex={8}>
                                Masuk ke akun
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

RegisterTenant.layout = {
    title: 'Daftar Stand Kantin FEB',
    description: 'Buka stand dan mulai terima pesanan mahasiswa secara digital',
};
