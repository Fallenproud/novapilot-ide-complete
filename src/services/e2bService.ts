// E2B Service for real-time code execution and deployment
export interface E2BSession {
  id: string;
  status: 'starting' | 'running' | 'stopped' | 'error';
  url?: string;
  logs: string[];
}

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  logs: string[];
}

export interface FileChange {
  path: string;
  content: string;
  action: 'create' | 'update' | 'delete';
}

class E2BService {
  private readonly E2B_API_URL = 'wss://api.e2b.dev/v1/ws';
  private readonly E2B_REST_URL = 'https://api.e2b.dev/v1';
  private sessions: Map<string, WebSocket> = new Map();
  private eventHandlers: Map<string, ((data: any) => void)[]> = new Map();

  // WebSocket connection for real-time updates
  async createSession(projectId: string, template: string = 'node'): Promise<E2BSession> {
    const sessionId = this.generateSessionId();
    
    return new Promise((resolve, reject) => {
      try {
        const ws = new WebSocket(`${this.E2B_API_URL}/sessions`);
        
        ws.onopen = () => {
          const initMessage = {
            type: 'create_session',
            sessionId,
            projectId,
            template,
            metadata: {
              source: 'novapilot-ide',
              timestamp: Date.now()
            }
          };
          
          ws.send(JSON.stringify(initMessage));
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'session_created') {
            const session: E2BSession = {
              id: sessionId,
              status: 'running',
              url: data.url,
              logs: []
            };
            
            this.sessions.set(sessionId, ws);
            this.setupSessionHandlers(sessionId, ws);
            resolve(session);
          } else if (data.type === 'error') {
            reject(new Error(data.message));
          }
        };

        ws.onerror = (error) => {
          reject(new Error('Failed to create E2B session'));
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  // Execute code in real-time with WebSocket streaming
  async executeCode(sessionId: string, code: string, language: string = 'javascript'): Promise<void> {
    const ws = this.sessions.get(sessionId);
    if (!ws) {
      throw new Error('Session not found');
    }

    const executeMessage = {
      type: 'execute_code',
      sessionId,
      code,
      language,
      timestamp: Date.now()
    };

    ws.send(JSON.stringify(executeMessage));
  }

  // Update files in real-time
  async updateFiles(sessionId: string, changes: FileChange[]): Promise<void> {
    const ws = this.sessions.get(sessionId);
    if (!ws) {
      throw new Error('Session not found');
    }

    const updateMessage = {
      type: 'update_files',
      sessionId,
      changes,
      timestamp: Date.now()
    };

    ws.send(JSON.stringify(updateMessage));
  }

  // Install packages in real-time
  async installPackages(sessionId: string, packages: string[]): Promise<void> {
    const ws = this.sessions.get(sessionId);
    if (!ws) {
      throw new Error('Session not found');
    }

    const installMessage = {
      type: 'install_packages',
      sessionId,
      packages,
      timestamp: Date.now()
    };

    ws.send(JSON.stringify(installMessage));
  }

  // Setup event handlers for real-time updates
  private setupSessionHandlers(sessionId: string, ws: WebSocket) {
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emitEvent(sessionId, data.type, data);
    };

    ws.onclose = () => {
      this.sessions.delete(sessionId);
      this.emitEvent(sessionId, 'session_closed', { sessionId });
    };

    ws.onerror = (error) => {
      this.emitEvent(sessionId, 'session_error', { sessionId, error });
    };
  }

  // Event system for real-time updates
  onSessionEvent(sessionId: string, eventType: string, handler: (data: any) => void) {
    const key = `${sessionId}:${eventType}`;
    if (!this.eventHandlers.has(key)) {
      this.eventHandlers.set(key, []);
    }
    this.eventHandlers.get(key)!.push(handler);
  }

  private emitEvent(sessionId: string, eventType: string, data: any) {
    const key = `${sessionId}:${eventType}`;
    const handlers = this.eventHandlers.get(key) || [];
    handlers.forEach(handler => handler(data));
  }

  // Get session logs
  async getSessionLogs(sessionId: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.E2B_REST_URL}/sessions/${sessionId}/logs`, {
        headers: {
          'Authorization': `Bearer ${this.getApiKey()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const data = await response.json();
      return data.logs || [];
    } catch (error) {
      console.error('Error fetching logs:', error);
      return [];
    }
  }

  // Close session
  async closeSession(sessionId: string): Promise<void> {
    const ws = this.sessions.get(sessionId);
    if (ws) {
      ws.close();
      this.sessions.delete(sessionId);
    }

    // Clean up event handlers
    const keysToDelete = Array.from(this.eventHandlers.keys())
      .filter(key => key.startsWith(`${sessionId}:`));
    keysToDelete.forEach(key => this.eventHandlers.delete(key));
  }

  // Get deployment status
  async getDeploymentStatus(sessionId: string): Promise<{ status: string; url?: string; logs?: string[] }> {
    try {
      const response = await fetch(`${this.E2B_REST_URL}/sessions/${sessionId}/status`, {
        headers: {
          'Authorization': `Bearer ${this.getApiKey()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get deployment status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting deployment status:', error);
      return { status: 'error' };
    }
  }

  // Deploy to production
  async deployToProduction(sessionId: string, domain?: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const response = await fetch(`${this.E2B_REST_URL}/sessions/${sessionId}/deploy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getApiKey()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domain,
          production: true
        })
      });

      if (!response.ok) {
        throw new Error('Deployment failed');
      }

      const result = await response.json();
      return {
        success: true,
        url: result.url
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed'
      };
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private getApiKey(): string {
    // In a real implementation, this would come from your secure config
    // For now, we'll use a placeholder - you'll provide the real key
    return process.env.E2B_API_KEY || 'your-e2b-api-key-here';
  }
}

export const e2bService = new E2BService();