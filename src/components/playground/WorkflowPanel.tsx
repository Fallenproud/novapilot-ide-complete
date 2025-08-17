
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Square, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Zap,
  Workflow,
  History
} from 'lucide-react';
import { LovableWorkflowEngine, WorkflowDefinition, WorkflowStep } from '@/services/lovable/workflowEngine';

interface WorkflowPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

const WorkflowPanel: React.FC<WorkflowPanelProps> = ({ 
  isVisible, 
  onToggle, 
  className = "" 
}) => {
  const [workflowEngine] = useState(() => new LovableWorkflowEngine());
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep | null>(null);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [executionResults, setExecutionResults] = useState<any>(null);

  useEffect(() => {
    setWorkflows(workflowEngine.getAllWorkflows());

    // Listen for workflow events
    const handleStepStart = (event: CustomEvent) => {
      setCurrentStep(event.detail.step);
    };

    const handleStepComplete = (event: CustomEvent) => {
      const workflow = workflows.find(w => w.id === event.detail.workflowId);
      if (workflow) {
        const completedSteps = workflow.steps.filter(s => s.status === 'completed').length;
        setExecutionProgress((completedSteps / workflow.steps.length) * 100);
      }
    };

    const handleWorkflowComplete = (event: CustomEvent) => {
      setExecutionResults(event.detail.results);
      setActiveWorkflow(null);
      setCurrentStep(null);
      setExecutionProgress(0);
    };

    const handleWorkflowError = (event: CustomEvent) => {
      console.error('Workflow error:', event.detail.error);
      setActiveWorkflow(null);
      setCurrentStep(null);
    };

    window.addEventListener('workflow:step-start', handleStepStart as EventListener);
    window.addEventListener('workflow:step-complete', handleStepComplete as EventListener);
    window.addEventListener('workflow:complete', handleWorkflowComplete as EventListener);
    window.addEventListener('workflow:error', handleWorkflowError as EventListener);

    return () => {
      window.removeEventListener('workflow:step-start', handleStepStart as EventListener);
      window.removeEventListener('workflow:step-complete', handleStepComplete as EventListener);
      window.removeEventListener('workflow:complete', handleWorkflowComplete as EventListener);
      window.removeEventListener('workflow:error', handleWorkflowError as EventListener);
    };
  }, [workflows, workflowEngine]);

  const handleExecuteWorkflow = async (workflowId: string) => {
    setActiveWorkflow(workflowId);
    setExecutionProgress(0);
    setExecutionResults(null);

    try {
      const context = {
        projectFiles: [], // Would come from project store
        userInput: "Create a Button component with hover effects",
        previousResults: {},
        preferences: {}
      };

      await workflowEngine.executeWorkflow(workflowId, context);
    } catch (error) {
      console.error('Workflow execution failed:', error);
    }
  };

  const handleStopWorkflow = () => {
    setActiveWorkflow(null);
    setCurrentStep(null);
    setExecutionProgress(0);
  };

  const getStepIcon = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-400" />;
    }
  };

  const getWorkflowIcon = (workflowId: string) => {
    switch (workflowId) {
      case 'generate-component':
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'refactor-code':
        return <Workflow className="h-5 w-5 text-green-500" />;
      case 'fix-bugs':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Play className="h-5 w-5 text-gray-500" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`bg-[#161B22] border-l border-[#21262D] ${className}`}>
      <div className="p-4 border-b border-[#21262D]">
        <div className="flex items-center justify-between">
          <h3 className="text-[#F0F6FC] font-semibold flex items-center space-x-2">
            <Workflow className="h-4 w-4" />
            <span>AI Workflows</span>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-[#8B949E] hover:text-[#F0F6FC]"
          >
            ×
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Active Workflow Execution */}
          {activeWorkflow && (
            <Card className="bg-[#0D1117] border-[#21262D]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#F0F6FC] text-sm flex items-center space-x-2">
                    <Clock className="h-4 w-4 animate-spin" />
                    <span>Executing Workflow</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStopWorkflow}
                    className="h-6 px-2"
                  >
                    <Square className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-[#8B949E] mb-1">
                    <span>Progress</span>
                    <span>{Math.round(executionProgress)}%</span>
                  </div>
                  <Progress value={executionProgress} className="h-2" />
                </div>
                
                {currentStep && (
                  <div className="bg-[#161B22] p-3 rounded border border-[#21262D]">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStepIcon(currentStep)}
                      <span className="text-[#F0F6FC] text-sm font-medium">
                        {currentStep.name}
                      </span>
                    </div>
                    <p className="text-[#8B949E] text-xs">
                      {currentStep.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Execution Results */}
          {executionResults && (
            <Card className="bg-[#0D1117] border-[#21262D]">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#F0F6FC] text-sm flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Workflow Complete</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(executionResults).map(([stepId, result]) => (
                    <div key={stepId} className="text-xs">
                      <span className="text-[#8B949E]">{stepId}:</span>
                      <span className="text-[#F0F6FC] ml-2">
                        {typeof result === 'object' ? 'Completed' : String(result)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Workflows */}
          <div className="space-y-3">
            <h4 className="text-[#F0F6FC] text-sm font-medium">Available Workflows</h4>
            
            {workflows.map(workflow => (
              <Card key={workflow.id} className="bg-[#0D1117] border-[#21262D]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getWorkflowIcon(workflow.id)}
                      <div>
                        <h5 className="text-[#F0F6FC] text-sm font-medium">
                          {workflow.name}
                        </h5>
                        <p className="text-[#8B949E] text-xs">
                          {workflow.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleExecuteWorkflow(workflow.id)}
                      disabled={!!activeWorkflow}
                      className="h-8 px-3"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Run
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {workflow.steps.length} steps
                    </Badge>
                    <span className="text-[#8B949E] text-xs">
                      ~{workflow.steps.length * 0.8}s avg
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Execution History */}
          <Card className="bg-[#0D1117] border-[#21262D]">
            <CardHeader className="pb-3">
              <CardTitle className="text-[#F0F6FC] text-sm flex items-center space-x-2">
                <History className="h-4 w-4" />
                <span>Recent Executions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workflowEngine.getExecutionHistory().slice(-5).map((execution, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-[#F0F6FC]">
                      {workflows.find(w => w.id === execution.workflowId)?.name || execution.workflowId}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={execution.status === 'completed' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {execution.status}
                      </Badge>
                      <span className="text-[#8B949E]">
                        {execution.startTime.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                
                {workflowEngine.getExecutionHistory().length === 0 && (
                  <p className="text-[#8B949E] text-xs text-center py-4">
                    No workflows executed yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default WorkflowPanel;
