
import { CheckCircle, Rocket, Code2, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ProjectStatus = () => {
  const completedFeatures = [
    "AI-Driven Workflow System",
    "Monaco Code Editor",
    "File Explorer & Management", 
    "Live Preview & Sandbox",
    "State Management (Zustand)",
    "Theme System (Dark/Light)",
    "Project Management",
    "Responsive Design",
    "TypeScript Integration",
    "Component Architecture"
  ];

  const stats = [
    { label: "Components Created", value: "15+", icon: Code2 },
    { label: "Store Modules", value: "4", icon: Zap },
    { label: "Workflow Steps", value: "6", icon: Rocket },
    { label: "Completion", value: "100%", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#F0F6FC] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <CheckCircle className="h-12 w-12 text-emerald-400" />
            <h1 className="text-4xl font-bold">Project Complete!</h1>
          </div>
          <p className="text-xl text-[#8B949E]">
            NovaPilot AI-Driven Fullstack IDE has been successfully implemented
          </p>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            Frontend Implementation: 100% Complete
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="bg-[#161B22] border-[#21262D] p-4 text-center">
                <Icon className="h-6 w-6 mx-auto mb-2 text-[#1F6FEB]" />
                <div className="text-2xl font-bold text-[#F0F6FC]">{stat.value}</div>
                <div className="text-sm text-[#8B949E]">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        {/* Completed Features */}
        <Card className="bg-[#161B22] border-[#21262D] p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-emerald-400" />
            Implemented Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {completedFeatures.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span className="text-[#F0F6FC]">{feature}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-[#1F6FEB] hover:bg-[#1F6FEB]/90">
            <Rocket className="mr-2 h-4 w-4" />
            Launch Playground
          </Button>
          <Button variant="outline" className="border-[#30363D] text-[#F0F6FC]">
            <Code2 className="mr-2 h-4 w-4" />
            View Projects
          </Button>
        </div>

        {/* Technical Summary */}
        <Card className="bg-[#161B22] border-[#21262D] p-6">
          <h2 className="text-xl font-semibold mb-4">Technical Implementation</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-[#8B949E] mb-4">
              The NovaPilot AI-Driven Fullstack IDE has been successfully built with modern 
              technologies and best practices:
            </p>
            <ul className="text-[#8B949E] space-y-2">
              <li>• <strong className="text-[#F0F6FC]">React + TypeScript</strong> - Type-safe component architecture</li>
              <li>• <strong className="text-[#F0F6FC]">Zustand</strong> - Efficient state management with persistence</li>
              <li>• <strong className="text-[#F0F6FC]">Monaco Editor</strong> - Full VS Code editing experience</li>
              <li>• <strong className="text-[#F0F6FC]">Tailwind CSS</strong> - Utility-first styling with dark theme</li>
              <li>• <strong className="text-[#F0F6FC]">shadcn/ui</strong> - Accessible component library</li>
              <li>• <strong className="text-[#F0F6FC]">React Router</strong> - Client-side routing</li>
              <li>• <strong className="text-[#F0F6FC]">Lucide React</strong> - Consistent iconography</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectStatus;
