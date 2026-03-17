import { useState, useCallback } from 'react';
import { REDEMPTION_INCREMENT } from '../data/rewards';
import { getProfile } from '../data/mockData';

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
  const [userJourney, setUserJourney] = useState('existing_user');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showProto, setShowProto] = useState(false);
  const [paymentMade, setPaymentMade] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [prefGV, setPrefGV] = useState(true);
  const [language, setLanguage] = useState('en');
  const [showCardArrival, setShowCardArrival] = useState(false);
  const [cardActivated, setCardActivated] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState(false);
  const [paperlessEnrolled, setPaperlessEnrolled] = useState(false);

  // Derive all data from the active profile, overlay paperless state on welcomeBonus
  const baseProfile = getProfile(userJourney);
  const profile = baseProfile.welcomeBonus
    ? { ...baseProfile, welcomeBonus: { ...baseProfile.welcomeBonus, paperlessEarned: paperlessEnrolled } }
    : baseProfile;
  const isNewUser = userJourney === 'new_user';
  const rewardsAvailable = profile.rewardsAvailable;
  const thisMonth = profile.rewardsThisMonth;
  const lifetime = profile.rewardsLifetime;
  const redemptions = profile.redemptions;

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

  const completeOnboarding = useCallback((newUser = false, notifSkipped = false, paperless = false) => {
    if (newUser) setUserJourney('new_user');
    if (notifSkipped) setNotificationBanner(true);
    if (paperless) setPaperlessEnrolled(true);
    navigate('home');
  }, [navigate]);

  const switchUserJourney = useCallback((journey) => {
    setUserJourney(journey);
  }, []);

  const resetOnboarding = useCallback(() => {
    setScreen('onboarding');
    setCardActivated(false);
    setShowCardArrival(false);
    setNotificationBanner(false);
    setLanguage('en');
    setUserJourney('existing_user');
    setPaperlessEnrolled(false);
  }, []);

  const simulateCardArrival = useCallback(() => {
    setShowCardArrival(true);
  }, []);

  const dismissCardArrival = useCallback(() => {
    setShowCardArrival(false);
  }, []);

  const activateCard = useCallback(() => {
    setCardActivated(true);
    setShowCardArrival(false);
  }, []);

  return {
    screen, onboardingData, setOnboardingData,
    tab, subScreen, selectedTx, setSelectedTx,
    frozen, setFrozen,
    rewardsAvailable, thisMonth, lifetime,
    showCelebration, showProto, setShowProto,
    redemptions, paymentMade, setPaymentMade,
    isNewUser, userJourney, switchUserJourney, completeOnboarding,
    showAccount, setShowAccount,
    prefGV, setPrefGV,
    profile,
    navigate, goBack, setScreen,
    language, setLanguage, showCardArrival, cardActivated, notificationBanner,
    resetOnboarding, simulateCardArrival, dismissCardArrival, activateCard, setNotificationBanner,
  };
}
