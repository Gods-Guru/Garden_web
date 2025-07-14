import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Check,
  Calendar,
  Sprout,
  TrendingUp,
  AlertTriangle,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  // Mock data - would come from backend API
  const stats = {
    totalGardens: 12,
    totalUsers: 287,
    activePlots: 156,
    pendingTasks: 23,
    thisMonthGrowth: {
      gardens: 8.2,
      users: 12.5,
      plots: 15.3,
      tasks: -5.2
    }
  };

  const recentActivity = [
    { id: 1, type: "garden", message: "New garden 'Downtown Community Plot' created", time: "2 hours ago" },
    { id: 2, type: "user", message: "15 new users registered this week", time: "1 day ago" },
    { id: 3, type: "task", message: "Watering task completed in Garden A", time: "2 days ago" },
    { id: 4, type: "alert", message: "High water usage detected in Garden B", time: "3 days ago" },
  ];

  const pendingApprovals = [
    { id: 1, type: "Garden Application", name: "Riverside Community Garden", applicant: "Sarah Johnson", date: "2024-01-15" },
    { id: 2, type: "User Registration", name: "Mike Chen", applicant: "mike@email.com", date: "2024-01-14" },
    { id: 3, type: "Plot Request", name: "Plot C-15", applicant: "Lisa Park", date: "2024-01-13" },
  ];

  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Admin</h1>
          <p className="text-muted-foreground">Here's what's happening in your community gardens today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Gardens</p>
                  <p className="text-2xl font-bold">{stats.totalGardens}</p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{stats.thisMonthGrowth.gardens}% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Sprout className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{stats.thisMonthGrowth.users}% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Plots</p>
                  <p className="text-2xl font-bold">{stats.activePlots}</p>
                  <p className="text-xs text-success flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{stats.thisMonthGrowth.plots}% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Home className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                  <p className="text-2xl font-bold">{stats.pendingTasks}</p>
                  <p className="text-xs text-warning flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                    {Math.abs(stats.thisMonthGrowth.tasks)}% fewer this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Check className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'garden' ? 'bg-primary' :
                      activity.type === 'user' ? 'bg-success' :
                      activity.type === 'task' ? 'bg-accent' : 'bg-warning'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Pending Approvals
                </div>
                <Badge variant="secondary">{pendingApprovals.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">{approval.name}</p>
                      <p className="text-xs text-muted-foreground">{approval.type} • {approval.applicant}</p>
                      <p className="text-xs text-muted-foreground">{approval.date}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Decline</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/admin/gardens')}>
                <Sprout className="h-6 w-6" />
                <span>New Garden</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/admin/users')}>
                <Users className="h-6 w-6" />
                <span>Add User</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/admin/events')}>
                <Calendar className="h-6 w-6" />
                <span>Create Event</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/admin/tasks')}>
                <Check className="h-6 w-6" />
                <span>Assign Task</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );

};

export default AdminDashboard;