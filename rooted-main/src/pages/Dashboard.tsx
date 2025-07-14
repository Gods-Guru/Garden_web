import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Calendar, 
  Check, 
  User, 
  Settings,
  Users,
  MapPin,
  Sprout,
  Droplets,
  MessageSquare,
  Award,
  BarChart3,
  Bell,
  Map,
  BookOpen,
  FileText,
  Shield
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const validTabs = ["overview", "gardens", "community"];
  const defaultTab = validTabs.includes(tabParam || "") ? tabParam : "overview";
  // Mock data - would come from backend/Supabase
  const userPlots = [
    { id: 1, name: "Plot A-12", status: "Active", planted: "Tomatoes, Peppers", progress: 75 },
    { id: 2, name: "Plot B-5", status: "Preparing", planted: "Lettuce, Herbs", progress: 25 }
  ];

  const upcomingTasks = [
    { id: 1, title: "Water Plot A-12", due: "Today", priority: "High" },
    { id: 2, title: "Harvest Tomatoes", due: "Tomorrow", priority: "Medium" },
    { id: 3, title: "Community Cleanup", due: "This Weekend", priority: "Low" }
  ];

  const upcomingEvents = [
    { id: 1, title: "Composting Workshop", date: "Mar 15", attendees: 12 },
    { id: 2, title: "Spring Planting Day", date: "Mar 22", attendees: 25 }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Rooted</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/profile">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Sarah! 🌱</h2>
          <p className="text-muted-foreground">Here's what's happening in your garden community today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Plots</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Home className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Check className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Community Members</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Navigation */}
        <Tabs defaultValue={defaultTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gardens">Gardens</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* My Plots */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    My Plots
                  </CardTitle>
                  <Link to="/plots">
                    <Button size="sm" variant="default">
                      Request New Plot
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userPlots.map((plot) => (
                    <div key={plot.id} className="p-4 border rounded-lg bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{plot.name}</h4>
                        <Badge variant={plot.status === 'Active' ? 'default' : 'secondary'}>
                          {plot.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{plot.planted}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Growth Progress</span>
                          <span>{plot.progress}%</span>
                        </div>
                        <Progress value={plot.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                  <Link to="/plots">
                    <Button className="w-full" variant="outline">
                      <Home className="h-4 w-4 mr-2" />
                      Manage Plots
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Upcoming Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    Upcoming Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="p-4 border rounded-lg bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{task.title}</h4>
                        <Badge 
                          variant={task.priority === 'High' ? 'destructive' : 
                                   task.priority === 'Medium' ? 'default' : 'secondary'}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{task.due}</p>
                      <Button size="sm" className="mt-2">Mark Complete</Button>
                    </div>
                  ))}
                  <Link to="/tasks">
                    <Button className="w-full" variant="outline">
                      <Check className="h-4 w-4 mr-2" />
                      View All Tasks
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Community Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="p-4 border rounded-lg bg-card">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{event.title}</h4>
                          <Badge variant="outline">{event.date}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {event.attendees} attendees registered
                        </p>
                        <Button size="sm" variant="outline">RSVP</Button>
                      </div>
                    ))}
                  </div>
                  <Link to="/events">
                    <Button className="w-full mt-4" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      View All Events
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gardens" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/gardens">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Map className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Garden Management</h3>
                        <p className="text-sm text-muted-foreground">Create and manage gardens</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/plots">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Plot Management</h3>
                        <p className="text-sm text-muted-foreground">Assign and track plots</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/plants">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Plant Guide</h3>
                        <p className="text-sm text-muted-foreground">Browse plant care guides</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/water">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Droplets className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Water Tracking</h3>
                        <p className="text-sm text-muted-foreground">Log and monitor water usage</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/tasks">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                        <Check className="h-6 w-6 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Task Management</h3>
                        <p className="text-sm text-muted-foreground">Create and assign tasks</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/achievements">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Achievements</h3>
                        <p className="text-sm text-muted-foreground">Track progress and rewards</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/forum">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Community Forum</h3>
                        <p className="text-sm text-muted-foreground">Discuss and share ideas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/events">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Events</h3>
                        <p className="text-sm text-muted-foreground">Community events and workshops</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/notifications">
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Bell className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Notifications</h3>
                        <p className="text-sm text-muted-foreground">Stay updated on activities</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>


        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;