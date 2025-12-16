# 🏗️ MYDUIT V6 - APPWRITE ARCHITECTURE DESIGN

## 📋 Overview

MyDuit v6 menggunakan **Appwrite** sebagai Backend-as-a-Service (BaaS) menggantikan Supabase.

### Tech Stack v6:
- **Frontend:** Next.js 14 (App Router)
- **Backend:** Appwrite Cloud
- **Hosting:** Vercel
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion

---

## 🔄 Appwrite vs Supabase Comparison

| Feature | Supabase | Appwrite |
|---------|----------|----------|
| Database | PostgreSQL | MariaDB (Collections/Documents) |
| Auth | Built-in | Built-in |
| Storage | S3-compatible | Built-in |
| Functions | Edge Functions | Appwrite Functions |
| Realtime | PostgreSQL Changes | Realtime API |
| Pricing | Per project | Per organization |
| Self-host | Yes | Yes |

**Kenapa Appwrite?**
- ✅ Simpler permission model
- ✅ Better mobile SDK support
- ✅ Generous free tier (75K MAU)
- ✅ Built-in Teams feature (perfect for households)
- ✅ No SQL required

---

## 🗄️ DATABASE ARCHITECTURE

### Appwrite Concepts:
```
Organization
└── Project (myduit)
    └── Database (myduit-db)
        ├── Collection: households
        ├── Collection: members
        ├── Collection: income
        ├── Collection: commitments
        ├── Collection: transactions
        ├── Collection: savings
        ├── Collection: investments
        ├── Collection: insurance
        ├── Collection: goals
        ├── Collection: zakat
        ├── Collection: faraid
        └── Collection: budget_settings
```

---

## 📊 COLLECTIONS SCHEMA

### 1. `households` Collection

**Purpose:** Main family/user group entity

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String (100) | ✅ | Household name |
| `userId` | String (36) | ✅ | Owner's Appwrite user ID |
| `teamId` | String (36) | ❌ | Appwrite Team ID for sharing |
| `currency` | String (3) | ❌ | Default: MYR |
| `createdAt` | DateTime | ✅ | Auto-generated |

**Indexes:**
- `userId` (Key) - For querying user's households
- `teamId` (Key) - For team-based access

**Permissions:**
- Document Level Security: ON
- Read: `user:{userId}`, `team:{teamId}`
- Write: `user:{userId}`

---

### 2. `members` Collection

**Purpose:** Family members within a household

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `householdId` | String (36) | ✅ | Reference to household |
| `name` | String (100) | ✅ | Member name |
| `role` | String (50) | ✅ | Suami, Isteri, Anak, etc. |
| `avatar` | String (10) | ❌ | Emoji avatar |
| `userId` | String (36) | ❌ | Linked Appwrite user (optional) |

**Indexes:**
- `householdId` (Key)
- `householdId_role` (Composite)

**Permissions:**
- Inherit from household

---

### 3. `income` Collection

**Purpose:** Track income sources

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `householdId` | String (36) | ✅ | Reference to household |
| `memberId` | String (36) | ❌ | Which member |
| `type` | String (50) | ✅ | Gaji, Komisyen, Freelance |
| `amount` | Float | ✅ | Amount in MYR |
| `date` | DateTime | ✅ | Income date |
| `isRecurring` | Boolean | ❌ | Monthly recurring? |
| `notes` | String (500) | ❌ | Optional notes |

**Indexes:**
- `householdId` (Key)
- `householdId_date` (Composite)
- `memberId` (Key)

---

### 4. `commitments` Collection

**Purpose:** Monthly bills, loans, subscriptions

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `householdId` | String (36) | ✅ | Reference to household |
| `memberId` | String (36) | ❌ | Which member |
| `name` | String (100) | ✅ | Commitment name |
| `amount` | Float | ✅ | Monthly payment |
| `dueDate` | Integer | ✅ | Day of month (1-31) |
| `icon` | String (50) | ❌ | Icon identifier |
| `totalDebt` | Float | ❌ | Total debt (for loans) |
| `paidAmount` | Float | ❌ | Amount paid so far |
| `interestRate` | Float | ❌ | Interest rate % |
| `startDate` | DateTime | ❌ | Start date |
| `endDate` | DateTime | ❌ | End date |
| `isActive` | Boolean | ❌ | Default: true |
| `category` | String (50) | ❌ | loan, credit_card, utility, subscription |

