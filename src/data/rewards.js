// Reward rates and calculation — single source of truth

export const REWARDS_RATES = {
  walmart: 0.03,      // 3% — in-store, walmart.ca, Marketplace
  other: 0.01,        // 1% — everywhere else Mastercard accepted
};

export const REDEMPTION_INCREMENT = 5; // must redeem in $5 increments

export function calculateRewards(walmartSpend, otherSpend) {
  const earned = (walmartSpend * REWARDS_RATES.walmart) +
                 (otherSpend * REWARDS_RATES.other);
  return Math.round(earned * 100) / 100; // round to cents
}

export function redeemableAmount(rewardDollarsBalance) {
  // floor to nearest $5 increment
  return Math.floor(rewardDollarsBalance / REDEMPTION_INCREMENT) * REDEMPTION_INCREMENT;
}

export function isWalmartMerchant(merchantName) {
  return merchantName.toLowerCase().includes('walmart');
}

export function getRate(merchantName) {
  return isWalmartMerchant(merchantName) ? REWARDS_RATES.walmart : REWARDS_RATES.other;
}

export function getRateLabel(merchantName) {
  return isWalmartMerchant(merchantName)
    ? `${REWARDS_RATES.walmart * 100}% Walmart rate`
    : `${REWARDS_RATES.other * 100}% standard rate`;
}
