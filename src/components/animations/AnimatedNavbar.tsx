import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedNavbarProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedNavbar: React.FC<AnimatedNavbarProps> = ({
  children,
  className = ''
}) => {
  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 bg-stone-900 ${className}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full">
        <div className="h-20 flex items-center" style={{ minHeight: '80px' }}>
          {children}
        </div>
      </div>
    </motion.nav>
  );
}; 