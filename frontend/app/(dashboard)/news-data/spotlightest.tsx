import React from 'react';

interface SpotlightestProps {
    className: string;
    size?: number;
    springOptions?: { bounce: number };
}

export const Spotlightest: React.FC<SpotlightestProps> = ({ className, size = 200, springOptions = { bounce: 0 } }) => {
    return (
        <div
            className={`absolute inset-0 bg-gradient-to-r ${className}`}
            style={{
                maskImage: `radial-gradient(circle ${size}px at center, black 50%, transparent 100%)`,
                WebkitMaskImage: `radial-gradient(circle ${size}px at center, black 50%, transparent 100%)`, // For Safari compatibility
            }}
        />
    );
};