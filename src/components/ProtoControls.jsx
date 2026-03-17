export function ProtoControls({ show, setShow, onResetOnboarding, isNewUser, userJourney, onSwitchUserJourney }) {
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
          <h3>Prototype Controls</h3>
          <button className="proto-btn" onClick={onResetOnboarding}>
            ↺ Replay onboarding
          </button>
          <button className="proto-btn" onClick={() => onSwitchUserJourney(userJourney === 'new_user' ? 'existing_user' : 'new_user')}>
            {userJourney === 'new_user' ? '◉ Switch to existing user' : '○ Switch to new user'}
          </button>
          <button className="proto-btn" onClick={() => setShow(false)}>
            Close
          </button>
          <div style={{
            marginTop: 12, paddingTop: 12,
            borderTop: '1px solid var(--border)',
            fontSize: 11, color: 'var(--text-muted)',
            lineHeight: 1.6,
          }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Onboarding triggers</div>
            <div>Card not activated: enter <strong>0000</strong></div>
            <div style={{ paddingLeft: 8, fontSize: 10 }}>→ "I've activated" → confirm → 1st check fails → "Try again" → succeeds → OTP</div>
            <div>Card not found: enter any other number</div>
            <div>Happy path: starts with <strong>4829</strong> (pre-filled)</div>
            <div>OTP code: <strong>123456</strong></div>
            <div>Wrong password: use <strong>wrong123</strong></div>
          </div>
        </div>
      )}
    </>
  );
}
