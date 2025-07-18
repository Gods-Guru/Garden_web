import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Plus, Search, TrendingUp, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Forum = () => {
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const forumPosts = [
    {
      id: 1,
      title: "Best Tomato Varieties for Summer",
      author: "Sarah Johnson",
      authorAvatar: "/placeholder.svg",
      category: "Plants",
      replies: 12,
      views: 156,
      lastActivity: "2 hours ago",
      isPinned: true,
      isPopular: true
    },
    {
      id: 2,
      title: "Organic Pest Control Methods",
      author: "Mike Chen",
      authorAvatar: "/placeholder.svg",
      category: "Garden Care",
      replies: 8,
      views: 89,
      lastActivity: "4 hours ago",
      isPinned: false,
      isPopular: false
    },
    {
      id: 3,
      title: "Water Conservation Tips",
      author: "Lisa Park",
      authorAvatar: "/placeholder.svg",
      category: "Water Management",
      replies: 15,
      views: 203,
      lastActivity: "6 hours ago",
      isPinned: false,
      isPopular: true
    },
  ];

  const categories = [
    { name: "All Categories", count: 45 },
    { name: "Plants", count: 15 },
    { name: "Garden Care", count: 12 },
    { name: "Water Management", count: 8 },
    { name: "Community Events", count: 10 },
  ];

  const filteredPosts = forumPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard?tab=community">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Community Forum</h1>
            </div>
          </div>
          <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Post Title</Label>
                  <Input id="title" placeholder="Enter post title" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plants">Plants</SelectItem>
                      <SelectItem value="garden-care">Garden Care</SelectItem>
                      <SelectItem value="water-management">Water Management</SelectItem>
                      <SelectItem value="community-events">Community Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content">Post Content</Label>
                  <Textarea id="content" placeholder="Write your post..." rows={6} />
                </div>
                <Button className="w-full" onClick={() => setIsNewPostDialogOpen(false)}>
                  Create Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer">
                    <span className="text-sm">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">{category.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Forum Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Posts</span>
                  <span className="font-semibold">245</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Members</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Topics</span>
                  <span className="font-semibold">89</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="recent" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="recent">Recent Posts</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                </TabsList>
                
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <TabsContent value="recent" className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={post.authorAvatar} />
                          <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {post.isPinned && <Badge variant="secondary">Pinned</Badge>}
                            {post.isPopular && <Badge variant="default">Popular</Badge>}
                            <Badge variant="outline">{post.category}</Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            by {post.author} • {post.lastActivity}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.replies} replies</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>{post.views} views</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="popular" className="space-y-4">
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Popular posts would be displayed here</p>
                </div>
              </TabsContent>

              <TabsContent value="unanswered" className="space-y-4">
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Unanswered posts would be displayed here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;