// Two user profiles for the WRMC prototype
// Selected based on userJourney state: 'new_user' or 'existing_user'

export const NEW_USER_PROFILE = {
  name: 'S. Martin',
  cardLast4: '4821',
  cardStatus: 'active',
  memberSince: 'March 2026',

  // Account
  accountBalance: 0.00,
  availableCredit: 3000.00,
  creditLimit: 3000,
  statementBalance: 0.00,
  minimumDue: 0.00,
  paymentDue: null,

  // Rewards
  rewardsAvailable: 0.00,
  rewardsPending: 0.00,
  rewardsThisMonth: 0.00,
  rewardsLifetime: 0.00,
  streakDays: 0,
  nextMilestone: 50,

  welcomeBonus: {
    total: 25.00,
    paperlessEarned: false,
    purchaseBonus: {
      earned: 0.00,
      target: 15.00,
      qualifyingPurchases: 0,
      requiredPurchases: 2,
      daysRemaining: 30,
    },
  },

  earningHistory: [],

  transactions: [],

  redemptions: [],

  insightMessage: "Make your first Walmart purchase to unlock $15 in Reward Dollars — part of your $25 welcome bonus.",
};

export const EXISTING_USER_PROFILE = {
  name: 'S. Martin',
  cardLast4: '4821',
  cardStatus: 'active',
  memberSince: 'March 2024',

  // Account
  accountBalance: 1284.55,
  availableCredit: 1715.45,
  creditLimit: 3000,
  statementBalance: 1100.00,
  minimumDue: 45.00,
  paymentDue: 'Apr 25',

  // Rewards
  rewardsAvailable: 55.00,
  rewardsPending: 6.12,
  rewardsThisMonth: 15.58,
  rewardsLifetime: 347.20,
  streakDays: 12,
  nextMilestone: 400,

  earningHistory: [
    { month: 'March 2026', amount: 3.82 },
    { month: 'February 2026', amount: 6.12 },
    { month: 'January 2026', amount: 4.50 },
    { month: 'December 2025', amount: 7.20 },
    { month: 'November 2025', amount: 5.90 },
  ],

  transactions: [
    { id: 'te1', merchant: 'Walmart Supercentre', amount: 72.00, date: '2026-04-12', category: 'Groceries', reward: 0.90, rewardLabel: '+$0.90 earned', rate: 0.03, preTaxAmount: 63.72, tax: 8.28, items: 8, gvTip: { itemCount: 2, estimatedSaving: 5.00, example: 'Great Value cereal and dish soap' } },
    { id: 'te2', merchant: 'Walmart.ca', amount: 41.00, date: '2026-04-11', category: 'Home', reward: 0.51, rewardLabel: '+$0.51 earned', rate: 0.03, preTaxAmount: 36.28, tax: 4.72, items: 1, gvTip: null },
    { id: 'te3', merchant: 'Starbucks', amount: 6.50, date: '2026-04-10', category: 'Dining', reward: 0.08, rewardLabel: '+$0.08 earned', rate: 0.01, preTaxAmount: 5.75, tax: 0.75, items: 1, gvTip: null },
    { id: 'te4', merchant: 'Shell', amount: 95.00, date: '2026-04-09', category: 'Gas', reward: 1.19, rewardLabel: '+$1.19 earned', rate: 0.01, preTaxAmount: 84.07, tax: 10.93, items: 1, gvTip: null },
    { id: 'te5', merchant: 'Walmart Supercentre', amount: 118.30, date: '2026-04-08', category: 'Groceries', reward: 1.48, rewardLabel: '+$1.48 earned', rate: 0.03, preTaxAmount: 104.69, tax: 13.61, items: 11, gvTip: { itemCount: 3, estimatedSaving: 8.50, example: 'Great Value orange juice, pasta, and paper towels' } },
  ],

  redemptions: [
    { id: 'r1', date: '2026-02-15', amount: 25.00, type: 'Used at Walmart checkout' },
    { id: 'r2', date: '2026-01-20', amount: 15.00, type: 'Used on Walmart.ca' },
    { id: 'r3', date: '2025-12-10', amount: 30.00, type: 'Used at Walmart checkout' },
  ],

  insightMessage: "You've earned $55.00 in rewards this year — enough for 11 free trips to the checkout.",
};

export function getProfile(userJourney) {
  return userJourney === 'new_user' ? NEW_USER_PROFILE : EXISTING_USER_PROFILE;
}
