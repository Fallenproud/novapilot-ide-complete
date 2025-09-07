import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

// Ripple effect component
interface RippleProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Ripple: React.FC<RippleProps> = ({ children, className = '', disabled = false }) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute bg-current opacity-20 rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            initial={{ width: 0, height: 0, x: '-50%', y: '-50%' }}
            animate={{ width: 200, height: 200 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Magnetic hover effect
interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export const Magnetic: React.FC<MagneticProps> = ({ children, className = '', strength = 0.3 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

// Tilt effect on hover
interface TiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  speed?: number;
}

export const Tilt: React.FC<TiltProps> = ({ 
  children, 
  className = '', 
  maxTilt = 15,
  speed = 400 
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * maxTilt;
    const tiltY = ((x - centerX) / centerX) * -maxTilt;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={{ 
        rotateX: tilt.x, 
        rotateY: tilt.y,
        transformPerspective: 1000
      }}
      transition={{ duration: speed / 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
};

// Floating label animation
interface FloatingLabelProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export const FloatingLabel: React.FC<FloatingLabelProps> = ({ label, children, className = '' }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
  };

  const labelVariants = {
    default: { y: 0, scale: 1, color: 'rgb(156 163 175)' },
    active: { y: -24, scale: 0.8, color: 'rgb(99 102 241)' }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.label
        className="absolute left-3 top-3 pointer-events-none origin-left"
        variants={labelVariants}
        animate={isFocused || hasValue ? 'active' : 'default'}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>
      <div onFocus={handleFocus} onBlur={handleBlur}>
        {children}
      </div>
    </div>
  );
};

// Loading skeleton with shimmer effect
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width = '100%', 
  height = '1rem',
  rounded = false 
}) => {
  return (
    <div
      className={`bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:400%_100%] ${
        rounded ? 'rounded-full' : 'rounded-md'
      } ${className}`}
      style={{ width, height }}
    />
  );
};

// Stagger container for list animations
interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const Stagger: React.FC<StaggerProps> = ({ children, className = '', delay = 0.1 }) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Progress bar with smooth animation
interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showValue?: boolean;
  color?: string;
}

export const AnimatedProgress: React.FC<ProgressProps> = ({ 
  value, 
  max = 100, 
  className = '',
  showValue = false,
  color = 'bg-primary'
}) => {
  const percentage = (value / max) * 100;

  return (
    <div className={`relative ${className}`}>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showValue && (
        <motion.span
          className="absolute right-0 top-0 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {Math.round(percentage)}%
        </motion.span>
      )}
    </div>
  );
};

// Count up animation
interface CountUpProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ 
  value, 
  duration = 1, 
  className = '',
  prefix = '',
  suffix = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const updateValue = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setDisplayValue(Math.round(easeOutQuart * value));

      if (now < endTime) {
        requestAnimationFrame(updateValue);
      }
    };

    updateValue();
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

// Smooth reveal on scroll
interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const Reveal: React.FC<RevealProps> = ({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'up' 
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
      x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.25, 0, 1] as any,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};