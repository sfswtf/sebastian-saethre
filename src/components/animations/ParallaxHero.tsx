import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxHeroProps {
  children: React.ReactNode;
  imageUrl: string;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({ children, imageUrl }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 250]);

  return (
    <div className="relative h-screen overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        style={{ y }}
      >
        <img
          className="w-full h-full object-cover"
          src={imageUrl}
          alt="Background"
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </motion.div>
      <div className="relative h-full">
        {children}
      </div>
    </div>
  );
}; 