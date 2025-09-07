
export interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  lastModified: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
  createdAt: string;
  updatedAt: string;
  isDeployed?: boolean;
}
