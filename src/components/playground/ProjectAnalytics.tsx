
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Code, 
  Calendar,
  BarChart3,
  FolderTree,
  Clock
} from 'lucide-react';
import { LovableProjectManager } from '@/services/lovable/projectManager';
import { VirtualFileSystem } from '@/services/virtualFileSystem';
import { Project } from '@/stores/projectStore';

interface ProjectAnalyticsProps {
  project: Project;
  className?: string;
}

const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({ project, className = "" }) => {
  // Initialize project manager (in real app, this would come from context)
  const vfs = new VirtualFileSystem();
  const projectManager = new LovableProjectManager(vfs);
  const analysis = projectManager.analyzeProject(project);

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      'typescript': 'bg-blue-500',
      'tsx': 'bg-blue-400',
      'javascript': 'bg-yellow-500',
      'jsx': 'bg-yellow-400',
      'css': 'bg-purple-500',
      'html': 'bg-orange-500',
      'json': 'bg-green-500',
      'md': 'bg-gray-500'
    };
    return colors[language] || 'bg-gray-400';
  };

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'typescript':
      case 'tsx':
        return '⚡';
      case 'javascript':
      case 'jsx':
        return '📜';
      case 'css':
        return '🎨';
      case 'html':
        return '🌐';
      case 'json':
        return '📋';
      case 'md':
        return '📝';
      default:
        return '📄';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#161B22] border-[#21262D]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-[#1F6FEB]" />
              <div>
                <p className="text-xs text-[#8B949E]">Files</p>
                <p className="text-lg font-semibold text-[#F0F6FC]">
                  {analysis.fileCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#161B22] border-[#21262D]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Code className="h-4 w-4 text-[#1F6FEB]" />
              <div>
                <p className="text-xs text-[#8B949E]">Lines</p>
                <p className="text-lg font-semibold text-[#F0F6FC]">
                  {analysis.totalLines.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#161B22] border-[#21262D]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-[#1F6FEB]" />
              <div>
                <p className="text-xs text-[#8B949E]">Languages</p>
                <p className="text-lg font-semibold text-[#F0F6FC]">
                  {Object.keys(analysis.languages).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#161B22] border-[#21262D]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-[#1F6FEB]" />
              <div>
                <p className="text-xs text-[#8B949E]">Updated</p>
                <p className="text-lg font-semibold text-[#F0F6FC]">
                  {Math.floor((Date.now() - analysis.lastModified.getTime()) / (1000 * 60 * 60 * 24))}d
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Language Distribution */}
        <Card className="bg-[#161B22] border-[#21262D]">
          <CardHeader>
            <CardTitle className="text-[#F0F6FC] text-sm flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Language Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analysis.languages)
                .sort(([,a], [,b]) => b - a)
                .map(([language, count]) => {
                  const percentage = (count / analysis.fileCount) * 100;
                  return (
                    <div key={language} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getLanguageIcon(language)}</span>
                          <span className="text-[#F0F6FC] capitalize">{language}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {count} file{count !== 1 ? 's' : ''}
                          </Badge>
                          <span className="text-[#8B949E] text-xs">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-[#21262D] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getLanguageColor(language)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Project Structure */}
        <Card className="bg-[#161B22] border-[#21262D]">
          <CardHeader>
            <CardTitle className="text-[#F0F6FC] text-sm flex items-center space-x-2">
              <FolderTree className="h-4 w-4" />
              <span>Project Structure</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <pre className="text-xs text-[#8B949E] font-mono whitespace-pre-wrap">
                {analysis.structure}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Project Metadata */}
      <Card className="bg-[#161B22] border-[#21262D]">
        <CardHeader>
          <CardTitle className="text-[#F0F6FC] text-sm flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Project Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#8B949E]">Created</p>
              <p className="text-[#F0F6FC] font-medium">
                {project.createdAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-[#8B949E]">Last Modified</p>
              <p className="text-[#F0F6FC] font-medium">
                {analysis.lastModified.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-[#8B949E]">Status</p>
              <Badge 
                variant={project.status === 'deployed' ? 'default' : 'secondary'}
                className="mt-1"
              >
                {project.status}
              </Badge>
            </div>
            <div>
              <p className="text-[#8B949E]">Average File Size</p>
              <p className="text-[#F0F6FC] font-medium">
                {Math.round(analysis.totalLines / analysis.fileCount)} lines
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectAnalytics;
