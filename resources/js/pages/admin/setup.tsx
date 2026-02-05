import { Head, useForm } from '@inertiajs/react';
import { ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function Setup() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/setup');
    };

    return (
        <>
            <Head title="Admin Setup - TutorConnect" />

            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
                <div className="w-full max-w-md">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-none bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-xl shadow-blue-500/20 mb-4">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                            Welcome, Admin
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                            Setup your initial administrator account to get started with TutorConnect.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-none p-8 shadow-2xl shadow-blue-500/5 border border-white/20 dark:border-gray-800">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="pl-10 h-11 bg-gray-50 dark:bg-black border-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="pl-10 h-11 bg-gray-50 dark:bg-black border-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="admin@tutorconnect.com"
                                        required
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="pl-10 h-11 bg-gray-50 dark:bg-black border-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        className="pl-10 h-11 bg-gray-50 dark:bg-black border-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/25 mt-2"
                                disabled={processing}
                            >
                                {processing && <Spinner className="mr-2" />}
                                Complete Setup
                            </Button>
                        </form>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-8">
                        This setup page is only accessible when the system has no administrator.
                    </p>
                </div>
            </div>
        </>
    );
}
