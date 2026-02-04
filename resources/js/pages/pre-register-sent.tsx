import { Head, Link } from '@inertiajs/react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PreRegisterSent() {
    return (
        <>
            <Head title="Check Your Email - TutorConnect" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    {/* Success Icon */}
                    <div className="relative inline-block mb-6">
                        <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Check Your Email
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                        We've sent a verification link to your email address.
                        Click the link in the email to complete your pre-registration.
                    </p>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 mb-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <strong className="text-gray-700 dark:text-gray-300">Didn't receive the email?</strong>
                            <br />
                            Check your spam folder or try again in a few minutes.
                        </p>
                    </div>

                    <Link href="/">
                        <Button variant="outline">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}
