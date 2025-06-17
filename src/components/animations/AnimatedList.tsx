import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedListProps {
  items: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  className = '',
  itemClassName = '',
  staggerDelay = 0.1
}) => {
  return (
    <motion.ul
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {items.map((listItem, index) => (
        <motion.li
          key={index}
          className={itemClassName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * staggerDelay,
            type: "spring",
            damping: 12,
            stiffness: 100
          }}
        >
          {listItem}
        </motion.li>
      ))}
    </motion.ul>
  );
}; 