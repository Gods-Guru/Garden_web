import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Clock, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Events = () => {
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);

  // Mock data
  const upcomingEvents = [
    {
      id: 1,
      title: "Community Harvest Festival",
      description: "Join us for our annual harvest celebration with food, music, and fun activities for the whole family.",
      date: "2024-02-15",
      time: "10:00 AM - 4:00 PM",
      location: "Downtown Community Garden",
      organizer: "Sarah Johnson",
      organizerAvatar: "/placeholder.svg",
      attendees: 25,
      maxAttendees: 50,
      category: "Festival",
      isUserAttending: true
    },
    {
      id: 2,
      title: "Organic Gardening Workshop",
      description: "Learn sustainable gardening practices and organic pest control methods from expert gardeners.",
      date: "2024-02-10",
      time: "2:00 PM - 5:00 PM",
      location: "Riverside Organic Farm",
      organizer: "Mike Chen",
      organizerAvatar: "/placeholder.svg",
      attendees: 12,
      maxAttendees: 20,
      category: "Workshop",
      isUserAttending: false
    },
    {
      id: 3,
      title: "Spring Planting Day",
      description: "Community planting event to prepare our gardens for the upcoming growing season.",
      date: "2024-03-05",
      time: "9:00 AM - 12:00 PM",
      location: "School District Garden",
      organizer: "Lisa Park",
      organizerAvatar: "/placeholder.svg",
      attendees: 8,
      maxAttendees: 30,
      category: "Volunteer",
      isUserAttending: false
    }
  ];

  const pastEvents = [
    {
      id: 4,
      title: "Winter Garden Prep Workshop",
      date: "2024-01-15",
      attendees: 18,
      category: "Workshop"
    },
    {
      id: 5,
      title: "New Member Orientation",
      date: "2024-01-08",
      attendees: 12,
      category: "Orientation"
    }
  ];

  const eventStats = [
    { label: "Upcoming Events", value: upcomingEvents.length },
    { label: "Total Attendees", value: upcomingEvents.reduce((sum, event) => sum + event.attendees, 0) },
    { label: "Events This Month", value: 5 },
  ];

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
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-success" />
              </div>
              <h1 className="text-2xl font-bold">Community Events</h1>
            </div>
          </div>
          <Dialog open={isCreateEventDialogOpen} onOpenChange={setIsCreateEventDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input id="event-title" placeholder="Enter event title" />
                </div>
                <div>
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea id="event-description" placeholder="Event description..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event-date">Date</Label>
                    <Input id="event-date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="event-time">Time</Label>
                    <Input id="event-time" type="time" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="event-location">Location</Label>
                  <Input id="event-location" placeholder="Event location" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event-category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="festival">Festival</SelectItem>
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                        <SelectItem value="orientation">Orientation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="max-attendees">Max Attendees</Label>
                    <Input id="max-attendees" type="number" placeholder="50" />
                  </div>
                </div>
                <Button className="w-full" onClick={() => setIsCreateEventDialogOpen(false)}>
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {eventStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:bg-accent/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{event.category}</Badge>
                      <Badge variant={event.isUserAttending ? "default" : "secondary"}>
                        {event.isUserAttending ? "Attending" : "Not Attending"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{event.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{event.attendees}/{event.maxAttendees} attending</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={event.organizerAvatar} />
                        <AvatarFallback>{event.organizer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">Organized by {event.organizer}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1" variant={event.isUserAttending ? "outline" : "default"}>
                        {event.isUserAttending ? "Cancel RSVP" : "RSVP"}
                      </Button>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Badge variant="outline">{event.category}</Badge>
                      <h3 className="font-semibold">{event.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees} attended</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Events you're organizing or attending would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;