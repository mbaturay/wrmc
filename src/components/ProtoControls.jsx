import { useState, useEffect, useRef } from 'react';

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

// ─── Shared controls content ──────────────────────────
export function ProtoControlsContent({
  onResetOnboarding,
  userJourney, onSwitchUserJourney,
  setScreen, setPath, setCardStatus, navigate, goToBranch,
  setSkipWelcome,
  onResetPayment, paymentMade,
  onResetRewards, totalRedeemed,
  onSimulateFirstPurchase, purchaseSimulated, onResetPurchaseSimulation,
  onSwitchLanguage, language,
  approvalOutcome, setApprovalOutcome, setPendingEmail,
  notificationNudgeDismissed, setNotificationNudgeDismissed,
  onUniversalBack, navHistoryLen,
  onResetNudges,
  resetToPath,
  onDone,
}) {
  const done = onDone || (() => {});
  const hasHistory = (navHistoryLen || 0) > 0;

  return (
    <>
      {/* ── Universal back ── */}
      <button
        style={{
          ...btnStyle,
          textAlign: 'center',
          fontWeight: 600,
          opacity: hasHistory ? 1 : 0.4,
          cursor: hasHistory ? 'pointer' : 'default',
          marginBottom: 0,
        }}
        disabled={!hasHistory}
        onClick={() => { if (onUniversalBack) { onUniversalBack(); done(); } }}
      >
        ← Go back one step
        {!hasHistory && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>Already at start</div>
        )}
      </button>
      <div style={{ borderBottom: '1px solid var(--border)', margin: '12px 0 2px' }} />

      {/* ── Onboarding paths ── */}
      <div style={labelStyle}>User Journeys</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button style={btnStyle} onClick={() => { onResetOnboarding(); done(); }}>
          <strong>Path A — Apply for a card</strong>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Welcome screen → Create account → Apply</div>
        </button>

        <button style={btnStyle} onClick={() => resetToPath(() => { setSkipWelcome(true); setScreen('onboarding'); setPath('just_approved'); done(); })}>
          <strong>Path B — Just approved in-store</strong>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Language → scan paper TSP barcode → home</div>
        </button>

        <button style={btnStyle} onClick={() => resetToPath(() => { setCardStatus('virtual_only'); navigate('home'); done(); })}>
          <strong>Path C — Card arrived in mail</strong>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Home banner + bell notification appear</div>
        </button>

        <button style={btnStyle} onClick={() => resetToPath(() => { setScreen('main'); setCardStatus('virtual_only'); navigate('main', 'activateCall'); done(); })}>
          <strong>Path C — Activate from welcome</strong>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Jumps directly to activation flow in app</div>
        </button>

        <button style={btnStyle} onClick={() => resetToPath(() => { setSkipWelcome(true); setScreen('onboarding'); setPath('have_card'); done(); })}>
          <strong>Path D — Already have a card</strong>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Activated by phone · first time in app</div>
        </button>

        <div style={{ borderBottom: '1px solid var(--border)', margin: '4px 0' }} />

        <button style={btnStyle} onClick={() => {
          if (setApprovalOutcome) setApprovalOutcome('pending');
          if (setPendingEmail) setPendingEmail('sarah@example.com');
          setSkipWelcome(true); setScreen('onboarding'); setPath('digital_apply');
          setTimeout(() => goToBranch('A_pending'), 50); done();
        }}>
          <strong>Pending state (income &lt; $30K)</strong>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Application under review · no account access</div>
        </button>

        <button style={btnStyle} onClick={() => resetToPath(() => { onSwitchUserJourney('existing_user'); setCardStatus('active'); setSkipWelcome(true); setScreen('onboarding'); setPath('sign_in'); done(); })}>
          <strong>Path E — Returning cardholder</strong>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sign in → $55 rewards · $1,284 balance</div>
        </button>

        <button style={btnStyle} onClick={() => resetToPath(() => { onSwitchUserJourney('existing_user'); setCardStatus('active'); setSkipWelcome(true); setScreen('onboarding'); setPath('session_expired'); done(); })}>
          <strong>Path G — Session expired</strong>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Re-auth screen · email pre-filled</div>
        </button>

        <button style={btnStyle} onClick={() => resetToPath(() => { onSwitchUserJourney('existing_user'); setCardStatus('active'); setSkipWelcome(true); setScreen('onboarding'); setPath('sign_in'); setTimeout(() => goToBranch('H_forgot_pw'), 50); done(); })}>
          <strong>Path H — Forgot password</strong>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Password reset · or simulate lockout (5 fails)</div>
        </button>
      </div>

      {/* ── User data ── */}
      <div style={labelStyle}>User Data</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button style={btnStyle} onClick={() => onSwitchUserJourney(userJourney === 'new_user' ? 'existing_user' : 'new_user')}>
          <strong>Switch: {userJourney === 'new_user' ? 'New → Existing' : 'Existing → New'}</strong>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Currently: {userJourney === 'new_user' ? 'New user ($0 data)' : 'Existing user ($55 rewards)'}
          </div>
        </button>

        <button style={btnStyle} onClick={() => { onResetPayment(); done(); }}>
          <strong>Reset payment state</strong>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {paymentMade ? 'Payment made — tap to reset balances' : 'No payment made yet'}
          </div>
        </button>

        <button style={btnStyle} onClick={() => { onResetRewards(); done(); }}>
          <strong>Reset rewards state</strong>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {totalRedeemed > 0 ? `$${totalRedeemed.toFixed(2)} redeemed — tap to restore` : 'No redemptions simulated'}
          </div>
        </button>

        <button style={{ ...btnStyle, opacity: purchaseSimulated ? 0.5 : 1, cursor: purchaseSimulated ? 'default' : 'pointer' }} onClick={purchaseSimulated ? undefined : () => { onSimulateFirstPurchase(); done(); }}>
          <strong>Simulate first purchase</strong>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {purchaseSimulated ? 'Already simulated' : 'Adds Walmart transaction + rewards'}
          </div>
        </button>

        <button style={btnStyle} onClick={() => { onResetPurchaseSimulation(); done(); }}>
          <strong>Reset purchase simulation</strong>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Clear simulated transaction</div>
        </button>

        <button style={btnStyle} onClick={() => { onSwitchLanguage(); done(); }}>
          <strong>Switch language ({language === 'en' ? 'EN → FR' : 'FR → EN'})</strong>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Toggle English / French</div>
        </button>

        {setNotificationNudgeDismissed && (
          <button style={btnStyle} onClick={() => { setNotificationNudgeDismissed(false); done(); }}>
            <strong>Reset notification nudge</strong>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {notificationNudgeDismissed ? 'Dismissed — tap to restore' : 'Nudge is visible'}
            </div>
          </button>
        )}

        {onResetNudges && (
          <button style={btnStyle} onClick={() => { onResetNudges(); done(); }}>
            <strong>Reset all notifications</strong>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Restores bell badge · clears all dismissed nudges</div>
          </button>
        )}

        {setApprovalOutcome && approvalOutcome === 'pending' && (
          <button style={btnStyle} onClick={() => { setApprovalOutcome('approved_1000'); done(); }}>
            <strong>Clear pending state → approved</strong>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Switch from pending to approved home</div>
          </button>
        )}
      </div>

      {/* ── Demo narratives ── */}
      <DemoNarratives />
    </>
  );
}

