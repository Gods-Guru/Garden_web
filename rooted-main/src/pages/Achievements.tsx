import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Star, Target, Calendar, ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Achievements = () => {
  // Mock data
  const earnedAchievements = [
    { id: 1, title: "First Harvest", description: "Complete your first harvest", category: "Milestone", earnedDate: "2024-01-15", icon: Trophy },
    { id: 2, title: "Green Thumb", description: "Successfully grow 5 different plants", category: "Skills", earnedDate: "2024-01-10", icon: Star },
  ];

  const availableAchievements = [
    { id: 3, title: "Water Warrior", description: "Log 30 days of watering", category: "Consistency", progress: 75, maxProgress: 30, icon: Target },
    { id: 4, title: "Community Helper", description: "Help 10 new gardeners", category: "Social", progress: 3, maxProgress: 10, icon: Trophy },
    { id: 5, title: "Master Gardener", description: "Reach expert level in 3 plant categories", category: "Expertise", progress: 1, maxProgress: 3, icon: Star },
  ];

  const achievements = [
    { label: "Earned", value: earnedAchievements.length },
    { label: "In Progress", value: availableAchievements.length },
    { label: "Total Points", value: 250 },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
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
              <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              <h1 className="text-2xl font-bold">Achievements</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {achievements.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="earned" className="space-y-6">
          <TabsList>
            <TabsTrigger value="earned">Earned Achievements</TabsTrigger>
            <TabsTrigger value="available">Available Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="earned" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {earnedAchievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <Card key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">{achievement.title}</h3>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">{achievement.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                              {achievement.category}
                            </Badge>
                            <span className="text-xs text-yellow-600 dark:text-yellow-400">
                              Earned {achievement.earnedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="available" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableAchievements.map((achievement) => {
                const IconComponent = achievement.icon;
                const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
                return (
                  <Card key={achievement.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                          <Badge variant="outline" className="mb-3">
                            {achievement.category}
                          </Badge>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Community Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Community achievement leaderboard would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Achievements;