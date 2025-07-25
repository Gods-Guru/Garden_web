const mongoose = require('mongoose');
const Garden = require('./src/models/Garden');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/garden-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testGardens = [
  {
    name: "Sunny Community Garden",
    description: "A beautiful community garden with organic vegetables and flowers. Perfect for families and beginners.",
    address: {
      street: "123 Garden Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "USA"
    },
    coordinates: {
      type: "Point",
      coordinates: [-122.4194, 37.7749] // [lng, lat] for San Francisco
    },
    numberOfPlots: 25,
    area: "2 acres",
    settings: {
      isPublic: true,
      requiresApproval: false,
      allowPhotos: true,
      allowEvents: true
    },
    contact: {
      email: "info@sunnygarden.com",
      phone: "(555) 123-4567"
    },
    rules: "1. Keep your plot clean and tidy\n2. Water regularly\n3. No pesticides allowed\n4. Respect other gardeners",
    stats: {
      activeMembers: 15,
      totalPlots: 25,
      availablePlots: 10
    }
  },
  {
    name: "Downtown Green Space",
    description: "Urban oasis in the heart of downtown. Specializing in herbs and small vegetables.",
    address: {
      street: "456 Urban Ave",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    coordinates: {
      type: "Point",
      coordinates: [-74.0060, 40.7128] // [lng, lat] for New York
    },
    numberOfPlots: 15,
    area: "1 acre",
    settings: {
      isPublic: true,
      requiresApproval: true,
      allowPhotos: true,
      allowEvents: true
    },
    contact: {
      email: "contact@downtowngreen.org"
    },
    rules: "Urban gardening guidelines apply. Membership required.",
    stats: {
      activeMembers: 12,
      totalPlots: 15,
      availablePlots: 3
    }
  },
  {
    name: "Riverside Organic Farm",
    description: "Large organic farm with educational programs and seasonal workshops.",
    address: {
      street: "789 River Road",
      city: "Portland",
      state: "OR",
      zipCode: "97201",
      country: "USA"
    },
    coordinates: {
      type: "Point",
      coordinates: [-122.6784, 45.5152] // [lng, lat] for Portland
    },
    numberOfPlots: 50,
    area: "5 acres",
    settings: {
      isPublic: true,
      requiresApproval: false,
      allowPhotos: true,
      allowEvents: true
    },
    contact: {
      email: "hello@riversideorganic.com",
      phone: "(555) 987-6543"
    },
    rules: "Organic practices only. Educational programs available.",
    stats: {
      activeMembers: 35,
      totalPlots: 50,
      availablePlots: 15
    }
  },
  {
    name: "Neighborhood Victory Garden",
    description: "Small neighborhood garden focused on vegetables and community building.",
    address: {
      street: "321 Victory Lane",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "USA"
    },
    coordinates: {
      type: "Point",
      coordinates: [-97.7431, 30.2672] // [lng, lat] for Austin
    },
    numberOfPlots: 20,
    area: "1.5 acres",
    settings: {
      isPublic: true,
      requiresApproval: false,
      allowPhotos: true,
      allowEvents: true
    },
    contact: {
      email: "info@victorygarden.net"
    },
    rules: "Community-focused gardening. All skill levels welcome.",
    stats: {
      activeMembers: 18,
      totalPlots: 20,
      availablePlots: 2
    }
  },
  {
    name: "Hillside Permaculture Garden",
    description: "Sustainable permaculture garden with fruit trees and perennial vegetables.",
    address: {
      street: "654 Hill Street",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA"
    },
    coordinates: {
      type: "Point",
      coordinates: [-122.3321, 47.6062] // [lng, lat] for Seattle
    },
    numberOfPlots: 30,
    area: "3 acres",
    settings: {
      isPublic: true,
      requiresApproval: true,
      allowPhotos: true,
      allowEvents: true
    },
    contact: {
      email: "contact@hillsidepermaculture.org",
      phone: "(555) 456-7890"
    },
    rules: "Permaculture principles. Sustainable practices required.",
    stats: {
      activeMembers: 22,
      totalPlots: 30,
      availablePlots: 8
    }
  }
];

async function createTestGardens() {
  try {
    console.log('🌱 Creating test gardens...');
    
    // Check if gardens already exist
    const existingCount = await Garden.countDocuments();
    console.log(`Found ${existingCount} existing gardens`);

    if (existingCount > 0) {
      console.log('Deleting existing gardens to recreate with proper status...');
      await Garden.deleteMany({});
      console.log('Existing gardens deleted.');
    }
    
    // Find or create a test user to be the owner
    let testUser = await User.findOne({ email: 'testowner@garden.com' });
    
    if (!testUser) {
      console.log('Creating test user...');
      testUser = await User.create({
        name: 'Test Garden Owner',
        email: 'testowner@garden.com',
        password: 'password123', // This will be hashed by the model
        role: 'user',
        isVerified: true
      });
    }
    
    // Add owner and status to each garden
    const gardensWithOwner = testGardens.map(garden => ({
      ...garden,
      owner: testUser._id,
      status: 'active', // This is required by the getAllGardens filter
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Create gardens
    const createdGardens = await Garden.insertMany(gardensWithOwner);
    
    console.log(`✅ Created ${createdGardens.length} test gardens:`);
    createdGardens.forEach(garden => {
      console.log(`  - ${garden.name} (${garden.address.city}, ${garden.address.state})`);
    });
    
    console.log('\n🎉 Test gardens created successfully!');
    console.log('You can now test the Gardens page with real data.');
    
  } catch (error) {
    console.error('❌ Error creating test gardens:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
createTestGardens();