**Indexes:**
- `householdId` (Key)
- `householdId_isActive` (Composite)
- `dueDate` (Key)

---

### 5. `transactions` Collection

**Purpose:** Individual expenses and income entries

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `householdId` | String (36) | ✅ | Reference to household |
| `memberId` | String (36) | ❌ | Which member |
| `description` | String (255) | ✅ | Transaction description |
| `amount` | Float | ✅ | Amount (negative = expense) |
| `date` | DateTime | ✅ | Transaction date |
| `category` | String (50) | ✅ | food, transport, etc. |
| `type` | String (20) | ✅ | expense or income |
| `notes` | String (500) | ❌ | Optional notes |

**Indexes:**
- `householdId` (Key)
- `householdId_date` (Composite)
- `householdId_category` (Composite)
- `householdId_type` (Composite)

---

### 6. `savings` Collection

**Purpose:** Savings goals and progress

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `householdId` | String (36) | ✅ | Reference to household |
| `memberId` | String (36) | ❌ | Which member |
| `name` | String (100) | ✅ | Savings name |
| `currentAmount` | Float | ❌ | Current saved amount |
| `targetAmount` | Float | ✅ | Target amount |
| `targetDate` | DateTime | ❌ | Target date |
| `icon` | String (10) | ❌ | Emoji icon |

**Indexes:**
- `householdId` (Key)

---

### 7. `investments` Collection

**Purpose:** Investment portfolio tracking

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `householdId` | String (36) | ✅ | Reference to household |
| `memberId` | String (36) | ❌ | Which member |
| `name` | String (100) | ✅ | Investment name |
| `type` | String (50) | ✅ | unit_trust, gold, stocks, crypto, retirement |
| `currentValue` | Float | ✅ | Current market value |
| `costBasis` | Float | ✅ | Original purchase price |
| `isHalal` | Boolean | ❌ | Shariah compliant? |
| `institution` | String (100) | ❌ | ASB, Public Gold, etc. |
| `notes` | String (500) | ❌ | Optional notes |

**Indexes:**
- `householdId` (Key)
- `householdId_type` (Composite)
- `householdId_isHalal` (Composite)

---

### 8. `insurance` Collection

**Purpose:** Insurance and Takaful policies

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `householdId` | String (36) | ✅ | Reference to household |
| `memberId` | String (36) | ❌ | Which member |
| `name` | String (100) | ✅ | Policy name |
| `type` | String (50) | ✅ | medical, life, car, home |
| `provider` | String (100) | ✅ | Insurance company |
| `premium` | Float | ✅ | Premium amount |
| `frequency` | String (20) | ❌ | monthly, yearly, one-time |
| `coverage` | Float | ❌ | Coverage amount |
| `renewalDate` | DateTime | ❌ | Renewal date |
| `policyNumber` | String (100) | ❌ | Policy number |
| `isTakaful` | Boolean | ❌ | Is Takaful? |
| `notes` | String (500) | ❌ | Optional notes |

**Indexes:**
- `householdId` (Key)
- `householdId_type` (Composite)
- `renewalDate` (Key)

---

### 9. `goals` Collection

**Purpose:** Financial goals (short & long term)

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `householdId` | String (36) | ✅ | Reference to household |
| `memberId` | String (36) | ❌ | Which member |
| `name` | String (100) | ✅ | Goal name |
| `type` | String (20) | ✅ | short or long |
| `targetAmount` | Float | ✅ | Target amount |
| `currentAmount` | Float | ❌ | Current progress |
| `deadline` | DateTime | ❌ | Target date |
| `priority` | String (20) | ❌ | high, medium, low |
| `icon` | String (10) | ❌ | Emoji icon |
| `isCompleted` | Boolean | ❌ | Completed? |

**Indexes:**
- `householdId` (Key)
- `householdId_type` (Composite)
- `householdId_priority` (Composite)

---

