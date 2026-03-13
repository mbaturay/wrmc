import { useState } from 'react';

const STEPS = [
  { icon: '◇', title: 'Welcome to WRMC', desc: 'Your Walmart Rewards Mastercard companion. See your rewards, shop smarter, and save more.' },
  { icon: '↔', title: 'Connect Your Card', desc: 'We\'ll verify your card ending in •••• 4829 to get started.' },
  { icon: '⚙', title: 'Permissions', desc: 'Optional: Enable notifications to see rewards in real time and never miss a milestone.' },
  { type: 'prefs', icon: '✦', title: 'Tell Us About You', desc: 'Help us personalize your experience.' },
  { icon: '✓', title: 'Your Savings Hub Is Ready', desc: 'Start earning, tracking, and redeeming your Walmart rewards today.' },
];

const PREFS = [
  { id: 'weekly', label: 'I shop at Walmart weekly' },
  { id: 'saving', label: 'I care most about saving money' },
  { id: 'gv', label: 'Show me Great Value nudges' },
];

export function Onboarding({ step, setStep, prefs, setPrefs, onComplete }) {
  const [verifying, setVerifying] = useState(false);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function handleNext() {
    if (step === 1) {
      setVerifying(true);
      setTimeout(() => { setVerifying(false); setStep(step + 1); }, 1200);
      return;
    }
    if (isLast) { onComplete(); return; }
    setStep(step + 1);
  }

  function togglePref(id) {
    setPrefs(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  }

  return (
    <div className="onboarding-screen">
      <div className="step-dots" role="group" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
        {STEPS.map((_, i) => (
          <div key={i} className={`step-dot ${i === step ? 'active' : ''}`} />
        ))}
      </div>
      <div className="onboarding-icon">{current.icon}</div>
      <h1>{current.title}</h1>
      <p>{current.desc}</p>

      {step === 1 && verifying && (
        <div style={{ padding: 16, color: '#666', fontSize: 14 }}>Verifying card...</div>
      )}

      {current.type === 'prefs' && (
        <div style={{ width: '100%', maxWidth: 300, marginBottom: 24 }}>
          {PREFS.map(p => (
            <button
              key={p.id}
              className={`pref-option ${prefs.includes(p.id) ? 'selected' : ''}`}
              onClick={() => togglePref(p.id)}
              role="checkbox"
              aria-checked={prefs.includes(p.id)}
            >
              <span className="pref-check">{prefs.includes(p.id) ? '✓' : ''}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      )}

      {!verifying && (
        <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="btn btn-primary" onClick={handleNext}>
            {isLast ? 'Get Started' : step === 1 ? 'Verify Card' : step === 2 ? 'Enable Notifications' : 'Continue'}
          </button>
          {step === 2 && (
            <button className="btn btn-ghost" onClick={() => setStep(step + 1)}>Skip for now</button>
          )}
        </div>
      )}
    </div>
  );
}
