import { useId } from 'react';
import { cn } from '@/lib/utils';

interface EnvelopeLoaderProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
    sm: {
        borderWidth: '20px 30px 15px 30px',
        afterRight: '31px',
        afterTop: '-20px',
        afterHeight: '35px',
        afterWidth: '25px',
        bgSize: '15px 2px',
        bgPositionStart: '0px 5px, 4px 17px, 0px 30px',
        dropStart: '50px 5px, 57px 17px, 52px 30px',
        dropMid: '0px 5px, 10px 17px, 2px 30px',
        dropEnd: '-15px 5px, 0px 17px, -5px 30px',
        dropFinal: '-15px 5px, -15px 17px, -15px 30px',
    },
    md: {
        borderWidth: '40px 60px 30px 60px',
        afterRight: '62px',
        afterTop: '-40px',
        afterHeight: '70px',
        afterWidth: '50px',
        bgSize: '30px 4px',
        bgPositionStart: '0px 11px, 8px 35px, 0px 60px',
        dropStart: '100px 11px, 115px 35px, 105px 60px',
        dropMid: '0px 11px, 20px 35px, 5px 60px',
        dropEnd: '-30px 11px, 0px 35px, -10px 60px',
        dropFinal: '-30px 11px, -30px 35px, -30px 60px',
    },
    lg: {
        borderWidth: '60px 90px 45px 90px',
        afterRight: '93px',
        afterTop: '-60px',
        afterHeight: '105px',
        afterWidth: '75px',
        bgSize: '45px 6px',
        bgPositionStart: '0px 16px, 12px 52px, 0px 90px',
        dropStart: '150px 16px, 172px 52px, 157px 90px',
        dropMid: '0px 16px, 30px 52px, 7px 90px',
        dropEnd: '-45px 16px, 0px 52px, -15px 90px',
        dropFinal: '-45px 16px, -45px 52px, -45px 90px',
    },
};

export function EnvelopeLoader({ className, size = 'md' }: EnvelopeLoaderProps) {
    const styles = sizeStyles[size];
    const id = useId();
    const uniqueId = id.replace(/:/g, '');

    return (
        <>
            <span className={cn(`envelope-loader-${uniqueId}`, className)} />
            <style>{`
                .envelope-loader-${uniqueId} {
                    position: relative;
                    border-style: solid;
                    box-sizing: border-box;
                    border-width: ${styles.borderWidth};
                    border-color: #3760C9 #96DDFC #96DDFC #36BBF7;
                    animation: envFloating-${uniqueId} 1s ease-in infinite alternate;
                }

                .envelope-loader-${uniqueId}:after {
                    content: "";
                    position: absolute;
                    right: ${styles.afterRight};
                    top: ${styles.afterTop};
                    height: ${styles.afterHeight};
                    width: ${styles.afterWidth};
                    background-image:
                        linear-gradient(#1e3a5f 45px, transparent 0),
                        linear-gradient(#1e3a5f 45px, transparent 0),
                        linear-gradient(#1e3a5f 45px, transparent 0);
                    background-repeat: no-repeat;
                    background-size: ${styles.bgSize};
                    background-position: ${styles.bgPositionStart};
                    animation: envDropping-${uniqueId} 0.75s linear infinite;
                }

                @keyframes envFloating-${uniqueId} {
                    0% { transform: translate(-2px, -5px); }
                    100% { transform: translate(0, 5px); }
                }

                @keyframes envDropping-${uniqueId} {
                    0% { background-position: ${styles.dropStart}; opacity: 1; }
                    50% { background-position: ${styles.dropMid}; }
                    60% { background-position: ${styles.dropEnd}; }
                    75%, 100% { background-position: ${styles.dropFinal}; opacity: 0; }
                }
            `}</style>
        </>
    );
}
