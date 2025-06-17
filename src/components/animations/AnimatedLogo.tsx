import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  src: string;
  alt: string;
  className?: string;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ src, alt, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ filter: 'contrast(1.1)' }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isHovered 
            ? '0 0 30px rgba(29, 79, 77, 0.5)' 
            : '0 0 0px rgba(29, 79, 77, 0)'
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}; 