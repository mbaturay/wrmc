import { useState, useCallback, useEffect } from 'react';
import { getProfile } from '../data/mockData';
import { storage } from '../utils/storage';

// ─── Onboarding path definitions ────────────────────────
export const PATHS = {
  digital_apply: [
    'language', 'A_intro', 'A_personal', 'A_id_intro', 'A_id_scan', 'A_selfie',
    'A_financial', 'A_consent', 'otp', 'A_processing', 'A_approved',
    'A_virtual_card', 'A_whats_next', 'biometric_setup', 'pin_setup',
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

  // Apply payment adjustments
  const profile = totalPaid > 0 ? {
    ...rawProfile,
    accountBalance: Math.max(0, rawProfile.accountBalance - totalPaid),
    availableCredit: Math.min(rawProfile.creditLimit, rawProfile.availableCredit + totalPaid),
    statementBalance: Math.max(0, rawProfile.statementBalance - totalPaid),
    minimumDue: totalPaid >= rawProfile.minimumDue ? 0 : Math.max(0, rawProfile.minimumDue - totalPaid),
    paymentDue: totalPaid >= rawProfile.minimumDue ? null : rawProfile.paymentDue,
    transactions: [...paymentTxs, ...rawProfile.transactions],
  } : rawProfile;

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
  };
}
