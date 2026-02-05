import { Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    message: string;
    name: string;
}

export default function PreRegisterSuccess({ message, name }: Props) {
    return (
        <>
            <Head title="Email Verified - TutorConnect" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    {/* Success Icon */}
                    <div className="relative inline-block mb-6">
                        <div className="w-20 h-20 rounded-none bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        You're Verified, {name}! 🎉
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                        {message}
                        <br />
                        We'll notify you when we launch!
                    </p>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 mb-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <strong className="text-gray-700 dark:text-gray-300">What's next?</strong>
                            <br />
                            Keep an eye on your inbox. You'll be among the first to know when TutorConnect goes live.
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
