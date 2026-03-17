import { storage } from '../utils/storage';

export function ProtoControls({
  show, setShow,
  onResetOnboarding,
  isNewUser, userJourney, onSwitchUserJourney,
  setScreen, setPath, setCardStatus, navigate, goToBranch,
  setSkipWelcome,
  onResetPayment, paymentMade,
}) {
  const btnStyle = {
    width: '100%', textAlign: 'left', padding: '10px 12px',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 8, fontSize: 13, cursor: 'pointer',
    color: 'var(--text-primary)', lineHeight: 1.4,
  };

  const labelStyle = {
    fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginTop: 14, marginBottom: 6,
  };

  return (
    <>
      <button
        className="proto-toggle"
        onClick={() => setShow(!show)}
        aria-label="Prototype controls"
        title="Prototype Controls"
      >
        ⚡
      </button>
      {show && (
        <div className="proto-panel" role="dialog" aria-label="Prototype Controls">
          <h3 style={{ marginBottom: 4 }}>Prototype Controls</h3>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
            Workshop use only
          </div>

          {/* ── Onboarding paths ── */}
          <div style={labelStyle}>Onboarding Paths</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button style={btnStyle} onClick={() => {
              onResetOnboarding();
              setShow(false);
            }}>
              <strong>Fresh install (Path A)</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Clear all → Welcome screen</div>
            </button>

            <button style={btnStyle} onClick={() => {
              setSkipWelcome(true);
              setScreen('onboarding');
              setPath('just_approved');
              setShow(false);
            }}>
              <strong>Just approved in-store (Path B)</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Starts at language → B_verify</div>
            </button>

            <button style={btnStyle} onClick={() => {
              setCardStatus('virtual_only');
              navigate('home');
              setShow(false);
            }}>
              <strong>Simulate card arrival (Path C)</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Home banner appears</div>
            </button>

            <button style={btnStyle} onClick={() => {
              setSkipWelcome(true);
              setScreen('onboarding');
              setPath('have_card');
              setShow(false);
            }}>
              <strong>Already have a card (Path D)</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Starts at language → D_verify</div>
            </button>

            <button style={btnStyle} onClick={() => {
              setSkipWelcome(true);
              setScreen('onboarding');
              setPath('sign_in');
              setShow(false);
            }}>
              <strong>Returning cardholder (Path E)</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sign in screen</div>
            </button>

            <button style={btnStyle} onClick={() => {
              setSkipWelcome(true);
              setScreen('onboarding');
              setPath('session_expired');
              setShow(false);
            }}>
              <strong>Session expired (Path G)</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Re-auth screen</div>
            </button>

            <button style={btnStyle} onClick={() => {
              setSkipWelcome(true);
              setScreen('onboarding');
              setPath('sign_in');
              setTimeout(() => goToBranch('H_forgot_pw'), 50);
              setShow(false);
            }}>
              <strong>Forgot password (Path H)</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Password reset flow</div>
            </button>
          </div>

          {/* ── User data ── */}
          <div style={labelStyle}>User Data</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button style={btnStyle} onClick={() => {
              onSwitchUserJourney(userJourney === 'new_user' ? 'existing_user' : 'new_user');
            }}>
              <strong>Switch: {userJourney === 'new_user' ? 'New → Existing' : 'Existing → New'}</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Currently: {userJourney === 'new_user' ? 'New user ($0 data)' : 'Existing user ($55 rewards)'}
              </div>
            </button>

            <button style={btnStyle} onClick={() => {
              onResetPayment();
              setShow(false);
            }}>
              <strong>Reset payment state</strong>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {paymentMade ? 'Payment made — tap to reset balances' : 'No payment made yet'}
              </div>
            </button>
          </div>

          {/* ── Close ── */}
          <button
            style={{ ...btnStyle, marginTop: 14, textAlign: 'center', fontWeight: 600 }}
            onClick={() => setShow(false)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
