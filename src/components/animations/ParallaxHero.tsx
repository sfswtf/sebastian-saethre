import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxHeroProps {
  children: React.ReactNode;
  imageUrl: string;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({ children, imageUrl }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 250]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        style={{ y, opacity }}
      >
        <img
          className="w-full h-full object-cover"
          src={imageUrl}
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
      </motion.div>
      <motion.div 
        className="relative min-h-screen flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}; 