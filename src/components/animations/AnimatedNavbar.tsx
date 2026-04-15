import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useVideoStore } from '../../stores/videoStore';

interface AnimatedNavbarProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedNavbar: React.FC<AnimatedNavbarProps> = ({ children, className = '' }) => {
  const location = useLocation();
  const { videoEnded } = useVideoStore();

  const isHomepage = location.pathname === '/';

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: isHomepage ? 0 : -10 }}
      animate={isHomepage ? { opacity: videoEnded ? 1 : 0, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ position: 'relative', zIndex: 20 }}
    >
      {children}
    </motion.div>
  );
};

