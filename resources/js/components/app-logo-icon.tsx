import { usePage } from '@inertiajs/react';
import type { SVGAttributes } from 'react';
import { cn } from '@/lib/utils';

interface AppLogoIconProps extends SVGAttributes<SVGElement> {
    imgClassName?: string;
}

interface AppLogoWithBackgroundProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    iconClassName?: string;
    rounded?: boolean;
}

// Hook to check if custom icon is set
export function useHasCustomIcon() {
    const { appSettings } = usePage().props as {
        appSettings?: {
            name?: string;
            icon?: string | null;
        };
    };
    return !!appSettings?.icon;
}

// Hook to get app name
export function useAppName() {
    const { appSettings } = usePage().props as {
        appSettings?: {
            name?: string;
            icon?: string | null;
        };
    };
    return appSettings?.name || 'TutorConnect';
}

// Get app icon URL
function useAppIcon() {
    const { appSettings } = usePage().props as {
        appSettings?: {
            name?: string;
            icon?: string | null;
        };
    };
    return appSettings?.icon;
}

// Wrapped component with conditional background
export function AppLogoWithBackground({ size = 'md', className, iconClassName, rounded = true }: AppLogoWithBackgroundProps) {
    const icon = useAppIcon();

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const iconSizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-6 h-6',
        lg: 'w-7 h-7',
        xl: 'w-10 h-10',
    };

    const roundedClass = rounded ? 'rounded-full' : '';

    // If custom icon is set, just show the image without background wrapper
    if (icon) {
        return (
            <img
                src={`/storage/${icon}`}
                alt="App Icon"
                className={cn(sizeClasses[size], 'object-contain', roundedClass, className)}
            />
        );
    }

    // Default: SVG with blue background wrapper
    return (
        <div className={cn(
            sizeClasses[size],
            'bg-blue-600 flex items-center justify-center',
            roundedClass,
            className
        )}>
            <svg
                className={cn(iconSizeClasses[size], 'fill-current text-white', iconClassName)}
                viewBox="0 0 40 42"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.2 5.63325L8.6 0.855469L0 5.63325V32.1434L16.2 41.1434L32.4 32.1434V23.699L40 19.4767V9.85547L31.4 5.07769L22.8 9.85547V18.2999L17.2 21.411V5.63325ZM38 18.2999L32.4 21.411V15.2545L38 12.1434V18.2999ZM36.9409 10.4439L31.4 13.5221L25.8591 10.4439L31.4 7.36561L36.9409 10.4439ZM24.8 18.2999V12.1434L30.4 15.2545V21.411L24.8 18.2999ZM23.8 20.0323L29.3409 23.1105L16.2 30.411L10.6591 27.3328L23.8 20.0323ZM7.6 27.9212L15.2 32.1434V38.2999L2 30.9666V7.92116L7.6 11.0323V27.9212ZM8.6 9.29991L3.05913 6.22165L8.6 3.14339L14.1409 6.22165L8.6 9.29991ZM30.4 24.8101L17.2 32.1434V38.2999L30.4 30.9666V24.8101ZM9.6 11.0323L15.2 7.92117V22.5221L9.6 25.6333V11.0323Z"
                />
            </svg>
        </div>
    );
}

// Original component for backwards compatibility
export default function AppLogoIcon({ imgClassName, ...props }: AppLogoIconProps) {
    const icon = useAppIcon();

    // If there's a custom app icon uploaded, use it
    if (icon) {
        return (
            <img
                src={`/storage/${icon}`}
                alt="App Icon"
                className={imgClassName || (props.className as string)}
                style={{ objectFit: 'contain' }}
            />
        );
    }

    // Default SVG icon
    return (
        <svg {...props} viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.2 5.63325L8.6 0.855469L0 5.63325V32.1434L16.2 41.1434L32.4 32.1434V23.699L40 19.4767V9.85547L31.4 5.07769L22.8 9.85547V18.2999L17.2 21.411V5.63325ZM38 18.2999L32.4 21.411V15.2545L38 12.1434V18.2999ZM36.9409 10.4439L31.4 13.5221L25.8591 10.4439L31.4 7.36561L36.9409 10.4439ZM24.8 18.2999V12.1434L30.4 15.2545V21.411L24.8 18.2999ZM23.8 20.0323L29.3409 23.1105L16.2 30.411L10.6591 27.3328L23.8 20.0323ZM7.6 27.9212L15.2 32.1434V38.2999L2 30.9666V7.92116L7.6 11.0323V27.9212ZM8.6 9.29991L3.05913 6.22165L8.6 3.14339L14.1409 6.22165L8.6 9.29991ZM30.4 24.8101L17.2 32.1434V38.2999L30.4 30.9666V24.8101ZM9.6 11.0323L15.2 7.92117V22.5221L9.6 25.6333V11.0323Z"
            />
        </svg>
    );
}

