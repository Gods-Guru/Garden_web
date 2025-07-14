import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Settings, Check, X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Notifications = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [eventUpdates, setEventUpdates] = useState(true);

  // Mock data
  const notifications = [
    {
      id: 1,
      title: "Task Reminder: Water Plot A-12",
      message: "Don't forget to water your tomatoes today. They're looking a bit dry.",
      time: "2 hours ago",
      type: "task",
      isRead: false,
      priority: "high"
    },
    {
      id: 2,
      title: "New Event: Spring Planting Workshop",
      message: "Join us for a hands-on workshop about spring planting techniques. Limited spots available!",
      time: "4 hours ago",
      type: "event",
      isRead: false,
      priority: "medium"
    },
    {
      id: 3,
      title: "Forum Reply: Organic Pest Control",
      message: "Sarah Johnson replied to your post about organic pest control methods.",
      time: "6 hours ago",
      type: "forum",
      isRead: true,
      priority: "low"
    },
    {
      id: 4,
      title: "Weather Alert: Heavy Rain Expected",
      message: "Heavy rain is forecasted for tonight. Consider covering sensitive plants.",
      time: "8 hours ago",
      type: "weather",
      isRead: true,
      priority: "high"
    },
    {
      id: 5,
      title: "Achievement Unlocked: Green Thumb",
      message: "Congratulations! You've successfully grown 5 different plant varieties.",
      time: "1 day ago",
      type: "achievement",
      isRead: true,
      priority: "low"
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task": return "🌱";
      case "event": return "📅";
      case "forum": return "💬";
      case "weather": return "🌧️";
      case "achievement": return "🏆";
      default: return "🔔";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

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
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </div>
          <Button variant="outline">
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">
              All Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`hover:bg-accent/50 transition-colors ${
                  !notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${!notification.isRead ? 'text-primary' : ''}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                            {notification.priority}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{notification.time}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{notification.message}</p>
                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <Button size="sm" variant="outline">
                            <Check className="h-4 w-4 mr-1" />
                            Mark Read
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <X className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {notifications.filter(n => !n.isRead).map((notification) => (
              <Card 
                key={notification.id} 
                className="border-l-4 border-l-primary bg-primary/5 hover:bg-accent/50 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-primary">{notification.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                            {notification.priority}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{notification.time}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{notification.message}</p>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Check className="h-4 w-4 mr-1" />
                          Mark Read
                        </Button>
                        <Button size="sm" variant="ghost">
                          <X className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="task-reminders">Task Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminded about pending tasks</p>
                    </div>
                    <Switch
                      id="task-reminders"
                      checked={taskReminders}
                      onCheckedChange={setTaskReminders}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="event-updates">Event Updates</Label>
                      <p className="text-sm text-muted-foreground">Stay updated about community events</p>
                    </div>
                    <Switch
                      id="event-updates"
                      checked={eventUpdates}
                      onCheckedChange={setEventUpdates}
                    />
                  </div>
                </div>

                <Button className="w-full">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;