import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  onClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ 
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
      }}
      onClick={onClick}
      className={`bg-white rounded-xl overflow-hidden ${className}`}
      style={{
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        transition: 'box-shadow 0.3s ease'
      }}
    >
      {children}
    </motion.div>
  );
}; 