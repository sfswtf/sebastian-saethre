import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  className = '',
  onClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: isLoaded ? 1 : 0,
        scale: isLoaded ? 1 : 0.95
      }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={() => setIsLoaded(true)}
      />
      <motion.div
        className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-300"
        whileHover={{ opacity: 0.2 }}
      />
    </motion.div>
  );
}; 