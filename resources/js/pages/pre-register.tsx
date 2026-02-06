import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Mail, User, ArrowRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { EnvelopeLoader } from '@/components/ui/envelope-loader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type FormState = 'idle' | 'loading' | 'success';

export default function PreRegister() {
    const [formState, setFormState] = useState<FormState>('idle');
    const [data, setData] = useState({
        first_name: '',
        last_name: '',
        email: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setFormState('loading');

        try {
            await axios.post('/pre-register', data, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            setFormState('success');
        } catch (error: unknown) {
            setFormState('idle');
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const formattedErrors: Record<string, string> = {};
                Object.keys(validationErrors).forEach(key => {
                    formattedErrors[key] = validationErrors[key][0];
                });
                setErrors(formattedErrors);
            } else {
                setErrors({ email: 'Something went wrong. Please try again.' });
            }
        }
    };

    const updateData = (field: keyof typeof data, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleBack = () => {
        setFormState('idle');
        setResendCountdown(60);
        setResendLoading(false);
    };

    // Resend email state
    const [resendCountdown, setResendCountdown] = useState(60);
    const [resendLoading, setResendLoading] = useState(false);

    // Countdown timer for resend
    useEffect(() => {
        if (formState === 'success' && resendCountdown > 0) {
            const timer = setTimeout(() => {
                setResendCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [formState, resendCountdown]);

    const handleResend = async () => {
        if (resendCountdown > 0 || resendLoading) return;

        setResendLoading(true);
        try {
            await axios.post('/pre-register/resend', { email: data.email }, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            setResendCountdown(60); // Reset countdown after successful resend
        } catch (error) {
            console.error('Failed to resend email:', error);
        } finally {
            setResendLoading(false);
        }
    };

    // Loading State - Envelope Animation
    if (formState === 'loading') {
        return (
            <AuthLayout
                title="Pre-Register"
                description="Be among the first to join TutorConnect when we launch."
                layout="split"
            >
                <Head title="Pre-Register" />
                <div className="flex flex-col items-center justify-center py-12">
                    {/* Envelope Loader */}
                    <EnvelopeLoader size="md" />

                    {/* Text Content */}
                    <div className="mt-12 text-center space-y-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Sending Verification Email
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Please wait while we process your registration...
                        </p>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    // Success State - Clean Professional Design (matching reference)
    if (formState === 'success') {
        return (
            <AuthLayout
                title=""
                description=""
                layout="split"
            >
                <Head title="Check Your Email - TutorConnect" />
                <div className="flex flex-col items-center text-center py-8">
                    {/* Email Animation GIF */}
                    <div className="mb-8">
                        <img
                            src="/images/animation-gif.gif"
                            alt="Check your email"
                            className="w-40 h-40 object-contain"
                        />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Check Email
                    </h1>

                    {/* Message with inline resend link */}
                    <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed text-sm max-w-[320px]">
                        Please check your email inbox and click on the provided link to verify your email.{' '}
                        {resendCountdown > 0 ? (
                            <span className="text-gray-400 dark:text-gray-500">
                                Resend available in {resendCountdown}s
                            </span>
                        ) : (
                            <>
                                If you don't receive email,{' '}
                                <button
                                    onClick={handleResend}
                                    disabled={resendLoading}
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    {resendLoading ? 'sending...' : 'click here to resend'}
                                </button>
                            </>
                        )}
                    </p>

                    {/* Action Links */}
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleBack}
                            className="flex items-center justify-center gap-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors text-sm font-medium group cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Edit Email
                        </button>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    // Default Form State
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
                                    onChange={e => updateData('first_name', e.target.value)}
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
                                    onChange={e => updateData('last_name', e.target.value)}
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
                                onChange={e => updateData('email', e.target.value)}
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
                    >
                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
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
