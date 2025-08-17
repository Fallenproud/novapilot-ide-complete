
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated Gradient Mesh */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 80%, hsl(var(--primary)/0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(262, 83%, 70%)/0.3 0%, transparent 50%)',
            'radial-gradient(circle at 40% 40%, hsl(220, 100%, 70%)/0.3 0%, transparent 50%), radial-gradient(circle at 60% 60%, hsl(var(--primary)/0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, hsl(280, 100%, 70%)/0.3 0%, transparent 50%), radial-gradient(circle at 20% 20%, hsl(var(--primary)/0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 80%, hsl(var(--primary)/0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(262, 83%, 70%)/0.3 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Pulsing Grid */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
        animate={{
          backgroundPosition: ['0 0', '50px 50px', '0 0']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating Orbs */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 blur-3xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
