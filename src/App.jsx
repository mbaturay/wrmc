import { useAppState } from './hooks/useAppState';
import { Header, BottomNav } from './components/Layout';
import { Celebration } from './components/Celebration';
import { ProtoControls } from './components/ProtoControls';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Activity, TransactionDetail, HowRewardsWork } from './screens/Activity';
import { Rewards } from './screens/Rewards';
import { Account, FreezeCard, MakePayment, Statements, Settings, Profile, About } from './screens/Account';

function App() {
  const state = useAppState();

  // Onboarding
  if (state.screen === 'onboarding') {
    return (
      <Onboarding
        onboardingData={state.onboardingData}
        setOnboardingData={state.setOnboardingData}
        onComplete={() => state.navigate('home')}
        onCompleteNewUser={() => state.completeOnboarding(true)}
      />
    );
  }

  // Sub-screens with headers
  const subScreens = {
    account: {
      title: 'Account',
      render: () => <Account navigate={state.navigate} frozen={state.frozen} />,
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
      render: () => <MakePayment onBack={state.goBack} paymentMade={state.paymentMade} setPaymentMade={state.setPaymentMade} />,
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
  };

  const tabTitles = { home: 'Home', rewards: 'Rewards', activity: 'Activity', settings: 'Settings' };
  const currentSub = state.subScreen && subScreens[state.subScreen];

  return (
    <div className="app-shell">
      <Celebration show={state.showCelebration} />

      <Header
        title={currentSub ? currentSub.title : tabTitles[state.tab]}
        onBack={currentSub ? state.goBack : null}
        tab={state.tab}
        onAvatarTap={() => state.navigate('main', 'account')}
      />

      {currentSub ? (
        currentSub.render()
      ) : (
        <>
          {state.tab === 'home' && (
            <Home
              thisMonth={state.thisMonth}
              lifetime={state.lifetime}
              rewardsAvailable={state.rewardsAvailable}
              navigate={state.navigate}
              isNewUser={state.isNewUser}
            />
          )}
          {state.tab === 'rewards' && (
            <Rewards
              rewardsAvailable={state.rewardsAvailable}
              redemptions={state.redemptions}
            />
          )}
          {state.tab === 'activity' && (
            <Activity
              isNewUser={state.isNewUser}
              prefGV={state.prefGV}
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
            />
          )}
        </>
      )}

      {!currentSub && (
        <BottomNav active={state.tab} onNavigate={(t) => state.navigate(t)} />
      )}

      <ProtoControls
        show={state.showProto}
        setShow={state.setShowProto}
        onSimulateReward={() => state.simulateReward()}
        onSimulateMilestone={state.simulateMilestone}
        onSimulateRedemption={state.simulateRedemption}
        onToggleRewards={state.toggleRewardsAvailable}
        onResetOnboarding={() => { state.setScreen('onboarding'); }}
        isNewUser={state.isNewUser}
        setIsNewUser={state.setIsNewUser}
      />
    </div>
  );
}

export default App;
