// ============================================
// MYDUIT V6 - APPWRITE SETUP SCRIPT
// Run this once to create all collections
// ============================================
// 
// Usage:
// 1. npm install node-appwrite
// 2. Set environment variables or update values below
// 3. node scripts/setup-appwrite.js
//
// ============================================

const { Client, Databases, ID } = require('node-appwrite');

// Configuration
const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID || 'YOUR_PROJECT_ID',
  apiKey: process.env.APPWRITE_API_KEY || 'YOUR_API_KEY',
  databaseId: 'myduit-db',
};

// Initialize client
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const databases = new Databases(client);

// Collection definitions
const collections = [
  {
    id: 'households',
    name: 'Households',
    attributes: [
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'string', key: 'userId', size: 36, required: true },
      { type: 'string', key: 'teamId', size: 36, required: false },
      { type: 'string', key: 'currency', size: 3, required: false, default: 'MYR' },
    ],
    indexes: [
      { key: 'userId_idx', type: 'key', attributes: ['userId'] },
      { key: 'teamId_idx', type: 'key', attributes: ['teamId'] },
    ],
  },
  {
    id: 'members',
    name: 'Members',
    attributes: [
      { type: 'string', key: 'householdId', size: 36, required: true },
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'string', key: 'role', size: 50, required: true },
      { type: 'string', key: 'avatar', size: 10, required: false, default: '👤' },
      { type: 'string', key: 'userId', size: 36, required: false },
    ],
    indexes: [
      { key: 'householdId_idx', type: 'key', attributes: ['householdId'] },
    ],
  },
  {
    id: 'income',
    name: 'Income',
    attributes: [
      { type: 'string', key: 'householdId', size: 36, required: true },
      { type: 'string', key: 'memberId', size: 36, required: false },
      { type: 'string', key: 'type', size: 50, required: true },
      { type: 'float', key: 'amount', required: true },
      { type: 'datetime', key: 'date', required: true },
      { type: 'boolean', key: 'isRecurring', required: false, default: true },
      { type: 'string', key: 'notes', size: 500, required: false },
    ],
    indexes: [
      { key: 'householdId_idx', type: 'key', attributes: ['householdId'] },
      { key: 'householdId_date_idx', type: 'key', attributes: ['householdId', 'date'] },
    ],
  },
  {
    id: 'commitments',
    name: 'Commitments',
    attributes: [
      { type: 'string', key: 'householdId', size: 36, required: true },
      { type: 'string', key: 'memberId', size: 36, required: false },
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'float', key: 'amount', required: true },
      { type: 'integer', key: 'dueDate', required: true, min: 1, max: 31 },
      { type: 'string', key: 'icon', size: 50, required: false, default: 'CreditCard' },
      { type: 'float', key: 'totalDebt', required: false },
      { type: 'float', key: 'paidAmount', required: false, default: 0 },
      { type: 'float', key: 'interestRate', required: false },
      { type: 'datetime', key: 'startDate', required: false },
      { type: 'datetime', key: 'endDate', required: false },
      { type: 'boolean', key: 'isActive', required: false, default: true },
      { type: 'string', key: 'category', size: 50, required: false },
    ],
    indexes: [
      { key: 'householdId_idx', type: 'key', attributes: ['householdId'] },
      { key: 'householdId_isActive_idx', type: 'key', attributes: ['householdId', 'isActive'] },
      { key: 'dueDate_idx', type: 'key', attributes: ['dueDate'] },
    ],
  },
  {
    id: 'transactions',
    name: 'Transactions',
    attributes: [
      { type: 'string', key: 'householdId', size: 36, required: true },
      { type: 'string', key: 'memberId', size: 36, required: false },
      { type: 'string', key: 'description', size: 255, required: true },
      { type: 'float', key: 'amount', required: true },
      { type: 'datetime', key: 'date', required: true },
      { type: 'string', key: 'category', size: 50, required: true },
      { type: 'string', key: 'type', size: 20, required: true }, // expense or income
      { type: 'string', key: 'notes', size: 500, required: false },
    ],
    indexes: [
      { key: 'householdId_idx', type: 'key', attributes: ['householdId'] },
      { key: 'householdId_date_idx', type: 'key', attributes: ['householdId', 'date'] },
      { key: 'householdId_category_idx', type: 'key', attributes: ['householdId', 'category'] },
      { key: 'householdId_type_idx', type: 'key', attributes: ['householdId', 'type'] },
    ],
  },
  {
    id: 'savings',
    name: 'Savings',
    attributes: [
      { type: 'string', key: 'householdId', size: 36, required: true },
      { type: 'string', key: 'memberId', size: 36, required: false },
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'float', key: 'currentAmount', required: false, default: 0 },
      { type: 'float', key: 'targetAmount', required: true },
      { type: 'datetime', key: 'targetDate', required: false },
      { type: 'string', key: 'icon', size: 10, required: false, default: '💰' },
    ],
    indexes: [
      { key: 'householdId_idx', type: 'key', attributes: ['householdId'] },
    ],
  },
  {
    id: 'investments',
    name: 'Investments',
    attributes: [
      { type: 'string', key: 'householdId', size: 36, required: true },
      { type: 'string', key: 'memberId', size: 36, required: false },
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'string', key: 'type', size: 50, required: true },
      { type: 'float', key: 'currentValue', required: true },
      { type: 'float', key: 'costBasis', required: true },
      { type: 'boolean', key: 'isHalal', required: false, default: true },
      { type: 'string', key: 'institution', size: 100, required: false },
      { type: 'string', key: 'notes', size: 500, required: false },
    ],
    indexes: [
      { key: 'householdId_idx', type: 'key', attributes: ['householdId'] },
      { key: 'householdId_type_idx', type: 'key', attributes: ['householdId', 'type'] },
      { key: 'householdId_isHalal_idx', type: 'key', attributes: ['householdId', 'isHalal'] },
    ],
  },
  {
    id: 'insurance',
    name: 'Insurance',
    attributes: [
      { type: 'string', key: 'householdId', size: 36, required: true },
      { type: 'string', key: 'memberId', size: 36, required: false },
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'string', key: 'type', size: 50, required: true },
      { type: 'string', key: 'provider', size: 100, required: true },
      { type: 'float', key: 'premium', required: true },
      { type: 'string', key: 'frequency', size: 20, required: false, default: 'monthly' },
      { type: 'float', key: 'coverage', required: false },
      { type: 'datetime', key: 'renewalDate', required: false },
      { type: 'string', key: 'policyNumber', size: 100, required: false },
      { type: 'boolean', key: 'isTakaful', required: false, default: false },
      { type: 'string', key: 'notes', size: 500, required: false },
    ],
    indexes: [
      { key: 'householdId_idx', type: 'key', attributes: ['householdId'] },
      { key: 'householdId_type_idx', type: 'key', attributes: ['householdId', 'type'] },
      { key: 'renewalDate_idx', type: 'key', attributes: ['renewalDate'] },
    ],
  },
  {
    id: 'goals',
    name: 'Financial Goals',
    attributes: [
      { type: 'string', key: 'householdId', size: 36, required: true },
      { type: 'string', key: 'memberId', size: 36, required: false },
      { type: 'string', key: 'name', size: 100, required: true },
      { type: 'string', key: 'type', size: 20, required: true }, // short or long
      { type: 'float', key: 'targetAmount', required: true },
      { type: 'float', key: 'currentAmount', required: false, default: 0 },
      { type: 'datetime', key: 'deadline', required: false },
      { type: 'string', key: 'priority', size: 20, required: false, default: 'medium' },
      { type: 'string', key: 'icon', size: 10, required: false, default: '🎯' },
      { type: 'boolean', key: 'isCompleted', required: false, default: false },
    ],
    indexes: [
      { key: 'householdId_idx', type: 'key', attributes: ['householdId'] },
      { key: 'householdId_type_idx', type: 'key', attributes: ['householdId', 'type'] },
      { key: 'householdId_priority_idx', type: 'key', attributes: ['householdId', 'priority'] },
    ],
  },
  {
    id: 'zakat',
    name: 'Zakat',
    attributes: [
      { type: 'string', key: 'householdId', size: 36, required: true },
      { type: 'integer', key: 'year', required: true },
      { type: 'float', key: 'incomeYearly', required: false, default: 0 },
      { type: 'float', key: 'incomeZakat', required: false, default: 0 },
      { type: 'float', key: 'savingsAmount', required: false, default: 0 },
      { type: 'float', key: 'savingsZakat', required: false, default: 0 },
      { type: 'float', key: 'goldValue', required: false, default: 0 },
      { type: 'float', key: 'goldZakat', required: false, default: 0 },
      { type: 'float', key: 'investmentValue', required: false, default: 0 },
      { type: 'float', key: 'investmentZakat', required: false, default: 0 },
      { type: 'float', key: 'totalDue', required: false, default: 0 },
      { type: 'float', key: 'totalPaid', required: false, default: 0 },
      { type: 'datetime', key: 'lastPaidDate', required: false },
    ],
    indexes: [
      { key: 'householdId_idx', type: 'key', attributes: ['householdId'] },
      { key: 'householdId_year_idx', type: 'unique', attributes: ['householdId', 'year'] },
    ],
  },
  {
    id: 'faraid',
    name: 'Faraid',
    attributes: [
      { type: 'string', key: 'householdId', size: 36, required: true },
      { type: 'float', key: 'totalAssets', required: false, default: 0 },
      { type: 'boolean', key: 'hasWasiat', required: false, default: false },
      { type: 'string', key: 'wasiatNotes', size: 1000, required: false },
      { type: 'string', key: 'beneficiaries', size: 5000, required: false, default: '[]' },
    ],
    indexes: [
      { key: 'householdId_idx', type: 'unique', attributes: ['householdId'] },
    ],
  },
  {
    id: 'budget_settings',
    name: 'Budget Settings',
    attributes: [
      { type: 'string', key: 'householdId', size: 36, required: true },
      { type: 'integer', key: 'needsPercentage', required: false, default: 50, min: 0, max: 100 },
      { type: 'integer', key: 'wantsPercentage', required: false, default: 30, min: 0, max: 100 },
      { type: 'integer', key: 'savingsPercentage', required: false, default: 20, min: 0, max: 100 },
    ],
    indexes: [
      { key: 'householdId_idx', type: 'unique', attributes: ['householdId'] },
    ],
  },
];

