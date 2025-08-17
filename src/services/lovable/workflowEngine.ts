
export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: 'generate' | 'analyze' | 'refactor' | 'test' | 'validate';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
  dependencies?: string[];
  estimatedDuration?: number;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  metadata: {
    category: string;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number;
  };
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  currentStepIndex: number;
  results: Record<string, any>;
  error?: string;
}

export interface WorkflowContext {
  projectFiles: any[];
  userInput: string;
  previousResults: Record<string, any>;
  preferences: Record<string, any>;
}

export class WorkflowEngine {
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();
  private executionHistory: WorkflowExecution[] = [];

  constructor() {
    this.initializeDefaultWorkflows();
  }

  private initializeDefaultWorkflows() {
    // Component Generation Workflow
    this.workflows.set('generate-component', {
      id: 'generate-component',
      name: 'Generate React Component',
      description: 'Create a new React component with TypeScript',
      steps: [
        {
          id: 'analyze-requirements',
          name: 'Analyze Requirements',
          description: 'Parse user input and determine component structure',
          type: 'analyze',
          status: 'pending',
          progress: 0
        },
        {
          id: 'generate-interface',
          name: 'Generate Interface',
          description: 'Create TypeScript interfaces for props',
          type: 'generate',
          status: 'pending',
          progress: 0
        },
        {
          id: 'generate-component',
          name: 'Generate Component',
          description: 'Create the React component code',
          type: 'generate',
          status: 'pending',
          progress: 0
        },
        {
          id: 'add-styling',
          name: 'Add Styling',
          description: 'Apply Tailwind CSS classes',
          type: 'generate',
          status: 'pending',
          progress: 0
        },
        {
          id: 'validate-code',
          name: 'Validate Code',
          description: 'Check for syntax and type errors',
          type: 'validate',
          status: 'pending',
          progress: 0
        }
      ],
      metadata: {
        category: 'Generation',
        tags: ['react', 'typescript', 'component'],
        difficulty: 'beginner',
        estimatedTime: 30
      }
    });

    // Code Refactoring Workflow
    this.workflows.set('refactor-code', {
      id: 'refactor-code',
      name: 'Refactor Code',
      description: 'Improve code structure and performance',
      steps: [
        {
          id: 'analyze-code',
          name: 'Analyze Code',
          description: 'Identify refactoring opportunities',
          type: 'analyze',
          status: 'pending',
          progress: 0
        },
        {
          id: 'extract-components',
          name: 'Extract Components',
          description: 'Split large components into smaller ones',
          type: 'refactor',
          status: 'pending',
          progress: 0
        },
        {
          id: 'optimize-performance',
          name: 'Optimize Performance',
          description: 'Add memoization and optimize renders',
          type: 'refactor',
          status: 'pending',
          progress: 0
        },
        {
          id: 'update-types',
          name: 'Update Types',
          description: 'Improve TypeScript type definitions',
          type: 'refactor',
          status: 'pending',
          progress: 0
        }
      ],
      metadata: {
        category: 'Refactoring',
        tags: ['optimization', 'typescript', 'performance'],
        difficulty: 'intermediate',
        estimatedTime: 45
      }
    });

    // Bug Fix Workflow
    this.workflows.set('fix-bugs', {
      id: 'fix-bugs',
      name: 'Fix Bugs',
      description: 'Identify and fix code issues',
      steps: [
        {
          id: 'identify-issues',
          name: 'Identify Issues',
          description: 'Scan code for potential problems',
          type: 'analyze',
          status: 'pending',
          progress: 0
        },
        {
          id: 'fix-syntax-errors',
          name: 'Fix Syntax Errors',
          description: 'Correct syntax and type errors',
          type: 'generate',
          status: 'pending',
          progress: 0
        },
        {
          id: 'fix-logic-errors',
          name: 'Fix Logic Errors',
          description: 'Correct logical issues in code',
          type: 'generate',
          status: 'pending',
          progress: 0
        },
        {
          id: 'test-fixes',
          name: 'Test Fixes',
          description: 'Verify that fixes work correctly',
          type: 'test',
          status: 'pending',
          progress: 0
        }
      ],
      metadata: {
        category: 'Debugging',
        tags: ['debugging', 'fixes', 'testing'],
        difficulty: 'advanced',
        estimatedTime: 60
      }
    });
  }

  getAllWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }

  getWorkflow(id: string): WorkflowDefinition | undefined {
    return this.workflows.get(id);
  }

  async executeWorkflow(workflowId: string, context: WorkflowContext): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    const executionId = crypto.randomUUID();
    const execution: WorkflowExecution = {
      id: executionId,
      workflowId,
      status: 'running',
      startTime: new Date(),
      currentStepIndex: 0,
      results: {}
    };

    this.executions.set(executionId, execution);

    // Emit workflow start event
    window.dispatchEvent(new CustomEvent('workflow:start', {
      detail: { execution, workflow }
    }));

    try {
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];
        execution.currentStepIndex = i;
        
        // Update step status
        step.status = 'running';
        step.progress = 0;

        // Emit step start event
        window.dispatchEvent(new CustomEvent('workflow:step-start', {
          detail: { execution, step, workflow }
        }));

        // Execute step
        const stepResult = await this.executeStep(step, context, execution.results);
        
        // Update step with result
        step.status = 'completed';
        step.progress = 100;
        step.result = stepResult;
        execution.results[step.id] = stepResult;

        // Emit step complete event
        window.dispatchEvent(new CustomEvent('workflow:step-complete', {
          detail: { execution, step, workflow, result: stepResult }
        }));

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Complete execution
      execution.status = 'completed';
      execution.endTime = new Date();
      this.executionHistory.push({ ...execution });

      // Emit workflow complete event
      window.dispatchEvent(new CustomEvent('workflow:complete', {
        detail: { execution, workflow, results: execution.results }
      }));

    } catch (error) {
      execution.status = 'failed';
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.endTime = new Date();
      this.executionHistory.push({ ...execution });

      // Emit workflow error event
      window.dispatchEvent(new CustomEvent('workflow:error', {
        detail: { execution, workflow, error }
      }));

      throw error;
    } finally {
      this.executions.delete(executionId);
    }

    return execution;
  }

  private async executeStep(step: WorkflowStep, context: WorkflowContext, previousResults: Record<string, any>): Promise<any> {
    // Simulate step execution
    const duration = 1000 + Math.random() * 2000;
    
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        step.progress = progress;
        
        if (progress < 100) {
          setTimeout(updateProgress, 100);
        } else {
          // Return mock result based on step type
          const result = this.generateMockStepResult(step, context, previousResults);
          resolve(result);
        }
      };
      
      updateProgress();
    });
  }

  private generateMockStepResult(step: WorkflowStep, context: WorkflowContext, previousResults: Record<string, any>): any {
    switch (step.type) {
      case 'analyze':
        return {
          analysis: `Analysis complete for ${step.name}`,
          insights: ['Key insight 1', 'Key insight 2'],
          recommendations: ['Recommendation 1', 'Recommendation 2']
        };
      
      case 'generate':
        return {
          code: `// Generated code for ${step.name}\nconst example = () => {\n  return <div>Generated component</div>;\n};`,
          files: [`${step.id}.tsx`],
          metadata: { linesOfCode: 10, complexity: 'low' }
        };
      
      case 'refactor':
        return {
          changes: [`Refactored ${step.name}`],
          improvements: ['Performance improvement', 'Code clarity'],
          metrics: { complexity: -20, maintainability: +15 }
        };
      
      case 'test':
        return {
          tests: [`Test for ${step.name}`],
          coverage: 85,
          passed: true
        };
      
      case 'validate':
        return {
          valid: true,
          errors: [],
          warnings: ['Minor warning about unused variable']
        };
      
      default:
        return { completed: true, message: `Step ${step.name} completed successfully` };
    }
  }

  getExecutionHistory(): WorkflowExecution[] {
    return [...this.executionHistory];
  }

  getActiveExecutions(): WorkflowExecution[] {
    return Array.from(this.executions.values());
  }

  cancelExecution(executionId: string): boolean {
    const execution = this.executions.get(executionId);
    if (execution && execution.status === 'running') {
      execution.status = 'cancelled';
      execution.endTime = new Date();
      this.executionHistory.push({ ...execution });
      this.executions.delete(executionId);
      return true;
    }
    return false;
  }

  dispose() {
    this.workflows.clear();
    this.executions.clear();
    this.executionHistory = [];
  }
}

// Export the class with the correct name
export { WorkflowEngine as LovableWorkflowEngine };
