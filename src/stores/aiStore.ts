
import { create } from 'zustand';

export type WorkflowStep = 
  | 'request'
  | 'analysis' 
  | 'planning'
  | 'generation'
  | 'execution'
  | 'deployment';

export interface AIMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  step?: WorkflowStep;
  metadata?: Record<string, any>;
}

export interface FileOperation {
  type: 'create' | 'update' | 'delete';
  path: string;
  content?: string;
  language?: string;
  reason?: string;
}

interface AIState {
  messages: AIMessage[];
  currentStep: WorkflowStep | null;
  isProcessing: boolean;
  isStreaming: boolean;
  
  // Workflow data
  userPrompt: string;
  analysisResult: string | null;
  architecturePlan: string | null;
  plannedOperations: FileOperation[];
  generatedFiles: string[];
  
  // Actions
  addMessage: (message: Omit<AIMessage, 'id' | 'timestamp'>) => void;
  setCurrentStep: (step: WorkflowStep | null) => void;
  setProcessing: (isProcessing: boolean) => void;
  setStreaming: (isStreaming: boolean) => void;
  
  // Workflow actions
  setUserPrompt: (prompt: string) => void;
  setAnalysisResult: (result: string) => void;
  setArchitecturePlan: (plan: string) => void;
  addPlannedOperation: (operation: FileOperation) => void;
  clearPlannedOperations: () => void;
  addGeneratedFile: (filePath: string) => void;
  clearWorkflow: () => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  messages: [],
  currentStep: null,
  isProcessing: false,
  isStreaming: false,
  
  userPrompt: '',
  analysisResult: null,
  architecturePlan: null,
  plannedOperations: [],
  generatedFiles: [],

  addMessage: (message) => {
    const newMessage: AIMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };
    
    set(state => ({
      messages: [...state.messages, newMessage]
    }));
  },

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  setProcessing: (isProcessing) => {
    set({ isProcessing });
  },

  setStreaming: (isStreaming) => {
    set({ isStreaming });
  },

  setUserPrompt: (prompt) => {
    set({ userPrompt: prompt });
  },

  setAnalysisResult: (result) => {
    set({ analysisResult: result });
  },

  setArchitecturePlan: (plan) => {
    set({ architecturePlan: plan });
  },

  addPlannedOperation: (operation) => {
    set(state => ({
      plannedOperations: [...state.plannedOperations, operation]
    }));
  },

  clearPlannedOperations: () => {
    set({ plannedOperations: [] });
  },

  addGeneratedFile: (filePath) => {
    set(state => ({
      generatedFiles: [...state.generatedFiles, filePath]
    }));
  },

  clearWorkflow: () => {
    set({
      userPrompt: '',
      analysisResult: null,
      architecturePlan: null,
      plannedOperations: [],
      generatedFiles: [],
      currentStep: null,
      isProcessing: false,
      isStreaming: false
    });
  }
}));
