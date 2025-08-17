// E2B deployment service for publishing projects
export interface DeploymentResult {
  success: boolean;
  url?: string;
  error?: string;
  deploymentId?: string;
}

export interface DeploymentConfig {
  projectId: string;
  projectName: string;
  files: Array<{
    name: string;
    content: string;
    path: string;
  }>;
}

class DeploymentService {
  private readonly E2B_API_URL = 'https://api.e2b.dev/v1';
  private readonly DEPLOYMENT_DOMAIN = 'e2b.dev';

  async deployProject(config: DeploymentConfig): Promise<DeploymentResult> {
    try {
      // Generate a unique deployment ID
      const deploymentId = this.generateDeploymentId(config.projectName);
      
      // Prepare deployment payload
      const payload = {
        template: 'static-web',
        files: this.prepareFiles(config.files),
        environment: {
          name: config.projectName,
          description: `Deployed from NovaPilot IDE`,
        },
        metadata: {
          source: 'novapilot-ide',
          projectId: config.projectId,
          deployedAt: new Date().toISOString(),
        }
      };

      // For demo purposes, we'll simulate the deployment
      // In a real implementation, you would make an actual API call to E2B
      const result = await this.simulateDeployment(deploymentId, payload);

      return {
        success: true,
        url: `https://${deploymentId}.${this.DEPLOYMENT_DOMAIN}`,
        deploymentId: deploymentId,
      };
    } catch (error) {
      console.error('Deployment failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Deployment failed',
      };
    }
  }

  private generateDeploymentId(projectName: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    const sanitizedName = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .substring(0, 10);
    
    return `${sanitizedName}-${timestamp}-${random}`;
  }

  private prepareFiles(files: Array<{ name: string; content: string; path: string }>) {
    const preparedFiles: Record<string, string> = {};
    
    // Ensure we have an index.html
    const hasIndex = files.some(f => f.name === 'index.html');
    if (!hasIndex) {
      preparedFiles['index.html'] = this.generateDefaultIndex(files);
    }

    // Add all project files
    files.forEach(file => {
      preparedFiles[file.path || file.name] = file.content;
    });

    return preparedFiles;
  }

  private generateDefaultIndex(files: Array<{ name: string; content: string }>): string {
    const cssFile = files.find(f => f.name.endsWith('.css'));
    const jsFile = files.find(f => f.name.endsWith('.js'));

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NovaPilot Project</title>
    ${cssFile ? `<style>${cssFile.content}</style>` : ''}
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Your Deployed Project</h1>
        <p>This project was deployed from NovaPilot IDE.</p>
        <p>Created with advanced development tools and live preview capabilities.</p>
    </div>
    ${jsFile ? `<script>${jsFile.content}</script>` : ''}
</body>
</html>`;
  }

  private async simulateDeployment(deploymentId: string, payload: any): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would be:
    // const response = await fetch(`${this.E2B_API_URL}/deployments`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${E2B_API_KEY}`,
    //   },
    //   body: JSON.stringify(payload),
    // });
    
    // if (!response.ok) {
    //   throw new Error(`Deployment failed: ${response.statusText}`);
    // }
    
    // return response.json();
    
    console.log('Deployment simulated:', { deploymentId, payload });
  }

  async getDeploymentStatus(deploymentId: string): Promise<{ status: string; url?: string }> {
    // Simulate status check
    return {
      status: 'deployed',
      url: `https://${deploymentId}.${this.DEPLOYMENT_DOMAIN}`,
    };
  }

  async deleteDeployment(deploymentId: string): Promise<boolean> {
    try {
      // Simulate deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Failed to delete deployment:', error);
      return false;
    }
  }
}

export const deploymentService = new DeploymentService();