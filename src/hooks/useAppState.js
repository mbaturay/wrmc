import { useState, useCallback } from 'react';
import { USER, REWARDS, TRANSACTIONS, PAYMENT, REDEMPTION_HISTORY } from '../data/mock';
import { REDEMPTION_INCREMENT } from '../data/rewards';

export function useAppState() {
  const [screen, setScreen] = useState('onboarding');
  const [onboardingData, setOnboardingData] = useState({
    firstName: 'Sarah', lastName: 'Demo', email: 'sarah@example.com',
    cardLast4: '', phone: '',
  });
  const [tab, setTab] = useState('home');
  const [subScreen, setSubScreen] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);
  const [frozen, setFrozen] = useState(false);
  const [rewardsAvailable, setRewardsAvailable] = useState(REWARDS.availableToRedeem);
  const [thisMonth, setThisMonth] = useState(REWARDS.thisMonth);
  const [lifetime, setLifetime] = useState(REWARDS.lifetimeSavings);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showProto, setShowProto] = useState(false);
  const [redemptions, setRedemptions] = useState(REDEMPTION_HISTORY);
  const [paymentMade, setPaymentMade] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const navigate = useCallback((s, sub = null) => {
    setSubScreen(sub);
    if (['home', 'rewards', 'activity', 'account'].includes(s)) {
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

  const simulateReward = useCallback((amount = 3.00) => {
    setThisMonth(v => +(v + amount).toFixed(2));
    setLifetime(v => +(v + amount).toFixed(2));
    setRewardsAvailable(v => +(v + amount).toFixed(2));
  }, []);

  const simulateMilestone = useCallback(() => {
    setLifetime(REWARDS.nextMilestone);
  }, []);

  const toggleRewardsAvailable = useCallback(() => {
    setRewardsAvailable(v => v > 0 ? 0 : REWARDS.availableToRedeem);
  }, []);

  // Simulates the user redeeming $5 at Walmart checkout (external event, not in-app)
  const simulateRedemption = useCallback(() => {
    setRewardsAvailable(v => {
      if (v < REDEMPTION_INCREMENT) return v;
      return +(v - REDEMPTION_INCREMENT).toFixed(2);
    });
    setRedemptions(prev => [
      { id: 'r' + Date.now(), date: new Date().toISOString().split('T')[0], amount: REDEMPTION_INCREMENT, type: 'Used at Walmart checkout' },
      ...prev,
    ]);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  }, []);

  const completeOnboarding = useCallback((newUser = false) => {
    setIsNewUser(newUser);
    navigate('home');
  }, [navigate]);

  return {
    screen, onboardingData, setOnboardingData,
    tab, subScreen, selectedTx, setSelectedTx,
    frozen, setFrozen,
    rewardsAvailable, thisMonth, lifetime,
    showCelebration, showProto, setShowProto,
    redemptions, paymentMade, setPaymentMade,
    isNewUser, setIsNewUser, completeOnboarding,
    navigate, goBack, simulateReward, simulateMilestone, toggleRewardsAvailable,
    simulateRedemption, setScreen, setRewardsAvailable,
  };
}
