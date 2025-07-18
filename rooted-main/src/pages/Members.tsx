import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MessageSquare, Users, Mail, Phone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Members = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const members = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@email.com",
      phone: "+1 234-567-8901",
      avatar: "/placeholder.svg",
      role: "Garden Owner",
      joinDate: "2024-01-15",
      gardens: ["Downtown Community Garden"],
      plots: 2,
      experience: "Expert",
      specialties: ["Tomatoes", "Herbs", "Composting"],
      isOnline: true
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike@email.com",
      phone: "+1 234-567-8902",
      avatar: "/placeholder.svg",
      role: "Member",
      joinDate: "2024-02-20",
      gardens: ["Riverside Organic Farm"],
      plots: 1,
      experience: "Intermediate",
      specialties: ["Vegetables", "Organic Farming"],
      isOnline: false
    },
    {
      id: 3,
      name: "Lisa Park",
      email: "lisa@email.com",
      phone: "+1 234-567-8903",
      avatar: "/placeholder.svg",
      role: "Member",
      joinDate: "2024-03-01",
      gardens: ["School District Garden"],
      plots: 1,
      experience: "Beginner",
      specialties: ["Flowers", "Learning"],
      isOnline: true
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@email.com",
      phone: "+1 234-567-8904",
      avatar: "/placeholder.svg",
      role: "Mentor",
      joinDate: "2023-05-15",
      gardens: ["Downtown Community Garden", "Riverside Organic Farm"],
      plots: 3,
      experience: "Expert",
      specialties: ["Fruit Trees", "Pest Control", "Teaching"],
      isOnline: false
    }
  ];

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const memberStats = [
    { label: "Total Members", value: members.length },
    { label: "Online Now", value: members.filter(m => m.isOnline).length },
    { label: "New This Month", value: 2 },
  ];

  const getExperienceBadgeVariant = (experience: string) => {
    switch (experience) {
      case "Expert": return "default";
      case "Intermediate": return "secondary";
      case "Beginner": return "outline";
      default: return "outline";
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
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <h1 className="text-2xl font-bold">Member Directory</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {memberStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Members</TabsTrigger>
              <TabsTrigger value="mentors">Mentors</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
            </TabsList>
            
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:bg-accent/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary">{member.role}</Badge>
                          <Badge variant={getExperienceBadgeVariant(member.experience)}>
                            {member.experience}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Member since {new Date(member.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Gardens</p>
                        <div className="flex flex-wrap gap-1">
                          {member.gardens.map((garden, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {garden}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Specialties</p>
                        <div className="flex flex-wrap gap-1">
                          {member.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p>Active plots: {member.plots}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mentors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.filter(member => member.role === "Mentor").map((member) => (
                <Card key={member.id} className="hover:bg-accent/50 transition-colors border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <Badge variant="default" className="mb-2">Mentor</Badge>
                        <p className="text-sm text-muted-foreground">
                          Available for guidance and questions
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Expertise</p>
                        <div className="flex flex-wrap gap-1">
                          {member.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button className="w-full mt-4">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Ask for Help
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="online" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.filter(member => member.isOnline).map((member) => (
                <Card key={member.id} className="hover:bg-accent/50 transition-colors border-green-200 dark:border-green-800">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <Badge variant="outline" className="text-green-600 border-green-600 mb-2">
                          Online Now
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Available for chat
                        </p>
                      </div>
                    </div>

                    <Button className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Members;