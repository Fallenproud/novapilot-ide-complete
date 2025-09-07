import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  FolderOpen, 
  Code2, 
  BarChart3, 
  Settings, 
  BookOpen,
  Bell,
  User,
  ChevronRight,
  ChevronLeft,
  Search,
  Terminal
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Magnetic } from '@/components/animations/MicroInteractions';

interface SidebarItem {
  id: string;
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
  shortcut?: string;
}

interface MiniSidebarProps {
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  className?: string;
}

const MiniSidebar: React.FC<MiniSidebarProps> = ({ 
  expanded = false, 
  onToggle,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    { id: 'home', icon: Home, label: 'Home', path: '/', shortcut: '⌘H' },
    { id: 'projects', icon: FolderOpen, label: 'Projects', path: '/projects', shortcut: '⌘P' },
    { id: 'ide', icon: Code2, label: 'IDE', path: '/ide', shortcut: '⌘I' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics', shortcut: '⌘A' },
    { id: 'docs', icon: BookOpen, label: 'Documentation', path: '/docs', shortcut: '⌘D' },
    { id: 'notifications', icon: Bell, label: 'Notifications', path: '/notifications', badge: 3 },
  ];

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <TooltipProvider>
      <motion.div 
        className={`fixed left-0 top-0 h-full bg-card/95 backdrop-blur-sm border-r border-border z-40 flex flex-col shadow-lg ${className}`}
        initial={{ width: 64 }}
        animate={{ width: isExpanded ? 240 : 64 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <Code2 className="h-5 w-5 text-primary" />
                <span className="font-bold text-sm">NovaPilot</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Magnetic strength={0.2}>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleToggle}
              className="hover:bg-accent/80 transition-colors"
            >
              {isExpanded ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </Magnetic>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Tooltip key={item.id} delayDuration={isExpanded ? 1000 : 300}>
                <TooltipTrigger asChild>
                  <Magnetic strength={0.15}>
                    <Button
                      variant={active ? "secondary" : "ghost"}
                      size={isExpanded ? "default" : "icon"}
                      onClick={() => handleItemClick(item.path)}
                      className={`
                        w-full justify-start relative group transition-all duration-200
                        ${active 
                          ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                          : 'hover:bg-accent/80 hover:text-accent-foreground'
                        }
                        ${!isExpanded && 'px-0'}
                      `}
                    >
                      <div className="relative">
                        <Icon className={`h-4 w-4 ${isExpanded ? 'mr-3' : ''}`} />
                        {item.badge && (
                          <Badge 
                            variant="destructive" 
                            className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 text-left"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </Button>
                  </Magnetic>
                </TooltipTrigger>
                
                <TooltipContent 
                  side="right" 
                  className={isExpanded ? "hidden" : ""}
                >
                  <div className="flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">
                        {item.shortcut}
                      </kbd>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-border p-2 space-y-1">
          <Tooltip delayDuration={isExpanded ? 1000 : 300}>
            <TooltipTrigger asChild>
              <Magnetic strength={0.15}>
                <Button
                  variant="ghost"
                  size={isExpanded ? "default" : "icon"}
                  className={`w-full justify-start ${!isExpanded && 'px-0'}`}
                >
                  <Search className={`h-4 w-4 ${isExpanded ? 'mr-3' : ''}`} />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        Search
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Magnetic>
            </TooltipTrigger>
            <TooltipContent side="right" className={isExpanded ? "hidden" : ""}>
              Search (⌘K)
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={isExpanded ? 1000 : 300}>
            <TooltipTrigger asChild>
              <Magnetic strength={0.15}>
                <Button
                  variant="ghost"
                  size={isExpanded ? "default" : "icon"}
                  className={`w-full justify-start ${!isExpanded && 'px-0'}`}
                >
                  <Settings className={`h-4 w-4 ${isExpanded ? 'mr-3' : ''}`} />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        Settings
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </Magnetic>
            </TooltipTrigger>
            <TooltipContent side="right" className={isExpanded ? "hidden" : ""}>
              Settings (⌘,)
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={isExpanded ? 1000 : 300}>
            <TooltipTrigger asChild>
              <Magnetic strength={0.15}>
                <Button
                  variant="ghost"
                  size={isExpanded ? "default" : "icon"}
                  className={`w-full justify-start ${!isExpanded && 'px-0'}`}
                >
                  <div className="relative">
                    <User className={`h-4 w-4 ${isExpanded ? 'mr-3' : ''}`} />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-start"
                      >
                        <span className="text-sm">John Doe</span>
                        <span className="text-xs text-muted-foreground">Online</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </Magnetic>
            </TooltipTrigger>
            <TooltipContent side="right" className={isExpanded ? "hidden" : ""}>
              Profile
            </TooltipContent>
          </Tooltip>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default MiniSidebar;