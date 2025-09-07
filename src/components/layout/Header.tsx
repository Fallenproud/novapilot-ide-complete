
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useNavigate, useLocation } from "react-router-dom";
import { useUIStore } from "@/stores/uiStore";
import { useProjectStore } from "@/stores/projectStore";
import { 
  Code2, 
  FolderOpen, 
  Play, 
  Settings,
  Command,
  User,
  Bell,
  BarChart3,
  BookOpen,
  Home
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NotificationCenter } from "@/components/features/NotificationCenter";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSettings, toggleCommandPalette } = useUIStore();
  const { activeProject, projects } = useProjectStore();

  const isActive = (path: string) => location.pathname === path;

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleProjectsClick = () => {
    navigate('/projects');
  };

  const handleIDEClick = () => {
    if (activeProject) {
      navigate('/ide');
    } else {
      // Create a sample project if none exists
      const { createProject, setActiveProject } = useProjectStore.getState();
      createProject('Sample Project', 'A sample project for testing');
      // Get the newly created project
      const newProject = useProjectStore.getState().projects[0];
      setActiveProject(newProject);
      navigate('/ide');
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Code2 className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              NovaPilot
            </span>
          </button>

          <nav className="flex items-center space-x-2">
            <Button
              variant={isActive('/dashboard') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>

            <Button
              variant={isActive('/projects') ? 'default' : 'ghost'}
              size="sm"
              onClick={handleProjectsClick}
              className="flex items-center gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              Projects
              {projects.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {projects.length}
                </Badge>
              )}
            </Button>

            <Button
              variant={isActive('/ide') ? 'default' : 'ghost'}
              size="sm"
              onClick={handleIDEClick}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              IDE
              {activeProject && (
                <Badge variant="outline" className="ml-1 px-1.5 py-0.5 text-xs">
                  {activeProject.name}
                </Badge>
              )}
            </Button>

            <Button
              variant={isActive('/analytics') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>

            <Button
              variant={isActive('/docs') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/docs')}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Docs
            </Button>
          </nav>
        </div>

        {/* Right side - Actions and User */}
        <div className="flex items-center space-x-2">
          {/* Command Palette */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCommandPalette}
            className="flex items-center gap-2"
          >
            <Command className="h-4 w-4" />
            <span className="hidden sm:inline">⌘K</span>
          </Button>

          {/* Notifications */}
          <NotificationCenter />

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSettings}
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* User Profile */}
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
