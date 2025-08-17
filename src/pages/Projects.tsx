
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  FolderOpen, 
  Calendar, 
  Globe, 
  Settings,
  Trash2,
  Play
} from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";
import { useNavigate } from "react-router-dom";
import TemplatesPopup from "@/components/playground/TemplatesPopup";

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  
  const { projects, createProject, deleteProject, setActiveProject } = useProjectStore();
  const navigate = useNavigate();

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName.trim(), newProjectDescription.trim());
      setNewProjectName('');
      setNewProjectDescription('');
      setShowCreateForm(false);
    }
  };

  const handleOpenProject = (project: any) => {
    setActiveProject(project);
    navigate('/ide');
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-500';
      case 'building': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#F0F6FC]">
      {/* Header */}
      <div className="border-b border-[#21262D] bg-[#161B22] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-6 w-6 text-[#1F6FEB]" />
            <h1 className="text-xl font-semibold">Projects</h1>
            <Badge variant="outline" className="ml-2">{projects.length}</Badge>
          </div>
          
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#1F6FEB] hover:bg-[#1F6FEB]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8B949E]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="pl-9 bg-[#21262D] border-[#30363D] text-[#F0F6FC]"
            />
          </div>
        </div>

        {/* Create Project Form */}
        {showCreateForm && (
          <Card className="mb-6 p-6 bg-[#161B22] border-[#30363D]">
            <h3 className="text-lg font-medium mb-4">Create New Project</h3>
            <div className="space-y-4">
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name"
                className="bg-[#21262D] border-[#30363D] text-[#F0F6FC]"
              />
              <Input
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="Project description (optional)"
                className="bg-[#21262D] border-[#30363D] text-[#F0F6FC]"
              />
              <div className="flex space-x-2">
                <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
                  Create Project
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel  
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Templates Section */}
        <Card className="mb-6 p-6 bg-[#161B22] border-[#30363D]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Quick Start Templates</h3>
            <Badge variant="outline">Start fast</Badge>
          </div>
          <TemplatesPopup 
            onSelectTemplate={(prompt) => {
              setNewProjectName('');
              setNewProjectDescription(prompt);
              setShowCreateForm(true);
            }}
            trigger={
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create from Template
              </Button>
            }
          />
        </Card>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-16 w-16 text-[#30363D] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#8B949E] mb-2">
              {projects.length === 0 ? 'No projects yet' : 'No matching projects'}
            </h3>
            <p className="text-sm text-[#6E7681] mb-6">
              {projects.length === 0 
                ? 'Create your first AI-generated project to get started'
                : 'Try adjusting your search terms'
              }
            </p>
            {projects.length === 0 && (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="bg-[#161B22] border-[#30363D] hover:border-[#1F6FEB]/50 transition-colors">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-[#F0F6FC] truncate">{project.name}</h3>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                      <span className="text-xs text-[#8B949E] capitalize">{project.status}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[#8B949E] mb-4 line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-xs text-[#6E7681]">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <span>{project.files.length} files</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleOpenProject(project)}
                    >
                      <Play className="mr-2 h-3 w-3" />
                      Open
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteProject(project.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
