import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    message: string;
    name: string;
}

export default function PreRegisterSuccess({ message, name }: Props) {
    return (
        <>
            <Head title="Email Verified - TutorConnect" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    {/* Success Animation */}
                    <div className="relative inline-block mb-6">
                        <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-pulse">
                            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="absolute -top-2 -right-2">
                            <PartyPopper className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome, {name}! 🎉
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        {message}
                    </p>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 mb-8">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            What's Next?
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            You're now pre-registered for TutorConnect! We'll notify you when the platform launches
                            and you'll be among the first to access our tutoring services.
                        </p>
                    </div>

                    <Link href="/">
                        <Button className="shadow-lg shadow-green-500/25">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}
