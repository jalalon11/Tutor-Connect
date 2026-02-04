import { Head, Link } from '@inertiajs/react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    message: string;
}

export default function PreRegisterError({ message }: Props) {
    return (
        <>
            <Head title="Verification Error - TutorConnect" />

            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    {/* Error Icon */}
                    <div className="inline-block mb-6">
                        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Verification Failed
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        {message}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/pre-register">
                            <Button>
                                Try Again
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
