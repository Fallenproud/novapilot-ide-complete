import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  BookOpen, 
  Code2, 
  Lightbulb, 
  Keyboard, 
  Zap,
  ArrowRight,
  Star,
  Clock,
  Users
} from 'lucide-react';

const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: 'Getting Started',
      description: 'Learn the basics and set up your first project',
      icon: Zap,
      color: 'text-green-500',
      docs: [
        { title: 'Quick Start Guide', time: '5 min read', popular: true },
        { title: 'Installation & Setup', time: '3 min read', popular: false },
        { title: 'Your First Project', time: '10 min read', popular: true },
        { title: 'Basic Concepts', time: '8 min read', popular: false }
      ]
    },
    {
      title: 'IDE Features',
      description: 'Master the integrated development environment',
      icon: Code2,
      color: 'text-blue-500',
      docs: [
        { title: 'Code Editor Features', time: '7 min read', popular: true },
        { title: 'File Management', time: '4 min read', popular: false },
        { title: 'Terminal Integration', time: '6 min read', popular: true },
        { title: 'Live Preview', time: '5 min read', popular: false }
      ]
    },
    {
      title: 'Best Practices',
      description: 'Tips and tricks for efficient development',
      icon: Lightbulb,
      color: 'text-yellow-500',
      docs: [
        { title: 'Code Organization', time: '12 min read', popular: true },
        { title: 'Performance Tips', time: '9 min read', popular: true },
        { title: 'Debugging Guide', time: '15 min read', popular: false },
        { title: 'Security Best Practices', time: '11 min read', popular: false }
      ]
    },
    {
      title: 'Keyboard Shortcuts',
      description: 'Speed up your workflow with hotkeys',
      icon: Keyboard,
      color: 'text-purple-500',
      docs: [
        { title: 'Editor Shortcuts', time: '3 min read', popular: true },
        { title: 'Navigation Shortcuts', time: '2 min read', popular: false },
        { title: 'File Operations', time: '4 min read', popular: false },
        { title: 'Custom Shortcuts', time: '6 min read', popular: false }
      ]
    }
  ];

  const popularDocs = [
    { title: 'Quick Start Guide', category: 'Getting Started', views: '12.4k' },
    { title: 'Code Editor Features', category: 'IDE Features', views: '8.9k' },
    { title: 'Performance Tips', category: 'Best Practices', views: '7.2k' },
    { title: 'Editor Shortcuts', category: 'Keyboard Shortcuts', views: '6.8k' }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    docs: category.docs.filter(doc =>
      searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.docs.length > 0);

  return (
    <div className="container mx-auto px-6 py-8">
      <Breadcrumbs />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Documentation</h1>
        <p className="text-muted-foreground mb-6">
          Everything you need to know to build amazing projects with our platform.
        </p>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {filteredCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <category.icon className={`h-6 w-6 ${category.color}`} />
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {category.docs.map((doc) => (
                    <Button
                      key={doc.title}
                      variant="ghost"
                      className="justify-between h-auto p-4 text-left"
                    >
                      <div className="flex items-start gap-3">
                        <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {doc.title}
                            {doc.popular && (
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {doc.time}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredCategories.length === 0 && searchQuery && (
            <Card>
              <CardContent className="py-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search query or browse the categories above.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Popular Docs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularDocs.map((doc, index) => (
                  <Button
                    key={doc.title}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{doc.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {doc.category}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {doc.views}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  API Reference
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Code2 className="h-4 w-4 mr-2" />
                  Code Examples
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Tutorials
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Keyboard className="h-4 w-4 mr-2" />
                  Shortcuts
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="space-y-2">
                <Button className="w-full">Contact Support</Button>
                <Button variant="outline" className="w-full">
                  Community Forum
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Documentation;