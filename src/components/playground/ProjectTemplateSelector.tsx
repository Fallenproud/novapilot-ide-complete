
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Code2, 
  Wrench,
  Sparkles
} from 'lucide-react';
import { LovableProjectManager, ProjectTemplate } from '@/services/lovable/projectManager';
import { VirtualFileSystem } from '@/services/virtualFileSystem';
import { useProjectStore } from '@/stores/projectStore';

interface ProjectTemplateSelectorProps {
  onProjectCreate?: (projectName: string, templateId: string) => void;
  className?: string;
}

const ProjectTemplateSelector: React.FC<ProjectTemplateSelectorProps> = ({ 
  onProjectCreate, 
  className = "" 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { addProject } = useProjectStore();

  // Initialize project manager with empty VFS
  const vfs = new VirtualFileSystem([]);
  const projectManager = new LovableProjectManager(vfs);
  const templates = projectManager.getTemplates();

  const getTemplateIcon = (templateId: string) => {
    switch (templateId) {
      case 'react-component':
        return <Code2 className="h-8 w-8 text-blue-500" />;
      case 'react-hook':
        return <Wrench className="h-8 w-8 text-green-500" />;
      case 'utility-functions':
        return <Sparkles className="h-8 w-8 text-purple-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const handleCreateProject = async () => {
    if (!selectedTemplate || !projectName.trim()) return;

    setIsCreating(true);
    try {
      const newProject = await projectManager.createFromTemplate(selectedTemplate, projectName);
      addProject(newProject);
      
      if (onProjectCreate) {
        onProjectCreate(projectName, selectedTemplate);
      }
      
      // Reset form
      setProjectName('');
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#F0F6FC] mb-2">Create New Project</h2>
        <p className="text-[#8B949E]">Choose a template to get started quickly</p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template: ProjectTemplate) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all border-2 ${
              selectedTemplate === template.id 
                ? 'border-[#1F6FEB] bg-[#1F6FEB]/10' 
                : 'border-[#21262D] bg-[#161B22] hover:border-[#30363D]'
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-3">
                {getTemplateIcon(template.id)}
              </div>
              <CardTitle className="text-[#F0F6FC] text-lg">
                {template.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#8B949E] text-sm mb-4 text-center">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-1 justify-center">
                {template.files.slice(0, 3).map((file, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {file.language}
                  </Badge>
                ))}
                {template.files.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{template.files.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Creation Form */}
      {selectedTemplate && (
        <Card className="bg-[#161B22] border-[#21262D]">
          <CardHeader>
            <CardTitle className="text-[#F0F6FC] flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create Project</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-[#F0F6FC] text-sm font-medium mb-2 block">
                Project Name
              </label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name..."
                className="bg-[#0D1117] border-[#21262D] text-[#F0F6FC]"
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleCreateProject}
                disabled={!projectName.trim() || isCreating}
                className="flex-1"
              >
                {isCreating ? 'Creating...' : 'Create Project'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTemplate(null);
                  setProjectName('');
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectTemplateSelector;
