'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Format currency
export const formatRM = (amount, showSign = false) => {
  const formatted = new Intl.NumberFormat('ms-MY', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(Math.abs(amount));
  if (showSign && amount !== 0) {
    return amount > 0 ? `+RM ${formatted}` : `-RM ${formatted}`;
  }
  return `RM ${formatted}`;
};

// Sample data for demo mode
const sampleData = {
  household: {
    id: 'demo-household',
    name: 'Keluarga Ahmad',
    currency: 'MYR',
  },
  members: [
    { id: 'suami', name: 'Ahmad', role: 'Suami', avatar: '👨', householdId: 'demo-household' },
    { id: 'isteri', name: 'Siti', role: 'Isteri', avatar: '👩', householdId: 'demo-household' },
  ],
  income: [
    { id: '1', memberId: 'suami', type: 'Gaji', amount: 5500, date: '2025-01-25', householdId: 'demo-household' },
    { id: '2', memberId: 'suami', type: 'Komisyen', amount: 800, date: '2025-01-28', householdId: 'demo-household' },
    { id: '3', memberId: 'isteri', type: 'Gaji', amount: 4200, date: '2025-01-25', householdId: 'demo-household' },
  ],
  commitments: [
    { id: '1', name: 'Loan Kereta', amount: 850, dueDate: 15, category: 'loan', totalDebt: 45000, paidAmount: 12750, householdId: 'demo-household' },
    { id: '2', name: 'Loan Rumah', amount: 1200, dueDate: 1, category: 'loan', totalDebt: 350000, paidAmount: 72000, householdId: 'demo-household' },
    { id: '3', name: 'Credit Card', amount: 500, dueDate: 20, category: 'credit_card', totalDebt: 8500, paidAmount: 0, householdId: 'demo-household' },
    { id: '4', name: 'PTPTN', amount: 200, dueDate: 10, category: 'loan', totalDebt: 25000, paidAmount: 8000, householdId: 'demo-household' },
  ],
  transactions: [
    { id: '1', description: 'Groceries - Lotus', amount: -250, date: '2025-01-10', category: 'food', type: 'expense', householdId: 'demo-household' },
    { id: '2', description: 'Petrol Shell', amount: -150, date: '2025-01-10', category: 'transport', type: 'expense', householdId: 'demo-household' },
    { id: '3', description: 'Netflix', amount: -55, date: '2025-01-09', category: 'entertainment', type: 'expense', householdId: 'demo-household' },
    { id: '4', description: 'Grab Food', amount: -45, date: '2025-01-09', category: 'food', type: 'expense', householdId: 'demo-household' },
  ],
  savings: [
    { id: '1', name: 'Emergency Fund', currentAmount: 15000, targetAmount: 30000, householdId: 'demo-household' },
    { id: '2', name: 'Tabung Haji', currentAmount: 8500, targetAmount: 20000, householdId: 'demo-household' },
    { id: '3', name: 'ASB', currentAmount: 12000, targetAmount: 50000, householdId: 'demo-household' },
  ],
  investments: [
    { id: '1', name: 'ASB', type: 'unit_trust', currentValue: 25000, costBasis: 25000, isHalal: true, householdId: 'demo-household' },
    { id: '2', name: 'Public Gold', type: 'gold', currentValue: 15000, costBasis: 12000, isHalal: true, householdId: 'demo-household' },
    { id: '3', name: 'Tabung Haji', type: 'retirement', currentValue: 8500, costBasis: 8500, isHalal: true, householdId: 'demo-household' },
    { id: '4', name: 'KWSP', type: 'retirement', currentValue: 85000, costBasis: 85000, isHalal: true, householdId: 'demo-household' },
  ],
  insurance: [
    { id: '1', name: 'Medical Card', type: 'medical', premium: 350, coverage: 500000, provider: 'AIA', isTakaful: false, householdId: 'demo-household' },
    { id: '2', name: 'Family Takaful', type: 'life', premium: 280, coverage: 300000, provider: 'Prudential BSN', isTakaful: true, householdId: 'demo-household' },
    { id: '3', name: 'Car Insurance', type: 'car', premium: 150, coverage: 85000, provider: 'Etiqa', isTakaful: false, householdId: 'demo-household' },
  ],
  goals: [
    { id: '1', name: 'Emergency Fund', type: 'short', targetAmount: 30000, currentAmount: 15000, deadline: '2025-06-30', priority: 1, householdId: 'demo-household' },
    { id: '2', name: 'Down Payment Rumah', type: 'long', targetAmount: 50000, currentAmount: 12000, deadline: '2027-12-31', priority: 2, householdId: 'demo-household' },
    { id: '3', name: 'Umrah', type: 'short', targetAmount: 15000, currentAmount: 8500, deadline: '2025-12-31', priority: 3, householdId: 'demo-household' },
  ],
  zakat: {
    year: 2025,
    incomeZakat: 2520,
    savingsZakat: 887.50,
    goldZakat: 375,
    investmentZakat: 842.50,
    totalDue: 4625,
    totalPaid: 4625,
    householdId: 'demo-household',
  },
  faraid: {
    totalAssets: 500000,
    hasWasiat: true,
    beneficiaries: JSON.stringify([
      { relation: 'Isteri', share: '1/8', amount: 62500 },
      { relation: 'Anak Lelaki', share: '7/12', amount: 291667 },
      { relation: 'Anak Perempuan', share: '7/24', amount: 145833 },
    ]),
    householdId: 'demo-household',
  },
  budgetSettings: {
    needsPercentage: 50,
    wantsPercentage: 30,
    savingsPercentage: 20,
    householdId: 'demo-household',
  },
};

// Calculate totals from data
const calculateTotals = (data) => {
  const totalIncome = data.income.reduce((sum, i) => sum + i.amount, 0);
  const totalCommitments = data.commitments.reduce((sum, c) => sum + c.amount, 0);
  const totalSavings = data.savings.reduce((sum, s) => sum + s.currentAmount, 0);
  const totalInvestments = data.investments.reduce((sum, i) => sum + i.currentValue, 0);
  const totalDebt = data.commitments.reduce((sum, c) => sum + (c.totalDebt || 0), 0);
  const totalPaidDebt = data.commitments.reduce((sum, c) => sum + (c.paidAmount || 0), 0);
  const remainingDebt = totalDebt - totalPaidDebt;
  const debtProgress = totalDebt > 0 ? (totalPaidDebt / totalDebt) * 100 : 0;
  const cashFlow = totalIncome - totalCommitments;
  const netWorth = totalSavings + totalInvestments - remainingDebt;
  const halalInvestments = data.investments.filter(i => i.isHalal).reduce((sum, i) => sum + i.currentValue, 0);
  const halalPercentage = totalInvestments > 0 ? (halalInvestments / totalInvestments) * 100 : 100;

  return {
    totalIncome,
    totalCommitments,
    totalSavings,
    totalInvestments,
    totalDebt,
    totalPaidDebt,
    remainingDebt,
    debtProgress,
    cashFlow,
    netWorth,
    halalPercentage,
  };
};

// Main store
export const useAppStore = create(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isDemoMode: true,

      // UI state
      showBalance: true,
      selectedMember: 'all',
      activeScreen: 'home',

      // Data
      ...sampleData,
      totals: calculateTotals(sampleData),

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      setDemoMode: (isDemoMode) => set({ isDemoMode }),
      
      toggleBalance: () => set((state) => ({ showBalance: !state.showBalance })),
      setSelectedMember: (memberId) => set({ selectedMember: memberId }),
      setActiveScreen: (screen) => set({ activeScreen: screen }),

      // Data actions
      setHousehold: (household) => set({ household }),
      setMembers: (members) => set({ members }),
      setIncome: (income) => set((state) => {
        const newState = { income };
        return { ...newState, totals: calculateTotals({ ...state, ...newState }) };
      }),
      setCommitments: (commitments) => set((state) => {
        const newState = { commitments };
        return { ...newState, totals: calculateTotals({ ...state, ...newState }) };
      }),
      setTransactions: (transactions) => set({ transactions }),
      setSavings: (savings) => set((state) => {
        const newState = { savings };
        return { ...newState, totals: calculateTotals({ ...state, ...newState }) };
      }),
      setInvestments: (investments) => set((state) => {
        const newState = { investments };
        return { ...newState, totals: calculateTotals({ ...state, ...newState }) };
      }),
      setInsurance: (insurance) => set({ insurance }),
      setGoals: (goals) => set({ goals }),
      setZakat: (zakat) => set({ zakat }),
      setFaraid: (faraid) => set({ faraid }),
      setBudgetSettings: (budgetSettings) => set({ budgetSettings }),

      // Add transaction
      addTransaction: (transaction) => set((state) => {
        const transactions = [transaction, ...state.transactions];
        return { transactions };
      }),

      // Reset to sample data (for demo)
      resetToSampleData: () => set({
        ...sampleData,
        totals: calculateTotals(sampleData),
      }),

      // Logout
      logout: () => set({
        user: null,
        isAuthenticated: false,
        isDemoMode: true,
        ...sampleData,
        totals: calculateTotals(sampleData),
      }),
    }),
    {
      name: 'myduit-storage',
      partialize: (state) => ({
        showBalance: state.showBalance,
        isDemoMode: state.isDemoMode,
      }),
    }
  )
);
