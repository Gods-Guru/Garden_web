import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Search, Plus, Droplets, Sun, Thermometer, Calendar, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Plants = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data
  const plants = [
    {
      id: 1,
      name: "Tomato",
      scientificName: "Solanum lycopersicum",
      category: "Vegetables",
      difficulty: "Beginner",
      plantingSeason: "Spring",
      harvestTime: "75-85 days",
      wateringFrequency: "2-3 times per week",
      sunRequirement: "Full sun",
      spacing: "18-24 inches",
      image: "/api/placeholder/200/150",
      description: "A popular vegetable that's relatively easy to grow and provides excellent yields."
    },
    {
      id: 2,
      name: "Lettuce",
      scientificName: "Lactuca sativa",
      category: "Leafy Greens",
      difficulty: "Beginner",
      plantingSeason: "Spring/Fall",
      harvestTime: "45-65 days",
      wateringFrequency: "Daily",
      sunRequirement: "Partial shade",
      spacing: "4-6 inches",
      image: "/api/placeholder/200/150",
      description: "Fast-growing leafy green perfect for continuous harvesting."
    },
    {
      id: 3,
      name: "Basil",
      scientificName: "Ocimum basilicum",
      category: "Herbs",
      difficulty: "Beginner",
      plantingSeason: "Spring/Summer",
      harvestTime: "60-90 days",
      wateringFrequency: "Every other day",
      sunRequirement: "Full sun",
      spacing: "6-12 inches",
      image: "/api/placeholder/200/150",
      description: "Aromatic herb that's perfect for cooking and companion planting."
    }
  ];

  const categories = ["all", "Vegetables", "Leafy Greens", "Herbs", "Fruits", "Flowers"];

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || plant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'default';
      case 'Intermediate': return 'secondary';
      case 'Advanced': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard?tab=gardens">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Garden
              </Button>
            </Link>
          <div className="flex items-center space-x-2">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Plant Guide</h1>
            </Link>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Plant Guide
          </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Plants</TabsTrigger>
            <TabsTrigger value="my-plants">My Plants</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search plants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "all" ? "All" : category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Plants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlants.map((plant) => (
                <Dialog key={plant.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="h-48 bg-muted"></div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{plant.name}</h3>
                          <Badge variant={getDifficultyColor(plant.difficulty) as any}>
                            {plant.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground italic mb-2">
                          {plant.scientificName}
                        </p>
                        <Badge variant="outline" className="mb-3">
                          {plant.category}
                        </Badge>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {plant.description}
                        </p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>{plant.name}</DialogTitle>
                      <p className="text-muted-foreground italic">{plant.scientificName}</p>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="h-48 bg-muted rounded-lg"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Planting Season</p>
                              <p className="text-sm text-muted-foreground">{plant.plantingSeason}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="text-sm font-medium">Watering</p>
                              <p className="text-sm text-muted-foreground">{plant.wateringFrequency}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Sun className="h-4 w-4 text-yellow-500" />
                            <div>
                              <p className="text-sm font-medium">Sun Requirement</p>
                              <p className="text-sm text-muted-foreground">{plant.sunRequirement}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium">Harvest Time</p>
                            <p className="text-sm text-muted-foreground">{plant.harvestTime}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Spacing</p>
                            <p className="text-sm text-muted-foreground">{plant.spacing}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Difficulty</p>
                            <Badge variant={getDifficultyColor(plant.difficulty) as any}>
                              {plant.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Description</p>
                        <p className="text-sm text-muted-foreground">{plant.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1">Add to My Plants</Button>
                      <Button variant="outline" className="flex-1">Create Planting Plan</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-plants" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plants.slice(0, 2).map((plant) => (
                <Card key={plant.id}>
                  <div className="h-48 bg-muted"></div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{plant.name}</h3>
                      <Badge variant="default">Growing</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Planted: March 1, 2024
                    </p>
                    <Button size="sm" className="w-full">View Care Instructions</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="seasonal" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {["Spring", "Summer", "Fall", "Winter"].map((season) => (
                <Card key={season}>
                  <CardHeader>
                    <CardTitle className="text-center">{season}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium">Best to Plant:</p>
                      <ul className="text-muted-foreground mt-1 space-y-1">
                        <li>• Tomatoes</li>
                        <li>• Lettuce</li>
                        <li>• Herbs</li>
                      </ul>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Care Tips:</p>
                      <p className="text-muted-foreground mt-1">
                        Focus on watering and pest control during this season.
                      </p>
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

export default Plants;