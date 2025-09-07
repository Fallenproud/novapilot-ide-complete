
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { 
  Search, 
  FileText, 
  Settings, 
  Home, 
  FolderOpen, 
  Play, 
  BarChart3, 
  BookOpen,
  User,
  Moon,
  Sun,
  Code2,
  Terminal,
  Palette,
  Keyboard,
  Bell,
  Download,
  Upload,
  Share2,
  GitBranch,
  Bug,
  Zap
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useProjectStore } from '@/stores/projectStore';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

interface CommandAction {
  id: string;
  label: string;
  icon: React.ElementType;
  shortcut?: string;
  category: 'navigation' | 'actions' | 'settings' | 'projects' | 'tools';
  action: () => void;
  keywords?: string[];
}

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { isCommandPaletteOpen, toggleCommandPalette } = useUIStore();
  const { projects, activeProject, setActiveProject } = useProjectStore();

  useEffect(() => {
    setOpen(isCommandPaletteOpen);
  }, [isCommandPaletteOpen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandPalette();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleCommandPalette]);

  const handleClose = useCallback(() => {
    setOpen(false);
    toggleCommandPalette();
    setSearch('');
  }, [toggleCommandPalette]);

  const createAction = useCallback((
    id: string,
    label: string,
    icon: React.ElementType,
    action: () => void,
    category: CommandAction['category'],
    shortcut?: string,
    keywords?: string[]
  ): CommandAction => ({
    id,
    label,
    icon,
    action: () => {
      action();
      handleClose();
    },
    category,
    shortcut,
    keywords
  }), [handleClose]);

  const actions: CommandAction[] = [
    // Navigation
    createAction('nav-home', 'Go to Home', Home, () => navigate('/'), 'navigation', '⌘H', ['home', 'dashboard']),
    createAction('nav-projects', 'Go to Projects', FolderOpen, () => navigate('/projects'), 'navigation', '⌘P', ['projects', 'workspace']),
    createAction('nav-ide', 'Open IDE', Play, () => navigate('/ide'), 'navigation', '⌘I', ['ide', 'editor', 'code']),
    createAction('nav-analytics', 'View Analytics', BarChart3, () => navigate('/analytics'), 'navigation', '⌘A', ['analytics', 'stats', 'metrics']),
    createAction('nav-docs', 'Documentation', BookOpen, () => navigate('/docs'), 'navigation', '⌘D', ['docs', 'help', 'documentation']),

    // Settings & Actions
    createAction('toggle-theme', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, theme === 'dark' ? Sun : Moon, () => setTheme(theme === 'dark' ? 'light' : 'dark'), 'settings', '⌘⇧T', ['theme', 'dark', 'light', 'appearance']),

    // Project Actions
    createAction('new-project', 'Create New Project', FolderOpen, () => {
      const { createProject } = useProjectStore.getState();
      const name = `Project ${projects.length + 1}`;
      createProject(name, 'New project created via command palette');
      toast.success(`Created project: ${name}`);
    }, 'projects', '⌘N', ['new', 'create', 'project']),
  ];

  // Add project-specific actions
  const projectActions: CommandAction[] = projects.map(project => 
    createAction(
      `project-${project.id}`,
      `Open ${project.name}`,
      Code2,
      () => {
        setActiveProject(project);
        navigate('/ide');
      },
      'projects',
      undefined,
      ['project', project.name.toLowerCase(), 'open']
    )
  );

  const allActions = [...actions, ...projectActions];

  const filteredActions = search
    ? allActions.filter(action => {
        const searchLower = search.toLowerCase();
        return (
          action.label.toLowerCase().includes(searchLower) ||
          action.keywords?.some(keyword => keyword.includes(searchLower)) ||
          action.category.includes(searchLower)
        );
      })
    : allActions;

  const groupedActions = filteredActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, CommandAction[]>);

  const categoryLabels = {
    navigation: 'Navigation',
    actions: 'Actions',
    settings: 'Settings',
    projects: 'Projects',
    tools: 'Tools'
  };

  return (
    <CommandDialog open={open} onOpenChange={handleClose}>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList className="max-h-[400px]">
        <CommandEmpty>No results found.</CommandEmpty>
        
        {Object.entries(groupedActions).map(([category, categoryActions], index) => (
          <div key={category}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={categoryLabels[category as keyof typeof categoryLabels]}>
              {categoryActions.map((action) => {
                const Icon = action.icon;
                return (
                  <CommandItem
                    key={action.id}
                    onSelect={action.action}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{action.label}</span>
                    {action.shortcut && (
                      <CommandShortcut>{action.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
