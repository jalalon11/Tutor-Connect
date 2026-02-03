import { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';
import { GraduationCap, ArrowLeft, Mail, Check } from 'lucide-react';

const SUBJECTS = [
    'Mathematics', 'English', 'Science', 'Filipino',
    'Social Studies', 'Computer Science', 'Music', 'Art', 'Physical Education', 'Other',
];

const EXPERIENCE_OPTIONS = [
    { value: '0', label: 'Less than 1 year' },
    { value: '1', label: '1-2 years' },
    { value: '3', label: '3-5 years' },
    { value: '5', label: '5-10 years' },
    { value: '10', label: '10+ years' },
];

interface PreRegistrationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PreRegistrationDialog({ open, onOpenChange }: PreRegistrationDialogProps) {
    const [step, setStep] = useState<'provider' | 'email-form'>('provider');
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        experience_years: '',
        subjects: [] as string[],
    });

    // Reset to provider selection when dialog closes
    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setStep('provider');
                reset();
                clearErrors();
            }, 300);
        }
    }, [open]);

    // Close dialog on success
    useEffect(() => {
        if (flash?.success) {
            onOpenChange(false);
        }
    }, [flash?.success, onOpenChange]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/teacher/pre-register', {
            onSuccess: () => {
                reset();
            },
        });
    };

    const toggleSubject = (subject: string) => {
        const newSubjects = data.subjects.includes(subject)
            ? data.subjects.filter(s => s !== subject)
            : [...data.subjects, subject];
        setData('subjects', newSubjects);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                {step === 'provider' ? (
                    <>
                        <DialogHeader className="text-center sm:text-center">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                            <DialogTitle className="text-2xl">Join as a Teacher</DialogTitle>
                            <DialogDescription>
                                Pre-register to be among the first teachers on TutorConnect
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-3 mt-4">
                            {/* Google */}
                            <a
                                href="/auth/google/redirect?type=teacher"
                                className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </a>

                            {/* Facebook */}
                            <a
                                href="/auth/facebook/redirect?type=teacher"
                                className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg bg-[#1877F2] text-white font-medium hover:bg-[#166FE5] transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Continue with Facebook
                            </a>

                            {/* Email */}
                            <button
                                onClick={() => setStep('email-form')}
                                className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                <Mail className="w-5 h-5" />
                                Continue with Email
                            </button>
                        </div>

                        <p className="text-xs text-center text-muted-foreground mt-4">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setStep('provider')}
                                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <DialogTitle>Pre-Register with Email</DialogTitle>
                                    <DialogDescription>
                                        Fill in your details to join as a teacher
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 mt-2"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="first_name" className="text-sm">First Name</Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={e => setData('first_name', e.target.value)}
                                        required
                                        placeholder="Juan"
                                    />
                                    <InputError message={errors.first_name} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="last_name" className="text-sm">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={e => setData('last_name', e.target.value)}
                                        required
                                        placeholder="Dela Cruz"
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="email" className="text-sm">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="experience_years" className="text-sm">Years of Experience</Label>
                                <select
                                    id="experience_years"
                                    value={data.experience_years}
                                    onChange={e => setData('experience_years', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="">Select experience</option>
                                    {EXPERIENCE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <InputError message={errors.experience_years} />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm">Subjects You Can Teach</Label>
                                <div className="grid grid-cols-2 gap-1.5 text-sm max-h-32 overflow-y-auto pr-2">
                                    {SUBJECTS.map((subj) => (
                                        <button
                                            key={subj}
                                            type="button"
                                            onClick={() => toggleSubject(subj)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-left transition-colors ${data.subjects.includes(subj)
                                                    ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300'
                                                    : 'bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${data.subjects.includes(subj)
                                                    ? 'bg-blue-500 border-blue-500'
                                                    : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                                                }`}>
                                                {data.subjects.includes(subj) && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            {subj}
                                        </button>
                                    ))}
                                </div>
                                <InputError message={errors.subjects} />
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing && <Spinner className="mr-2" />}
                                Pre-Register Now
                            </Button>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
