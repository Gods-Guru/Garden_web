#!/usr/bin/env node

/**
 * Database Migration Script for Community Garden Management System
 * 
 * This script handles database schema migrations and updates.
 * It ensures the database structure is up-to-date with the latest model definitions.
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import all models to ensure they're registered
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

class DatabaseMigrator {
  constructor() {
    this.migrations = [
      {
        version: '1.0.0',
        description: 'Initial schema setup',
        migrate: this.migration_1_0_0.bind(this)
      },
      {
        version: '1.1.0',
        description: 'Add user verification fields',
        migrate: this.migration_1_1_0.bind(this)
      },
      {
        version: '1.2.0',
        description: 'Add garden manager assignments',
        migrate: this.migration_1_2_0.bind(this)
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

  async getCurrentVersion() {
    try {
      // Check if migrations collection exists
      const collections = await mongoose.connection.db.listCollections().toArray();
      const migrationsExists = collections.some(col => col.name === 'migrations');
      
      if (!migrationsExists) {
        return '0.0.0';
      }

      const Migration = mongoose.model('Migration', new mongoose.Schema({
        version: String,
        appliedAt: { type: Date, default: Date.now }
      }));

      const lastMigration = await Migration.findOne().sort({ appliedAt: -1 });
      return lastMigration ? lastMigration.version : '0.0.0';
    } catch (error) {
      console.error('Error getting current version:', error.message);
      return '0.0.0';
    }
  }

  async recordMigration(version) {
    const Migration = mongoose.model('Migration', new mongoose.Schema({
      version: String,
      appliedAt: { type: Date, default: Date.now }
    }));

    await new Migration({ version }).save();
  }

  async migration_1_0_0() {
    console.log('  📋 Running initial schema setup...');
    
    // Ensure all collections exist by creating indexes
    await User.createIndexes();
    await Garden.createIndexes();
    await Plot.createIndexes();
    await Task.createIndexes();
    await Event.createIndexes();
    
    console.log('  ✅ Initial schema setup completed');
  }

  async migration_1_1_0() {
    console.log('  📋 Adding user verification fields...');
    
    // Update users without verification fields
    await User.updateMany(
      { isVerified: { $exists: false } },
      { 
        $set: { 
          isVerified: false,
          verificationToken: null,
          verificationTokenExpires: null
        }
      }
    );
    
    console.log('  ✅ User verification fields added');
  }

  async migration_1_2_0() {
    console.log('  📋 Adding garden manager assignments...');
    
    // Update gardens without manager field
    await Garden.updateMany(
      { manager: { $exists: false } },
      { $set: { manager: null } }
    );
    
    console.log('  ✅ Garden manager assignments added');
  }

  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 < part2) return -1;
      if (part1 > part2) return 1;
    }
    
    return 0;
  }

  async runMigrations() {
    console.log('🔄 Starting database migrations...\n');
    
    const currentVersion = await this.getCurrentVersion();
    console.log(`📊 Current database version: ${currentVersion}`);
    
    let migrationsRun = 0;
    
    for (const migration of this.migrations) {
      if (this.compareVersions(currentVersion, migration.version) < 0) {
        console.log(`\n🚀 Running migration ${migration.version}: ${migration.description}`);
        
        try {
          await migration.migrate();
          await this.recordMigration(migration.version);
          migrationsRun++;
          
          console.log(`✅ Migration ${migration.version} completed`);
        } catch (error) {
          console.error(`❌ Migration ${migration.version} failed:`, error.message);
          throw error;
        }
      }
    }
    
    if (migrationsRun === 0) {
      console.log('\n✅ Database is up to date - no migrations needed');
    } else {
      console.log(`\n✅ Successfully ran ${migrationsRun} migration(s)`);
    }
  }

  async validateSchema() {
    console.log('\n🔍 Validating database schema...');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    const expectedCollections = [
      'users', 'gardens', 'plots', 'tasks', 'events', 
      'applications', 'posts', 'notifications', 'payments'
    ];
    
    const missingCollections = expectedCollections.filter(
      name => !collectionNames.includes(name)
    );
    
    if (missingCollections.length > 0) {
      console.log(`⚠️  Missing collections: ${missingCollections.join(', ')}`);
    } else {
      console.log('✅ All expected collections exist');
    }
    
    // Validate indexes
    try {
      await User.listIndexes();
      await Garden.listIndexes();
      await Plot.listIndexes();
      console.log('✅ Database indexes are valid');
    } catch (error) {
      console.log('⚠️  Some indexes may be missing or invalid');
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === '--help' || command === '-h') {
    console.log('Database Migration Tool');
    console.log('');
    console.log('Usage:');
    console.log('  node migrate.js           Run pending migrations');
    console.log('  node migrate.js --validate Validate schema only');
    console.log('  node migrate.js --help     Show this help');
    return;
  }
  
  const migrator = new DatabaseMigrator();
  
  const connected = await migrator.connect();
  if (!connected) {
    process.exit(1);
  }

  try {
    if (command === '--validate') {
      await migrator.validateSchema();
    } else {
      await migrator.runMigrations();
      await migrator.validateSchema();
    }
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await migrator.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = DatabaseMigrator;
