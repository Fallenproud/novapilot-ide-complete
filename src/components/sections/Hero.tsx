
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Code2 } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Sparkles className="mr-2 h-4 w-4" />
            Powered by Claude Sonnet 4
          </Badge>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              NovaPilot
            </span>
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl text-muted-foreground">
              AI Development Environment
            </span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Transform your ideas into production-ready applications with Apple-level design excellence. 
            Complete system blueprint with live code generation and instant deployment.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-lg px-8 py-3">
              <Zap className="mr-2 h-5 w-5" />
              Try Interactive Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              <Code2 className="mr-2 h-5 w-5" />
              View Documentation
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="mb-4 rounded-full bg-purple-100 p-4 dark:bg-purple-900/20">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mb-2 font-semibold">Instant Generation</h3>
              <p className="text-sm text-muted-foreground text-center">
                Complete applications in minutes, not hours
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="mb-4 rounded-full bg-blue-100 p-4 dark:bg-blue-900/20">
                <Code2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 font-semibold">Production Ready</h3>
              <p className="text-sm text-muted-foreground text-center">
                Clean, scalable code with best practices
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="mb-4 rounded-full bg-indigo-100 p-4 dark:bg-indigo-900/20">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mb-2 font-semibold">Design Excellence</h3>
              <p className="text-sm text-muted-foreground text-center">
                Apple-level aesthetics with micro-interactions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
