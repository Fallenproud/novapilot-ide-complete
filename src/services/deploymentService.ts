// Enhanced E2B deployment service with real-time WebSocket integration
import { e2bService } from './e2bService';

export interface DeploymentResult {
  success: boolean;
  url?: string;
  error?: string;
  deploymentId?: string;
  sessionId?: string;
}

export interface DeploymentConfig {
  projectId: string;
  projectName: string;
  files: Array<{
    name: string;
    content: string;
    path: string;
  }>;
  template?: string;
  environment?: Record<string, string>;
}

class DeploymentService {
  private readonly E2B_API_URL = 'https://api.e2b.dev/v1';
  private readonly DEPLOYMENT_DOMAIN = 'e2b.dev';
  private activeSessions: Map<string, string> = new Map(); // projectId -> sessionId

  async deployProject(config: DeploymentConfig): Promise<DeploymentResult> {
    try {
      // Create E2B session for the project
      const session = await e2bService.createSession(
        config.projectId, 
        config.template || 'node'
      );

      // Store session mapping
      this.activeSessions.set(config.projectId, session.id);

      // Prepare file changes for upload
      const fileChanges = config.files.map(file => ({
        path: file.path || file.name,
        content: file.content,
        action: 'create' as const
      }));

      // Upload files to E2B session
      await e2bService.updateFiles(session.id, fileChanges);

      // Install dependencies if package.json exists
      const packageJson = config.files.find(f => f.name === 'package.json');
      if (packageJson) {
        try {
          const pkg = JSON.parse(packageJson.content);
          const dependencies = Object.keys(pkg.dependencies || {});
          if (dependencies.length > 0) {
            await e2bService.installPackages(session.id, dependencies);
          }
        } catch (error) {
          console.warn('Failed to parse package.json:', error);
        }
      }

      // Generate deployment URL
      const deploymentUrl = session.url || `https://${session.id}.${this.DEPLOYMENT_DOMAIN}`;

      return {
        success: true,
        url: deploymentUrl,
        deploymentId: session.id,
        sessionId: session.id
      };
    } catch (error) {
      console.error('Deployment failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed'
      };
    }
  }

  async getDeploymentStatus(deploymentId: string): Promise<{ status: string; url?: string; logs?: string[] }> {
    try {
      return await e2bService.getDeploymentStatus(deploymentId);
    } catch (error) {
      console.error('Failed to get deployment status:', error);
      return { status: 'error' };
    }
  }

  async deleteDeployment(deploymentId: string): Promise<boolean> {
    try {
      await e2bService.closeSession(deploymentId);
      
      // Remove from active sessions
      for (const [projectId, sessionId] of this.activeSessions.entries()) {
        if (sessionId === deploymentId) {
          this.activeSessions.delete(projectId);
          break;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Failed to delete deployment:', error);
      return false;
    }
  }

  // Get active session for a project
  getActiveSession(projectId: string): string | undefined {
    return this.activeSessions.get(projectId);
  }

  // Execute code in an active deployment
  async executeCodeInDeployment(projectId: string, code: string, language: string = 'javascript'): Promise<void> {
    const sessionId = this.activeSessions.get(projectId);
    if (!sessionId) {
      throw new Error('No active deployment session for this project');
    }

    await e2bService.executeCode(sessionId, code, language);
  }

  // Update files in an active deployment
  async updateDeploymentFiles(projectId: string, files: Array<{ name: string; content: string; path: string }>): Promise<void> {
    const sessionId = this.activeSessions.get(projectId);
    if (!sessionId) {
      throw new Error('No active deployment session for this project');
    }

    const fileChanges = files.map(file => ({
      path: file.path || file.name,
      content: file.content,
      action: 'update' as const
    }));

    await e2bService.updateFiles(sessionId, fileChanges);
  }

  // Deploy to production with custom domain
  async deployToProduction(projectId: string, domain?: string): Promise<{ success: boolean; url?: string; error?: string }> {
    const sessionId = this.activeSessions.get(projectId);
    if (!sessionId) {
      return {
        success: false,
        error: 'No active session found for this project'
      };
    }

    return await e2bService.deployToProduction(sessionId, domain);
  }

  // Get session logs
  async getSessionLogs(projectId: string): Promise<string[]> {
    const sessionId = this.activeSessions.get(projectId);
    if (!sessionId) {
      return [];
    }

    return await e2bService.getSessionLogs(sessionId);
  }
}

export const deploymentService = new DeploymentService();