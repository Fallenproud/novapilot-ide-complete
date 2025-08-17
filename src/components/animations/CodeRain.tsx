
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const codeSnippets = [
  'const app = () => {}',
  'useState()',
  'useEffect(() => {})',
  '<Component />',
  'npm install',
  'git commit -m',
  'export default',
  'import React',
  'async/await',
  'Promise.resolve()',
];

interface CodeDrop {
  id: number;
  text: string;
  x: number;
  delay: number;
}

const CodeRain = () => {
  const [drops, setDrops] = useState<CodeDrop[]>([]);

  useEffect(() => {
    const generateDrop = () => ({
      id: Math.random(),
      text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      x: Math.random() * 100,
      delay: Math.random() * 2,
    });

    // Initialize drops
    const initialDrops = Array.from({ length: 12 }, generateDrop);
    setDrops(initialDrops);

    // Regenerate drops periodically
    const interval = setInterval(() => {
      setDrops(prev => {
        const newDrops = [...prev];
        const randomIndex = Math.floor(Math.random() * newDrops.length);
        newDrops[randomIndex] = generateDrop();
        return newDrops;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
      <AnimatePresence>
        {drops.map((drop) => (
          <motion.div
            key={drop.id}
            className="absolute text-xs font-mono text-primary/40"
            style={{ left: `${drop.x}%` }}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: '100vh', opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 8,
              delay: drop.delay,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {drop.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CodeRain;
