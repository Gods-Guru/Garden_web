import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-garden.jpg";
import { 
  Users, 
  Calendar, 
  Settings, 
  User,
  Home,
  Check
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Rooted
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <a href="/auth">Sign In</a>
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90 transition-opacity" asChild>
              <a href="/auth">Get Started</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Grow Together in
            <span className="block bg-gradient-to-r from-green-200 to-green-100 bg-clip-text text-transparent">
              Community Gardens
            </span>
          </h2>
          <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
            Manage plots, track tasks, and build connections in your local community garden with Rooted - where neighbors become gardening partners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Buttons removed as per user request */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Everything You Need to Manage Your Garden</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From plot management to community events, Rooted provides all the tools to cultivate a thriving garden community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Plot Management</h4>
                <p className="text-muted-foreground">
                  Reserve plots, track planting schedules, and monitor your garden's progress with intuitive management tools.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Task Tracking</h4>
                <p className="text-muted-foreground">
                  Stay organized with task assignments, completion tracking, and volunteer coordination for community maintenance.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Community Building</h4>
                <p className="text-muted-foreground">
                  Connect with fellow gardeners, share knowledge, and participate in workshops and community events.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Event Scheduling</h4>
                <p className="text-muted-foreground">
                  Organize workshops, volunteer days, and harvest celebrations with integrated calendar management.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Resource Management</h4>
                <p className="text-muted-foreground">
                  Track tools, supplies, and resources with check-out systems and inventory management.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Admin Dashboard</h4>
                <p className="text-muted-foreground">
                  Comprehensive admin tools for user management, plot assignments, and community oversight.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Cultivate Community?</h3>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of gardeners who are already using Rooted to manage their community gardens and build stronger neighborhoods.
          </p>
          <Button size="lg" variant="secondary" className="shadow-glow">
            Start Your Free Garden
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Rooted</span>
            </div>
            <p className="text-muted-foreground">
              © 2024 Rooted. Growing communities, one garden at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;