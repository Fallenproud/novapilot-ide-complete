import { useProjectStore } from '@/stores/projectStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { 
  Activity, 
  Code2, 
  FileText, 
  Users, 
  TrendingUp,
  Clock,
  GitBranch,
  Zap,
  Plus,
  FolderOpen,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { projects, activeProject } = useProjectStore();
  const navigate = useNavigate();

  const recentProjects = projects.slice(0, 4);
  
  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      change: '+12%',
      icon: FolderOpen,
      color: 'text-blue-500'
    },
    {
      title: 'Active Sessions',
      value: '2',
      change: '+5%',
      icon: Activity,
      color: 'text-green-500'
    },
    {
      title: 'Lines of Code',
      value: '24.5k',
      change: '+18%',
      icon: Code2,
      color: 'text-purple-500'
    },
    {
      title: 'Deploy Success',
      value: '98.2%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-emerald-500'
    }
  ];

  const quickActions = [
    {
      title: 'New Project',
      description: 'Create a new development project',
      icon: Plus,
      action: () => navigate('/projects?action=new')
    },
    {
      title: 'Open IDE',
      description: 'Launch the development environment',
      icon: Play,
      action: () => navigate('/ide')
    },
    {
      title: 'View Analytics',
      description: 'Check project performance metrics',
      icon: TrendingUp,
      action: () => navigate('/analytics')
    },
    {
      title: 'Browse Docs',
      description: 'Access documentation and guides',
      icon: FileText,
      action: () => navigate('/docs')
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <Breadcrumbs />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your development environment.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Recent Projects */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Recent Projects
            </CardTitle>
            <CardDescription>
              Your most recently accessed projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/ide')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Code2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{project.files.length} files</Badge>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No projects yet</p>
                <Button onClick={() => navigate('/projects')}>
                  Create Your First Project
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="ghost"
                  className="justify-start h-auto p-3"
                  onClick={action.action}
                >
                  <action.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Project Info */}
      {activeProject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Active Project: {activeProject.name}
            </CardTitle>
            <CardDescription>
              Currently working on this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline">{activeProject.files.length} files</Badge>
                <Badge variant={activeProject.status === 'deployed' ? 'default' : 'secondary'}>
                  {activeProject.status === 'deployed' ? 'Deployed' : 'Not Deployed'}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/ide')}>
                  Open in IDE
                </Button>
                <Button onClick={() => navigate('/ide')}>
                  Continue Working
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;