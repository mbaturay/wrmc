import { useState, useCallback, useEffect } from 'react';
import { getProfile } from '../data/mockData';
import { storage } from '../utils/storage';

// ─── Onboarding path definitions ────────────────────────
export const PATHS = {
  digital_apply: [
    'language', 'A_disclosure', 'A_intro', 'A_personal', 'A_id_intro', 'A_id_scan', 'A_selfie',
    'A_financial', 'A_consent', 'otp', 'A_processing', 'A_approved',
    'A_virtual_card', 'A_whats_next', 'bpp_offer', 'biometric_setup', 'pin_setup',
    'estatement', 'notifications',
  ],
  just_approved: [
    'language', 'B_verify', 'otp', 'B_account_found', 'biometric_setup',
    'pin_setup', 'estatement', 'notifications',
  ],
  have_card: [
    'language', 'D_verify', 'otp', 'D_already_active', 'biometric_setup',
    'pin_setup', 'estatement', 'notifications',
  ],
  sign_in: ['E_signin'],
  session_expired: ['G_reauth'],
};

// ─── Hook ───────────────────────────────────────────────
export function useAppState() {
  // App-level gate: 'loading' | 'ready'
  const [appState, setAppState] = useState('loading');

  // Core routing
  const [screen, setScreen] = useState('onboarding');   // 'onboarding' | 'main'
  const [tab, setTab] = useState('home');
  const [subScreen, setSubScreen] = useState(null);

  // Onboarding step machine
  const [onboardingPath, setOnboardingPath] = useState('digital_apply');
  const [stepIndex, setStepIndex] = useState(0);
  const [branchStep, setBranchStep] = useState(null);

  // Session & auth
  const [hasSession, setHasSession] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Card
  const [cardStatus, setCardStatus] = useState('none'); // 'none' | 'virtual_only' | 'active'
  const [frozen, setFrozen] = useState(false);

  // Onboarding data (form fields)
  const [onboardingData, setOnboardingData] = useState({
    firstName: 'Sarah', lastName: 'Demo', email: 'sarah@example.com',
    cardLast4: '', phone: '',
  });

  // UI state
  const [selectedTx, setSelectedTx] = useState(null);
  const [userJourney, setUserJourney] = useState('existing_user');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showProto, setShowProto] = useState(false);
  const [paymentMade, setPaymentMade] = useState(false);
  const [totalPaid, setTotalPaid] = useState(0);
  const [paymentTxs, setPaymentTxs] = useState([]);
  const [showAccount, setShowAccount] = useState(false);
  const [prefGV, setPrefGV] = useState(true);
  const [language, setLanguage] = useState('en');
  const [notificationBanner, setNotificationBanner] = useState(false);
  const [paperlessEnrolled, setPaperlessEnrolled] = useState(false);
  const [skipWelcome, setSkipWelcome] = useState(false);

  // Rewards simulation
  const [totalRedeemed, setTotalRedeemed] = useState(0);
  const [simulatedRedemptions, setSimulatedRedemptions] = useState([]);

  // First purchase simulation (Build 3)
  const [purchaseSimulated, setPurchaseSimulated] = useState(false);
  const [rewardsBanner, setRewardsBanner] = useState(null);

  // ─── Launch detection (AppRouter) ───────────────────────
  useEffect(() => {
    const saved = storage.get('session');
    if (saved && saved.hasSession) {
      // Returning user with session
      const expired = saved.sessionExpiry && Date.now() > saved.sessionExpiry;
      setHasSession(true);
      setSessionExpiry(saved.sessionExpiry);
      setBiometricEnabled(saved.biometricEnabled || false);
      setCardStatus(saved.cardStatus || 'none');
      setUserJourney(saved.userJourney || 'existing_user');
      setLanguage(saved.language || 'en');
      setPaperlessEnrolled(saved.paperlessEnrolled || false);

      if (expired) {
        // Session expired → re-auth flow
        setScreen('onboarding');
        setOnboardingPath('session_expired');
        setStepIndex(0);
      } else {
        // Valid session → go straight to main
        setScreen('main');
        setTab('home');
      }
    } else {
      // No session → onboarding
      setScreen('onboarding');
      setOnboardingPath('digital_apply');
      setStepIndex(0);
    }
    setAppState('ready');
  }, []);

  // ─── Persist key state on change ────────────────────────
  useEffect(() => {
    if (appState !== 'ready') return;
    storage.set('session', {
      hasSession,
      sessionExpiry,
      biometricEnabled,
      cardStatus,
      userJourney,
      language,
      paperlessEnrolled,
    });
  }, [appState, hasSession, sessionExpiry, biometricEnabled, cardStatus, userJourney, language, paperlessEnrolled]);

  // ─── Derived profile data ───────────────────────────────
  const baseProfile = getProfile(userJourney);
  const rawProfile = baseProfile.welcomeBonus
    ? { ...baseProfile, welcomeBonus: { ...baseProfile.welcomeBonus, paperlessEarned: paperlessEnrolled } }
    : baseProfile;

  // ─── Apply overlays to profile ──────────────────────────
  let profile = rawProfile;

  // Payment adjustments
  if (totalPaid > 0) {
    profile = {
      ...profile,
      accountBalance: Math.max(0, profile.accountBalance - totalPaid),
      availableCredit: Math.min(profile.creditLimit, profile.availableCredit + totalPaid),
      statementBalance: Math.max(0, profile.statementBalance - totalPaid),
      minimumDue: totalPaid >= profile.minimumDue ? 0 : Math.max(0, profile.minimumDue - totalPaid),
      paymentDue: totalPaid >= profile.minimumDue ? null : profile.paymentDue,
      transactions: [...paymentTxs, ...profile.transactions],
    };
  }

  // Rewards redemption adjustments
  if (totalRedeemed > 0) {
    profile = {
      ...profile,
      rewardsAvailable: Math.max(0, profile.rewardsAvailable - totalRedeemed),
      redemptions: [...simulatedRedemptions, ...profile.redemptions],
    };
  }

  // First purchase simulation (new user)
  if (purchaseSimulated && userJourney === 'new_user') {
    profile = {
      ...profile,
      rewardsThisMonth: 3.07,
      rewardsPending: 3.07,
      rewardsLifetime: 3.07,
      accountBalance: 245.80,
      availableCredit: 2754.20,
      streakDays: 1,
      transactions: [{
        id: 'sim1', merchant: 'Walmart Supercentre', amount: 245.80,
        date: '2026-03-16', category: 'Groceries', reward: 3.07,
        rewardLabel: '+$3.07 earned', rate: 0.03,
        preTaxAmount: 217.52, tax: 28.28, items: 14,
        gvTip: { itemCount: 4, estimatedSaving: 12.00, example: 'Great Value cereal, milk, bread, and dish soap' },
      }, ...profile.transactions],
      earningHistory: [
        { month: 'March 2026', amount: 3.07 },
        ...profile.earningHistory,
      ],
      welcomeBonus: profile.welcomeBonus ? {
        ...profile.welcomeBonus,
        purchaseBonus: {
          ...profile.welcomeBonus.purchaseBonus,
          qualifyingPurchases: 1,
          earned: 7.50,
        },
      } : profile.welcomeBonus,
      insightMessage: 'Your first rewards are here. Keep shopping at Walmart to unlock your $25 welcome bonus.',
    };
  }

  const isNewUser = userJourney === 'new_user';
  const rewardsAvailable = profile.rewardsAvailable;
  const thisMonth = profile.rewardsThisMonth;
  const lifetime = profile.rewardsLifetime;
  const redemptions = profile.redemptions;

  // ─── Current onboarding step (rendered step) ────────────
  const steps = PATHS[onboardingPath] || [];
  const currentStep = branchStep ?? steps[stepIndex] ?? steps[0];

  // ─── Navigation ─────────────────────────────────────────
  const navigate = useCallback((s, sub = null) => {
    setSubScreen(sub);
    if (['home', 'rewards', 'activity', 'settings'].includes(s)) {
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

  // ─── Onboarding step controls ───────────────────────────
  const goNext = useCallback(() => {
    if (branchStep) {
      // Clear branch and advance past the step that branched
      setBranchStep(null);
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [branchStep, steps.length]);

  const goBackStep = useCallback(() => {
    if (branchStep) {
      setBranchStep(null);
      return;
    }
    setStepIndex((i) => Math.max(i - 1, 0));
  }, [branchStep]);

  const goToBranch = useCallback((stepId) => {
    setBranchStep(stepId);
  }, []);

  const goToStep = useCallback((stepId) => {
    const idx = steps.indexOf(stepId);
    if (idx >= 0) {
      setBranchStep(null);
      setStepIndex(idx);
    }
  }, [steps]);

  const setPath = useCallback((path) => {
    setOnboardingPath(path);
    setStepIndex(0);
    setBranchStep(null);
  }, []);

  // ─── Lifecycle actions ──────────────────────────────────
  const completeOnboarding = useCallback((newUser = false, notifSkipped = false, paperless = false) => {
    if (newUser) setUserJourney('new_user');
    if (notifSkipped) setNotificationBanner(true);
    if (paperless) setPaperlessEnrolled(true);
    setHasSession(true);
    setSessionExpiry(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    navigate('home');
  }, [navigate]);

  const switchUserJourney = useCallback((journey) => {
    setUserJourney(journey);
  }, []);

  const resetOnboarding = useCallback(() => {
    storage.clear();
    setScreen('onboarding');
    setOnboardingPath('digital_apply');
    setStepIndex(0);
    setBranchStep(null);
    setHasSession(false);
    setSessionExpiry(null);
    setFailedAttempts(0);
    setBiometricEnabled(false);
    setCardStatus('none');
    setNotificationBanner(false);
    setLanguage('en');
    setUserJourney('existing_user');
    setPaperlessEnrolled(false);
    setFrozen(false);
    setSkipWelcome(false);
    setTotalPaid(0);
    setPaymentTxs([]);
    setTotalRedeemed(0);
    setSimulatedRedemptions([]);
    setPurchaseSimulated(false);
    setRewardsBanner(null);
  }, []);

  const simulateCardArrival = useCallback(() => {
    setCardStatus('virtual_only');
  }, []);

  const activateCard = useCallback(() => {
    setCardStatus('active');
  }, []);

  const applyPayment = useCallback((amount) => {
    setTotalPaid((prev) => prev + amount);
    setPaymentMade(true);
    const today = new Date().toISOString().split('T')[0];
    setPaymentTxs((prev) => [{
      id: `pay${Date.now()}`,
      merchant: 'Payment — Bank account ••89',
      amount: -amount,
      date: today,
      category: 'Payment',
      reward: 0,
      rewardLabel: '',
      rate: 0,
      preTaxAmount: amount,
      tax: 0,
      items: 0,
      gvTip: null,
    }, ...prev]);
  }, []);

  const resetPaymentState = useCallback(() => {
    setTotalPaid(0);
    setPaymentMade(false);
    setPaymentTxs([]);
  }, []);

  const redeemRewards = useCallback((amount) => {
    setTotalRedeemed((prev) => prev + amount);
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    setSimulatedRedemptions((prev) => [{
      id: `red${Date.now()}`,
      date: dateStr,
      amount: amount,
      type: 'Simulated redemption',
    }, ...prev]);
  }, []);

  const resetRewardsState = useCallback(() => {
    setTotalRedeemed(0);
    setSimulatedRedemptions([]);
  }, []);

  const simulateFirstPurchase = useCallback(() => {
    if (purchaseSimulated) return;
    setPurchaseSimulated(true);
    setRewardsBanner({ text: '+$3.07 in rewards earned', sub: 'From your Walmart Supercentre purchase' });
    setTimeout(() => setRewardsBanner(null), 4000);
  }, [purchaseSimulated]);

  const resetPurchaseSimulation = useCallback(() => {
    setPurchaseSimulated(false);
    setRewardsBanner(null);
  }, []);

  return {
    // App gate
    appState,
    // Routing
    screen, tab, subScreen, navigate, goBack, setScreen,
    // Onboarding
    onboardingPath, setPath, stepIndex, currentStep,
    goNext, goBackStep, goToBranch, goToStep, branchStep,
    onboardingData, setOnboardingData,
    // Session & auth
    hasSession, sessionExpiry, failedAttempts, setFailedAttempts,
    biometricEnabled, setBiometricEnabled,
    // Card
    cardStatus, setCardStatus, frozen, setFrozen,
    // Data
    selectedTx, setSelectedTx,
    rewardsAvailable, thisMonth, lifetime, redemptions,
    profile, isNewUser, userJourney, switchUserJourney,
    // UI
    showCelebration, showProto, setShowProto,
    paymentMade, setPaymentMade,
    showAccount, setShowAccount,
    prefGV, setPrefGV,
    language, setLanguage,
    notificationBanner, setNotificationBanner,
    paperlessEnrolled, setPaperlessEnrolled,
    skipWelcome, setSkipWelcome,
    // Lifecycle
    completeOnboarding, resetOnboarding,
    simulateCardArrival, activateCard,
    applyPayment, resetPaymentState, totalPaid,
    redeemRewards, resetRewardsState, totalRedeemed,
    simulateFirstPurchase, resetPurchaseSimulation,
    purchaseSimulated, rewardsBanner,
  };
}
