import type { ReactNode} from 'react';
import { useRef, useState } from 'react';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="group flex-shrink-0 w-80 p-6 rounded-none bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 hover:z-10 cursor-pointer">
            <div className="w-12 h-12 rounded-none bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
        </div>
    );
}

interface FeatureMarqueeProps {
    features: FeatureCardProps[];
}

export default function FeatureMarquee({ features }: FeatureMarqueeProps) {
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Duplicate features for seamless loop
    const duplicatedFeatures = [...features, ...features];

    return (
        <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Gradient masks for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10 pointer-events-none" />

            {/* Marquee container */}
            <div
                ref={containerRef}
                className={`flex gap-6 py-4 ${isPaused ? 'animate-marquee-paused' : 'animate-marquee'}`}
                style={{
                    width: 'max-content',
                }}
            >
                {duplicatedFeatures.map((feature, index) => (
                    <FeatureCard
                        key={`${feature.title}-${index}`}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </div>
    );
}
