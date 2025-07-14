import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MapPin, Edit, Trash2, Home, Users, Check } from "lucide-react";

// Helper to get random plot size
const plotSizes = ["3x3", "4x4", "4x6", "4x8", "6x6"];
function getRandomPlotSize() {
  return plotSizes[Math.floor(Math.random() * plotSizes.length)];
}

const AdminPlots = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedGarden, setSelectedGarden] = useState<string | null>(null);
  const [selectedPlotPosition, setSelectedPlotPosition] = useState<string | null>(null);
  const [plotName, setPlotName] = useState("");
  const [plotSize, setPlotSize] = useState("");

  // Mock data with plot layouts
  const gardens = [
    { 
      id: 1, 
      name: "Downtown Community Garden", 
      location: "123 Main St, Downtown", 
      totalPlots: 20, 
      availablePlots: 5, 
      occupiedPlots: 15,
      members: 24,
      plotLayout: [
        { id: "A1", status: "occupied", assignee: "Sarah J.", size: "4x4" },
        { id: "A2", status: "occupied", assignee: "Mike C.", size: "4x6" },
        { id: "A3", status: "vacant", size: "3x3" },
        { id: "A4", status: "vacant", size: "4x4" },
        { id: "B1", status: "occupied", assignee: "Lisa P.", size: "4x6" },
        { id: "B2", status: "occupied", assignee: "John D.", size: "4x4" },
        { id: "B3", status: "vacant", size: "3x3" },
        { id: "B4", status: "occupied", assignee: "Emma S.", size: "4x6" },
        { id: "C1", status: "occupied", assignee: "Tom R.", size: "4x4" },
        { id: "C2", status: "vacant", size: "3x3" },
        { id: "C3", status: "occupied", assignee: "Anna M.", size: "4x6" },
        { id: "C4", status: "vacant", size: "3x3" },
        { id: "D1", status: "occupied", assignee: "Chris L.", size: "4x4" },
        { id: "D2", status: "occupied", assignee: "Kate W.", size: "4x6" },
        { id: "D3", status: "occupied", assignee: "David H.", size: "4x4" },
        { id: "D4", status: "occupied", assignee: "Megan F.", size: "4x6" },
        { id: "E1", status: "occupied", assignee: "Alex B.", size: "4x4" },
        { id: "E2", status: "occupied", assignee: "Jenny K.", size: "4x6" },
        { id: "E3", status: "occupied", assignee: "Mark T.", size: "4x4" },
        { id: "E4", status: "occupied", assignee: "Sophie G.", size: "4x6" }
      ]
    },
    { 
      id: 2, 
      name: "Riverside Organic Farm", 
      location: "456 River Rd, Riverside", 
      totalPlots: 15, 
      availablePlots: 3, 
      occupiedPlots: 12,
      members: 18,
      plotLayout: [
        { id: "R1", status: "occupied", assignee: "Paul V.", size: "4x4" },
        { id: "R2", status: "vacant", size: "3x3" },
        { id: "R3", status: "occupied", assignee: "Nina S.", size: "4x6" },
        { id: "R4", status: "occupied", assignee: "Bob M.", size: "4x4" },
        { id: "R5", status: "occupied", assignee: "Carol D.", size: "4x6" },
        { id: "R6", status: "vacant", size: "3x3" },
        { id: "R7", status: "occupied", assignee: "Steve R.", size: "4x4" },
        { id: "R8", status: "occupied", assignee: "Linda K.", size: "4x6" },
        { id: "R9", status: "occupied", assignee: "Frank L.", size: "4x4" },
        { id: "R10", status: "occupied", assignee: "Grace N.", size: "4x6" },
        { id: "R11", status: "occupied", assignee: "Henry P.", size: "4x4" },
        { id: "R12", status: "occupied", assignee: "Iris Q.", size: "4x6" },
        { id: "R13", status: "vacant", size: "3x3" },
        { id: "R14", status: "occupied", assignee: "Jack T.", size: "4x4" },
        { id: "R15", status: "occupied", assignee: "Kelly U.", size: "4x6" }
      ]
    },
    { 
      id: 3, 
      name: "School District Garden", 
      location: "789 School Ave, Midtown", 
      totalPlots: 12, 
      availablePlots: 8, 
      occupiedPlots: 4,
      members: 10,
      plotLayout: [
        { id: "S1", status: "occupied", assignee: "Teacher A", size: "4x4" },
        { id: "S2", status: "vacant", size: "3x3" },
        { id: "S3", status: "vacant", size: "3x3" },
        { id: "S4", status: "vacant", size: "3x3" },
        { id: "S5", status: "vacant", size: "3x3" },
        { id: "S6", status: "occupied", assignee: "Teacher B", size: "4x4" },
        { id: "S7", status: "vacant", size: "3x3" },
        { id: "S8", status: "vacant", size: "3x3" },
        { id: "S9", status: "occupied", assignee: "Teacher C", size: "4x4" },
        { id: "S10", status: "vacant", size: "3x3" },
        { id: "S11", status: "vacant", size: "3x3" },
        { id: "S12", status: "occupied", assignee: "Teacher D", size: "4x4" }
      ]
    }
  ].map(garden => ({
    ...garden,
    plotLayout: garden.plotLayout.map(plot => ({
      ...plot,
      size: getRandomPlotSize(),
    })),
  }));

  const plots = [
    { id: 1, name: "Plot A-1", garden: "Downtown Community Garden", assignee: "Sarah Johnson", status: "Active", size: "4x4", plantedCrop: "Tomatoes" },
    { id: 2, name: "Plot A-2", garden: "Downtown Community Garden", assignee: "Mike Chen", status: "Active", size: "4x6", plantedCrop: "Lettuce" },
    { id: 3, name: "Plot B-1", garden: "Riverside Organic Farm", assignee: null, status: "Available", size: "3x3", plantedCrop: null },
  ];

  const selectedGardenData = gardens.find(g => g.name === selectedGarden);

  const PlotGrid = ({ garden }: { garden: typeof gardens[0] }) => {
    const [sizeFilter, setSizeFilter] = useState<string | null>(null);
    const uniqueSizes = Array.from(new Set(garden.plotLayout.map(p => p.size)));
    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-3">Select Plot Position</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          <Button
            size="sm"
            variant={!sizeFilter ? "default" : "outline"}
            onClick={() => setSizeFilter(null)}
          >
            All Sizes
          </Button>
          {uniqueSizes.map(size => (
            <Button
              key={size}
              size="sm"
              variant={sizeFilter === size ? "default" : "outline"}
              onClick={() => setSizeFilter(size)}
            >
              {size}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 p-4 bg-muted/20 rounded-lg">
          {garden.plotLayout
            .filter(plot => !sizeFilter || plot.size === sizeFilter)
            .map((plot) => (
            <div
              key={plot.id}
              className={`
                relative aspect-square border-2 rounded-lg cursor-pointer transition-all
                ${plot.status === 'vacant' 
                  ? 'bg-success/10 border-success/20 hover:border-success hover:bg-success/20' 
                  : 'bg-muted border-muted-foreground/20 cursor-not-allowed opacity-50'
                }
                ${selectedPlotPosition === plot.id && plot.status === 'vacant'
                  ? 'ring-2 ring-primary bg-primary/10 border-primary'
                  : ''
                }
              `}
              onClick={() => {
                if (plot.status === 'vacant') {
                  setSelectedPlotPosition(plot.id);
                }
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs font-medium">{plot.id}</p>
                    <p className="text-xs font-medium">{plot.size}</p>
                  {plot.status === 'vacant' ? (
                    <p className="text-xs text-success font-medium">Vacant</p>
                  ) : (
                    <div className="text-xs">
                      <p className="text-muted-foreground truncate">{plot.assignee}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedPlotPosition === plot.id && plot.status === 'vacant' && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                              bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium
                              border border-primary shadow-sm z-10">
                  Selected
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 
                               border-l-2 border-r-2 border-t-2 border-transparent border-t-primary"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success/20 border border-success/40 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-muted border border-muted-foreground/20 rounded"></div>
              <span>Occupied</span>
            </div>
          </div>
          {selectedPlotPosition && (
            <span className="text-primary font-medium">Plot {selectedPlotPosition} selected</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Plot Management</h1>
            <p className="text-muted-foreground">Manage all garden plots in the system</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Plot
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Create New Plot</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Plot Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plotName">Plot Name</Label>
                    <Input 
                      id="plotName" 
                      placeholder="e.g., Plot A-1" 
                      value={plotName}
                      onChange={(e) => setPlotName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plotSize">Plot Size</Label>
                    <Select value={plotSize} onValueChange={setPlotSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3x3">3x3 feet</SelectItem>
                        <SelectItem value="4x4">4x4 feet</SelectItem>
                        <SelectItem value="4x6">4x6 feet</SelectItem>
                        <SelectItem value="4x8">4x8 feet</SelectItem>
                        <SelectItem value="6x6">6x6 feet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Garden Selection */}
                <div className="space-y-4">
                  <Label>Select Garden Location</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {gardens.map((garden) => (
                      <Card 
                        key={garden.id} 
                        className={`cursor-pointer transition-all ${
                          selectedGarden === garden.name 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedGarden(garden.name)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{garden.name}</h3>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {garden.location}
                              </div>
                            </div>
                            {selectedGarden === garden.name && (
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Check className="h-4 w-4 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                                <Home className="h-4 w-4 text-success" />
                              </div>
                              <div>
                                <p className="font-medium text-success">{garden.availablePlots}</p>
                                <p className="text-xs text-muted-foreground">Available</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                                <Home className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium">{garden.occupiedPlots}</p>
                                <p className="text-xs text-muted-foreground">Occupied</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Users className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{garden.members}</p>
                                <p className="text-xs text-muted-foreground">Members</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                                <MapPin className="h-4 w-4 text-accent" />
                              </div>
                              <div>
                                <p className="font-medium">{garden.totalPlots}</p>
                                <p className="text-xs text-muted-foreground">Total Plots</p>
                              </div>
                            </div>
                          </div>

                          {garden.availablePlots === 0 && (
                            <div className="mt-3 p-2 bg-destructive/10 rounded-lg">
                              <p className="text-xs text-destructive font-medium">No available plots</p>
                            </div>
                          )}

                          {selectedGarden === garden.name && (
                            <PlotGrid garden={garden} />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setSelectedGarden(null);
                    setPlotName("");
                    setPlotSize("");
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    // Handle plot creation logic here
                    setIsCreateDialogOpen(false);
                    setSelectedGarden(null);
                    setPlotName("");
                    setPlotSize("");
                  }}
                  disabled={!selectedGarden || !plotName || !plotSize}
                >
                  Create Plot
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{plots.length}</p>
                  <p className="text-sm text-muted-foreground">Total Plots</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Plots</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plot Name</TableHead>
                  <TableHead>Garden</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Current Crop</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plots.map((plot) => (
                  <TableRow key={plot.id}>
                    <TableCell className="font-medium">{plot.name}</TableCell>
                    <TableCell>{plot.garden}</TableCell>
                    <TableCell>{plot.assignee || "Unassigned"}</TableCell>
                    <TableCell>
                      <Badge variant={plot.status === 'Active' ? 'default' : 'secondary'}>
                        {plot.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{plot.size}</TableCell>
                    <TableCell>{plot.plantedCrop || "None"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPlots;