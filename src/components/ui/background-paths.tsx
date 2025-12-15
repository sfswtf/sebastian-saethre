"use client";

import { motion } from "framer-motion";

// Borealis color palette - balanced visibility for aurora effect
const borealisColors = [
  // Teal/cyan - increased visibility while keeping smooth flow
  "rgba(14, 184, 166, 0.4)", // brand-500 - visible teal
  "rgba(45, 212, 191, 0.35)", // brand-400 - visible cyan
  "rgba(94, 234, 212, 0.3)", // brand-300 - soft cyan
  "rgba(14, 165, 233, 0.35)", // primary-500 - visible sky blue
  "rgba(56, 189, 248, 0.3)", // primary-400 - soft light blue
  // Purple
  "rgba(168, 85, 247, 0.35)", // accent-500 - visible purple
  "rgba(192, 132, 252, 0.3)", // accent-400 - soft purple
];

function FloatingPaths({ position }: { position: number }) {
    // Fewer paths (12 instead of 30) for cleaner look
    // Longer, smoother waves for fluid aurora flow
    const paths = Array.from({ length: 12 }, (_, i) => {
        const waveOffset = i * 25; // Larger offset for more spacing
        const verticalOffset = 200 + i * 40; // Spread vertically across screen
        const colorIndex = i % borealisColors.length;
        const color = borealisColors[colorIndex];
        
        // Create long, flowing waves - like aurora across the sky
        // Larger amplitude and lower frequency for smoother curves
        const waveAmplitude = 60 + Math.sin(i * 0.8) * 30; // Varying but smooth
        const waveFrequency = 0.008 + i * 0.0003; // Lower frequency = longer waves
        const verticalDrift = Math.sin(i * 0.3) * 30; // Subtle vertical variation
        
        // Generate smooth, flowing path points
        const points: string[] = [];
        for (let x = -600; x <= 1800; x += 25) { // Larger step = smoother curves
            // Single smooth sine wave for fluid flow (removed complex multi-wave)
            const y = verticalOffset + Math.sin(x * waveFrequency + waveOffset) * waveAmplitude + verticalDrift;
            points.push(`${x},${y}`);
        }
        
        const pathD = `M${points.join(' L')}`;
        
        return {
            id: i,
            d: pathD,
            color: color,
            width: 1.8 + i * 0.06, // Slightly thicker for visibility
            opacity: 0.25 + (i % 3) * 0.12, // Increased opacity for better visibility
        };
    });

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg
                className="w-full h-full"
                viewBox="0 0 1200 800"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
            >
                <title>Borealis Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke={path.color}
                        strokeWidth={path.width}
                        strokeOpacity={path.opacity}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ 
                            pathLength: 0.3, 
                            opacity: 0.1,
                        }}
                        animate={{
                            pathLength: [0.3, 1, 0.3],
                            opacity: [0.1, path.opacity, 0.1],
                        }}
                        transition={{
                            duration: 40 + path.id * 2 + Math.random() * 10, // Slower, smoother
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut", // Smoother easing instead of linear
                            delay: path.id * 0.5, // More spacing between animations
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

// Simplified component - fewer layers for cleaner look
export function BackgroundPaths() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Two main layers for subtle depth - like aurora flowing across sky */}
            <FloatingPaths position={1} />
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 4 }}
            >
                <FloatingPaths position={-0.7} />
            </motion.div>
        </div>
    );
}

