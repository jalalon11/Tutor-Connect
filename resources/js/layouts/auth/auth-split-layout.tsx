import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Users, Star } from 'lucide-react';
import { AppLogoWithBackground } from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps, SharedData } from '@/types';

const HIGHLIGHTS = [
    {
        icon: Users,
        title: 'Professional Tutors',
        description: 'Connect with verified experts and experienced educators in various fields.'
    },
    {
        icon: BookOpen,
        title: 'Tailored Learning',
        description: 'Get personalized lesson plans designed to help you succeed at your own pace.'
    },
    {
        icon: Star,
        title: 'Premium Experience',
        description: 'Access top-tier resources and interactive tools for an engaging learning journey.'
    }
];

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2">
            {/* Left Column: Highlights (Minimalist Design) */}
            <div className="relative hidden lg:flex flex-col justify-between p-16 overflow-hidden bg-slate-50 dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800">
                <div className="relative z-10 w-full">
                    <Link
                        href={home()}
                        className="flex items-center gap-3 text-slate-900 dark:text-white"
                    >
                        <AppLogoWithBackground size="md" />
                        <span className="text-xl font-bold tracking-tight">{name}</span>
                    </Link>

                    <div className="mt-24 max-w-lg">
                        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-[1.2]">
                            Elevate your learning <br />
                            <span className="text-blue-600">with expert guidance.</span>
                        </h2>

                        <div className="mt-16 space-y-10">
                            {HIGHLIGHTS.map((highlight, index) => (
                                <div key={index} className="flex gap-5 group">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-none bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center shadow-sm transition-all group-hover:border-blue-200 dark:group-hover:border-blue-900/50 group-hover:shadow-blue-500/5">
                                        <highlight.icon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100">{highlight.title}</h3>
                                        <p className="text-slate-500 dark:text-gray-400 text-sm mt-1.5 leading-relaxed">
                                            {highlight.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 p-5 rounded-none bg-white dark:bg-zinc-900 shadow-sm border border-slate-200 dark:border-zinc-800">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-9 w-9 rounded-none border-2 border-white dark:border-zinc-900 bg-gray-200 overflow-hidden shadow-sm">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="avatar" />
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-gray-400 font-medium mt-1">Trusted by 2,000+ Students</p>
                    </div>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="flex items-center justify-center p-12 bg-white dark:bg-gray-950">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col mb-10 lg:hidden">
                        <Link
                            href={home()}
                            className="flex items-center gap-2 mb-8"
                        >
                            <AppLogoWithBackground size="sm" />
                            <span className="text-xl font-bold">{name}</span>
                        </Link>
                    </div>

                    <div className="space-y-2 mb-10">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>
                        <p className="text-muted-foreground text-balanced">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
