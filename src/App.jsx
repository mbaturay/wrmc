import { useAppState } from './hooks/useAppState';
import { Header, BottomNav } from './components/Layout';
import { Celebration } from './components/Celebration';
import { ProtoControls } from './components/ProtoControls';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Activity, TransactionDetail, HowRewardsWork } from './screens/Activity';
import { Rewards } from './screens/Rewards';
import { Account, FreezeCard, MakePayment, Statements, Settings, Profile } from './screens/Account';

function App() {
  const state = useAppState();

  // Onboarding
  if (state.screen === 'onboarding') {
    return (
      <Onboarding
        step={state.onboardingStep}
        setStep={state.setOnboardingStep}
        prefs={state.prefs}
        setPrefs={state.setPrefs}
        onComplete={() => state.navigate('home')}
      />
    );
  }

  // Sub-screens with headers
  const subScreens = {
    txDetail: {
      title: 'Transaction',
      render: () => (
        <TransactionDetail
          tx={state.selectedTx}
          onBack={state.goBack}
          onHowRewards={() => state.navigate('main', 'howRewards')}
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
    settings: {
      title: 'Settings',
      render: () => <Settings />,
    },
    profile: {
      title: 'Profile',
      render: () => <Profile />,
    },
  };

  const tabTitles = { home: 'Home', rewards: 'Rewards', activity: 'Activity', account: 'Account' };
  const currentSub = state.subScreen && subScreens[state.subScreen];

  return (
    <div className="app-shell">
      <Celebration show={state.showCelebration} />

      <Header
        title={currentSub ? currentSub.title : tabTitles[state.tab]}
        onBack={currentSub ? state.goBack : null}
        tab={state.tab}
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
              onSimulateReward={() => state.simulateReward(3.00)}
              onSimulateMilestone={state.simulateMilestone}
              onToggleRewards={state.toggleRewardsAvailable}
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
              onSelectTx={(tx) => {
                state.setSelectedTx(tx);
                state.navigate('main', 'txDetail');
              }}
            />
          )}
          {state.tab === 'account' && (
            <Account
              navigate={state.navigate}
              frozen={state.frozen}
              setFrozen={state.setFrozen}
            />
          )}
        </>
      )}

      {!currentSub && (
        <BottomNav active={state.tab} onNavigate={(t) => state.navigate(t)} />
      )}

      {/* Global proto controls — hidden on Home (Home has its own) */}
      {state.tab !== 'home' && (
        <ProtoControls
          show={state.showProto}
          setShow={state.setShowProto}
          onSimulateReward={state.simulateReward}
          onSimulateMilestone={state.simulateMilestone}
          onSimulateRedemption={state.simulateRedemption}
          onResetOnboarding={() => { state.setScreen('onboarding'); }}
        />
      )}
    </div>
  );
}

export default App;
