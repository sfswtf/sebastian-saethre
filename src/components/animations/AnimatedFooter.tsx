import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useVideoStore } from '../../stores/videoStore';

interface AnimatedFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedFooter: React.FC<AnimatedFooterProps> = ({
  children,
  className = ''
}) => {
  const location = useLocation();
  const { videoEnded } = useVideoStore();
  
  // On homepage, fade in after video ends. On other pages, use scroll-based animation
  const isHomepage = location.pathname === '/';

  return (
    <motion.footer
      className={`bg-black text-white ${className} w-full`}
      initial={{ opacity: 0, y: isHomepage ? 0 : 50 }}
      animate={isHomepage ? { 
        opacity: videoEnded ? 1 : 0,
        y: 0
      } : {}}
      whileInView={isHomepage ? undefined : { opacity: 1, y: 0 }}
      viewport={isHomepage ? undefined : { once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ position: 'relative', zIndex: 10, marginTop: 'auto' }}
    >
      <div className="w-full flex flex-col items-center justify-center">
        {children}
      </div>
    </motion.footer>
  );
}; 