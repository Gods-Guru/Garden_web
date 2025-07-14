import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, MapPin, Search, Sprout, Droplets, Calendar as CalendarLucide, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Plots = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const plots = [
    {
      id: 1,
      name: "Plot A-12",
      garden: "Downtown Community Garden",
      status: "Active",
      planted: "Tomatoes, Peppers",
      progress: 75,
      plantedDate: "2024-01-15",
      harvestDate: "2024-04-15",
      size: "4x4",
      lastWatered: "Today"
    },
    {
      id: 2,
      name: "Plot B-5",
      garden: "Downtown Community Garden",
      status: "Preparing",
      planted: "Lettuce, Herbs",
      progress: 25,
      plantedDate: "2024-02-01",
      harvestDate: "2024-03-15",
      size: "4x6",
      lastWatered: "Yesterday"
    }
  ];

  const filteredPlots = plots.filter(plot =>
    plot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plot.planted.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <Link to="/dashboard?tab=gardens">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Garden
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Plot Management</h1>
              </Link>
            </div>
          </div>
          <div className="flex-0">
            <Button size="sm" variant="default">
              Request New Plot
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calendar">Planting Calendar</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search plots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Plots Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPlots.map((plot) => (
                <Card key={plot.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        {plot.name}
                      </CardTitle>
                      <Badge variant={plot.status === 'Active' ? 'default' : 'secondary'}>
                        {plot.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      <p>Garden: {plot.garden}</p>
                      <p>Size: {plot.size}</p>
                      <p>Planted: {plot.planted}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Growth Progress</span>
                        <span>{plot.progress}%</span>
                      </div>
                      <Progress value={plot.progress} className="h-2" />
                    </div>
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

export default Plots;