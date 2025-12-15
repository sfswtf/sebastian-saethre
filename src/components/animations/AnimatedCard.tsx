import React from 'react';
import { motion } from 'framer-motion';
import { GlowingEffect } from '../ui/glowing-effect';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  withGlow?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  onClick,
  withGlow = false
}) => {
  // Check if className has overflow-hidden - if so, we need to handle it differently
  const hasOverflowHidden = className.includes('overflow-hidden');
  const classNameWithoutOverflow = className.replace(/\boverflow-hidden\b/g, '').trim();
  
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
      className={`bg-white rounded-xl relative ${hasOverflowHidden ? '' : classNameWithoutOverflow || className}`}
      style={{
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        transition: 'box-shadow 0.3s ease'
      }}
    >
      {withGlow && (
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
      )}
      <div className={hasOverflowHidden ? 'overflow-hidden rounded-xl' : ''}>
        {children}
      </div>
    </motion.div>
  );
}; 