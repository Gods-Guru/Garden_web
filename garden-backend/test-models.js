#!/usr/bin/env node

/**
 * Community Garden Management System - Model Testing Utility
 *
 * This script validates all database models and can be used to:
 * - Test model schemas and validation
 * - Create sample data for development
 * - Verify database connections
 * - Debug model issues
 *
 * Usage:
 *   node test-models.js --validate    # Validate all models
 *   node test-models.js --seed        # Create sample data
 *   node test-models.js --clean       # Clean test data
 *   node test-models.js --help        # Show help
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import all models
const User = require('./src/models/User');
const Garden = require('./src/models/Garden');
const Plot = require('./src/models/Plot');
const Task = require('./src/models/Task');
const Event = require('./src/models/Event');
const Application = require('./src/models/Application');
const Post = require('./src/models/Post');
const Notification = require('./src/models/Notification');
const Payment = require('./src/models/Payment');

// Suppress mongoose warnings
mongoose.set('strictQuery', false);

class ModelTester {
  constructor() {
    this.models = [
      { name: 'User', Model: User },
      { name: 'Garden', Model: Garden },
      { name: 'Plot', Model: Plot },
      { name: 'Task', Model: Task },
      { name: 'Event', Model: Event },
      { name: 'Application', Model: Application },
      { name: 'Post', Model: Post },
      { name: 'Notification', Model: Notification },
      { name: 'Payment', Model: Payment }
    ];
    this.testData = {};
  }

  async connect() {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/garden-management-test';

    try {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Connected to MongoDB:', mongoose.connection.name);
      return true;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      return false;
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('✅ Disconnected from MongoDB');
    } catch (error) {
      console.error('❌ Disconnect error:', error.message);
    }
  }

  async validateModels() {
    console.log('🧪 Validating model schemas...\n');

    let passedCount = 0;
    let failedCount = 0;

    for (const { name, Model } of this.models) {
      try {
        // Create minimal valid instance
        const testData = this.getMinimalTestData(name);
        const instance = new Model(testData);

        // Validate without saving
        const validationError = instance.validateSync();

        if (validationError) {
          console.log(`❌ ${name} validation failed:`);
          Object.keys(validationError.errors).forEach(field => {
            console.log(`   - ${field}: ${validationError.errors[field].message}`);
          });
          failedCount++;
        } else {
          console.log(`✅ ${name} model schema is valid`);
          passedCount++;
        }
      } catch (error) {
        console.log(`❌ ${name} model error: ${error.message}`);
        failedCount++;
      }
    }

    console.log(`\n📊 Validation Results: ${passedCount} passed, ${failedCount} failed`);
    return failedCount === 0;
  }

  getMinimalTestData(modelName) {
    const userId = new mongoose.Types.ObjectId();
    const gardenId = new mongoose.Types.ObjectId();

    switch (modelName) {
      case 'User':
        return {
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedpassword123'
        };

      case 'Garden':
        return {
          name: 'Test Garden',
          description: 'A test garden',
          location: 'Test Location',
          createdBy: userId
        };

      case 'Plot':
        return {
          garden: gardenId,
          number: 'A-01'
        };

      case 'Task':
        return {
          title: 'Test Task',
          garden: gardenId,
          createdBy: userId,
          category: 'other'
        };

      case 'Event':
        return {
          title: 'Test Event',
          type: 'other',
          startDate: new Date(),
          endDate: new Date(Date.now() + 60 * 60 * 1000),
          garden: gardenId,
          organizer: userId
        };

      case 'Application':
        return {
          applicant: userId,
          garden: gardenId
        };

      case 'Post':
        return {
          title: 'Test Post',
          content: 'Test content',
          author: userId,
          garden: gardenId
        };

      case 'Notification':
        return {
          recipient: userId,
          type: 'system_update',
          title: 'Test Notification',
          message: 'Test message'
        };

      case 'Payment':
        return {
          user: userId,
          garden: gardenId,
          amount: 50,
          type: 'fee'
        };

      default:
        return {};
    }
  }

  showHelp() {
    console.log(`
🌱 Community Garden Management System - Model Testing Utility

Usage:
  node test-models.js [command]

Commands:
  --validate, -v    Validate all model schemas
  --seed, -s        Create sample data for development
  --clean, -c       Clean all test data
  --help, -h        Show this help message

Examples:
  node test-models.js --validate
  node test-models.js --seed
  node test-models.js --clean

Environment:
  MONGODB_URI       MongoDB connection string (default: mongodb://localhost:27017/garden-management-test)
    `);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const tester = new ModelTester();

  if (!command || command === '--help' || command === '-h') {
    tester.showHelp();
    return;
  }

  console.log('🌱 Community Garden Management System - Model Tester\n');

  const connected = await tester.connect();
  if (!connected) {
    process.exit(1);
  }

  try {
    switch (command) {
      case '--validate':
      case '-v':
        const isValid = await tester.validateModels();
        process.exit(isValid ? 0 : 1);
        break;

      default:
        console.log(`❌ Unknown command: ${command}`);
        tester.showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  } finally {
    await tester.disconnect();
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Process interrupted');
  await mongoose.disconnect();
  process.exit(0);
});

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}
        title: 'Test Event',
        type: 'other',
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 60 * 1000),
        garden: gardenId,
        organizer: userId
      };
    
    case 'Application':
      return {
        applicant: userId,
        garden: gardenId
      };
    
    case 'Post':
      return {
        title: 'Test Post',
        content: 'Test content',
        author: userId,
        garden: gardenId
      };
    
    case 'Notification':
      return {
        recipient: userId,
        type: 'system_update',
        title: 'Test Notification',
        message: 'Test message'
      };
    
    case 'Payment':
      return {
        user: userId,
        garden: gardenId,
        amount: 50,
        type: 'fee'
      };
    
    default:
      return {};
  }
}

// Run the test
testModels();
