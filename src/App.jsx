import { useAppState } from './hooks/useAppState';
import { Header, BottomNav } from './components/Layout';
import { Celebration } from './components/Celebration';
import { ProtoControls } from './components/ProtoControls';
import { OnboardingFlow } from './screens/OnboardingFlow';
import { CardArrival, CardActivate, ActivationSuccess } from './screens/onboarding/Stage5';
import { Home } from './screens/Home';
import { Activity, TransactionDetail, HowRewardsWork } from './screens/Activity';
import { Rewards } from './screens/Rewards';
import { Account, FreezeCard, MakePayment, Statements, Settings, Profile, About } from './screens/Account';

function App() {
  const state = useAppState();

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
      render: () => <MakePayment onBack={state.goBack} paymentMade={state.paymentMade} setPaymentMade={state.setPaymentMade} profile={state.profile} />,
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
    cardActivate: {
      title: 'Activate Your Card',
      render: () => <CardActivate onNext={() => { state.activateCard(); state.navigate('main', 'activationSuccess'); }} onBack={state.goBack} lang={state.language} />,
    },
    activationSuccess: {
      title: '',
      render: () => <ActivationSuccess onNext={() => { state.goBack(); }} lang={state.language} />,
    },
  };

  const tabTitles = { home: 'Home', rewards: 'Rewards', activity: 'Activity', settings: 'Settings' };
  const currentSub = state.subScreen && subScreens[state.subScreen];

  return (
    <div className="app-shell">
      <Celebration show={state.showCelebration} />

      <Header
        title={state.screen === 'onboarding' ? '' : (currentSub ? currentSub.title : tabTitles[state.tab])}
        onBack={state.screen === 'onboarding' ? null : (currentSub ? state.goBack : null)}
        tab={state.screen === 'onboarding' ? 'home' : state.tab}
        onAvatarTap={() => state.navigate('main', 'account')}
      />

      {state.screen === 'onboarding' ? (
        <OnboardingFlow
          onComplete={(isNewUser) => state.completeOnboarding(isNewUser)}
          language={state.language}
          setLanguage={state.setLanguage}
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
          {state.tab === 'home' && (
            <Home
              thisMonth={state.thisMonth}
              lifetime={state.lifetime}
              rewardsAvailable={state.rewardsAvailable}
              navigate={state.navigate}
              isNewUser={state.isNewUser}
              frozen={state.frozen}
              profile={state.profile}
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
              prefGV={state.prefGV}
              setPrefGV={state.setPrefGV}
              onResetOnboarding={state.resetOnboarding}
              onSimulateCardArrival={state.simulateCardArrival}
              onSwitchLanguage={() => state.setLanguage(state.language === 'en' ? 'fr' : 'en')}
              language={state.language}
              userJourney={state.userJourney}
              onSwitchUserJourney={state.switchUserJourney}
            />
          )}
        </>
      )}

      <BottomNav active={state.tab} onNavigate={state.screen === 'onboarding' ? () => {} : (t) => state.navigate(t)} />

      {state.showCardArrival && (
        <CardArrival
          onNext={() => { state.dismissCardArrival(); state.navigate('main', 'cardActivate'); }}
          onDismiss={state.dismissCardArrival}
          lang={state.language}
        />
      )}

      <ProtoControls
        show={state.showProto}
        setShow={state.setShowProto}
        onResetOnboarding={() => { state.setScreen('onboarding'); }}
        isNewUser={state.isNewUser}
        userJourney={state.userJourney}
        onSwitchUserJourney={state.switchUserJourney}
      />
    </div>
  );
}

export default App;
