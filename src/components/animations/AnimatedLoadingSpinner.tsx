import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const AnimatedLoadingSpinner: React.FC<AnimatedLoadingSpinnerProps> = ({
  size = 'md',
  color = '#1d4f4d'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} border-2 border-t-transparent rounded-full`}
        style={{ borderColor: `${color} transparent ${color} ${color}` }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}; 