import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedNotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
  onClose: () => void;
}

export const AnimatedNotification: React.FC<AnimatedNotificationProps> = ({
  message,
  type = 'info',
  isVisible,
  onClose
}) => {
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        >
          <div className={`${typeClasses[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`}>
            <span className="mr-4">{message}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 