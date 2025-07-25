const mongoose = require('mongoose');

// Database indexes for optimal performance
const createIndexes = async () => {
  try {
    console.log('Creating database indexes...');

    // Check if connection is ready
    if (!mongoose.connection.db) {
      console.log('⚠️ Database connection not ready, skipping index creation');
      return;
    }

    // Check connection state
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ Database not connected, skipping index creation');
      return;
    }

    // Create indexes with error handling for each collection
    const createCollectionIndexes = async (collectionName, indexes) => {
      try {
        for (const index of indexes) {
          await mongoose.connection.db.collection(collectionName).createIndex(
            index.key,
            index.options || { background: true }
          );
        }
        console.log(`✅ Created indexes for ${collectionName}`);
      } catch (error) {
        console.log(`⚠️ Error creating indexes for ${collectionName}:`, error.message);
      }
    };

    // User indexes
    await createCollectionIndexes('users', [
      { key: { email: 1 }, options: { unique: true, background: true } },
      { key: { role: 1 } },
      { key: { status: 1 } },
      { key: { createdAt: -1 } }
    ]);

    // Garden indexes
    await createCollectionIndexes('gardens', [
      { key: { "geo": "2dsphere" } },
      { key: { "location.city": 1, "location.state": 1 } },
      { key: { owner: 1 } },
      { key: { creator: 1 } },
      { key: { status: 1 } },
      { key: { createdAt: -1 } }
    ]);

    // Plot indexes
    await createCollectionIndexes('plots', [
      { key: { garden: 1, status: 1 } },
      { key: { assignedTo: 1 } },
      { key: { garden: 1, plotNumber: 1 }, options: { unique: true, background: true } }
    ]);

    // Task indexes
    await createCollectionIndexes('tasks', [
      { key: { assignedTo: 1, status: 1 } },
      { key: { garden: 1, dueDate: 1 } },
      { key: { createdBy: 1 } },
      { key: { priority: 1, status: 1 } }
    ]);

    console.log('✅ Essential database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating database indexes:', error.message);
  }
};

// Drop all indexes (for development/testing)
const dropIndexes = async () => {
  try {
    console.log('Dropping all custom indexes...');
    
    const collections = ['users', 'gardens', 'plots', 'tasks', 'events', 'applications', 'payments', 'notifications', 'posts', 'waterlogs', 'volunteers'];
    
    for (const collectionName of collections) {
      try {
        await mongoose.connection.db.collection(collectionName).dropIndexes();
        console.log(`Dropped indexes for ${collectionName}`);
      } catch (error) {
        // Collection might not exist, ignore error
        console.log(`No indexes to drop for ${collectionName}`);
      }
    }
    
    console.log('✅ Indexes dropped successfully');
  } catch (error) {
    console.error('❌ Error dropping indexes:', error);
  }
};

// List all indexes
const listIndexes = async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      const indexes = await mongoose.connection.db.collection(collection.name).indexes();
      console.log(`\n${collection.name} indexes:`);
      indexes.forEach(index => {
        console.log(`  - ${JSON.stringify(index.key)} ${index.unique ? '(unique)' : ''}`);
      });
    }
  } catch (error) {
    console.error('❌ Error listing indexes:', error);
  }
};

module.exports = {
  createIndexes,
  dropIndexes,
  listIndexes
};
