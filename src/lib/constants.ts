
export const COLORS = {
  primary: {
    50: 'hsl(var(--primary-50))',
    100: 'hsl(var(--primary-100))',
    200: 'hsl(var(--primary-200))',
    300: 'hsl(var(--primary-300))',
    400: 'hsl(var(--primary-400))',
    500: 'hsl(var(--primary-500))',
    600: 'hsl(var(--primary-600))',
    700: 'hsl(var(--primary-700))',
    800: 'hsl(var(--primary-800))',
    900: 'hsl(var(--primary-900))',
  },
  accent: {
    green: 'hsl(142, 71%, 45%)',
    purple: 'hsl(262, 83%, 58%)',
    orange: 'hsl(25, 95%, 53%)',
  }
} as const;

export const ANIMATION_CONFIGS = {
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  },
  smooth: {
    duration: 0.3,
    ease: [0.4, 0.0, 0.2, 1],
  },
  bounce: {
    type: "spring",
    stiffness: 400,
    damping: 10,
  }
} as const;

export const WORKFLOW_STEPS = [
  {
    id: 1,
    title: 'User Request',
    description: 'Natural language prompt describing desired functionality',
    icon: '📝',
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Holistic Analysis',
    description: 'AI analyzes requirements and existing project context',
    icon: '🔍',
    color: 'bg-purple-500'
  },
  {
    id: 3,
    title: 'Architecture Planning',
    description: 'Plans optimal file structure and component architecture',
    icon: '📋',
    color: 'bg-green-500'
  },
  {
    id: 4,
    title: 'Artifact Generation',
    description: 'Creates production-ready code with best practices',
    icon: '🏗️',
    color: 'bg-orange-500'
  },
  {
    id: 5,
    title: 'Execution & Preview',
    description: 'Runs development server with live preview updates',
    icon: '⚡',
    color: 'bg-red-500'
  },
  {
    id: 6,
    title: 'Optional Deployment',
    description: 'One-click deployment to production environment',
    icon: '🚀',
    color: 'bg-indigo-500'
  }
] as const;

export const CAPABILITIES = [
  {
    title: 'Design Excellence',
    description: 'Apple-level aesthetics with meticulous attention to detail',
    features: [
      'Responsive design across all viewport sizes',
      'Comprehensive color systems with 6+ shades',
      'Micro-interactions and smooth animations',
      'Accessibility-first approach (WCAG compliance)'
    ],
    icon: '🎨'
  },
  {
    title: 'Technical Mastery',
    description: 'Modern development stack with best practices',
    features: [
      'React 18 with latest features and TypeScript',
      'Next.js App Router for modern web applications',
      'Tailwind CSS for rapid, consistent styling',
      'Supabase integration for full-stack capabilities'
    ],
    icon: '⚡'
  },
  {
    title: 'Architecture Principles',
    description: 'Production-ready code from the first iteration',
    features: [
      'Modular file organization with clear separation',
      'Performance optimization built-in',
      'Security-first development practices',
      'Scalable component architecture'
    ],
    icon: '🏗️'
  }
] as const;