// Helper functions
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createDatabase() {
  try {
    console.log('Creating database...');
    await databases.create(config.databaseId, 'MyDuit Database');
    console.log('✅ Database created');
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️ Database already exists');
    } else {
      throw error;
    }
  }
}

async function createCollection(collection) {
  try {
    console.log(`\nCreating collection: ${collection.name}...`);
    
    // Create collection
    await databases.createCollection(
      config.databaseId,
      collection.id,
      collection.name,
      [
        // Collection level permissions - allow users to create
        'create("users")',
      ],
      true // Enable document security
    );
    console.log(`✅ Collection ${collection.name} created`);
    
    // Wait a bit to avoid rate limiting
    await sleep(500);
    
    // Create attributes
    for (const attr of collection.attributes) {
      try {
        console.log(`  Creating attribute: ${attr.key}...`);
        
        switch (attr.type) {
          case 'string':
            await databases.createStringAttribute(
              config.databaseId,
              collection.id,
              attr.key,
              attr.size,
              attr.required,
              attr.default || null,
              attr.array || false
            );
            break;
          case 'integer':
            await databases.createIntegerAttribute(
              config.databaseId,
              collection.id,
              attr.key,
              attr.required,
              attr.min || null,
              attr.max || null,
              attr.default || null,
              attr.array || false
            );
            break;
          case 'float':
            await databases.createFloatAttribute(
              config.databaseId,
              collection.id,
              attr.key,
              attr.required,
              attr.min || null,
              attr.max || null,
              attr.default || null,
              attr.array || false
            );
            break;
          case 'boolean':
            await databases.createBooleanAttribute(
              config.databaseId,
              collection.id,
              attr.key,
              attr.required,
              attr.default || null,
              attr.array || false
            );
            break;
          case 'datetime':
            await databases.createDatetimeAttribute(
              config.databaseId,
              collection.id,
              attr.key,
              attr.required,
              attr.default || null,
              attr.array || false
            );
            break;
        }
        
        console.log(`  ✅ Attribute ${attr.key} created`);
        await sleep(300);
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️ Attribute ${attr.key} already exists`);
        } else {
          console.error(`  ❌ Error creating attribute ${attr.key}:`, error.message);
        }
      }
    }
    
    // Wait for attributes to be processed
    console.log('  Waiting for attributes to be processed...');
    await sleep(2000);
    
    // Create indexes
    for (const index of collection.indexes || []) {
      try {
        console.log(`  Creating index: ${index.key}...`);
        await databases.createIndex(
          config.databaseId,
          collection.id,
          index.key,
          index.type,
          index.attributes,
          index.orders || []
        );
        console.log(`  ✅ Index ${index.key} created`);
        await sleep(500);
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️ Index ${index.key} already exists`);
        } else {
          console.error(`  ❌ Error creating index ${index.key}:`, error.message);
        }
      }
    }
    
  } catch (error) {
    if (error.code === 409) {
      console.log(`⚠️ Collection ${collection.name} already exists`);
    } else {
      console.error(`❌ Error creating collection ${collection.name}:`, error.message);
      throw error;
    }
  }
}

// Main function
async function main() {
  console.log('🚀 Starting MyDuit Appwrite Setup');
  console.log('================================\n');
  console.log(`Endpoint: ${config.endpoint}`);
  console.log(`Project ID: ${config.projectId}`);
  console.log(`Database ID: ${config.databaseId}`);
  console.log('');
  
  try {
    // Create database
    await createDatabase();
    
    // Create collections
    for (const collection of collections) {
      await createCollection(collection);
    }
    
    console.log('\n================================');
    console.log('✅ Setup completed successfully!');
    console.log('================================\n');
    console.log('Next steps:');
    console.log('1. Go to Appwrite Console');
    console.log('2. Review collection permissions');
    console.log('3. Create Appwrite Functions if needed');
    console.log('4. Update .env.local with your credentials');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run
main();
