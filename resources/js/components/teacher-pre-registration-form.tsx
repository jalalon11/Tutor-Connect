import { Form, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

const SUBJECTS = [
    'Mathematics',
    'English',
    'Science',
    'Filipino',
    'Social Studies',
    'Computer Science',
    'Music',
    'Art',
    'Physical Education',
    'Other',
];

const EXPERIENCE_OPTIONS = [
    { value: '0', label: 'Less than 1 year' },
    { value: '1', label: '1-2 years' },
    { value: '3', label: '3-5 years' },
    { value: '5', label: '5-10 years' },
    { value: '10', label: '10+ years' },
];

export default function TeacherPreRegistrationForm() {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string; info?: string } };

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Flash Messages */}
            {flash?.success && (
                <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200">
                    <p className="font-medium">✓ {flash.success}</p>
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200">
                    <p className="font-medium">✕ {flash.error}</p>
                </div>
            )}
            {flash?.info && (
                <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200">
                    <p className="font-medium">ℹ {flash.info}</p>
                </div>
            )}

            {/* Social Sign-up Buttons */}
            <div className="flex flex-col gap-3 mb-6">
                <a
                    href="/auth/google/redirect?type=teacher"
                    className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign up with Google
                </a>
                <a
                    href="/auth/facebook/redirect?type=teacher"
                    className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-lg border border-gray-200 bg-[#1877F2] text-white font-medium hover:bg-[#166FE5] transition-colors"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Sign up with Facebook
                </a>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 dark:bg-gray-900 dark:text-gray-400">or sign up with email</span>
                </div>
            </div>

            {/* Email Sign-up Form */}
            <Form
                action="/teacher/pre-register"
                method="post"
                className="space-y-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    required
                                    placeholder="Juan"
                                    className="bg-white dark:bg-gray-800"
                                />
                                <InputError message={errors.first_name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    required
                                    placeholder="Dela Cruz"
                                    className="bg-white dark:bg-gray-800"
                                />
                                <InputError message={errors.last_name} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="bg-white dark:bg-gray-800"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience_years">Years of Experience</Label>
                            <select
                                id="experience_years"
                                name="experience_years"
                                className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-gray-800 dark:border-gray-700"
                            >
                                <option value="">Select experience</option>
                                {EXPERIENCE_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.experience_years} />
                        </div>

                        <div className="space-y-2">
                            <Label>Subjects You Can Teach</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {SUBJECTS.map((subject) => (
                                    <label
                                        key={subject}
                                        className="flex items-center gap-2 text-sm cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            name="subjects[]"
                                            value={subject}
                                            className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                                        />
                                        {subject}
                                    </label>
                                ))}
                            </div>
                            <InputError message={errors.subjects} />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Pre-Register Now
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                            By signing up, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </>
                )}
            </Form>
        </div>
    );
}
