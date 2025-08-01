
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Zap, Code2 } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
      
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="mr-2 h-3 w-3" />
              AI-Powered Development Environment
            </Badge>
          </motion.div>

          <motion.h1
            className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-600 bg-clip-text text-transparent">
              NovaPilot
            </span>
            <br />
            <span className="text-foreground">Development Environment</span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Transform ideas into production-ready applications with AI-powered code generation, 
            Apple-level design excellence, and instant deployment capabilities.
          </motion.p>

          <motion.div
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300"
            >
              <Code2 className="mr-2 h-5 w-5" />
              Try Interactive Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="hover:scale-105 transition-transform duration-200">
              <Zap className="mr-2 h-5 w-5" />
              View Capabilities
            </Button>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            className="mt-16 grid gap-6 sm:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { icon: <Code2 className="h-6 w-6" />, title: "Full-Stack Generation", desc: "Complete apps in minutes" },
              { icon: <Sparkles className="h-6 w-6" />, title: "Apple-Level Design", desc: "Beautiful, responsive UI" },
              { icon: <Zap className="h-6 w-6" />, title: "Instant Deployment", desc: "Production-ready code" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="rounded-lg border bg-card/50 p-6 text-center backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