### 10. `zakat` Collection

**Purpose:** Yearly zakat calculations and tracking

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `householdId` | String (36) | ✅ | Reference to household |
| `year` | Integer | ✅ | Zakat year |
| `incomeYearly` | Float | ❌ | Yearly income |
| `incomeZakat` | Float | ❌ | Zakat on income |
| `savingsAmount` | Float | ❌ | Savings amount |
| `savingsZakat` | Float | ❌ | Zakat on savings |
| `goldValue` | Float | ❌ | Gold value |
| `goldZakat` | Float | ❌ | Zakat on gold |
| `investmentValue` | Float | ❌ | Investment value |
| `investmentZakat` | Float | ❌ | Zakat on investments |
| `totalDue` | Float | ❌ | Total zakat due |
| `totalPaid` | Float | ❌ | Total paid |
| `lastPaidDate` | DateTime | ❌ | Last payment date |

**Indexes:**
- `householdId` (Key)
- `householdId_year` (Unique Composite)

---

### 11. `faraid` Collection

**Purpose:** Inheritance planning (one per household)

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `householdId` | String (36) | ✅ | Reference to household |
| `totalAssets` | Float | ❌ | Total assets value |
| `hasWasiat` | Boolean | ❌ | Has wasiat? |
| `wasiatNotes` | String (1000) | ❌ | Wasiat notes |
| `beneficiaries` | String (5000) | ❌ | JSON array of beneficiaries |

**Indexes:**
- `householdId` (Unique Key)

**Note:** `beneficiaries` stored as JSON string:
```json
[
  {"relation": "Isteri", "name": "Siti", "share": "1/8", "amount": 62500},
  {"relation": "Anak Lelaki", "name": "Ahmad Jr", "share": "7/12", "amount": 291667}
]
```

---

### 12. `budget_settings` Collection

**Purpose:** Budget allocation settings (50/30/20)

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `householdId` | String (36) | ✅ | Reference to household |
| `needsPercentage` | Integer | ❌ | Default: 50 |
| `wantsPercentage` | Integer | ❌ | Default: 30 |
| `savingsPercentage` | Integer | ❌ | Default: 20 |

**Indexes:**
- `householdId` (Unique Key)

---

## 🔐 PERMISSIONS ARCHITECTURE

### Permission Strategy

Appwrite uses a **grant-based permission model**. Users have NO access by default.

```
Collection Level Permissions:
├── Any: (none)
├── Users: Create ✅
├── Document Security: ENABLED
│
Document Level Permissions (per document):
├── Read: user:{userId}, team:{teamId}
├── Update: user:{userId}
└── Delete: user:{userId}
```

### Permission Flow:

1. **User registers** → Creates Appwrite account
2. **User creates household** → Document created with user's permission
3. **User invites family** → Create Appwrite Team, add members
4. **Team members access** → Team permission added to documents

### Appwrite Teams for Household Sharing:

```javascript
// Create team for household
const team = await teams.create(
  ID.unique(),
  'Keluarga Ahmad'
);

// Invite member
await teams.createMembership(
  teamId,
  ['member'],
  'spouse@email.com'
);

// Add team permission to documents
await databases.updateDocument(
  DATABASE_ID,
  'households',
  householdId,
  {},
  [
    Permission.read(Role.user(userId)),
    Permission.read(Role.team(teamId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId))
  ]
);
```

---

## 🔄 DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│   │   React      │    │   Zustand    │    │   Appwrite   │ │
│   │   Components │◄──►│   Store      │◄──►│   Web SDK    │ │
│   └──────────────┘    └──────────────┘    └──────┬───────┘ │
│                                                   │         │
└───────────────────────────────────────────────────┼─────────┘
                                                    │
                                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                     APPWRITE CLOUD                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│   │    Auth      │    │   Databases  │    │   Realtime   │ │
│   │   Service    │    │   Service    │    │   Service    │ │
│   └──────────────┘    └──────────────┘    └──────────────┘ │
│                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│   │   Storage    │    │   Functions  │    │    Teams     │ │
│   │   Service    │    │   Service    │    │   Service    │ │
│   └──────────────┘    └──────────────┘    └──────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 CLIENT SDK INTEGRATION

