
import { useState, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useUIStore } from '@/stores/uiStore';
import { useProjectStore } from '@/stores/projectStore';
import { useEditorStore } from '@/stores/editorStore';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Settings,
  FolderOpen,
  Play,
  Square,
  RefreshCw,
  Moon,
  Sun,
  Code,
  Eye,
  Terminal,
  Search,
  Plus
} from 'lucide-react';

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const {
    isCommandPaletteOpen,
    toggleCommandPalette,
    toggleSettings,
    isDarkMode,
    toggleDarkMode,
    layout,
    setLayout
  } = useUIStore();
  
  const { activeProject, projects, createProject } = useProjectStore();
  const { closeAllTabs, tabs } = useEditorStore();

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

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      toggleCommandPalette();
    }
  };

  const runCommand = (command: () => void) => {
    command();
    handleOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
            <FileText className="mr-2 h-4 w-4" />
            Go to Home
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/projects'))}>
            <FolderOpen className="mr-2 h-4 w-4" />
            Go to Projects
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/ide'))}>
            <Code className="mr-2 h-4 w-4" />
            Go to IDE
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Project Actions">
          <CommandItem onSelect={() => runCommand(() => createProject('New Project', 'Created via command palette'))}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Project
          </CommandItem>
          {activeProject && (
            <CommandItem onSelect={() => runCommand(() => navigate('/ide'))}>
              <Play className="mr-2 h-4 w-4" />
              Open Current Project
            </CommandItem>
          )}
        </CommandGroup>

        <CommandGroup heading="Editor Actions">
          <CommandItem onSelect={() => runCommand(closeAllTabs)}>
            <Square className="mr-2 h-4 w-4" />
            Close All Tabs
          </CommandItem>
          {tabs.length > 0 && (
            <CommandItem onSelect={() => runCommand(() => window.location.reload())}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Editor
            </CommandItem>
          )}
        </CommandGroup>

        <CommandGroup heading="Layout">
          <CommandItem onSelect={() => runCommand(() => setLayout('split'))}>
            <Eye className="mr-2 h-4 w-4" />
            Split View
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLayout('editor-only'))}>
            <Code className="mr-2 h-4 w-4" />
            Editor Only
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setLayout('preview-only'))}>
            <Eye className="mr-2 h-4 w-4" />
            Preview Only
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(toggleSettings)}>
            <Settings className="mr-2 h-4 w-4" />
            Open Settings
          </CommandItem>
          <CommandItem onSelect={() => runCommand(toggleDarkMode)}>
            {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
          </CommandItem>
        </CommandGroup>

        {projects.length > 0 && (
          <CommandGroup heading="Recent Projects">
            {projects.slice(0, 5).map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => runCommand(() => {
                  // Set active project and navigate
                  useProjectStore.getState().setActiveProject(project);
                  navigate('/ide');
                })}
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                {project.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
