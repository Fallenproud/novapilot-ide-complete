import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Layers, 
  Globe, 
  Database, 
  FileText, 
  Zap, 
  Smartphone,
  ShoppingBag,
  BookOpen,
  Calendar,
  MessageSquare,
  Gamepad2,
  TrendingUp,
  Users
} from 'lucide-react';

const QUICK_TEMPLATES = [
  {
    id: 'webapp',
    title: 'Web Application',
    description: 'Modern responsive web app with authentication',
    icon: Globe,
    category: 'Web',
    prompt: 'Create a modern web application with user authentication, dashboard, and responsive design using React and TypeScript'
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Store',
    description: 'Online store with cart and payments',
    icon: ShoppingBag,
    category: 'E-commerce',
    prompt: 'Build an e-commerce platform with product catalog, shopping cart, user accounts, and payment integration'
  },
  {
    id: 'blog',
    title: 'Blog Platform',
    description: 'Content management with rich editor',
    icon: BookOpen,
    category: 'Content',
    prompt: 'Create a blog platform with rich text editor, categories, comments, and user management'
  },
  {
    id: 'dashboard',
    title: 'Analytics Dashboard',
    description: 'Data visualization and reporting',
    icon: TrendingUp,
    category: 'Analytics',
    prompt: 'Build an analytics dashboard with charts, graphs, data visualization, and real-time metrics'
  },
  {
    id: 'social',
    title: 'Social Platform',
    description: 'Social networking with feeds and messaging',
    icon: Users,
    category: 'Social',
    prompt: 'Create a social media platform with user profiles, posts, comments, messaging, and real-time updates'
  },
  {
    id: 'api',
    title: 'REST API',
    description: 'Backend API with database integration',
    icon: Database,
    category: 'Backend',
    prompt: 'Build a RESTful API with authentication, CRUD operations, database integration, and API documentation'
  },
  {
    id: 'mobile',
    title: 'Mobile App',
    description: 'Cross-platform mobile application',
    icon: Smartphone,
    category: 'Mobile',
    prompt: 'Create a mobile-first web application with PWA features, offline capability, and native-like experience'
  },
  {
    id: 'chat',
    title: 'Chat Application',
    description: 'Real-time messaging with rooms',
    icon: MessageSquare,
    category: 'Communication',
    prompt: 'Build a real-time chat application with rooms, private messaging, file sharing, and user presence'
  },
  {
    id: 'task',
    title: 'Task Manager',
    description: 'Project management with kanban board',
    icon: Calendar,
    category: 'Productivity',
    prompt: 'Create a task management app with kanban boards, deadlines, team collaboration, and progress tracking'
  },
  {
    id: 'game',
    title: 'Web Game',
    description: 'Interactive browser-based game',
    icon: Gamepad2,
    category: 'Entertainment',
    prompt: 'Build an interactive web game with scoreboard, multiplayer features, and engaging gameplay mechanics'
  },
  {
    id: 'component',
    title: 'React Component',
    description: 'Reusable UI component library',
    icon: FileText,
    category: 'Component',
    prompt: 'Generate a reusable React component library with TypeScript, proper styling, and comprehensive documentation'
  },
  {
    id: 'fullstack',
    title: 'Full-Stack App',
    description: 'Complete application with frontend and backend',
    icon: Zap,
    category: 'Full-Stack',
    prompt: 'Create a complete full-stack application with React frontend, Node.js backend, database, and deployment configuration'
  }
];

const categories = [...new Set(QUICK_TEMPLATES.map(t => t.category))];

interface TemplatesPopupProps {
  onSelectTemplate: (prompt: string) => void;
  trigger?: React.ReactNode;
}

const TemplatesPopup: React.FC<TemplatesPopupProps> = ({ onSelectTemplate, trigger }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [open, setOpen] = useState(false);

  const filteredTemplates = selectedCategory === 'All' 
    ? QUICK_TEMPLATES 
    : QUICK_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (template: typeof QUICK_TEMPLATES[0]) => {
    onSelectTemplate(template.prompt);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Layers className="h-4 w-4 mr-2" />
            Templates
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center text-foreground">
            <Layers className="h-5 w-5 mr-2 text-primary" />
            Quick Start Templates
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 p-4 border-b border-border">
            <Button
              variant={selectedCategory === 'All' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('All')}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card
                    key={template.id}
                    className="p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 bg-card border-border"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-foreground truncate">
                            {template.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatesPopup;