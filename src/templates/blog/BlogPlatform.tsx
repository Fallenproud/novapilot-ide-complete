import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { 
  Search, 
  Calendar, 
  User, 
  Heart, 
  MessageCircle, 
  Share2,
  BookOpen,
  TrendingUp,
  Clock
} from 'lucide-react';

const SAMPLE_POSTS = [
  {
    id: '1',
    title: 'Getting Started with React 18: A Complete Guide',
    excerpt: 'Learn about the new features in React 18 including concurrent rendering, automatic batching, and more.',
    author: 'Sarah Johnson',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100',
    publishedAt: '2024-01-15',
    readTime: '8 min read',
    category: 'Technology',
    tags: ['React', 'JavaScript', 'Frontend'],
    likes: 145,
    comments: 23,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600'
  },
  {
    id: '2',
    title: 'The Future of Web Development: Trends to Watch',
    excerpt: 'Exploring the latest trends shaping the future of web development, from AI integration to edge computing.',
    author: 'Michael Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    publishedAt: '2024-01-12',
    readTime: '12 min read',
    category: 'Technology',
    tags: ['Web Development', 'AI', 'Trends'],
    likes: 89,
    comments: 15,
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600'
  },
  {
    id: '3',
    title: 'Building Sustainable Design Systems',
    excerpt: 'How to create and maintain design systems that scale with your organization and stand the test of time.',
    author: 'Emma Rodriguez',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    publishedAt: '2024-01-10',
    readTime: '15 min read',
    category: 'Design',
    tags: ['Design Systems', 'UI/UX', 'Scalability'],
    likes: 203,
    comments: 31,
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600'
  }
];

const TRENDING_TAGS = ['React', 'TypeScript', 'Design Systems', 'AI', 'Web Development', 'UI/UX'];

export const BlogPlatform: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const categories = ['All', ...new Set(SAMPLE_POSTS.map(p => p.category))];
  
  const filteredPosts = SAMPLE_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">DevBlog</h1>
            </div>
            <Button className="gap-2">
              <User className="h-4 w-4" />
              Sign In
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
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

            {/* Featured Post */}
            {filteredPosts.length > 0 && (
              <Card className="mb-8 overflow-hidden border-border bg-card">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={filteredPosts[0].image} 
                      alt={filteredPosts[0].title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:w-1/2 flex flex-col justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-3">
                        Featured
                      </Badge>
                      <h2 className="text-2xl font-bold text-foreground mb-3 line-clamp-2">
                        {filteredPosts[0].title}
                      </h2>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {filteredPosts[0].excerpt}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <img src={filteredPosts[0].authorAvatar} alt={filteredPosts[0].author} />
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium text-foreground">{filteredPosts[0].author}</p>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {filteredPosts[0].publishedAt}
                            <Clock className="h-3 w-3 ml-2" />
                            {filteredPosts[0].readTime}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {filteredPosts[0].tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm">Read More</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Posts Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredPosts.slice(1).map(post => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow border-border bg-card">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <img src={post.authorAvatar} alt={post.author} />
                        </Avatar>
                        <span className="text-sm text-foreground">{post.author}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {post.publishedAt}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className="gap-1 p-0 h-auto"
                        >
                          <Heart className={`h-4 w-4 ${likedPosts.includes(post.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          <span className="text-xs">{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-xs">{post.comments}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button size="sm" variant="outline">Read</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Tags */}
            <Card className="p-6 border-border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Trending Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Newsletter */}
            <Card className="p-6 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-2">Stay Updated</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the latest articles delivered to your inbox.
              </p>
              <div className="space-y-2">
                <Input placeholder="Enter your email" />
                <Button className="w-full">Subscribe</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};