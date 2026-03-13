// Mock data — Canadian context, realistic Walmart scenarios

export const USER = {
  name: 'Sarah',
  cardLast4: '4829',
  memberSince: 'March 2024',
  frozen: false,
};

export const REWARDS = {
  lifetimeSavings: 342.18,
  thisMonth: 24.37,
  pendingRewards: 8.12,
  availableToRedeem: 56.84,
  nextMilestone: 400,
  milestoneName: '$400 Lifetime Saver',
  autoApply: false,
  cashbackRate: 0.0125, // 1.25%
  basicRate: 0.01, // 1%
  walmartRate: 0.0125, // 1.25% at Walmart
  streakDays: 12,
};

export const TRANSACTIONS = [
  { id: 't1', merchant: 'Walmart Supercenter', amount: 127.43, date: '2026-03-11', category: 'Groceries', reward: 1.59, rate: 0.0125, preTaxAmount: 112.77, tax: 14.66, items: 14 },
  { id: 't2', merchant: 'Walmart.ca', amount: 54.99, date: '2026-03-09', category: 'Home', reward: 0.69, rate: 0.0125, preTaxAmount: 48.67, tax: 6.32, items: 3 },
  { id: 't3', merchant: 'Shell Gas Station', amount: 68.20, date: '2026-03-08', category: 'Gas', reward: 0.68, rate: 0.01, preTaxAmount: 60.35, tax: 7.85, items: 1 },
  { id: 't4', merchant: 'Walmart Supercenter', amount: 89.15, date: '2026-03-06', category: 'Groceries', reward: 1.11, rate: 0.0125, preTaxAmount: 78.89, tax: 10.26, items: 9 },
  { id: 't5', merchant: 'Tim Hortons', amount: 12.45, date: '2026-03-05', category: 'Dining', reward: 0.12, rate: 0.01, preTaxAmount: 11.02, tax: 1.43, items: 2 },
  { id: 't6', merchant: 'Walmart Pharmacy', amount: 34.50, date: '2026-03-03', category: 'Health', reward: 0.43, rate: 0.0125, preTaxAmount: 30.53, tax: 3.97, items: 2 },
  { id: 't7', merchant: 'Canadian Tire', amount: 156.78, date: '2026-03-01', category: 'Auto', reward: 1.57, rate: 0.01, preTaxAmount: 138.74, tax: 18.04, items: 4 },
  { id: 't8', merchant: 'Walmart Supercenter', amount: 201.33, date: '2026-02-27', category: 'Groceries', reward: 2.52, rate: 0.0125, preTaxAmount: 178.17, tax: 23.16, items: 22 },
];

export const CART_ITEMS = [
  { id: 'c1', name: 'Great Value Whole Wheat Bread', price: 2.97, brand: 'Great Value', category: 'Groceries', rate: 0.0125, isWalmartBrand: true },
  { id: 'c2', name: 'Tropicana Orange Juice 1.75L', price: 5.97, brand: 'Tropicana', category: 'Groceries', rate: 0.0125, isWalmartBrand: false, gvAlt: { name: 'Great Value Orange Juice 1.75L', price: 3.47, savings: 2.50 } },
  { id: 'c3', name: 'Tide Pods 42ct', price: 16.97, brand: 'Tide', category: 'Home', rate: 0.0125, isWalmartBrand: false, gvAlt: { name: 'Great Value Laundry Pacs 40ct', price: 9.97, savings: 7.00 } },
  { id: 'c4', name: 'Great Value Cheddar Cheese 400g', price: 5.47, brand: 'Great Value', category: 'Groceries', rate: 0.0125, isWalmartBrand: true },
  { id: 'c5', name: 'Bounty Paper Towels 6-roll', price: 14.97, brand: 'Bounty', category: 'Home', rate: 0.0125, isWalmartBrand: false, gvAlt: { name: 'Great Value Paper Towels 6-roll', price: 8.97, savings: 6.00 } },
  { id: 'c6', name: 'Great Value Pasta 900g', price: 1.97, brand: 'Great Value', category: 'Groceries', rate: 0.0125, isWalmartBrand: true },
  { id: 'c7', name: 'Chicken Breast 1kg', price: 14.97, brand: 'Fresh', category: 'Groceries', rate: 0.0125, isWalmartBrand: false },
  { id: 'c8', name: 'Kelloggs Cereal', price: 6.47, brand: 'Kelloggs', category: 'Groceries', rate: 0.0125, isWalmartBrand: false, gvAlt: { name: 'Great Value Cereal', price: 3.97, savings: 2.50 } },
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
  { id: 'r1', date: '2026-02-15', amount: 25.00, type: 'Statement Credit' },
  { id: 'r2', date: '2026-01-20', amount: 15.00, type: 'In-Store Purchase' },
  { id: 'r3', date: '2025-12-10', amount: 30.00, type: 'Statement Credit' },
];