### Environment Variables:

```env
# .env.local
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=myduit-db

# For server-side (API routes)
APPWRITE_API_KEY=your-api-key
```

### SDK Setup:

```javascript
// lib/appwrite.js
import { Client, Account, Databases, Teams, ID, Query, Permission, Role } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const teams = new Teams(client);

export { ID, Query, Permission, Role };
export default client;
```

---

## 🔧 APPWRITE FUNCTIONS (Server-side)

### Function 1: `onUserCreate`
**Trigger:** Auth event - user.create
**Purpose:** Create default household for new user

```javascript
// functions/onUserCreate/index.js
const { Client, Databases, ID, Permission, Role } = require('node-appwrite');

module.exports = async function(context) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const { userId, name, email } = context.req.body;

  // Create default household
  const household = await databases.createDocument(
    process.env.DATABASE_ID,
    'households',
    ID.unique(),
    {
      name: `Keluarga ${name || 'Baru'}`,
      userId: userId,
      currency: 'MYR'
    },
    [
      Permission.read(Role.user(userId)),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId))
    ]
  );

  // Create default member (user themselves)
  await databases.createDocument(
    process.env.DATABASE_ID,
    'members',
    ID.unique(),
    {
      householdId: household.$id,
      name: name || 'Saya',
      role: 'Ketua',
      avatar: '👤',
      userId: userId
    },
    [
      Permission.read(Role.user(userId)),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId))
    ]
  );

  // Create default budget settings
  await databases.createDocument(
    process.env.DATABASE_ID,
    'budget_settings',
    ID.unique(),
    {
      householdId: household.$id,
      needsPercentage: 50,
      wantsPercentage: 30,
      savingsPercentage: 20
    },
    [
      Permission.read(Role.user(userId)),
      Permission.update(Role.user(userId))
    ]
  );

  return context.res.json({ success: true, householdId: household.$id });
};
```

### Function 2: `calculateZakat`
**Trigger:** HTTP
**Purpose:** Calculate zakat based on assets

```javascript
// functions/calculateZakat/index.js
const NISAB = 23000; // ~85g gold in MYR
const ZAKAT_RATE = 0.025; // 2.5%

module.exports = async function(context) {
  const { income, savings, gold, investments } = context.req.body;

  const result = {
    income: {
      amount: income || 0,
      zakat: (income || 0) * ZAKAT_RATE
    },
    savings: {
      amount: savings || 0,
      zakat: (savings || 0) >= NISAB ? (savings || 0) * ZAKAT_RATE : 0
    },
    gold: {
      amount: gold || 0,
      zakat: (gold || 0) >= NISAB ? (gold || 0) * ZAKAT_RATE : 0
    },
    investments: {
      amount: investments || 0,
      zakat: (investments || 0) >= NISAB ? (investments || 0) * ZAKAT_RATE : 0
    },
    total: 0,
    meetsNisab: false
  };

  result.total = result.income.zakat + result.savings.zakat + 
                 result.gold.zakat + result.investments.zakat;
  
  const totalAssets = income + savings + gold + investments;
  result.meetsNisab = totalAssets >= NISAB;

  return context.res.json(result);
};
```

---

## 🚀 SETUP INSTRUCTIONS

### Step 1: Create Appwrite Project

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io)
2. Create new project: `myduit`
3. Note down Project ID

### Step 2: Create Database

1. Go to Databases
2. Create database: `myduit-db`
3. Note down Database ID

### Step 3: Create Collections

Use Appwrite Console or CLI to create collections:

```bash
# Install Appwrite CLI
npm install -g appwrite-cli

# Login
appwrite login

# Initialize project
appwrite init project

# Create collections (or use Console)
```

### Step 4: Configure Permissions

For each collection:
1. Go to Settings > Permissions
2. Add `Users` role with `Create` permission
3. Enable `Document Security`

### Step 5: Create API Key

1. Go to Overview > API Keys
2. Create new key with scopes:
   - databases.read
   - databases.write
   - users.read
   - teams.read
   - teams.write

### Step 6: Setup Appwrite Functions

