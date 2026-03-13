import { useState, useCallback } from 'react';
import { USER, REWARDS, TRANSACTIONS, CART_ITEMS, PAYMENT, REDEMPTION_HISTORY } from '../data/mock';

export function useAppState() {
  const [screen, setScreen] = useState('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [prefs, setPrefs] = useState([]);
  const [tab, setTab] = useState('home');
  const [subScreen, setSubScreen] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);
  const [frozen, setFrozen] = useState(false);
  const [autoApply, setAutoApply] = useState(REWARDS.autoApply);
  const [rewardsAvailable, setRewardsAvailable] = useState(REWARDS.availableToRedeem);
  const [thisMonth, setThisMonth] = useState(REWARDS.thisMonth);
  const [lifetime, setLifetime] = useState(REWARDS.lifetimeSavings);
  const [showCelebration, setShowCelebration] = useState(false);
  const [cartItems, setCartItems] = useState(CART_ITEMS.map(i => ({ ...i, switched: false })));
  const [checkedOut, setCheckedOut] = useState(false);
  const [showProto, setShowProto] = useState(false);
  const [redemptions, setRedemptions] = useState(REDEMPTION_HISTORY);
  const [paymentMade, setPaymentMade] = useState(false);

  const navigate = useCallback((s, sub = null) => {
    setSubScreen(sub);
    if (['home', 'shop', 'activity', 'account'].includes(s)) {
      setTab(s);
      setScreen('main');
    } else {
      setScreen(s);
    }
  }, []);

  const goBack = useCallback(() => {
    if (subScreen) {
      setSubScreen(null);
    } else {
      setScreen('main');
    }
  }, [subScreen]);

  const simulateReward = useCallback((amount = 1.25) => {
    setThisMonth(v => +(v + amount).toFixed(2));
    setLifetime(v => +(v + amount).toFixed(2));
    setRewardsAvailable(v => +(v + amount).toFixed(2));
  }, []);

  const simulateMilestone = useCallback(() => {
    // Push lifetime to milestone target so Home can detect the crossing
    setLifetime(REWARDS.nextMilestone);
  }, []);

  const toggleRewardsAvailable = useCallback(() => {
    setRewardsAvailable(v => v > 0 ? 0 : REWARDS.availableToRedeem);
  }, []);

  const redeemRewards = useCallback((amount) => {
    setRewardsAvailable(v => +(v - amount).toFixed(2));
    setRedemptions(prev => [
      { id: 'r' + Date.now(), date: new Date().toISOString().split('T')[0], amount, type: 'Statement Credit' },
      ...prev,
    ]);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  }, []);

  const switchToGV = useCallback((itemId) => {
    setCartItems(prev => prev.map(i => i.id === itemId ? { ...i, switched: true } : i));
  }, []);

  return {
    screen, onboardingStep, setOnboardingStep, prefs, setPrefs,
    tab, subScreen, selectedTx, setSelectedTx,
    frozen, setFrozen, autoApply, setAutoApply,
    rewardsAvailable, thisMonth, lifetime,
    showCelebration, cartItems, checkedOut, setCheckedOut,
    showProto, setShowProto, redemptions, paymentMade, setPaymentMade,
    navigate, goBack, simulateReward, simulateMilestone, toggleRewardsAvailable,
    redeemRewards, switchToGV, setScreen, setRewardsAvailable,
  };
}
