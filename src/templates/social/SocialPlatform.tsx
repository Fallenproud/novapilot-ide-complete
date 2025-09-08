import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Plus,
  Search,
  Bell,
  Settings,
  Home,
  Users,
  Bookmark,
  Image,
  Smile
} from 'lucide-react';

const SAMPLE_POSTS = [
  {
    id: '1',
    author: 'Sarah Johnson',
    username: '@sarahj',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100',
    timestamp: '2 hours ago',
    content: 'Just finished building an amazing React component library! The power of TypeScript and modern tooling never ceases to amaze me. 🚀',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500',
    likes: 42,
    comments: 8,
    shares: 3,
    isLiked: false
  },
  {
    id: '2',
    author: 'Mike Chen',
    username: '@mikedev',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    timestamp: '4 hours ago',
    content: 'Beautiful sunset from my office today. Sometimes we need to step back and appreciate the simple moments. #photography #sunset',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
    likes: 127,
    comments: 23,
    shares: 12,
    isLiked: true
  },
  {
    id: '3',
    author: 'Emma Rodriguez',
    username: '@emmux',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    timestamp: '6 hours ago',
    content: 'Working on some exciting UX patterns for our design system. User research continues to surprise me with insights I never expected! 🎨✨',
    likes: 89,
    comments: 15,
    shares: 7,
    isLiked: false
  }
];

const SUGGESTED_USERS = [
  { name: 'Alex Thompson', username: '@alexdev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', followers: '12k' },
  { name: 'Lisa Park', username: '@lisadesign', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', followers: '8.5k' },
  { name: 'David Wilson', username: '@dwilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', followers: '15k' }
];

export const SocialPlatform: React.FC = () => {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handlePost = () => {
    if (newPost.trim()) {
      const post = {
        id: String(Date.now()),
        author: 'You',
        username: '@you',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        timestamp: 'now',
        content: newPost,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false
      };
      setPosts(prev => [post, ...prev]);
      setNewPost('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">SocialHub</h1>
            
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search posts, people..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" alt="Profile" />
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Navigation */}
            <Card className="p-4 border-border bg-card">
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="h-4 w-4 mr-3" />
                  Home
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-3" />
                  Following
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Bookmark className="h-4 w-4 mr-3" />
                  Saved
                </Button>
              </nav>
            </Card>

            {/* Suggested Users */}
            <Card className="p-4 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4">Suggested for you</h3>
              <div className="space-y-3">
                {SUGGESTED_USERS.map(user => (
                  <div key={user.username} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <img src={user.avatar} alt={user.name} />
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.followers} followers</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Follow</Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card className="p-4 border-border bg-card">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" alt="Your avatar" />
                </Avatar>
                <div className="flex-1">
                  <Input
                    placeholder="What's on your mind?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="mb-3 border-none shadow-none text-base"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Image className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={handlePost} disabled={!newPost.trim()}>
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.map(post => (
                <Card key={post.id} className="border-border bg-card">
                  {/* Post Header */}
                  <div className="p-4 pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <img src={post.avatar} alt={post.author} />
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{post.author}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{post.username}</span>
                            <span>•</span>
                            <span>{post.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 py-3">
                    <p className="text-foreground leading-relaxed">{post.content}</p>
                  </div>

                  {/* Post Image */}
                  {post.image && (
                    <div className="px-4 pb-3">
                      <img 
                        src={post.image} 
                        alt="Post content"
                        className="w-full rounded-lg object-cover max-h-96"
                      />
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="px-4 py-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className="gap-2 p-0 h-auto hover:text-red-500"
                        >
                          <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                          <span className="text-sm">{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2 p-0 h-auto">
                          <MessageCircle className="h-5 w-5" />
                          <span className="text-sm">{post.comments}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2 p-0 h-auto">
                          <Share2 className="h-5 w-5" />
                          <span className="text-sm">{post.shares}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Trending Topics */}
            <Card className="p-4 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4">Trending</h3>
              <div className="space-y-3">
                {['#ReactJS', '#TypeScript', '#WebDev', '#Design', '#AI'].map(tag => (
                  <div key={tag} className="cursor-pointer hover:bg-muted/50 p-2 rounded">
                    <p className="font-medium text-primary">{tag}</p>
                    <p className="text-xs text-muted-foreground">15.2k posts</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Activity Feed */}
            <Card className="p-4 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-foreground"><strong>Sarah</strong> liked your post</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
                <div className="text-sm">
                  <p className="text-foreground"><strong>Mike</strong> started following you</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <div className="text-sm">
                  <p className="text-foreground"><strong>Emma</strong> commented on your post</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};