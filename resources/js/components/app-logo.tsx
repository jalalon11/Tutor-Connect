import { usePage } from '@inertiajs/react';
import { AppLogoWithBackground } from './app-logo-icon';

export default function AppLogo() {
    const { appSettings } = usePage().props as {
        appSettings?: {
            name?: string;
            icon?: string | null;
        };
    };

    return (
        <>
            <AppLogoWithBackground size="sm" rounded={false} />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {appSettings?.name || 'TutorConnect'}
                </span>
            </div>
        </>
    );
}