// ─── Demo narratives (collapsible) ────────────────────
function DemoNarratives() {
  const [expanded, setExpanded] = useState(false);

  const cardStyle = {
    padding: 14, background: '#FAFAFA', borderRadius: 10,
    border: '1px solid var(--border)', fontSize: 13, lineHeight: 1.6,
  };

  return (
    <div style={{ marginTop: 12 }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, color: 'var(--text-muted)',
        }}
      >
        <span>Demo narratives</span>
        <span style={{ fontSize: 11 }}>{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>For demo use only</div>
          <div style={cardStyle}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>Act 1 + 2 — New cardholder journey</div>
            <div style={{ color: 'var(--text-secondary)' }}>
              <strong>Use:</strong> Path A (apply) or Path B (just approved)<br />
              <strong>Then:</strong> Simulate first purchase<br />
              <strong>Shows:</strong> Onboarding → home → first rewards earned → $25 welcome bonus
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>Act 3 — Activate physical card</div>
            <div style={{ color: 'var(--text-secondary)' }}>
              <strong>Use:</strong> Path C (card arrived in mail)<br />
              <strong>Shows:</strong> Home banner + bell → tap to activate → call screen → success
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text-primary)' }}>Existing cardholder journey</div>
            <div style={{ color: 'var(--text-secondary)' }}>
              <strong>Use:</strong> Path E (returning cardholder)<br />
              <strong>Shows:</strong> Sign in → $55 rewards · $1,284 balance → payment → redemption
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Overlay panel (Cmd+P) ────────────────────────────
export function ProtoControlsOverlay(props) {
  const { show, setShow } = props;
  const panelRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    if (!show) return;
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [show, setShow]);

  if (!show) return null;

  return (
    <div ref={panelRef} className="proto-panel" role="dialog" aria-label="Prototype Controls">
      <div className="proto-panel-scroll">
        <h3 style={{ marginBottom: 4 }}>Prototype Controls</h3>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
          ⌘P / Ctrl+P — toggle this panel<br />
          ⌘B / Ctrl+B — go back one screen<br />
          Mobile: triple-tap spark to open
        </div>
        <ProtoControlsContent {...props} onDone={() => setShow(false)} />
      </div>
      <div className="proto-panel-footer">
        <button
          style={{ ...btnStyle, textAlign: 'center', fontWeight: 600, margin: 0 }}
          onClick={() => setShow(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
