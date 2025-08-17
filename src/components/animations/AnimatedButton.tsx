
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ReactNode, useState } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
}

const AnimatedButton = ({ 
  children, 
  onClick, 
  disabled, 
  size = 'lg', 
  variant = 'default',
  className = '' 
}: AnimatedButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    onClick?.();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Button
        onClick={handleClick}
        disabled={disabled}
        size={size}
        variant={variant}
        className={`relative overflow-hidden ${className}`}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-blue-600"
          animate={{
            backgroundPosition: isHovered ? ['0% 50%', '100% 50%'] : '0% 50%'
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut"
          }}
          style={{
            backgroundSize: '200% 100%'
          }}
        />
        
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
            animate={{
              scale: [0, 4],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut"
            }}
          />
        ))}
        
        {/* Button content */}
        <span className="relative z-10">
          {children}
        </span>
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          animate={{
            x: isHovered ? ['-100%', '200%'] : '-100%'
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut"
          }}
        />
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
