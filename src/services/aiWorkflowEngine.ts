
import { useAIStore, WorkflowStep, FileOperation } from '@/stores/aiStore';
import { useProjectStore } from '@/stores/projectStore';

export class AIWorkflowEngine {
  private aiStore: ReturnType<typeof useAIStore.getState>;
  private projectStore: ReturnType<typeof useProjectStore.getState>;

  constructor() {
    this.aiStore = useAIStore.getState();
    this.projectStore = useProjectStore.getState();
  }

  async executeWorkflow(prompt: string) {
    this.aiStore.setProcessing(true);
    this.aiStore.setUserPrompt(prompt);

    try {
      await this.runAnalysis();
      await this.runPlanning();
      await this.runGeneration();
      await this.runExecution();
      await this.runDeployment();
    } catch (error) {
      console.error('Workflow error:', error);
      this.aiStore.addMessage({
        type: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        step: this.aiStore.currentStep || 'request'
      });
    } finally {
      this.aiStore.setProcessing(false);
      this.aiStore.setCurrentStep(null);
    }
  }

  private async runAnalysis() {
    this.aiStore.setCurrentStep('analysis');
    this.aiStore.addMessage({
      type: 'ai',
      content: 'Analyzing your request and scanning existing project structure...',
      step: 'analysis'
    });

    // Simulate analysis
    await this.delay(2000);
    
    const analysis = this.generateAnalysis();
    this.aiStore.setAnalysisResult(analysis);
    
    this.aiStore.addMessage({
      type: 'ai',
      content: analysis,
      step: 'analysis'
    });
  }

  private async runPlanning() {
    this.aiStore.setCurrentStep('planning');
    this.aiStore.addMessage({
      type: 'ai',
      content: 'Creating architecture plan and component structure...',
      step: 'planning'
    });

    await this.delay(2000);
    
    const plan = this.generateArchitecturePlan();
    this.aiStore.setArchitecturePlan(plan);
    
    this.aiStore.addMessage({
      type: 'ai',
      content: plan,
      step: 'planning'
    });
  }

  private async runGeneration() {
    this.aiStore.setCurrentStep('generation');
    this.aiStore.addMessage({
      type: 'ai',
      content: 'Generating code files and components...',
      step: 'generation'
    });

    await this.delay(3000);
    
    const operations = this.generateFileOperations();
    operations.forEach(op => this.aiStore.addPlannedOperation(op));
    
    // Execute file operations
    this.executeFileOperations(operations);
    
    this.aiStore.addMessage({
      type: 'ai',
      content: `Generated ${operations.length} files successfully.`,
      step: 'generation'
    });
  }

  private async runExecution() {
    this.aiStore.setCurrentStep('execution');
    this.aiStore.addMessage({
      type: 'ai',
      content: 'Building and testing application...',
      step: 'execution'
    });

    await this.delay(2000);
    
    this.aiStore.addMessage({
      type: 'ai',
      content: 'Application built successfully. Preview is ready!',
      step: 'execution'
    });
  }

  private async runDeployment() {
    this.aiStore.setCurrentStep('deployment');
    this.aiStore.addMessage({
      type: 'ai',
      content: 'Preparing deployment configuration...',
      step: 'deployment'
    });

    await this.delay(1500);
    
    this.aiStore.addMessage({
      type: 'ai',
      content: 'Deployment ready! Click deploy to publish your application.',
      step: 'deployment'
    });
  }

  private generateAnalysis(): string {
    const prompt = this.aiStore.userPrompt;
    const activeProject = this.projectStore.activeProject;
    
    return `Analysis Complete:

📋 **Request Understanding:**
- User wants: ${prompt}
- Project context: ${activeProject?.name || 'New project'}
- Existing files: ${activeProject?.files.length || 0}

🔍 **Technical Analysis:**
- Framework: React + TypeScript + Vite
- Styling: Tailwind CSS
- State: Zustand
- Components: Modular architecture recommended

✅ **Feasibility:** High - All requirements can be implemented with current stack.`;
  }

  private generateArchitecturePlan(): string {
    return `Architecture Plan:

🏗️ **Component Structure:**
- Main container component
- Feature-specific sub-components
- Shared utility components
- Custom hooks for state management

📁 **File Organization:**
- /components/[feature]/ - Feature components
- /hooks/ - Custom hooks
- /lib/ - Utilities and helpers
- /types/ - TypeScript definitions

🎨 **Styling Approach:**
- Tailwind utility classes
- Consistent design tokens
- Responsive design patterns

🔄 **State Management:**
- Local state for UI interactions
- Zustand stores for global state
- Context for shared data`;
  }

  private generateFileOperations(): FileOperation[] {
    const operations: FileOperation[] = [
      {
        type: 'create',
        path: 'src/components/generated/GeneratedComponent.tsx',
        content: this.generateSampleComponent(),
        language: 'typescript',
        reason: 'Main feature component'
      },
      {
        type: 'create',
        path: 'src/hooks/useGeneratedLogic.ts',
        content: this.generateSampleHook(),
        language: 'typescript',
        reason: 'Custom hook for business logic'
      }
    ];

    return operations;
  }

  private executeFileOperations(operations: FileOperation[]) {
    const activeProject = this.projectStore.activeProject;
    if (!activeProject) return;

    operations.forEach(operation => {
      if (operation.type === 'create' && operation.content) {
        this.projectStore.createFile(activeProject.id, {
          name: operation.path.split('/').pop() || 'untitled',
          path: operation.path,
          content: operation.content,
          language: operation.language || 'typescript',
          isGenerated: true
        });
        
        this.aiStore.addGeneratedFile(operation.path);
      }
    });
  }

  private generateSampleComponent(): string {
    return `import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const GeneratedComponent = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Generated Component</h2>
      <p className="text-muted-foreground mb-4">
        This component was generated by NovaPilot AI.
      </p>
      <Button>Take Action</Button>
    </Card>
  );
};

export default GeneratedComponent;`;
  }

  private generateSampleHook(): string {
    return `import { useState, useCallback } from 'react';

export const useGeneratedLogic = () => {
  const [state, setState] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAction = useCallback(async () => {
    setLoading(true);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setState('Action completed');
    setLoading(false);
  }, []);

  return {
    state,
    loading,
    handleAction
  };
};`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const aiWorkflowEngine = new AIWorkflowEngine();
