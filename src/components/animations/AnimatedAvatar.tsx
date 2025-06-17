import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedAvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({
  src,
  alt,
  size = 'md',
  className = '',
  onClick
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full rounded-full object-cover"
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
        style={{ backgroundColor: '#1d4f4d' }}
      />
    </motion.div>
  );
}; 