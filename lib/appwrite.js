// ============================================
// MYDUIT V6 - APPWRITE CLIENT CONFIGURATION
// ============================================

import { Client, Account, Databases, Teams, Storage, ID, Query, Permission, Role } from 'appwrite';

// Initialize Appwrite Client
const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

// Export services
export const account = new Account(client);
export const databases = new Databases(client);
export const teams = new Teams(client);
export const storage = new Storage(client);

// Export utilities
export { ID, Query, Permission, Role };
export default client;

// ============================================
// CONSTANTS
// ============================================

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'myduit-db';

export const COLLECTIONS = {
  HOUSEHOLDS: 'households',
  MEMBERS: 'members',
  INCOME: 'income',
  COMMITMENTS: 'commitments',
  TRANSACTIONS: 'transactions',
  SAVINGS: 'savings',
  INVESTMENTS: 'investments',
  INSURANCE: 'insurance',
  GOALS: 'goals',
  ZAKAT: 'zakat',
  FARAID: 'faraid',
  BUDGET_SETTINGS: 'budget_settings',
};

// ============================================
// AUTHENTICATION HELPERS
// ============================================

export const auth = {
  // Create new account
  createAccount: async (email, password, name) => {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      // Auto login after registration
      await account.createEmailPasswordSession(email, password);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login with email/password
  login: async (email, password) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return { success: true, session };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Logout
  logout: async () => {
    try {
      await account.deleteSession('current');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const user = await account.get();
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message, user: null };
    }
  },

  // Check if logged in
  isLoggedIn: async () => {
    try {
      await account.get();
      return true;
    } catch {
      return false;
    }
  },

  // OAuth login (Google, etc.)
  loginWithOAuth: async (provider) => {
    try {
      account.createOAuth2Session(
        provider,
        `${window.location.origin}/`, // Success URL
        `${window.location.origin}/login` // Failure URL
      );
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Password recovery
  forgotPassword: async (email) => {
    try {
      await account.createRecovery(email, `${window.location.origin}/reset-password`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reset password
  resetPassword: async (userId, secret, password) => {
    try {
      await account.updateRecovery(userId, secret, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// DATABASE HELPERS
// ============================================

// Generic CRUD operations
const createDocument = async (collectionId, data, permissions = []) => {
  try {
    const doc = await databases.createDocument(
      DATABASE_ID,
      collectionId,
      ID.unique(),
      data,
      permissions
    );
    return { success: true, data: doc };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const getDocument = async (collectionId, documentId) => {
  try {
    const doc = await databases.getDocument(DATABASE_ID, collectionId, documentId);
    return { success: true, data: doc };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const updateDocument = async (collectionId, documentId, data) => {
  try {
    const doc = await databases.updateDocument(DATABASE_ID, collectionId, documentId, data);
    return { success: true, data: doc };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const deleteDocument = async (collectionId, documentId) => {
  try {
    await databases.deleteDocument(DATABASE_ID, collectionId, documentId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const listDocuments = async (collectionId, queries = []) => {
  try {
    const docs = await databases.listDocuments(DATABASE_ID, collectionId, queries);
    return { success: true, data: docs.documents, total: docs.total };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// ============================================
// HOUSEHOLDS
// ============================================

export const householdsDB = {
  create: async (userId, name) => {
    return createDocument(
      COLLECTIONS.HOUSEHOLDS,
      { userId, name, currency: 'MYR' },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  },

  getByUserId: async (userId) => {
    return listDocuments(COLLECTIONS.HOUSEHOLDS, [Query.equal('userId', userId)]);
  },

  update: async (householdId, data) => {
    return updateDocument(COLLECTIONS.HOUSEHOLDS, householdId, data);
  },

  delete: async (householdId) => {
    return deleteDocument(COLLECTIONS.HOUSEHOLDS, householdId);
  },

  // Add team for sharing
  addTeam: async (householdId, teamId) => {
    const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.HOUSEHOLDS, householdId);
    return databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.HOUSEHOLDS,
      householdId,
      { teamId },
      [
        ...doc.$permissions,
        Permission.read(Role.team(teamId)),
      ]
    );
  },
};

// ============================================
// MEMBERS
// ============================================

export const membersDB = {
  create: async (householdId, userId, data) => {
    return createDocument(
      COLLECTIONS.MEMBERS,
      { householdId, ...data },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  },

  getByHousehold: async (householdId) => {
    return listDocuments(COLLECTIONS.MEMBERS, [Query.equal('householdId', householdId)]);
  },

  update: async (memberId, data) => {
    return updateDocument(COLLECTIONS.MEMBERS, memberId, data);
  },

  delete: async (memberId) => {
    return deleteDocument(COLLECTIONS.MEMBERS, memberId);
  },
};

// ============================================
// INCOME
// ============================================

export const incomeDB = {
  create: async (householdId, userId, data) => {
    return createDocument(
      COLLECTIONS.INCOME,
      { householdId, ...data },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  },

  getByHousehold: async (householdId, queries = []) => {
    return listDocuments(COLLECTIONS.INCOME, [
      Query.equal('householdId', householdId),
      Query.orderDesc('date'),
      ...queries,
    ]);
  },

  update: async (incomeId, data) => {
    return updateDocument(COLLECTIONS.INCOME, incomeId, data);
  },

  delete: async (incomeId) => {
    return deleteDocument(COLLECTIONS.INCOME, incomeId);
  },
};

// ============================================
// COMMITMENTS
// ============================================

export const commitmentsDB = {
  create: async (householdId, userId, data) => {
    return createDocument(
      COLLECTIONS.COMMITMENTS,
      { householdId, isActive: true, paidAmount: 0, ...data },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  },

  getByHousehold: async (householdId, activeOnly = true) => {
    const queries = [Query.equal('householdId', householdId)];
    if (activeOnly) queries.push(Query.equal('isActive', true));
    queries.push(Query.orderAsc('dueDate'));
    return listDocuments(COLLECTIONS.COMMITMENTS, queries);
  },

  update: async (commitmentId, data) => {
    return updateDocument(COLLECTIONS.COMMITMENTS, commitmentId, data);
  },

  delete: async (commitmentId) => {
    return deleteDocument(COLLECTIONS.COMMITMENTS, commitmentId);
  },

  // Update paid amount
  updatePaidAmount: async (commitmentId, paidAmount) => {
    return updateDocument(COLLECTIONS.COMMITMENTS, commitmentId, { paidAmount });
  },
};

// ============================================
// TRANSACTIONS
// ============================================

export const transactionsDB = {
  create: async (householdId, userId, data) => {
    return createDocument(
      COLLECTIONS.TRANSACTIONS,
      { householdId, ...data },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  },

  getByHousehold: async (householdId, queries = []) => {
    return listDocuments(COLLECTIONS.TRANSACTIONS, [
      Query.equal('householdId', householdId),
      Query.orderDesc('date'),
      Query.limit(100),
      ...queries,
    ]);
  },

  getByDateRange: async (householdId, startDate, endDate) => {
    return listDocuments(COLLECTIONS.TRANSACTIONS, [
      Query.equal('householdId', householdId),
      Query.greaterThanEqual('date', startDate),
      Query.lessThanEqual('date', endDate),
      Query.orderDesc('date'),
    ]);
  },

  getByCategory: async (householdId, category) => {
    return listDocuments(COLLECTIONS.TRANSACTIONS, [
      Query.equal('householdId', householdId),
      Query.equal('category', category),
      Query.orderDesc('date'),
    ]);
  },

  update: async (transactionId, data) => {
    return updateDocument(COLLECTIONS.TRANSACTIONS, transactionId, data);
  },

  delete: async (transactionId) => {
    return deleteDocument(COLLECTIONS.TRANSACTIONS, transactionId);
  },
};

// ============================================
// SAVINGS
// ============================================

export const savingsDB = {
  create: async (householdId, userId, data) => {
    return createDocument(
      COLLECTIONS.SAVINGS,
      { householdId, currentAmount: 0, ...data },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  },

  getByHousehold: async (householdId) => {
    return listDocuments(COLLECTIONS.SAVINGS, [Query.equal('householdId', householdId)]);
  },

  update: async (savingsId, data) => {
    return updateDocument(COLLECTIONS.SAVINGS, savingsId, data);
  },

  delete: async (savingsId) => {
    return deleteDocument(COLLECTIONS.SAVINGS, savingsId);
  },

  // Update current amount
  updateAmount: async (savingsId, currentAmount) => {
    return updateDocument(COLLECTIONS.SAVINGS, savingsId, { currentAmount });
  },
};

// ============================================
// INVESTMENTS
// ============================================

export const investmentsDB = {
  create: async (householdId, userId, data) => {
    return createDocument(
      COLLECTIONS.INVESTMENTS,
      { householdId, isHalal: true, ...data },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  },

  getByHousehold: async (householdId) => {
    return listDocuments(COLLECTIONS.INVESTMENTS, [Query.equal('householdId', householdId)]);
  },

  getHalalOnly: async (householdId) => {
    return listDocuments(COLLECTIONS.INVESTMENTS, [
      Query.equal('householdId', householdId),
      Query.equal('isHalal', true),
    ]);
  },

  update: async (investmentId, data) => {
    return updateDocument(COLLECTIONS.INVESTMENTS, investmentId, data);
  },

  delete: async (investmentId) => {
    return deleteDocument(COLLECTIONS.INVESTMENTS, investmentId);
  },
};

// ============================================
// INSURANCE
// ============================================

export const insuranceDB = {
  create: async (householdId, userId, data) => {
    return createDocument(
      COLLECTIONS.INSURANCE,
      { householdId, frequency: 'monthly', isTakaful: false, ...data },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  },

  getByHousehold: async (householdId) => {
    return listDocuments(COLLECTIONS.INSURANCE, [Query.equal('householdId', householdId)]);
  },

  getUpcomingRenewals: async (householdId, daysAhead = 60) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return listDocuments(COLLECTIONS.INSURANCE, [
      Query.equal('householdId', householdId),
      Query.lessThanEqual('renewalDate', futureDate.toISOString()),
      Query.orderAsc('renewalDate'),
    ]);
  },

  update: async (insuranceId, data) => {
    return updateDocument(COLLECTIONS.INSURANCE, insuranceId, data);
  },

  delete: async (insuranceId) => {
    return deleteDocument(COLLECTIONS.INSURANCE, insuranceId);
  },
};

// ============================================
// GOALS
// ============================================

export const goalsDB = {
  create: async (householdId, userId, data) => {
    return createDocument(
      COLLECTIONS.GOALS,
      { householdId, currentAmount: 0, priority: 'medium', isCompleted: false, ...data },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  },

  getByHousehold: async (householdId) => {
    return listDocuments(COLLECTIONS.GOALS, [
      Query.equal('householdId', householdId),
      Query.orderAsc('priority'),
    ]);
  },

  getByType: async (householdId, type) => {
    return listDocuments(COLLECTIONS.GOALS, [
      Query.equal('householdId', householdId),
      Query.equal('type', type),
    ]);
  },

  update: async (goalId, data) => {
    return updateDocument(COLLECTIONS.GOALS, goalId, data);
  },

  delete: async (goalId) => {
    return deleteDocument(COLLECTIONS.GOALS, goalId);
  },

  // Mark as completed
  complete: async (goalId) => {
    return updateDocument(COLLECTIONS.GOALS, goalId, { isCompleted: true });
  },
};

// ============================================
// ZAKAT
// ============================================

export const zakatDB = {
  create: async (householdId, userId, year, data = {}) => {
    return createDocument(
      COLLECTIONS.ZAKAT,
      {
        householdId,
        year,
        incomeYearly: 0,
        incomeZakat: 0,
        savingsAmount: 0,
        savingsZakat: 0,
        goldValue: 0,
        goldZakat: 0,
        investmentValue: 0,
        investmentZakat: 0,
        totalDue: 0,
        totalPaid: 0,
        ...data,
      },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  },

  getByYear: async (householdId, year) => {
    const result = await listDocuments(COLLECTIONS.ZAKAT, [
      Query.equal('householdId', householdId),
      Query.equal('year', year),
    ]);
    return result.data?.[0] || null;
  },

  update: async (zakatId, data) => {
    return updateDocument(COLLECTIONS.ZAKAT, zakatId, data);
  },

  // Calculate zakat
  calculate: (income, savings, gold, investments) => {
    const NISAB = 23000; // ~85g gold in MYR
    const RATE = 0.025; // 2.5%

    const incomeZakat = income * RATE;
    const savingsZakat = savings >= NISAB ? savings * RATE : 0;
    const goldZakat = gold >= NISAB ? gold * RATE : 0;
    const investmentZakat = investments >= NISAB ? investments * RATE : 0;
    const totalDue = incomeZakat + savingsZakat + goldZakat + investmentZakat;

    return {
      incomeZakat,
      savingsZakat,
      goldZakat,
      investmentZakat,
      totalDue,
      meetsNisab: (income + savings + gold + investments) >= NISAB,
    };
  },
};

// ============================================
// FARAID
// ============================================

export const faraidDB = {
  create: async (householdId, userId, data = {}) => {
    return createDocument(
      COLLECTIONS.FARAID,
      {
        householdId,
        totalAssets: 0,
        hasWasiat: false,
        wasiatNotes: '',
        beneficiaries: '[]',
        ...data,
      },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  },

  getByHousehold: async (householdId) => {
    const result = await listDocuments(COLLECTIONS.FARAID, [
      Query.equal('householdId', householdId),
    ]);
    const doc = result.data?.[0] || null;
    if (doc && doc.beneficiaries) {
      doc.beneficiaries = JSON.parse(doc.beneficiaries);
    }
    return doc;
  },

  update: async (faraidId, data) => {
    if (data.beneficiaries && typeof data.beneficiaries !== 'string') {
      data.beneficiaries = JSON.stringify(data.beneficiaries);
    }
    return updateDocument(COLLECTIONS.FARAID, faraidId, data);
  },
};

// ============================================
// BUDGET SETTINGS
// ============================================

export const budgetDB = {
  create: async (householdId, userId, data = {}) => {
    return createDocument(
      COLLECTIONS.BUDGET_SETTINGS,
      {
        householdId,
        needsPercentage: 50,
        wantsPercentage: 30,
        savingsPercentage: 20,
        ...data,
      },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
      ]
    );
  },

  getByHousehold: async (householdId) => {
    const result = await listDocuments(COLLECTIONS.BUDGET_SETTINGS, [
      Query.equal('householdId', householdId),
    ]);
    return result.data?.[0] || { needsPercentage: 50, wantsPercentage: 30, savingsPercentage: 20 };
  },

  update: async (budgetId, data) => {
    // Ensure percentages add up to 100
    const total = (data.needsPercentage || 0) + (data.wantsPercentage || 0) + (data.savingsPercentage || 0);
    if (total !== 100) {
      return { success: false, error: 'Percentages must add up to 100' };
    }
    return updateDocument(COLLECTIONS.BUDGET_SETTINGS, budgetId, data);
  },
};

// ============================================
// TEAMS (for household sharing)
// ============================================

export const teamsDB = {
  create: async (name) => {
    try {
      const team = await teams.create(ID.unique(), name);
      return { success: true, data: team };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  invite: async (teamId, email, roles = ['member']) => {
    try {
      const membership = await teams.createMembership(
        teamId,
        roles,
        email,
        undefined, // userId (optional)
        undefined, // phone (optional)
        `${window.location.origin}/accept-invite` // redirect URL
      );
      return { success: true, data: membership };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getMembers: async (teamId) => {
    try {
      const members = await teams.listMemberships(teamId);
      return { success: true, data: members.memberships };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  removeMember: async (teamId, membershipId) => {
    try {
      await teams.deleteMembership(teamId, membershipId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  delete: async (teamId) => {
    try {
      await teams.delete(teamId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// REALTIME SUBSCRIPTIONS
// ============================================

export const realtime = {
  subscribeToCollection: (collectionId, callback) => {
    return client.subscribe(
      `databases.${DATABASE_ID}.collections.${collectionId}.documents`,
      callback
    );
  },

  subscribeToDocument: (collectionId, documentId, callback) => {
    return client.subscribe(
      `databases.${DATABASE_ID}.collections.${collectionId}.documents.${documentId}`,
      callback
    );
  },

  subscribeToTransactions: (callback) => {
    return realtime.subscribeToCollection(COLLECTIONS.TRANSACTIONS, callback);
  },

  subscribeToCommitments: (callback) => {
    return realtime.subscribeToCollection(COLLECTIONS.COMMITMENTS, callback);
  },
};
