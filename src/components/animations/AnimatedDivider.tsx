import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedDividerProps {
  color?: string;
  height?: number;
  className?: string;
  animated?: boolean;
}

export const AnimatedDivider: React.FC<AnimatedDividerProps> = ({
  color = '#1d4f4d',
  height = 1,
  className = '',
  animated = true
}) => {
  return (
    <div className={`w-full ${className}`}>
      {animated ? (
        <motion.div
          className="w-full"
          style={{ height: `${height}px`, backgroundColor: color }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ) : (
        <div
          className="w-full"
          style={{ height: `${height}px`, backgroundColor: color }}
        />
      )}
    </div>
  );
}; 