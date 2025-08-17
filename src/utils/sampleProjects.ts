
import { Project, ProjectFile } from '@/stores/projectStore';

export const createSampleProjects = (): Project[] => {
  const sampleReactProject: Project = {
    id: crypto.randomUUID(),
    name: 'React Counter App',
    description: 'A simple React counter with modern hooks and styling',
    files: [
      {
        id: crypto.randomUUID(),
        name: 'App.tsx',
        path: 'src/App.tsx',
        content: `import React from 'react';
import Counter from './components/Counter';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          🚀 React Playground
        </h1>
        <Counter />
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Edit the code to see live changes!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;`,
        language: 'tsx',
        lastModified: new Date(),
        isGenerated: true
      },
      {
        id: crypto.randomUUID(),
        name: 'Counter.tsx',
        path: 'src/components/Counter.tsx',
        content: `import React, { useState } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  return (
    <div className="text-center">
      <div className="mb-8">
        <span className="text-6xl font-bold text-indigo-600">
          {count}
        </span>
      </div>
      
      <div className="space-x-3">
        <button
          onClick={decrement}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-lg"
        >
          - Decrease
        </button>
        
        <button
          onClick={reset}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors shadow-lg"
        >
          Reset
        </button>
        
        <button
          onClick={increment}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors shadow-lg"
        >
          + Increase
        </button>
      </div>
    </div>
  );
};

export default Counter;`,
        language: 'tsx',
        lastModified: new Date(),
        isGenerated: true
      },
      {
        id: crypto.randomUUID(),
        name: 'App.css',
        path: 'src/App.css',
        content: `/* Modern CSS with animations */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

button {
  transition: all 0.2s ease-in-out;
  transform: translateY(0);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: translateY(0);
}

.counter-animation {
  animation: pulse 0.3s ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}`,
        language: 'css',
        lastModified: new Date(),
        isGenerated: true
      },
      {
        id: crypto.randomUUID(),
        name: 'utils.ts',
        path: 'src/utils/utils.ts',
        content: `// Utility functions for the app

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};`,
        language: 'typescript',
        lastModified: new Date(),
        isGenerated: true
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'draft'
  };

  const sampleHtmlProject: Project = {
    id: crypto.randomUUID(),
    name: 'Interactive Portfolio',
    description: 'A beautiful HTML/CSS/JS portfolio website',
    files: [
      {
        id: crypto.randomUUID(),
        name: 'index.html',
        path: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>John Doe - Portfolio</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">JD</div>
            <ul class="nav-links">
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section class="hero">
            <div class="hero-content">
                <h1 class="hero-title">Hi, I'm John Doe</h1>
                <p class="hero-subtitle">Full Stack Developer & UI/UX Designer</p>
                <button class="cta-button" onclick="scrollToSection('projects')">
                    View My Work
                </button>
            </div>
        </section>

        <section id="about" class="about">
            <div class="container">
                <h2>About Me</h2>
                <p>I'm a passionate developer with 5+ years of experience creating beautiful, functional web applications.</p>
            </div>
        </section>

        <section id="projects" class="projects">
            <div class="container">
                <h2>Featured Projects</h2>
                <div class="project-grid">
                    <div class="project-card">
                        <h3>E-commerce Platform</h3>
                        <p>React, Node.js, MongoDB</p>
                    </div>
                    <div class="project-card">
                        <h3>Task Management App</h3>
                        <p>Vue.js, Express, PostgreSQL</p>
                    </div>
                    <div class="project-card">
                        <h3>Weather Dashboard</h3>
                        <p>JavaScript, API Integration</p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>`,
        language: 'html',
        lastModified: new Date(),
        isGenerated: true
      },
      {
        id: crypto.randomUUID(),
        name: 'styles.css',
        path: 'styles.css',
        content: `/* Modern Portfolio Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

.header {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    padding: 1rem 0;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #4f46e5;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: #333;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: #4f46e5;
}

.hero {
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
}

.hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: fadeInUp 1s ease;
}

.hero-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    animation: fadeInUp 1s ease 0.2s both;
}

.cta-button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    background: transparent;
    color: white;
    border: 2px solid white;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s;
    animation: fadeInUp 1s ease 0.4s both;
}

.cta-button:hover {
    background: white;
    color: #667eea;
    transform: translateY(-2px);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.about, .projects {
    padding: 5rem 0;
}

.about {
    background: #f8f9fa;
}

.about h2, .projects h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
    color: #333;
}

.project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.project-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.project-card h3 {
    color: #4f46e5;
    margin-bottom: 1rem;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem;
    }
    
    .nav-links {
        display: none;
    }
}`,
        language: 'css',
        lastModified: new Date(),
        isGenerated: true
      },
      {
        id: crypto.randomUUID(),
        name: 'script.js',
        path: 'script.js',
        content: `// Interactive Portfolio JavaScript

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Animate project cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// Observe all project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });
});

// Add click effect to CTA button
document.querySelector('.cta-button')?.addEventListener('click', function(e) {
    // Create ripple effect
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = \`
        position: absolute;
        width: \${size}px;
        height: \${size}px;
        left: \${x}px;
        top: \${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    \`;
    
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
});

// Add ripple animation styles
const style = document.createElement('style');
style.textContent = \`
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
\`;
document.head.appendChild(style);`,
        language: 'javascript',
        lastModified: new Date(),
        isGenerated: true
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'draft'
  };

  return [sampleReactProject, sampleHtmlProject];
};
