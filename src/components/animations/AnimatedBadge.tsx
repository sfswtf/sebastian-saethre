import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBadgeProps {
  text: string;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  text,
  color = '#1d4f4d',
  className = '',
  onClick
}) => {
  return (
    <motion.div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}
      style={{ backgroundColor: `${color}20`, color }}
      whileHover={{ scale: 1.05, backgroundColor: `${color}30` }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {text}
    </motion.div>
  );
}; 