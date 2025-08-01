
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Code, Palette } from "lucide-react";
import { motion } from "framer-motion";

const Onboarding = () => {
  const steps = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Describe Your Vision",
      description: "Tell NovaPilot what you want to build in natural language",
      example: '"Create a modern blog app with authentication"'
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Watch Magic Happen",
      description: "AI generates production-ready code with full-stack architecture",
      example: "Complete React app with TypeScript, Tailwind, and Supabase"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Apple-Level Design",
      description: "Beautiful, responsive UI that works perfectly on all devices",
      example: "Professional design with smooth animations and accessibility"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Deploy Instantly",
      description: "One-click deployment to production with live preview",
      example: "Share your app with the world in seconds"
    }
  ];

  const quickStarts = [
    "Create a task management dashboard",
    "Build a real-time chat application", 
    "Make a modern e-commerce store",
    "Design a portfolio website",
    "Develop a social media app",
    "Build a SaaS landing page"
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4">
              Quick Start Guide
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              From Idea to Production in Minutes
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Follow these simple steps to transform your ideas into production-ready applications with NovaPilot.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="mb-16 grid gap-8 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="relative h-full overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {step.icon}
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <div className="p-3 rounded-lg bg-muted/50 text-sm font-mono text-muted-foreground">
                      {step.example}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Start Commands */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 text-center">
              <h3 className="mb-4 text-2xl font-bold">Popular Quick Start Commands</h3>
              <p className="text-muted-foreground">
                Try these example prompts to see NovaPilot in action
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickStarts.map((command, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{command}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
              <h3 className="mb-4 text-2xl font-bold">Ready to Start Building?</h3>
              <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
                Join thousands of developers who are already using NovaPilot to create amazing applications faster than ever before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Try Interactive Demo
                </Button>
                <Button size="lg" variant="outline">
                  View Documentation
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Onboarding;