1. Go to Functions
2. Create functions for:
   - `onUserCreate` (Event trigger: users.*.create)
   - `calculateZakat` (HTTP trigger)

---

## 📊 QUERIES REFERENCE

### Common Queries:

```javascript
import { databases, Query } from '@/lib/appwrite';

// Get user's household
const households = await databases.listDocuments(
  DATABASE_ID,
  'households',
  [Query.equal('userId', userId)]
);

// Get transactions for current month
const transactions = await databases.listDocuments(
  DATABASE_ID,
  'transactions',
  [
    Query.equal('householdId', householdId),
    Query.greaterThanEqual('date', startOfMonth),
    Query.lessThanEqual('date', endOfMonth),
    Query.orderDesc('date'),
    Query.limit(100)
  ]
);

// Get active commitments
const commitments = await databases.listDocuments(
  DATABASE_ID,
  'commitments',
  [
    Query.equal('householdId', householdId),
    Query.equal('isActive', true),
    Query.orderAsc('dueDate')
  ]
);

// Get savings progress
const savings = await databases.listDocuments(
  DATABASE_ID,
  'savings',
  [Query.equal('householdId', householdId)]
);

// Get halal investments only
const halalInvestments = await databases.listDocuments(
  DATABASE_ID,
  'investments',
  [
    Query.equal('householdId', householdId),
    Query.equal('isHalal', true)
  ]
);
```

---

## 🔄 REALTIME SUBSCRIPTIONS

```javascript
import client from '@/lib/appwrite';

// Subscribe to transaction changes
const unsubscribe = client.subscribe(
  `databases.${DATABASE_ID}.collections.transactions.documents`,
  (response) => {
    if (response.events.includes('databases.*.collections.*.documents.*.create')) {
      // New transaction added
      console.log('New transaction:', response.payload);
    }
    if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
      // Transaction deleted
      console.log('Transaction deleted:', response.payload);
    }
  }
);

// Unsubscribe when done
unsubscribe();
```

---

## 📈 MIGRATION FROM SUPABASE

If migrating from v5 (Supabase):

1. Export Supabase data as JSON
2. Transform data to match Appwrite schema
3. Use Appwrite Server SDK to bulk import
4. Update frontend to use Appwrite SDK

```javascript
// Migration script example
const { Client, Databases, ID } = require('node-appwrite');
const supabaseData = require('./supabase-export.json');

async function migrate() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);
  
  const databases = new Databases(client);
  
  // Migrate households
  for (const household of supabaseData.households) {
    await databases.createDocument(
      DATABASE_ID,
      'households',
      household.id, // Keep same ID if possible
      {
        name: household.name,
        userId: household.user_id,
        currency: 'MYR'
      }
    );
  }
  
  // Continue for other collections...
}
```

---

## ✅ CHECKLIST

### Database Setup:
- [ ] Create Appwrite project
- [ ] Create database
- [ ] Create all 12 collections
- [ ] Configure attributes for each collection
- [ ] Create indexes
- [ ] Configure permissions

### Functions Setup:
- [ ] Create onUserCreate function
- [ ] Create calculateZakat function
- [ ] Test functions

### Frontend Setup:
- [ ] Install appwrite SDK
- [ ] Configure environment variables
- [ ] Update lib/appwrite.js
- [ ] Update store to use Appwrite
- [ ] Test authentication
- [ ] Test CRUD operations

### Testing:
- [ ] Test user registration
- [ ] Test household creation
- [ ] Test member management
- [ ] Test transactions CRUD
- [ ] Test realtime updates
- [ ] Test team sharing

---

## 📚 RESOURCES

- [Appwrite Docs](https://appwrite.io/docs)
- [Appwrite Web SDK](https://appwrite.io/docs/sdks#client-web)
- [Appwrite Next.js Tutorial](https://appwrite.io/docs/quick-starts/nextjs)
- [Appwrite Permissions](https://appwrite.io/docs/advanced/platform/permissions)
- [Appwrite Realtime](https://appwrite.io/docs/apis/realtime)

---

**Document Version:** 1.0
**Last Updated:** December 2024
**For:** MyDuit v6
