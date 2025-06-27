// MyPlots Component
import React from 'react';
import { Camera, BookOpen, Droplets, Leaf, AlertTriangle, PlusCircle } from 'lucide-react';

const MyPlots = () => {
  // Dummy data for plots
  const userPlots = [
    {
      id: 'plot-a01',
      name: 'Plot A-01: Sunny Veggie Patch',
      plants: ['Tomatoes', 'Basil', 'Peppers'],
      lastPhotoUrl: '/placeholder-images/plot1.jpg', // Placeholder image path
      status: 'Healthy', // Options: Healthy, Needs Attention, Needs Water, Harvest Ready
      nextCare: 'Watering due tomorrow',
      healthColor: 'text-green-500', // For plot health visualization
    },
    {
      id: 'plot-b05',
      name: 'Plot B-05: Herb Haven',
      plants: ['Rosemary', 'Thyme', 'Mint', 'Chives'],
      lastPhotoUrl: '/placeholder-images/plot2.jpg', // Placeholder image path
      status: 'Needs Water',
      nextCare: 'Water immediately',
      healthColor: 'text-yellow-500',
    },
    // Example of a plot needing more urgent attention
    // {
    //   id: 'plot-c12',
    //   name: 'Plot C-12: Berry Corner',
    //   plants: ['Strawberries', 'Blueberries'],
    //   lastPhotoUrl: '/placeholder-images/plot3.jpg',
    //   status: 'Pest Detected',
    //   nextCare: 'Inspect for aphids',
    //   healthColor: 'text-red-500',
    // },
  ];

  // const userPlots = []; // Test empty state

  const getHealthIcon = (status) => {
    switch (status) {
      case 'Healthy':
        return <Leaf size={18} className="text-green-500" />;
      case 'Needs Water':
        return <Droplets size={18} className="text-blue-500" />;
      case 'Needs Attention':
      case 'Pest Detected':
        return <AlertTriangle size={18} className="text-red-500" />;
      default:
        return <Leaf size={18} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
      <h2 className="text-2xl font-semibold text-primary-700 mb-6 flex items-center">
        <Leaf size={28} className="mr-2 text-primary-500" /> My Plots
      </h2>

      {userPlots.length === 0 ? (
        // Empty State for No Plots
        <div className="text-center py-10 bg-background rounded-md border border-border">
          <Leaf size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Plots Yet!</h3>
          <p className="text-muted-foreground mb-4">
            You currently don't have any garden plots assigned.
          </p>
          <button className="bg-primary-500 hover:bg-primary-600 text-primary-foreground font-semibold py-2 px-4 rounded-md flex items-center mx-auto">
            <PlusCircle size={20} className="mr-2" />
            Request a Plot (Example)
          </button>
          {/* UX Comment: How should the dashboard adapt for users with no plots yet?
              - Display a clear message.
              - Provide guidance or a CTA (e.g., "Contact Admin", "View Available Plots" if applicable).
              - Could show general gardening tips instead.
          */}
        </div>
      ) : (
        // Display Plot Cards
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userPlots.map((plot) => (
            <div key={plot.id} className="bg-background rounded-lg shadow-sm overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300">
              <img
                src={plot.lastPhotoUrl || "https://via.placeholder.com/400x200.png?text=Plot+Image"}
                alt={`View of ${plot.name}`}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-1">{plot.name}</h3>

                {/* Plot Health: Use green/yellow/red border/icon/text */}
                <div className={`flex items-center text-sm font-medium mb-2 ${plot.healthColor}`}>
                  {getHealthIcon(plot.status)}
                  <span className="ml-1.5">{plot.status}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-1">
                  <span className="font-medium text-foreground">Plants:</span> {plot.plants.join(', ')}
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  <span className="font-medium text-foreground">Next Care:</span> {plot.nextCare}
                </p>

                <div className="flex flex-wrap gap-2">
                  <button className="flex-1 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-md flex items-center justify-center transition-colors duration-200">
                    <Camera size={16} className="mr-1.5" /> Add Photo
                  </button>
                  <button className="flex-1 text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-md flex items-center justify-center transition-colors duration-200">
                    <BookOpen size={16} className="mr-1.5" /> Log Activity
                  </button>
                  <button className="flex-1 text-xs sm:text-sm bg-teal-500 hover:bg-teal-600 text-white py-2 px-3 rounded-md flex items-center justify-center transition-colors duration-200">
                    <Droplets size={16} className="mr-1.5" /> Water Plot
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* UX Comment: What's the best way to visualize plot health status?
          - Color-coded icons (as implemented: Leaf for healthy, Droplets for water, Alert for issues).
          - Colored text for status.
          - A small colored border on the card (e.g., left border).
          - A progress bar-like indicator if health can be quantified.
          Current implementation uses an icon and colored text.
       */}
    </div>
  );
};

export default MyPlots;
