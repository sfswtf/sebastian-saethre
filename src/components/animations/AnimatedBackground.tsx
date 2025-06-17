import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#1d4f4d] to-[#2a6f6d]"
        animate={{
          background: [
            'linear-gradient(45deg, #1d4f4d 0%, #2a6f6d 100%)',
            'linear-gradient(45deg, #2a6f6d 0%, #1d4f4d 100%)',
            'linear-gradient(45deg, #1d4f4d 0%, #2a6f6d 100%)'
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, white 0%, transparent 50%)',
          backgroundSize: '200% 200%'
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}; 