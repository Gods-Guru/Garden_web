#!/usr/bin/env node

/**
 * Database Index Creation Script for Community Garden Management System
 * 
 * This script creates optimized database indexes for better query performance.
 * It should be run after initial setup or when new indexes are needed.
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import all models
const User = require('../src/models/User');
const Garden = require('../src/models/Garden');
const Plot = require('../src/models/Plot');
const Task = require('../src/models/Task');
const Event = require('../src/models/Event');
const Application = require('../src/models/Application');
const Post = require('../src/models/Post');
const Notification = require('../src/models/Notification');
const Payment = require('../src/models/Payment');

// Suppress mongoose warnings
mongoose.set('strictQuery', false);

class IndexCreator {
  constructor() {
    this.indexes = [
      {
        model: User,
        name: 'User',
        indexes: [
          { fields: { email: 1 }, options: { unique: true } },
          { fields: { role: 1 } },
          { fields: { isVerified: 1 } },
          { fields: { createdAt: -1 } },
          { fields: { 'profile.phone': 1 } }
        ]
      },
      {
        model: Garden,
        name: 'Garden',
        indexes: [
          { fields: { name: 1 } },
          { fields: { manager: 1 } },
          { fields: { createdBy: 1 } },
          { fields: { isActive: 1 } },
          { fields: { 'location.coordinates': '2dsphere' } },
          { fields: { createdAt: -1 } }
        ]
      },
      {
        model: Plot,
        name: 'Plot',
        indexes: [
          { fields: { garden: 1 } },
          { fields: { assignedTo: 1 } },
          { fields: { status: 1 } },
          { fields: { plotNumber: 1, garden: 1 }, options: { unique: true } },
          { fields: { assignedDate: -1 } },
          { fields: { garden: 1, status: 1 } }
        ]
      },
      {
        model: Task,
        name: 'Task',
        indexes: [
          { fields: { garden: 1 } },
          { fields: { assignedTo: 1 } },
          { fields: { createdBy: 1 } },
          { fields: { status: 1 } },
          { fields: { priority: 1 } },
          { fields: { dueDate: 1 } },
          { fields: { createdAt: -1 } },
          { fields: { garden: 1, status: 1 } },
          { fields: { assignedTo: 1, status: 1 } }
        ]
      },
      {
        model: Event,
        name: 'Event',
        indexes: [
          { fields: { garden: 1 } },
          { fields: { organizer: 1 } },
          { fields: { date: 1 } },
          { fields: { isPublic: 1 } },
          { fields: { createdAt: -1 } },
          { fields: { garden: 1, date: 1 } },
          { fields: { date: 1, isPublic: 1 } }
        ]
      },
      {
        model: Application,
        name: 'Application',
        indexes: [
          { fields: { applicant: 1 } },
          { fields: { garden: 1 } },
          { fields: { plot: 1 } },
          { fields: { status: 1 } },
          { fields: { type: 1 } },
          { fields: { createdAt: -1 } },
          { fields: { garden: 1, status: 1 } },
          { fields: { applicant: 1, status: 1 } }
        ]
      },
      {
        model: Post,
        name: 'Post',
        indexes: [
          { fields: { author: 1 } },
          { fields: { garden: 1 } },
          { fields: { type: 1 } },
          { fields: { isPublic: 1 } },
          { fields: { createdAt: -1 } },
          { fields: { garden: 1, createdAt: -1 } },
          { fields: { type: 1, isPublic: 1 } }
        ]
      },
      {
        model: Notification,
        name: 'Notification',
        indexes: [
          { fields: { recipient: 1 } },
          { fields: { sender: 1 } },
          { fields: { type: 1 } },
          { fields: { isRead: 1 } },
          { fields: { createdAt: -1 } },
          { fields: { recipient: 1, isRead: 1 } },
          { fields: { recipient: 1, createdAt: -1 } }
        ]
      },
      {
        model: Payment,
        name: 'Payment',
        indexes: [
          { fields: { user: 1 } },
          { fields: { garden: 1 } },
          { fields: { status: 1 } },
          { fields: { type: 1 } },
          { fields: { createdAt: -1 } },
          { fields: { user: 1, status: 1 } },
          { fields: { garden: 1, type: 1 } }
        ]
      }
    ];
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

  async createIndexesForModel(modelConfig) {
    const { model, name, indexes } = modelConfig;
    
    console.log(`\n📋 Creating indexes for ${name}...`);
    
    let created = 0;
    let skipped = 0;
    
    for (const indexConfig of indexes) {
      const { fields, options = {} } = indexConfig;
      
      try {
        // Check if index already exists
        const existingIndexes = await model.collection.listIndexes().toArray();
        const indexName = Object.keys(fields).join('_');
        const indexExists = existingIndexes.some(idx => 
          idx.name.includes(indexName) || 
          JSON.stringify(idx.key) === JSON.stringify(fields)
        );
        
        if (indexExists) {
          console.log(`  ⏭️  Index ${indexName} already exists`);
          skipped++;
          continue;
        }
        
        await model.collection.createIndex(fields, options);
        console.log(`  ✅ Created index: ${indexName}`);
        created++;
        
      } catch (error) {
        if (error.code === 11000 || error.message.includes('already exists')) {
          console.log(`  ⏭️  Index already exists: ${Object.keys(fields).join('_')}`);
          skipped++;
        } else {
          console.error(`  ❌ Failed to create index ${Object.keys(fields).join('_')}:`, error.message);
        }
      }
    }
    
    console.log(`  📊 ${name}: ${created} created, ${skipped} skipped`);
  }

  async createAllIndexes() {
    console.log('🔧 Creating database indexes...\n');
    
    let totalCreated = 0;
    let totalSkipped = 0;
    
    for (const modelConfig of this.indexes) {
      try {
        await this.createIndexesForModel(modelConfig);
        
        // Get stats from the last operation
        const stats = await this.getIndexStats(modelConfig.model);
        totalCreated += stats.created || 0;
        totalSkipped += stats.skipped || 0;
        
      } catch (error) {
        console.error(`❌ Error creating indexes for ${modelConfig.name}:`, error.message);
      }
    }
    
    console.log(`\n📊 Summary: ${totalCreated} indexes created, ${totalSkipped} skipped`);
  }

  async getIndexStats(model) {
    try {
      const indexes = await model.collection.listIndexes().toArray();
      return {
        total: indexes.length,
        names: indexes.map(idx => idx.name)
      };
    } catch (error) {
      return { total: 0, names: [] };
    }
  }

  async listAllIndexes() {
    console.log('📋 Current database indexes:\n');
    
    for (const modelConfig of this.indexes) {
      const { model, name } = modelConfig;
      
      try {
        const indexes = await model.collection.listIndexes().toArray();
        
        console.log(`${name}:`);
        indexes.forEach(idx => {
          const keyStr = Object.keys(idx.key).map(k => `${k}:${idx.key[k]}`).join(', ');
          console.log(`  - ${idx.name}: {${keyStr}}`);
        });
        console.log('');
        
      } catch (error) {
        console.log(`${name}: Error listing indexes - ${error.message}\n`);
      }
    }
  }

  async dropAllIndexes() {
    console.log('🗑️  Dropping all custom indexes...\n');
    
    for (const modelConfig of this.indexes) {
      const { model, name } = modelConfig;
      
      try {
        console.log(`Dropping indexes for ${name}...`);
        
        // Get all indexes except _id
        const indexes = await model.collection.listIndexes().toArray();
        const customIndexes = indexes.filter(idx => idx.name !== '_id_');
        
        for (const idx of customIndexes) {
          try {
            await model.collection.dropIndex(idx.name);
            console.log(`  ✅ Dropped: ${idx.name}`);
          } catch (error) {
            console.log(`  ⚠️  Could not drop ${idx.name}: ${error.message}`);
          }
        }
        
      } catch (error) {
        console.error(`❌ Error dropping indexes for ${name}:`, error.message);
      }
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === '--help' || command === '-h') {
    console.log('Database Index Management Tool');
    console.log('');
    console.log('Usage:');
    console.log('  node createIndexes.js           Create all indexes');
    console.log('  node createIndexes.js --list    List current indexes');
    console.log('  node createIndexes.js --drop    Drop all custom indexes');
    console.log('  node createIndexes.js --help    Show this help');
    return;
  }
  
  const indexCreator = new IndexCreator();
  
  const connected = await indexCreator.connect();
  if (!connected) {
    process.exit(1);
  }

  try {
    switch (command) {
      case '--list':
        await indexCreator.listAllIndexes();
        break;
      case '--drop':
        await indexCreator.dropAllIndexes();
        break;
      default:
        await indexCreator.createAllIndexes();
        break;
    }
  } catch (error) {
    console.error('❌ Operation failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await indexCreator.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = IndexCreator;
