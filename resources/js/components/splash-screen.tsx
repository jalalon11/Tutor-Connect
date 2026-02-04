import React, { useEffect, useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 5000;
        const intervalTime = 50;
        const steps = duration / intervalTime;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + increment;
            });
        }, intervalTime);

        const exitTimer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Wait for fade out animation
        }, duration);

        return () => {
            clearInterval(timer);
            clearTimeout(exitTimer);
        };
    }, [onComplete]);

    return (
        <div className={cn(
            "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-gray-950 transition-opacity duration-500 ease-in-out",
            !isVisible ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
            <div className="relative flex flex-col items-center gap-8">
                {/* Logo with Animation */}
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-600/20 rounded-none blur-2xl animate-pulse" />
                    <div className="relative bg-blue-600 p-6 rounded-none shadow-2xl shadow-blue-600/20 animate-in zoom-in duration-700">
                        <AppLogoIcon className="w-16 h-16 fill-current text-white" />
                    </div>
                </div>

                {/* Text and Branding */}
                <div className="flex flex-col items-center gap-2 animate-in slide-in-from-bottom duration-1000 delay-300">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Tutor<span className="text-blue-600">Connect</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium tracking-widest text-xs uppercase">
                        Expert guidance for every learner
                    </p>
                </div>

                {/* Modern Progress Bar */}
                <div className="w-48 h-1 bg-gray-100 dark:bg-gray-800 rounded-none overflow-hidden mt-4">
                    <div
                        className="h-full bg-blue-600 transition-all duration-75 ease-out rounded-none shadow-[0_0_8px_rgba(37,99,235,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Footer Copyright */}
            <div className="absolute bottom-12 text-gray-400 dark:text-gray-600 text-[10px] font-medium tracking-[0.2em] uppercase">
                © {new Date().getFullYear()} TutorConnect Platform
            </div>
        </div>
    );
}
