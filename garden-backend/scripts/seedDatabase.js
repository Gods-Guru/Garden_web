#!/usr/bin/env node

/**
 * Database Seeding Script for Community Garden Management System
 * 
 * This script creates initial data for development and testing purposes.
 * It creates sample gardens, users, plots, and other necessary data.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const Garden = require('../src/models/Garden');
const Plot = require('../src/models/Plot');
const Task = require('../src/models/Task');
const Event = require('../src/models/Event');

// Suppress mongoose warnings
mongoose.set('strictQuery', false);

class DatabaseSeeder {
  constructor() {
    this.users = [];
    this.gardens = [];
    this.plots = [];
  }

  async connect() {
    try {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
      if (!mongoUri) {
        throw new Error('MongoDB URI not found in environment variables');
      }

      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB');
      return true;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      return false;
    }
  }

  async disconnect() {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }

  async clearDatabase() {
    console.log('🧹 Clearing existing data...');
    
    await User.deleteMany({});
    await Garden.deleteMany({});
    await Plot.deleteMany({});
    await Task.deleteMany({});
    await Event.deleteMany({});
    
    console.log('✅ Database cleared');
  }

  async createUsers() {
    console.log('👥 Creating users...');
    
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const usersData = [
      {
        name: 'System Administrator',
        email: 'admin@garden.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        phone: '+1234567890'
      },
      {
        name: 'Garden Manager One',
        email: 'manager1@garden.com',
        password: hashedPassword,
        role: 'garden_manager',
        isVerified: true,
        phone: '+1234567891'
      },
      {
        name: 'Garden Manager Two',
        email: 'manager2@garden.com',
        password: hashedPassword,
        role: 'garden_manager',
        isVerified: true,
        phone: '+1234567892'
      },
      {
        name: 'John Gardener',
        email: 'john@garden.com',
        password: hashedPassword,
        role: 'user',
        isVerified: true,
        phone: '+1234567893'
      },
      {
        name: 'Jane Green',
        email: 'jane@garden.com',
        password: hashedPassword,
        role: 'user',
        isVerified: true,
        phone: '+1234567894'
      }
    ];

    this.users = await User.insertMany(usersData);
    console.log(`✅ Created ${this.users.length} users`);
  }

  async createGardens() {
    console.log('🌱 Creating gardens...');
    
    const admin = this.users.find(u => u.role === 'admin');
    const manager1 = this.users.find(u => u.email === 'manager1@garden.com');
    const manager2 = this.users.find(u => u.email === 'manager2@garden.com');

    const gardensData = [
      {
        name: 'Sunrise Community Garden',
        description: 'A beautiful community garden located in the heart of downtown, perfect for growing vegetables and herbs.',
        location: {
          address: '123 Garden Street, Downtown',
          coordinates: {
            lat: 40.7128,
            lng: -74.0060
          }
        },
        size: '2 acres',
        totalPlots: 20,
        availablePlots: 15,
        rules: [
          'No pesticides allowed',
          'Water your plants regularly',
          'Keep your plot clean and tidy',
          'Respect other gardeners'
        ],
        manager: manager1._id,
        createdBy: admin._id,
        isActive: true
      },
      {
        name: 'Westside Organic Garden',
        description: 'An organic-focused community garden with composting facilities and educational workshops.',
        location: {
          address: '456 West Avenue, Westside',
          coordinates: {
            lat: 40.7589,
            lng: -73.9851
          }
        },
        size: '1.5 acres',
        totalPlots: 15,
        availablePlots: 10,
        rules: [
          'Organic practices only',
          'Participate in monthly workshops',
          'Share knowledge with fellow gardeners',
          'Maintain composting area'
        ],
        manager: manager2._id,
        createdBy: admin._id,
        isActive: true
      }
    ];

    this.gardens = await Garden.insertMany(gardensData);
    console.log(`✅ Created ${this.gardens.length} gardens`);
  }

  async createPlots() {
    console.log('🧱 Creating plots...');
    
    const plotsData = [];
    
    // Create plots for each garden
    this.gardens.forEach((garden, gardenIndex) => {
      for (let i = 1; i <= garden.totalPlots; i++) {
        plotsData.push({
          plotNumber: `${gardenIndex + 1}-${i.toString().padStart(2, '0')}`,
          garden: garden._id,
          size: '4x8 feet',
          status: i <= 5 ? 'occupied' : 'available',
          assignedTo: i <= 5 ? this.users[Math.floor(Math.random() * 2) + 3]._id : null, // Assign to regular users
          cropType: i <= 5 ? ['Tomatoes', 'Lettuce', 'Carrots', 'Herbs', 'Peppers'][Math.floor(Math.random() * 5)] : null,
          assignedDate: i <= 5 ? new Date() : null
        });
      }
    });

    this.plots = await Plot.insertMany(plotsData);
    console.log(`✅ Created ${this.plots.length} plots`);
  }

  async createTasks() {
    console.log('📋 Creating tasks...');
    
    const tasksData = [
      {
        title: 'Water the tomato plants',
        description: 'Water all tomato plants in the morning',
        garden: this.gardens[0]._id,
        assignedTo: this.users[3]._id,
        createdBy: this.users[1]._id,
        priority: 'high',
        status: 'pending',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
      },
      {
        title: 'Weed the herb section',
        description: 'Remove weeds from the community herb garden',
        garden: this.gardens[1]._id,
        assignedTo: this.users[4]._id,
        createdBy: this.users[2]._id,
        priority: 'medium',
        status: 'in_progress',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
      }
    ];

    await Task.insertMany(tasksData);
    console.log(`✅ Created ${tasksData.length} tasks`);
  }

  async createEvents() {
    console.log('📅 Creating events...');
    
    const eventsData = [
      {
        title: 'Monthly Garden Meeting',
        description: 'Discuss garden maintenance and upcoming projects',
        garden: this.gardens[0]._id,
        organizer: this.users[1]._id,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        duration: 120, // 2 hours
        maxAttendees: 20,
        isPublic: true
      },
      {
        title: 'Composting Workshop',
        description: 'Learn how to create and maintain compost for your garden',
        garden: this.gardens[1]._id,
        organizer: this.users[2]._id,
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
        duration: 180, // 3 hours
        maxAttendees: 15,
        isPublic: true
      }
    ];

    await Event.insertMany(eventsData);
    console.log(`✅ Created ${eventsData.length} events`);
  }

  async seed() {
    console.log('🌱 Starting database seeding...\n');
    
    await this.clearDatabase();
    await this.createUsers();
    await this.createGardens();
    await this.createPlots();
    await this.createTasks();
    await this.createEvents();
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Login credentials:');
    console.log('Admin: admin@garden.com / password123');
    console.log('Manager 1: manager1@garden.com / password123');
    console.log('Manager 2: manager2@garden.com / password123');
    console.log('User 1: john@garden.com / password123');
    console.log('User 2: jane@garden.com / password123');
  }
}

// Main execution
async function main() {
  const seeder = new DatabaseSeeder();
  
  const connected = await seeder.connect();
  if (!connected) {
    process.exit(1);
  }

  try {
    await seeder.seed();
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await seeder.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = DatabaseSeeder;
