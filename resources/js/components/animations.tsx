import { useEffect, useRef, useState, ReactNode } from 'react';

interface AnimatedSectionProps {
    children: ReactNode;
    animation?: 'fade-in-up' | 'fade-in' | 'scale-in' | 'slide-in-left' | 'slide-in-right';
    delay?: number;
    className?: string;
    threshold?: number;
}

export function AnimatedSection({
    children,
    animation = 'fade-in-up',
    delay = 0,
    className = '',
    threshold = 0.1
}: AnimatedSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold]);

    const animationClass = isVisible ? `animate-${animation}` : 'opacity-0';

    return (
        <div
            ref={ref}
            className={`${animationClass} ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

interface StaggeredChildrenProps {
    children: ReactNode[];
    animation?: 'fade-in-up' | 'fade-in' | 'scale-in' | 'slide-in-left' | 'slide-in-right';
    staggerDelay?: number;
    className?: string;
    childClassName?: string;
}

export function StaggeredChildren({
    children,
    animation = 'fade-in-up',
    staggerDelay = 100,
    className = '',
    childClassName = ''
}: StaggeredChildrenProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={className}>
            {children.map((child, index) => (
                <div
                    key={index}
                    className={`${isVisible ? `animate-${animation}` : 'opacity-0'} ${childClassName}`}
                    style={{ animationDelay: `${index * staggerDelay}ms` }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}

// Counter animation hook
export function useCountUp(end: number, duration: number = 2000, startOnMount: boolean = false) {
    const [count, setCount] = useState(0);
    const [isStarted, setIsStarted] = useState(startOnMount);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!startOnMount) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsStarted(true);
                        observer.disconnect();
                    }
                },
                { threshold: 0.5 }
            );

            if (ref.current) {
                observer.observe(ref.current);
            }

            return () => observer.disconnect();
        }
    }, [startOnMount]);

    useEffect(() => {
        if (!isStarted) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            setCount(Math.floor(progress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, isStarted]);

    return { count, ref };
}
