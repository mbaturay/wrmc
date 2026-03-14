// Mock data — Canadian context, realistic Walmart scenarios

export const USER = {
  name: 'Sarah',
  cardLast4: '4829',
  memberSince: 'March 2024',
  frozen: false,
};

export const REWARDS = {
  lifetimeSavings: 382.50,
  thisMonth: 15.58,
  pendingRewards: 8.12,
  availableToRedeem: 55.00,
  nextMilestone: 400,
  milestoneName: '$400 Lifetime Saver',
  // Rates centralized in rewards.js
  streakDays: 12,
};

export const TRANSACTIONS = [
  { id: 't1', merchant: 'Walmart Supercenter', amount: 127.43, date: '2026-03-11', category: 'Groceries', reward: 3.38, rate: 0.03, preTaxAmount: 112.77, tax: 14.66, items: 14 },
  { id: 't2', merchant: 'Walmart.ca', amount: 54.99, date: '2026-03-09', category: 'Home', reward: 1.46, rate: 0.03, preTaxAmount: 48.67, tax: 6.32, items: 3 },
  { id: 't3', merchant: 'Shell Gas Station', amount: 68.20, date: '2026-03-08', category: 'Gas', reward: 0.60, rate: 0.01, preTaxAmount: 60.35, tax: 7.85, items: 1 },
  { id: 't4', merchant: 'Walmart Supercenter', amount: 89.15, date: '2026-03-06', category: 'Groceries', reward: 2.37, rate: 0.03, preTaxAmount: 78.89, tax: 10.26, items: 9 },
  { id: 't5', merchant: 'Tim Hortons', amount: 12.45, date: '2026-03-05', category: 'Dining', reward: 0.11, rate: 0.01, preTaxAmount: 11.02, tax: 1.43, items: 2 },
  { id: 't6', merchant: 'Walmart Pharmacy', amount: 34.50, date: '2026-03-03', category: 'Health', reward: 0.92, rate: 0.03, preTaxAmount: 30.53, tax: 3.97, items: 2 },
  { id: 't7', merchant: 'Canadian Tire', amount: 156.78, date: '2026-03-01', category: 'Auto', reward: 1.39, rate: 0.01, preTaxAmount: 138.74, tax: 18.04, items: 4 },
  { id: 't8', merchant: 'Walmart Supercenter', amount: 201.33, date: '2026-02-27', category: 'Groceries', reward: 5.35, rate: 0.03, preTaxAmount: 178.17, tax: 23.16, items: 22 },
];

export const PAYMENT = {
  currentBalance: 423.56,
  statementBalance: 389.12,
  minimumDue: 10.00,
  dueDate: '2026-03-25',
  creditLimit: 5000,
  availableCredit: 4576.44,
};

export const REDEMPTION_HISTORY = [
  { id: 'r1', date: '2026-02-15', amount: 25.00, type: 'In-Store Redemption' },
  { id: 'r2', date: '2026-01-20', amount: 15.00, type: 'Walmart.ca Redemption' },
  { id: 'r3', date: '2025-12-10', amount: 30.00, type: 'In-Store Redemption' },
];
