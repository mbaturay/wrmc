import { useState, useCallback, useEffect, useRef } from 'react';
import { getProfile } from '../data/mockData';
import { storage } from '../utils/storage';

// ─── Onboarding path definitions ────────────────────────
export const PATHS = {
  digital_apply: [
    'A_disclosure', 'A_intro', 'A_personal', 'otp',
    'A_id_intro', 'A_id_scan', 'A_selfie', 'A_prefill',
    'A_financial', 'A_consent', 'A_processing', 'A_approved',
    'A_create_password', 'value_prop', 'bpp_offer',
  ],
  just_approved: [
    'B_verify', 'otp', 'B_account_found',
    'A_create_password',
  ],
  have_card: [
    'D_verify', 'otp', 'D_already_active',
    'A_create_password',
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

  // Notification preferences
  const [notifTransactions, setNotifTransactions] = useState(true);
  const [notifRewards, setNotifRewards] = useState(true);
  const [notifLowCredit, setNotifLowCredit] = useState(true);
  const [notifPayments, setNotifPayments] = useState(true);
  const [skipWelcome, setSkipWelcome] = useState(false);

  // Rewards simulation
  const [totalRedeemed, setTotalRedeemed] = useState(0);
  const [simulatedRedemptions, setSimulatedRedemptions] = useState([]);

  // First purchase simulation (Build 3)
  const [purchaseSimulated, setPurchaseSimulated] = useState(false);
  const [rewardsBanner, setRewardsBanner] = useState(null);

  // Approval outcome (income-based branching)
  const [approvalOutcome, setApprovalOutcome] = useState(null); // 'approved_1000' | 'approved_500' | 'pending'
  const [tspLimit, setTspLimit] = useState(1000);
  const [pendingEmail, setPendingEmail] = useState('');
  const [notificationNudgeDismissed, setNotificationNudgeDismissed] = useState(false);
  const [nudgePaperlessDismissed, setNudgePaperlessDismissed] = useState(false);
  const [nudgeFaceIdDismissed, setNudgeFaceIdDismissed] = useState(false);
  const [nudgeNotifDismissed, setNudgeNotifDismissed] = useState(false);
  const [notificationsConfigured, setNotificationsConfigured] = useState(false);
  const [highlightedSetting, setHighlightedSetting] = useState(null);
  const [linkedAccount, setLinkedAccount] = useState(null); // { bankName, last4 } or null

  // ─── Navigation history (session-only, not persisted) ──
  const navHistoryRef = useRef([]);
  const [navHistoryLen, setNavHistoryLen] = useState(0);
  const isRestoringRef = useRef(false);

  const pushNavSnapshot = useCallback(() => {
    if (isRestoringRef.current) return;
    const snapshot = {
      screen, tab, subScreen,
      onboardingPath, stepIndex, branchStep,
      approvalOutcome,
    };
    const h = navHistoryRef.current;
    h.push(snapshot);
    if (h.length > 20) h.shift();
    setNavHistoryLen(h.length);
  }, [screen, tab, subScreen, onboardingPath, stepIndex, branchStep, approvalOutcome]);

  // ─── Launch detection (AppRouter) ───────────────────────
  useEffect(() => {
    const saved = storage.get('session');
    if (saved && saved.hasSession) {
      // Returning user with session
      const expired = saved.sessionExpiry && Date.now() > saved.sessionExpiry;
      setHasSession(true);
      setSessionExpiry(saved.sessionExpiry);
      setBiometricEnabled(saved.biometricEnabled || false);
      const restoredJourney = saved.userJourney || 'existing_user';
      setUserJourney(restoredJourney);
      // Existing users always have an active card; default 'none' only for new users
      const defaultCardStatus = restoredJourney === 'existing_user' ? 'active' : 'none';
      setCardStatus(saved.cardStatus || defaultCardStatus);
      setLanguage(saved.language || 'en');
      setPaperlessEnrolled(saved.paperlessEnrolled || false);
      if (saved.notifTransactions !== undefined) setNotifTransactions(saved.notifTransactions);
      if (saved.notifRewards !== undefined) setNotifRewards(saved.notifRewards);
      if (saved.notifLowCredit !== undefined) setNotifLowCredit(saved.notifLowCredit);
      if (saved.notifPayments !== undefined) setNotifPayments(saved.notifPayments);
      if (saved.approvalOutcome) setApprovalOutcome(saved.approvalOutcome);
      if (saved.tspLimit) setTspLimit(saved.tspLimit);
      if (saved.pendingEmail) setPendingEmail(saved.pendingEmail);
      if (saved.notificationNudgeDismissed) setNotificationNudgeDismissed(true);
      if (saved.nudgePaperlessDismissed) setNudgePaperlessDismissed(true);
      if (saved.nudgeFaceIdDismissed) setNudgeFaceIdDismissed(true);
      if (saved.nudgeNotifDismissed) setNudgeNotifDismissed(true);
      if (saved.notificationsConfigured || restoredJourney === 'existing_user') setNotificationsConfigured(true);
      if (saved.linkedAccount) setLinkedAccount(saved.linkedAccount);

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
      notifTransactions,
      notifRewards,
      notifLowCredit,
      notifPayments,
      approvalOutcome,
      tspLimit,
      pendingEmail,
      notificationNudgeDismissed,
      nudgePaperlessDismissed,
      nudgeFaceIdDismissed,
      nudgeNotifDismissed,
      notificationsConfigured,
      linkedAccount,
    });
  }, [appState, hasSession, sessionExpiry, biometricEnabled, cardStatus, userJourney, language, paperlessEnrolled, notifTransactions, notifRewards, notifLowCredit, notifPayments, approvalOutcome, tspLimit, pendingEmail, notificationNudgeDismissed, nudgePaperlessDismissed, nudgeFaceIdDismissed, nudgeNotifDismissed, notificationsConfigured, linkedAccount]);

  // ─── Derived profile data ───────────────────────────────
  const baseProfile = getProfile(userJourney);
  const rawProfile = baseProfile;

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
      rewardsThisMonth: 7.37,
      rewardsPending: 7.37,
      rewardsLifetime: 7.37,
      accountBalance: 245.80,
      availableCredit: 2754.20,
      streakDays: 1,
      transactions: [{
        id: 'sim1', merchant: 'Walmart Supercentre', amount: 245.80,
        date: '2026-03-16', category: 'Groceries', reward: 7.37,
        rewardLabel: '+$7.37 earned', rate: 0.03,
        preTaxAmount: 217.52, tax: 28.28, items: 14,
        gvTip: { itemCount: 4, estimatedSaving: 12.00, example: 'Great Value cereal, milk, bread, and dish soap' },
      }, ...profile.transactions],
      earningHistory: [
        { month: 'March 2026', amount: 7.37 },
        ...profile.earningHistory,
      ],
      welcomeBonus: profile.welcomeBonus ? {
        ...profile.welcomeBonus,
        unlocked: true,
      } : profile.welcomeBonus,
      insightMessage: 'Your $25 welcome bonus is unlocked! It will be credited within 5 business days.',
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
    pushNavSnapshot();
    setSubScreen(sub);
    if (['home', 'rewards', 'activity', 'help', 'settings'].includes(s)) {
      setTab(s);
      setScreen('main');
    } else {
      setScreen(s);
    }
  }, [pushNavSnapshot]);

  const goBack = useCallback(() => {
    if (subScreen) {
      setSubScreen(null);
    } else {
      setScreen('main');
    }
  }, [subScreen]);

  // ─── Onboarding step controls ───────────────────────────
  const goNext = useCallback(() => {
    pushNavSnapshot();
    if (branchStep) {
      setBranchStep(null);
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [branchStep, steps.length, pushNavSnapshot]);

  const goBackStep = useCallback(() => {
    if (branchStep) {
      setBranchStep(null);
      return;
    }
    setStepIndex((i) => Math.max(i - 1, 0));
  }, [branchStep]);

  const goToBranch = useCallback((stepId) => {
    pushNavSnapshot();
    setBranchStep(stepId);
  }, [pushNavSnapshot]);

  const goToStep = useCallback((stepId) => {
    pushNavSnapshot();
    const idx = steps.indexOf(stepId);
    if (idx >= 0) {
      setBranchStep(null);
      setStepIndex(idx);
    }
  }, [steps, pushNavSnapshot]);

  const setPath = useCallback((path) => {
    setOnboardingPath(path);
    setStepIndex(0);
    setBranchStep(null);
  }, []);

  // ─── Lifecycle actions ──────────────────────────────────
  // ─── Universal back (restores previous nav state) ──────
  const universalBack = useCallback((restoreAccountScreen) => {
    const h = navHistoryRef.current;
    if (h.length === 0) return false;
    isRestoringRef.current = true;
    const entry = h.pop();
    setNavHistoryLen(h.length);
    setScreen(entry.screen);
    setTab(entry.tab);
    setSubScreen(entry.subScreen);
    setOnboardingPath(entry.onboardingPath);
    setStepIndex(entry.stepIndex);
    setBranchStep(entry.branchStep);
    if (entry.approvalOutcome !== undefined) setApprovalOutcome(entry.approvalOutcome);
    if (restoreAccountScreen && entry.accountScreen !== undefined) {
      restoreAccountScreen(entry.accountScreen);
    }
    // Allow next navigation to push again
    requestAnimationFrame(() => { isRestoringRef.current = false; });
    return true;
  }, []);

  // Allow App.jsx to augment snapshot with accountScreen
  const pushNavSnapshotWithExtra = useCallback((extra) => {
    if (isRestoringRef.current) return;
    const snapshot = {
      screen, tab, subScreen,
      onboardingPath, stepIndex, branchStep,
      approvalOutcome,
      ...extra,
    };
    const h = navHistoryRef.current;
    h.push(snapshot);
    if (h.length > 20) h.shift();
    setNavHistoryLen(h.length);
  }, [screen, tab, subScreen, onboardingPath, stepIndex, branchStep, approvalOutcome]);

  const completeOnboarding = useCallback((newUser = false, notifSkipped = true, paperless = false) => {
    if (newUser) {
      setUserJourney('new_user');
    } else {
      setUserJourney('existing_user');
      // Existing returning cardholders always have an active physical card
      setCardStatus('active');
      setNotificationsConfigured(true);
    }
    if (paperless) setPaperlessEnrolled(true);
    setHasSession(true);
    setSessionExpiry(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    navigate('home');
  }, [navigate]);

  const switchUserJourney = useCallback((journey) => {
    setUserJourney(journey);
  }, []);

  const resetToPath = useCallback((pathFn) => {
    // Clear all state that should not bleed between proto control invocations
    setApprovalOutcome(null);
    setBranchStep(null);
    setStepIndex(0);
    setHighlightedSetting(null);
    setRewardsBanner(null);
    // Then run the path-specific setup
    pathFn();
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
    setNotifTransactions(true);
    setNotifRewards(true);
    setNotifLowCredit(true);
    setNotifPayments(true);
    setApprovalOutcome(null);
    setTspLimit(1000);
    setPendingEmail('');
    setNotificationNudgeDismissed(false);
    setNudgePaperlessDismissed(false);
    setNudgeFaceIdDismissed(false);
    setNudgeNotifDismissed(false);
    setNotificationsConfigured(false);
    setHighlightedSetting(null);
    setLinkedAccount(null);
    navHistoryRef.current = [];
    setNavHistoryLen(0);
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
    const acctLabel = linkedAccount ? `${linkedAccount.bankName} ••${linkedAccount.last4}` : 'Bank account';
    setPaymentTxs((prev) => [{
      id: `pay${Date.now()}`,
      merchant: `Payment — ${acctLabel}`,
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
  }, [linkedAccount]);

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
    setRewardsBanner({ text: '+$7.37 in rewards earned · $25 welcome bonus unlocked!', sub: 'From your Walmart Supercentre purchase' });
    setTimeout(() => setRewardsBanner(null), 5000);
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
    notifTransactions, setNotifTransactions,
    notifRewards, setNotifRewards,
    notifLowCredit, setNotifLowCredit,
    notifPayments, setNotifPayments,
    skipWelcome, setSkipWelcome,
    approvalOutcome, setApprovalOutcome,
    tspLimit, setTspLimit,
    pendingEmail, setPendingEmail,
    notificationNudgeDismissed, setNotificationNudgeDismissed,
    nudgePaperlessDismissed, setNudgePaperlessDismissed,
    nudgeFaceIdDismissed, setNudgeFaceIdDismissed,
    nudgeNotifDismissed, setNudgeNotifDismissed,
    notificationsConfigured, setNotificationsConfigured,
    highlightedSetting, setHighlightedSetting,
    linkedAccount, setLinkedAccount,
    // Lifecycle
    completeOnboarding, resetOnboarding, resetToPath,
    simulateCardArrival, activateCard,
    applyPayment, resetPaymentState, totalPaid,
    redeemRewards, resetRewardsState, totalRedeemed,
    simulateFirstPurchase, resetPurchaseSimulation,
    purchaseSimulated, rewardsBanner,
    // Universal back
    universalBack, navHistoryLen, pushNavSnapshotWithExtra,
  };
}
