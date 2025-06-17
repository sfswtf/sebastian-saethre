import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedIconProps {
  icon: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  hoverColor?: string;
  onClick?: () => void;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon,
  className = '',
  size = 'md',
  color = '#1d4f4d',
  hoverColor = '#2a6f6d',
  onClick
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.1, color: hoverColor }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{ color }}
    >
      {icon}
    </motion.div>
  );
}; 