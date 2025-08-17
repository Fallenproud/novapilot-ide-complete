
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Sparkles, 
  Code2
} from "lucide-react";
import { motion } from "framer-motion";
import { useAIStore } from "@/stores/aiStore";
import { useProjectStore } from "@/stores/projectStore";
import { aiWorkflowEngine } from "@/services/aiWorkflowEngine";
import AnimatedBackground from "@/components/animations/AnimatedBackground";
import ParticleSystem from "@/components/animations/ParticleSystem";
import CodeRain from "@/components/animations/CodeRain";
import AnimatedButton from "@/components/animations/AnimatedButton";
import TypewriterText from "@/components/animations/TypewriterText";

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const { isProcessing, clearWorkflow } = useAIStore();
  const { activeProject, createProject, setActiveProject, projects } = useProjectStore();

  const handleSubmit = async () => {
    if (!prompt.trim() || isProcessing) return;

    // Ensure we have an active project
    if (!activeProject) {
      const newProject = createProject('AI Generated Project', prompt);
      if (newProject) {
        setActiveProject(newProject);
      }
    }

    // Clear previous workflow
    clearWorkflow();

    // Navigate to playground
    navigate('/playground');

    // Start AI workflow after navigation
    setTimeout(() => {
      aiWorkflowEngine.executeWorkflow(prompt);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const placeholderTexts = [
    "Create a task management app with drag-and-drop functionality...",
    "Build a real-time chat application with user authentication...",
    "Design a modern e-commerce store with payment integration...",
    "Develop a social media dashboard with analytics...",
    "Make a portfolio website with smooth animations..."
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Layers */}
      <AnimatedBackground />
      <ParticleSystem />
      <CodeRain />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div 
              className="flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.3,
                type: "spring",
                stiffness: 200
              }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Code2 className="h-12 w-12 text-primary mr-4" />
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 100%'
                }}
              >
                NovaPilot
              </motion.h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <p className="text-xl text-muted-foreground mb-4">
                Transform your ideas into production-ready applications with AI
              </p>
              <div className="text-lg text-muted-foreground/80 h-8">
                <TypewriterText 
                  texts={[
                    "✨ Beautiful, responsive designs",
                    "⚡ Production-ready code",
                    "🚀 Deploy in seconds",
                    "🎨 Apple-level aesthetics"
                  ]}
                  speed={80}
                  deleteSpeed={40}
                  delayBetween={2000}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Prompt Input */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.div
              className="relative bg-card/80 backdrop-blur-xl border rounded-lg p-8 shadow-2xl overflow-hidden"
              animate={{
                boxShadow: isFocused 
                  ? ['0 25px 50px -12px rgba(124, 58, 237, 0.25)', '0 25px 50px -12px rgba(124, 58, 237, 0.4)', '0 25px 50px -12px rgba(124, 58, 237, 0.25)']
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'linear-gradient(45deg, transparent, hsl(var(--primary)/0.3), transparent)',
                  padding: '2px',
                }}
                animate={{
                  rotate: isFocused ? [0, 360] : 0
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="w-full h-full bg-card rounded-lg" />
              </motion.div>

              <div className="relative z-10 space-y-6">
                <div>
                  <motion.label 
                    className="text-lg font-semibold mb-4 block"
                    animate={{
                      color: isFocused ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    What would you like to build today?
                  </motion.label>
                  
                  <div className="relative">
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder={placeholderTexts[0]}
                      className="min-h-[120px] text-base resize-none transition-all duration-300 bg-background/50 backdrop-blur-sm"
                      disabled={isProcessing}
                    />
                    
                    {/* Floating placeholder */}
                    {!prompt && !isFocused && (
                      <motion.div
                        className="absolute top-3 left-3 pointer-events-none text-muted-foreground"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <TypewriterText 
                          texts={placeholderTexts}
                          speed={60}
                          deleteSpeed={30}
                          delayBetween={3000}
                        />
                      </motion.div>
                    )}
                    
                    {/* Character counter */}
                    <motion.div
                      className="absolute bottom-3 right-3 text-xs text-muted-foreground"
                      animate={{
                        opacity: prompt.length > 0 ? 1 : 0
                      }}
                    >
                      {prompt.length} characters
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="mt-3 text-sm text-muted-foreground flex items-center gap-2"
                    animate={{
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.span
                      animate={{ rotate: [0, 5, 0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ⌘⏎
                    </motion.span>
                    Press ⌘⏎ (Ctrl+Enter) to start building
                  </motion.div>
                </div>

                <AnimatedButton
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || isProcessing}
                  className="w-full text-lg py-6"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="mr-3 h-5 w-5" />
                      </motion.div>
                      Starting AI Workflow...
                    </>
                  ) : (
                    <>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Send className="mr-3 h-5 w-5" />
                      </motion.div>
                      Start Building
                    </>
                  )}
                </AnimatedButton>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            className="mt-16 grid gap-6 sm:grid-cols-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            {[
              { icon: <Code2 className="h-6 w-6" />, title: "Full-Stack Generation", desc: "Complete apps in minutes" },
              { icon: <Sparkles className="h-6 w-6" />, title: "Apple-Level Design", desc: "Beautiful, responsive UI" },
              { icon: <Send className="h-6 w-6" />, title: "Instant Deployment", desc: "Production-ready code" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="rounded-lg border bg-card/30 backdrop-blur-sm p-6 text-center hover:bg-card/50 transition-all duration-300 group overflow-hidden relative"
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  boxShadow: '0 20px 40px -12px rgba(124, 58, 237, 0.3)'
                }}
                transition={{ type: "spring", stiffness: 300 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                {/* Animated background glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.div
                  className="relative z-10"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: index * 0.5
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
