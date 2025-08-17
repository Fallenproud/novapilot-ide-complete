import { EventEmitter } from 'events';

interface Workflow {
  id: string;
  name: string;
  description: string;
  tasks: WorkflowTask[];
}

interface WorkflowTask {
  id: string;
  name: string;
  description: string;
  type: string;
  inputs: any;
}

interface WorkflowExecution {
  workflowId: string;
  startTime: Date;
  endTime?: Date;
  status: string;
  results: any;
}

export class WorkflowEngine extends EventEmitter {
  private workflows: Map<string, Workflow> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();

  constructor() {
    super();
  }

  registerWorkflow(workflow: Workflow) {
    this.workflows.set(workflow.id, workflow);
    this.emit('workflow:registered', workflow);
  }

  getWorkflow(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  async executeWorkflow(workflowId: string, inputs: any): Promise<string> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow with id ${workflowId} not found`);
    }

    const executionId = crypto.randomUUID();
    const execution: WorkflowExecution = {
      workflowId: executionId,
      startTime: new Date(),
      status: 'running',
      results: {}
    };
    this.executions.set(executionId, execution);

    this.emit('workflow:started', { workflowId: executionId, inputs });

    // Simulate task execution
    for (const task of workflow.tasks) {
      this.emit('task:started', task);
      try {
        // Replace this with actual task execution logic
        const taskResult = await this.executeTask(task, inputs);
        execution.results[task.id] = taskResult;
        this.emit('task:completed', { task, result: taskResult });
      } catch (error: any) {
        execution.status = 'failed';
        execution.endTime = new Date();
        execution.results = { error: error.message };
        this.emit('task:failed', { task, error });
        this.emit('workflow:failed', { workflowId: executionId, error });
        return executionId;
      }
    }

    await this.complete(executionId, execution.results);
    return executionId;
  }

  private async executeTask(task: WorkflowTask, inputs: any): Promise<any> {
    // Simulate task execution based on task type
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Result from task ${task.id} of type ${task.type}`);
      }, 1000);
    });
  }

  async complete(workflowId: string, results: any) {
    const execution = this.executions.get(workflowId);
    if (execution) {
      execution.status = 'completed';
      execution.endTime = new Date();
      execution.results = results;
      
      this.emit('workflow:completed', { workflowId, results });
    }
  }

  async fail(workflowId: string, error: Error) {
    const execution = this.executions.get(workflowId);
    if (execution) {
      execution.status = 'failed';
      execution.endTime = new Date();
      execution.results = { error: error.message };
      
      this.emit('workflow:failed', { workflowId, error });
    }
  }

  getExecutionStatus(workflowId: string): WorkflowExecution | undefined {
    return this.executions.get(workflowId);
  }

  dispose() {
    this.workflows.clear();
    this.executions.clear();
    this.removeAllListeners();
  }
}
