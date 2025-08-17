
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileCode2, 
  Plus, 
  Sparkles, 
  Code, 
  Settings,
  CheckCircle
} from 'lucide-react';
import { LovableProjectManager, ProjectTemplate } from '@/services/lovable/projectManager';
import { VirtualFileSystem } from '@/services/virtualFileSystem';
import { useProjectStore } from '@/stores/projectStore';

interface ProjectTemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (projectId: string) => void;
}

const ProjectTemplateSelector: React.FC<ProjectTemplateSelectorProps> = ({
  isOpen,
  onClose,
  onProjectCreated
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { createProject } = useProjectStore();

  // Initialize project manager (in real app, this would come from context)
  const vfs = new VirtualFileSystem();
  const projectManager = new LovableProjectManager(vfs);
  const templates = projectManager.getTemplates();

  const handleCreateProject = async () => {
    if (!selectedTemplate || !projectName.trim()) return;

    setIsCreating(true);
    try {
      const project = await projectManager.createFromTemplate(selectedTemplate.id, projectName);
      
      // Add to store
      createProject(project.name, project.description);
      
      onProjectCreated(project.id);
      onClose();
      
      // Reset form
      setSelectedTemplate(null);
      setProjectName('');
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getTemplateIcon = (templateId: string) => {
    switch (templateId) {
      case 'react-component':
        return <Code className="h-5 w-5 text-blue-500" />;
      case 'react-hook':
        return <Settings className="h-5 w-5 text-green-500" />;
      case 'utility-functions':
        return <FileCode2 className="h-5 w-5 text-purple-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-[#161B22] border-[#21262D]">
        <DialogHeader>
          <DialogTitle className="text-[#F0F6FC] flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create New Project</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template Selection */}
          <div className="space-y-4">
            <div>
              <Label className="text-[#F0F6FC] text-sm font-medium">Choose Template</Label>
              <p className="text-[#8B949E] text-xs mt-1">
                Select a template to get started quickly
              </p>
            </div>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'border-[#1F6FEB] bg-[#0D1117]'
                        : 'border-[#21262D] bg-[#161B22] hover:border-[#30363D]'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTemplateIcon(template.id)}
                          <CardTitle className="text-sm text-[#F0F6FC]">
                            {template.name}
                          </CardTitle>
                        </div>
                        {selectedTemplate?.id === template.id && (
                          <CheckCircle className="h-4 w-4 text-[#1F6FEB]" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-[#8B949E] mb-2">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {template.files.length} file{template.files.length !== 1 ? 's' : ''}
                        </Badge>
                        {template.dependencies && (
                          <Badge variant="outline" className="text-xs">
                            {template.dependencies.length} dependencies
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Project Configuration */}
          <div className="space-y-4">
            <div>
              <Label className="text-[#F0F6FC] text-sm font-medium">Project Details</Label>
              <p className="text-[#8B949E] text-xs mt-1">
                Configure your new project
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName" className="text-[#F0F6FC] text-sm">
                  Project Name *
                </Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name..."
                  className="bg-[#0D1117] border-[#21262D] text-[#F0F6FC] mt-1"
                />
              </div>

              {selectedTemplate && (
                <div className="space-y-3">
                  <Label className="text-[#F0F6FC] text-sm">Template Preview</Label>
                  <Card className="bg-[#0D1117] border-[#21262D]">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        {getTemplateIcon(selectedTemplate.id)}
                        <CardTitle className="text-sm text-[#F0F6FC]">
                          {selectedTemplate.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-[#8B949E] mb-3">
                        {selectedTemplate.description}
                      </p>
                      
                      <div className="space-y-2">
                        <Label className="text-[#F0F6FC] text-xs">Files included:</Label>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {selectedTemplate.files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 text-xs"
                            >
                              <FileCode2 className="h-3 w-3 text-[#8B949E]" />
                              <span className="text-[#F0F6FC] font-mono">
                                {file.path}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {file.language}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-[#21262D] text-[#8B949E] hover:text-[#F0F6FC]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={!selectedTemplate || !projectName.trim() || isCreating}
                className="bg-[#1F6FEB] hover:bg-[#1F6FEB]/90"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectTemplateSelector;
