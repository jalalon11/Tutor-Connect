import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Mail, User, ArrowRight } from 'lucide-react';

export default function PreRegister() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pre-register');
    };

    return (
        <AuthLayout
            title="Pre-Register"
            description="Be among the first to join TutorConnect when we launch."
            layout="split"
        >
            <Head title="Pre-Register" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-5">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="first_name" className="text-sm font-medium">First Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="first_name"
                                    value={data.first_name}
                                    onChange={e => setData('first_name', e.target.value)}
                                    required
                                    autoFocus
                                    placeholder="Juan"
                                    className="pl-10 h-11 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <InputError message={errors.first_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last_name" className="text-sm font-medium">Last Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="last_name"
                                    value={data.last_name}
                                    onChange={e => setData('last_name', e.target.value)}
                                    required
                                    placeholder="Dela Cruz"
                                    className="pl-10 h-11 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <InputError message={errors.last_name} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                required
                                placeholder="you@example.com"
                                className="pl-10 h-11 bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <Button
                        type="submit"
                        className="h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all group"
                        disabled={processing}
                    >
                        {processing ? (
                            <Spinner className="mr-2" />
                        ) : (
                            <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
                        )}
                        Continue
                    </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                    We'll send you a verification email to confirm your address.
                </p>

                <div className="text-center text-sm text-muted-foreground pt-4">
                    Already have an account?{' '}
                    <TextLink href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold inline-flex items-center group">
                        Sign in
                        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
