import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedFooter: React.FC<AnimatedFooterProps> = ({
  children,
  className = ''
}) => {
  return (
    <motion.footer
      className={`bg-stone-900 text-white ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full flex flex-col items-center justify-center">
        {children}
      </div>
    </motion.footer>
  );
}; 