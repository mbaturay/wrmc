import { useEffect } from 'react';
import { useAppState } from './hooks/useAppState';
import { Header, BottomNav } from './components/Layout';
import { Celebration } from './components/Celebration';
import { ProtoControlsOverlay } from './components/ProtoControls';
import { OnboardingFlow } from './screens/OnboardingFlow';
import { CardActivate, ActivateCall, ActivationSuccess, BppOffer } from './screens/onboarding/Stage5';
import { Home } from './screens/Home';
import { PendingHome } from './screens/onboarding/Stage3';
import { Activity, TransactionDetail, HowRewardsWork } from './screens/Activity';
import { Rewards } from './screens/Rewards';
import { Account, FreezeCard, MakePayment, Statements, Settings, Profile, About } from './screens/Account';

function App() {
  const state = useAppState();

  // ─── Keyboard shortcut: Cmd+P / Ctrl+P ──────────────
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        state.setShowProto(prev => !prev);
      }
      if (e.key === 'Escape') {
        state.setShowProto(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ─── Splash gate ──────────────────────────────────────
  if (state.appState === 'loading') {
    return (
      <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" aria-label="Loading">
          <g transform="translate(50,50)">
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <path
                key={angle}
                d="M0,-8 L5,-38 L0,-44 L-5,-38 Z"
                fill="#FFC220"
                transform={`rotate(${angle})`}
              />
            ))}
          </g>
        </svg>
      </div>
    );
  }

  // Sub-screens with headers
  const subScreens = {
    account: {
      title: 'Account',
      render: () => <Account navigate={state.navigate} frozen={state.frozen} profile={state.profile} />,
    },
    txDetail: {
      title: 'Transaction',
      render: () => (
        <TransactionDetail
          tx={state.selectedTx}
          onBack={state.goBack}
          onHowRewards={() => state.navigate('main', 'howRewards')}
          showGVTip={state.prefGV}
        />
      ),
    },
    howRewards: {
      title: 'How Rewards Work',
      render: () => <HowRewardsWork onBack={state.goBack} />,
    },
    freeze: {
      title: 'Card Controls',
      render: () => <FreezeCard frozen={state.frozen} setFrozen={state.setFrozen} onBack={state.goBack} />,
    },
    payment: {
      title: 'Make a Payment',
      render: () => <MakePayment onBack={state.goBack} profile={state.profile} applyPayment={state.applyPayment} />,
    },
    statements: {
      title: 'Statements',
      render: () => <Statements />,
    },
    profile: {
      title: 'Profile',
      render: () => <Profile />,
    },
    about: {
      title: 'About',
      render: () => <About />,
    },
    editProfile: {
      title: 'Edit Profile',
      render: () => (
        <div className="screen" style={{ textAlign: 'center', paddingTop: 48 }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Edit Profile</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Coming soon.</div>
        </div>
      ),
    },
    faq: {
      title: 'FAQ',
      render: () => (
        <div className="screen" style={{ textAlign: 'center', paddingTop: 48 }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>FAQ</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Frequently asked questions coming soon.</div>
        </div>
      ),
    },
    legal: {
      title: 'Legal Documents',
      render: () => (
        <div className="screen" style={{ textAlign: 'center', paddingTop: 48 }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Legal Documents</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Legal documents coming soon.</div>
        </div>
      ),
    },
    cardActivate: {
      title: 'Activate Your Card',
      render: () => <CardActivate onNext={() => { state.navigate('main', 'activateCall'); }} onBack={state.goBack} lang={state.language} />,
    },
    activateCall: {
      title: 'Activate Your Card',
      render: () => <ActivateCall onNext={() => { state.navigate('main', 'bppOffer'); }} lang={state.language} />,
    },
    bppOffer: {
      title: '',
      render: () => <BppOffer onNext={() => { state.activateCard(); state.navigate('main', 'activationSuccess'); }} lang={state.language} />,
    },
    activationSuccess: {
      title: '',
      render: () => <ActivationSuccess onNext={() => { state.goBack(); }} lang={state.language} />,
    },
  };

  const tabTitles = { home: 'Home', rewards: 'Rewards', activity: 'Activity', settings: 'Settings' };
  const currentSub = state.subScreen && subScreens[state.subScreen];

  return (
    <div className="app-shell" style={{ '--scroll-clearance': state.cardStatus === 'virtual_only' && state.screen === 'main' ? '180px' : '80px' }}>
      <Celebration show={state.showCelebration} />

      <Header
        title={state.screen === 'onboarding' ? '' : (currentSub ? currentSub.title : tabTitles[state.tab])}
        onBack={state.screen === 'onboarding' ? null : (currentSub ? state.goBack : null)}
        tab={state.screen === 'onboarding' ? 'home' : state.tab}
        onAvatarTap={() => state.navigate('main', 'account')}
        hideActions={state.screen === 'onboarding'}
      />

      {state.screen === 'onboarding' ? (
        <OnboardingFlow
          key={state.onboardingPath}
          onComplete={(...args) => state.completeOnboarding(...args)}
          language={state.language}
          setLanguage={state.setLanguage}
          onboardingPath={state.onboardingPath}
          setPath={state.setPath}
          currentStep={state.currentStep}
          goNext={state.goNext}
          goBackStep={state.goBackStep}
          goToBranch={state.goToBranch}
          goToStep={state.goToStep}
          biometricEnabled={state.biometricEnabled}
          failedAttempts={state.failedAttempts}
          setFailedAttempts={state.setFailedAttempts}
          setUserJourney={state.switchUserJourney}
          setCardStatus={state.setCardStatus}
          skipWelcome={state.skipWelcome}
          approvalOutcome={state.approvalOutcome}
          setApprovalOutcome={state.setApprovalOutcome}
          setTspLimit={state.setTspLimit}
          tspLimit={state.tspLimit}
          setPendingEmail={state.setPendingEmail}
          pendingEmail={state.pendingEmail}
        />
      ) : currentSub ? (
        currentSub.render()
      ) : (
        <>
          {state.tab === 'home' && state.notificationBanner && (
            <div style={{
              padding: '10px 16px', background: '#EBF5FF', borderBottom: '1px solid #cde0f0',
              fontSize: 13, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>Enable notifications to stay on top of your account →</span>
              <button onClick={() => state.setNotificationBanner(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)' }}>×</button>
            </div>
          )}
          {state.rewardsBanner && (
            <div style={{
              padding: '12px 16px', background: '#E8F5E9', borderBottom: '1px solid #C8E6C9',
              fontSize: 13, color: '#2E7D32',
            }}>
              <div style={{ fontWeight: 600 }}>{state.rewardsBanner.text}</div>
              <div style={{ fontSize: 12, color: '#4CAF50', marginTop: 2 }}>{state.rewardsBanner.sub}</div>
            </div>
          )}
          {state.tab === 'home' && state.profile.paymentDue && !state.paymentMade && (
            <div
              onClick={() => state.navigate('main', 'payment')}
              style={{
                padding: '12px 16px', background: '#FFF8E1', borderBottom: '1px solid #F0E0A0',
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: '#FFE082',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="5" width="14" height="10" rx="2" stroke="#8D6E00" strokeWidth="1.5" fill="none"/>
                  <path d="M10 12V7M10 7L7.5 9.5M10 7L12.5 9.5" stroke="#8D6E00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#5D4200' }}>Payment due {state.profile.paymentDue}</div>
                <div style={{ fontSize: 12, color: '#8D6E00' }}>Minimum ${state.profile.minimumDue.toFixed(2)} due</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M7 4L13 10L7 16" stroke="#8D6E00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          {state.tab === 'home' && state.approvalOutcome === 'pending' ? (
            <PendingHome lang={state.language} email={state.pendingEmail || 'sarah@example.com'} />
          ) : state.tab === 'home' && (
            <Home
              thisMonth={state.thisMonth}
              lifetime={state.lifetime}
              rewardsAvailable={state.rewardsAvailable}
              navigate={state.navigate}
              isNewUser={state.isNewUser}
              frozen={state.frozen}
              profile={state.profile}
              notificationNudgeDismissed={state.notificationNudgeDismissed}
              setNotificationNudgeDismissed={state.setNotificationNudgeDismissed}
            />
          )}
          {state.tab === 'rewards' && (
            <Rewards
              rewardsAvailable={state.rewardsAvailable}
              redemptions={state.redemptions}
              earningHistory={state.profile.earningHistory}
              pendingRewards={state.profile.rewardsPending}
              welcomeBonus={state.profile.welcomeBonus}
              isNewUser={state.isNewUser}
              onRedeem={state.redeemRewards}
            />
          )}
          {state.tab === 'activity' && (
            <Activity
              isNewUser={state.isNewUser}
              prefGV={state.prefGV}
              transactions={state.profile.transactions}
              onSelectTx={(tx) => {
                state.setSelectedTx(tx);
                state.navigate('main', 'txDetail');
              }}
            />
          )}
          {state.tab === 'settings' && (
            <Settings
              navigate={state.navigate}
              profile={state.profile}
              biometricEnabled={state.biometricEnabled}
              setBiometricEnabled={state.setBiometricEnabled}
              notifTransactions={state.notifTransactions}
              setNotifTransactions={state.setNotifTransactions}
              notifRewards={state.notifRewards}
              setNotifRewards={state.setNotifRewards}
              notifLowCredit={state.notifLowCredit}
              setNotifLowCredit={state.setNotifLowCredit}
              notifPayments={state.notifPayments}
              setNotifPayments={state.setNotifPayments}
              paperlessEnrolled={state.paperlessEnrolled}
              setPaperlessEnrolled={state.setPaperlessEnrolled}
              prefGV={state.prefGV}
              setPrefGV={state.setPrefGV}
              language={state.language}
              setLanguage={state.setLanguage}
              protoProps={{
                onResetOnboarding: state.resetOnboarding,
                userJourney: state.userJourney,
                onSwitchUserJourney: state.switchUserJourney,
                setScreen: state.setScreen,
                setPath: state.setPath,
                setCardStatus: state.setCardStatus,
                navigate: state.navigate,
                goToBranch: state.goToBranch,
                setSkipWelcome: state.setSkipWelcome,
                onResetPayment: state.resetPaymentState,
                paymentMade: state.paymentMade,
                onResetRewards: state.resetRewardsState,
                totalRedeemed: state.totalRedeemed,
                onSimulateFirstPurchase: state.simulateFirstPurchase,
                purchaseSimulated: state.purchaseSimulated,
                onResetPurchaseSimulation: state.resetPurchaseSimulation,
                onSwitchLanguage: () => state.setLanguage(state.language === 'en' ? 'fr' : 'en'),
                language: state.language,
                approvalOutcome: state.approvalOutcome,
                setApprovalOutcome: state.setApprovalOutcome,
                setPendingEmail: state.setPendingEmail,
                notificationNudgeDismissed: state.notificationNudgeDismissed,
                setNotificationNudgeDismissed: state.setNotificationNudgeDismissed,
              }}
            />
          )}
        </>
      )}

      {state.screen === 'main' && state.subScreen !== 'activateCall' && state.subScreen !== 'bppOffer' && state.subScreen !== 'activationSuccess' && (
        <BottomNav active={state.tab} onNavigate={(t) => state.navigate(t)} />
      )}

      {state.cardStatus === 'virtual_only' && state.screen === 'main' && (
        <div
          onClick={() => state.navigate('main', 'cardActivate')}
          style={{
            position: 'fixed', bottom: 80, left: 16, right: 16,
            background: '#E6F1FB', borderRadius: 12, padding: '14px 16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Your physical card is on its way</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Activate it when it arrives to use in stores</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Temporary Shopping Pass \u00b7 Valid for 10 days from approval</div>
        </div>
      )}

      <ProtoControlsOverlay
        show={state.showProto}
        setShow={state.setShowProto}
        onResetOnboarding={state.resetOnboarding}
        userJourney={state.userJourney}
        onSwitchUserJourney={state.switchUserJourney}
        setScreen={state.setScreen}
        setPath={state.setPath}
        setCardStatus={state.setCardStatus}
        navigate={state.navigate}
        goToBranch={state.goToBranch}
        setSkipWelcome={state.setSkipWelcome}
        onResetPayment={state.resetPaymentState}
        paymentMade={state.paymentMade}
        onResetRewards={state.resetRewardsState}
        totalRedeemed={state.totalRedeemed}
        onSimulateFirstPurchase={state.simulateFirstPurchase}
        purchaseSimulated={state.purchaseSimulated}
        onResetPurchaseSimulation={state.resetPurchaseSimulation}
        onSwitchLanguage={() => state.setLanguage(state.language === 'en' ? 'fr' : 'en')}
        language={state.language}
        approvalOutcome={state.approvalOutcome}
        setApprovalOutcome={state.setApprovalOutcome}
        setPendingEmail={state.setPendingEmail}
        notificationNudgeDismissed={state.notificationNudgeDismissed}
        setNotificationNudgeDismissed={state.setNotificationNudgeDismissed}
      />
    </div>
  );
}

export default App;
