import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({
    children,
    onClick,
    className = '',
    variant = 'primary',
    disabled = false,
    ...rest
  }, ref) => {
    const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-300 transform";
    
    const variantClasses = {
      primary: "bg-[#1d4f4d] text-white hover:bg-[#2a6f6d]",
      secondary: "bg-[#f8f9fa] text-[#1d4f4d] hover:bg-[#e9ecef]",
      outline: "border-2 border-[#1d4f4d] text-[#1d4f4d] hover:bg-[#1d4f4d] hover:text-white"
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
        {...(rest as HTMLMotionProps<'button'>)}
      >
        {children}
      </motion.button>
    );
  }
);
AnimatedButton.displayName = 'AnimatedButton'; 