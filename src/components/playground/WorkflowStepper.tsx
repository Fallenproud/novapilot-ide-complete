
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  MessageSquare,
  Search, 
  FileTree, 
  Code, 
  Play, 
  Rocket,
  Check,
  Loader2
} from "lucide-react";
import { useAIStore, type WorkflowStep } from "@/stores/aiStore";

const WORKFLOW_STEPS = [
  {
    id: 'request' as WorkflowStep,
    title: 'User Request',
    description: 'Processing your requirements',
    icon: MessageSquare,
    color: 'text-blue-400'
  },
  {
    id: 'analysis' as WorkflowStep,
    title: 'Analysis',
    description: 'Scanning project structure',
    icon: Search,
    color: 'text-purple-400'
  },
  {
    id: 'planning' as WorkflowStep,
    title: 'Planning',
    description: 'Designing architecture',
    icon: FileTree,
    color: 'text-green-400'
  },
  {
    id: 'generation' as WorkflowStep,
    title: 'Generation',
    description: 'Creating code artifacts',
    icon: Code,
    color: 'text-orange-400'
  },
  {
    id: 'execution' as WorkflowStep,
    title: 'Execution',
    description: 'Building and testing',
    icon: Play,
    color: 'text-red-400'
  },
  {
    id: 'deployment' as WorkflowStep,
    title: 'Deployment',
    description: 'Ready for production',
    icon: Rocket,
    color: 'text-indigo-400'
  }
];

const WorkflowStepper = () => {
  const { currentStep, isProcessing } = useAIStore();

  const getStepStatus = (stepId: WorkflowStep) => {
    if (!currentStep) return 'pending';
    
    const currentIndex = WORKFLOW_STEPS.findIndex(s => s.id === currentStep);
    const stepIndex = WORKFLOW_STEPS.findIndex(s => s.id === stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return isProcessing ? 'active' : 'current';
    return 'pending';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#F0F6FC]">
          AI Workflow
        </h3>
        {isProcessing && (
          <Badge variant="secondary" className="bg-[#1F6FEB]/20 text-[#1F6FEB]">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Processing
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        {WORKFLOW_STEPS.map((step, index) => {
          const Icon = step.icon;
          const status = getStepStatus(step.id);
          
          return (
            <Card
              key={step.id}
              className={`p-3 transition-all duration-200 ${
                status === 'completed' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : status === 'active' || status === 'current'
                  ? 'bg-[#1F6FEB]/10 border-[#1F6FEB]/30' 
                  : 'bg-[#161B22] border-[#30363D]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 ${
                  status === 'completed' 
                    ? 'text-green-400' 
                    : status === 'active' || status === 'current'
                    ? step.color
                    : 'text-[#6E7681]'
                }`}>
                  {status === 'completed' ? (
                    <Check className="h-4 w-4" />
                  ) : status === 'active' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${
                    status === 'pending' ? 'text-[#8B949E]' : 'text-[#F0F6FC]'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-[#6E7681]">
                    {step.description}
                  </div>
                </div>

                <div className={`w-2 h-2 rounded-full ${
                  status === 'completed' 
                    ? 'bg-green-400' 
                    : status === 'active' || status === 'current'
                    ? 'bg-[#1F6FEB]' 
                    : 'bg-[#30363D]'
                }`} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowStepper;
