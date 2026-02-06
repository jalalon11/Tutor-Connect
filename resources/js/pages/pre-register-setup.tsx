import { Head, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Lock,
    Eye,
    EyeOff,
    GraduationCap,
    BookOpen,
    ArrowRight,
    Users,
    Shield,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { AppLogoWithBackground } from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';

interface Props {
    token: string;
    name: string;
    email: string;
}

type Step = 'loading' | 'password' | 'transitioning' | 'role';

// Sidebar Progress Component
function SidebarProgress({ currentStep, name }: { currentStep: Step; name: string }) {
    const { appSettings } = usePage().props as {
        appSettings?: {
            name?: string;
            icon?: string | null;
        };
    };

    const steps = [
        {
            key: 'verified',
            label: 'Email Verified',
            description: 'Your email has been verified successfully',
            icon: CheckCircle2
        },
        {
            key: 'password',
            label: 'Set Password',
            description: 'Create a secure password for your account',
            icon: Lock
        },
        {
            key: 'role',
            label: 'Select Role',
            description: 'Choose how you want to use TutorConnect',
            icon: Users
        },
    ];

    const getStepStatus = (stepKey: string) => {
        if (currentStep === 'loading') {
            return stepKey === 'verified' ? 'current' : 'upcoming';
        }
        if (currentStep === 'password' || currentStep === 'transitioning') {
            if (stepKey === 'verified') return 'completed';
            if (stepKey === 'password') return 'current';
            return 'upcoming';
        }
        if (currentStep === 'role') {
            if (stepKey === 'role') return 'current';
            return 'completed';
        }
        return 'upcoming';
    };

    return (
        <div className="h-full flex flex-col px-8 lg:px-12 py-10">
            {/* App Logo & Name */}
            <div className="flex items-center gap-3 mb-12">
                <AppLogoWithBackground size="md" />
                <span className="text-xl font-bold text-white">{appSettings?.name || 'TutorConnect'}</span>
            </div>

            {/* Welcome Header */}
            <div className="flex-1 flex flex-col justify-center">
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-white mb-1">Welcome, {name}!</h2>
                    <p className="text-sm text-gray-400">Let's set up your account</p>
                </div>

                {/* Progress Steps */}
                <div className="space-y-1">
                    {steps.map((step, index) => {
                        const status = getStepStatus(step.key);
                        const Icon = step.icon;
                        return (
                            <div key={step.key} className="relative">
                                <div className="flex items-start gap-4">
                                    {/* Step Indicator */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 flex items-center justify-center transition-all ${status === 'completed'
                                                ? 'bg-blue-500 text-white'
                                                : status === 'current'
                                                    ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-800'
                                                    : 'bg-slate-700 text-gray-500'
                                                }`}
                                        >
                                            {status === 'completed' ? (
                                                <CheckCircle2 className="w-5 h-5" />
                                            ) : (
                                                <Icon className="w-5 h-5" />
                                            )}
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div
                                                className={`w-0.5 h-16 mt-2 ${getStepStatus(steps[index + 1].key) === 'completed' ||
                                                    getStepStatus(steps[index + 1].key) === 'current'
                                                    ? 'bg-blue-500'
                                                    : 'bg-slate-700'
                                                    }`}
                                            />
                                        )}
                                    </div>

                                    {/* Step Content */}
                                    <div className="flex-1 pb-8">
                                        <h3
                                            className={`font-semibold mb-1 ${status === 'current'
                                                ? 'text-white'
                                                : status === 'completed'
                                                    ? 'text-blue-400'
                                                    : 'text-gray-500'
                                                }`}
                                        >
                                            {step.label}
                                        </h3>
                                        <p
                                            className={`text-sm ${status === 'current'
                                                ? 'text-gray-300'
                                                : 'text-gray-500'
                                                }`}
                                        >
                                            {step.description}
                                        </p>
                                        {status === 'completed' && (
                                            <span className="inline-flex items-center gap-1 text-xs text-blue-400 mt-2">
                                                <CheckCircle2 className="w-3 h-3" /> Completed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Security Badge */}
                <div className="mt-10 flex items-center gap-3 p-4 bg-slate-700/50 border border-slate-600">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <p className="text-xs text-gray-400">
                        Your information is secure and encrypted
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function PreRegisterSetup({ token, name, email }: Props) {
    const [step, setStep] = useState<Step>('loading');
    const [progress, setProgress] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        token: token,
        password: '',
        password_confirmation: '',
        role: '',
    });

    // Progress bar animation
    useEffect(() => {
        if (step === 'loading') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setStep('password');
                        return 10;
                    }
                    return prev + 4;
                });
            }, 130);
            return () => clearInterval(interval);
        }
    }, [step]);

    // Transition animation between password and role
    useEffect(() => {
        if (step === 'transitioning') {
            const timer = setTimeout(() => {
                setStep('role');
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.password.length >= 8 && data.password === data.password_confirmation) {
            setStep('transitioning');
        }
    };

    const handleRoleSelect = (role: 'student' | 'teacher') => {
        setSelectedRole(role);
        setData('role', role);
    };

    const handleFinalSubmit = () => {
        if (selectedRole) {
            post('/pre-register/complete-setup');
        }
    };

    // Render right-side content based on step
    const renderContent = () => {
        // Loading Step
        if (step === 'loading') {
            return (
                <div className="text-center">
                    <div className="relative inline-block mb-6">
                        <img
                            src="/images/verified-success.gif"
                            alt="Verified Success"
                            className="w-40 h-40 object-contain"
                        />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Email Verified!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Setting up your account...
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
                        <Progress value={progress} className="h-2 mb-3" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Preparing your account setup...
                        </p>
                    </div>
                </div>
            );
        }

        // Transitioning Step
        if (step === 'transitioning') {
            return (
                <div className="text-center">
                    <Spinner className="w-10 h-10 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Loading . . . .
                    </p>
                </div>
            );
        }

        // Password Step
        if (step === 'password') {
            return (
                <div>
                    <div className="text-center mb-8">
                        <div className="relative inline-block mb-4">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Set Your Password
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Create a secure password to protect your account
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700">
                        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Signing up as</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{email}</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        required
                                        autoFocus
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        className="pr-10 h-11"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">Minimum 8 characters</p>
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        className="pr-10 h-11"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {data.password && data.password_confirmation && data.password !== data.password_confirmation && (
                                    <p className="text-xs text-red-500">Passwords do not match</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                                disabled={data.password.length < 8 || data.password !== data.password_confirmation}
                            >
                                Continue
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </form>
                    </div>
                </div>
            );
        }

        // Role Selection Step
        return (
            <div>
                <div className="text-center mb-8">
                    <div className="relative inline-block mb-4">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Choose Your Role
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Select how you want to use TutorConnect
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => handleRoleSelect('student')}
                        className={`p-5 text-left border-2 transition-all duration-200 hover:shadow-lg ${selectedRole === 'student'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 bg-white dark:bg-gray-800'
                            }`}
                    >
                        <div className={`w-12 h-12 mb-3 flex items-center justify-center transition-colors ${selectedRole === 'student' ? 'bg-blue-500' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                            <BookOpen className={`w-6 h-6 ${selectedRole === 'student' ? 'text-white' : 'text-blue-600'}`} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Student</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Find tutors and book sessions</p>
                        {selectedRole === 'student' && (
                            <div className="mt-3 flex items-center gap-1 text-blue-600 text-xs font-medium">
                                <CheckCircle2 className="w-3 h-3" /> Selected
                            </div>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => handleRoleSelect('teacher')}
                        className={`p-5 text-left border-2 transition-all duration-200 hover:shadow-lg ${selectedRole === 'teacher'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 bg-white dark:bg-gray-800'
                            }`}
                    >
                        <div className={`w-12 h-12 mb-3 flex items-center justify-center transition-colors ${selectedRole === 'teacher' ? 'bg-blue-500' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                            <GraduationCap className={`w-6 h-6 ${selectedRole === 'teacher' ? 'text-white' : 'text-blue-600'}`} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Tutor</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Share expertise with learners</p>
                        {selectedRole === 'teacher' && (
                            <div className="mt-3 flex items-center gap-1 text-blue-600 text-xs font-medium">
                                <CheckCircle2 className="w-3 h-3" /> Selected
                            </div>
                        )}
                    </button>
                </div>

                <InputError message={errors.role} />

                <Button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    disabled={!selectedRole || processing}
                >
                    {processing ? (
                        <><Spinner className="mr-2" />Creating your account...</>
                    ) : (
                        <>Complete Registration<ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                </Button>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                    You can change your role later in settings
                </p>
            </div>
        );
    };

    return (
        <>
            <Head title="Account Setup - TutorConnect" />
            <div className="min-h-screen flex">
                {/* Left Sidebar - Progress */}
                <div className="hidden lg:flex lg:w-[400px] bg-gradient-to-br from-slate-800 to-slate-900">
                    <SidebarProgress currentStep={step} name={name} />
                </div>

                {/* Right Content */}
                <div className="flex-1 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-md">
                        {/* Mobile Progress (shown on small screens) */}
                        <div className="lg:hidden mb-8">
                            <div className="flex items-center justify-between text-sm">
                                <span className={step === 'loading' ? 'text-blue-600 font-medium' : 'text-green-600'}>
                                    {step === 'loading' ? '1. Verified' : '✓ Verified'}
                                </span>
                                <div className="flex-1 h-0.5 mx-2 bg-gray-200" />
                                <span className={step === 'password' || step === 'transitioning' ? 'text-blue-600 font-medium' : step === 'role' ? 'text-green-600' : 'text-gray-400'}>
                                    {step === 'role' ? '✓ Password' : '2. Password'}
                                </span>
                                <div className="flex-1 h-0.5 mx-2 bg-gray-200" />
                                <span className={step === 'role' ? 'text-blue-600 font-medium' : 'text-gray-400'}>
                                    3. Role
                                </span>
                            </div>
                        </div>

                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
}
