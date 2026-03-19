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
    unlocked: false,
    triggerAmount: 75,
    daysRemaining: 30,
  },

  earningHistory: [],

  transactions: [],

  redemptions: [],

  insightMessage: "Make a $75+ Walmart purchase within 30 days to unlock your $25 welcome bonus.",
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
  rewardsPending: 7.04,
  rewardsThisMonth: 18.46,
  rewardsLifetime: 347.20,
  streakDays: 12,
  nextMilestone: 400,

  earningHistory: [
    { month: 'March 2026', amount: 7.04 },
    { month: 'February 2026', amount: 9.80 },
    { month: 'January 2026', amount: 7.65 },
    { month: 'December 2025', amount: 11.50 },
    { month: 'November 2025', amount: 9.25 },
  ],

  transactions: [
    { id: 'te1', merchant: 'Walmart Supercentre', amount: 72.00, date: '2026-04-12', category: 'Groceries', reward: 1.91, rewardLabel: '+$1.91 earned', rate: 0.03, preTaxAmount: 63.72, tax: 8.28, items: 8, gvTip: { itemCount: 2, estimatedSaving: 5.00, example: 'Great Value cereal and dish soap' } },
    { id: 'te2', merchant: 'Walmart.ca', amount: 41.00, date: '2026-04-11', category: 'Home', reward: 1.09, rewardLabel: '+$1.09 earned', rate: 0.03, preTaxAmount: 36.28, tax: 4.72, items: 1, gvTip: null },
    { id: 'te3', merchant: 'Starbucks', amount: 6.50, date: '2026-04-10', category: 'Dining', reward: 0.06, rewardLabel: '+$0.06 earned', rate: 0.01, preTaxAmount: 5.75, tax: 0.75, items: 1, gvTip: null },
    { id: 'te4', merchant: 'Shell', amount: 95.00, date: '2026-04-09', category: 'Gas', reward: 0.84, rewardLabel: '+$0.84 earned', rate: 0.01, preTaxAmount: 84.07, tax: 10.93, items: 1, gvTip: null },
    { id: 'te5', merchant: 'Walmart Supercentre', amount: 118.30, date: '2026-04-08', category: 'Groceries', reward: 3.14, rewardLabel: '+$3.14 earned', rate: 0.03, preTaxAmount: 104.69, tax: 13.61, items: 11, gvTip: { itemCount: 3, estimatedSaving: 8.50, example: 'Great Value orange juice, pasta, and paper towels' } },
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
