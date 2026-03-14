import { useState } from 'react';

// Simple inline SVG pictograms — black/white, 1-stroke style
const PICTOGRAMS = {
  // Step 0: Welcome — wallet with spark
  welcome: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="16" y="36" width="72" height="52" rx="6" stroke="black" strokeWidth="2.5" fill="none" />
      <rect x="16" y="36" width="72" height="16" rx="0" stroke="none" fill="#e8e8e8" />
      <circle cx="72" cy="62" r="5" fill="black" />
      <line x1="96" y1="20" x2="96" y2="34" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <line x1="89" y1="27" x2="103" y2="27" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <line x1="104" y1="36" x2="104" y2="46" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="99" y1="41" x2="109" y2="41" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Step 1: Connect card — credit card with link/check
  card: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="20" y="32" width="80" height="52" rx="6" stroke="black" strokeWidth="2.5" fill="none" />
      <rect x="20" y="44" width="80" height="10" fill="#e8e8e8" />
      <rect x="30" y="64" width="24" height="4" rx="2" fill="#ccc" />
      <rect x="30" y="72" width="16" height="4" rx="2" fill="#ccc" />
      <circle cx="88" cy="90" r="14" stroke="black" strokeWidth="2.5" fill="white" />
      <polyline points="81,90 86,95 96,85" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  // Step 2: Permissions — bell with toggle
  permissions: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M60 24C46 24 36 34 36 48V68L28 80H92L84 68V48C84 34 74 24 60 24Z" stroke="black" strokeWidth="2.5" fill="none" />
      <line x1="52" y1="80" x2="52" y2="86" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="68" y1="80" x2="68" y2="86" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M52 86C52 90.4 55.6 94 60 94C64.4 94 68 90.4 68 86" stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="82" cy="32" r="8" fill="#e8e8e8" stroke="black" strokeWidth="2" />
      <circle cx="82" cy="32" r="3" fill="black" />
    </svg>
  ),
  // Step 3: Preferences — sliders/controls
  prefs: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="24" y1="40" x2="96" y2="40" stroke="#ddd" strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="60" x2="96" y2="60" stroke="#ddd" strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="80" x2="96" y2="80" stroke="#ddd" strokeWidth="3" strokeLinecap="round" />
      <circle cx="44" cy="40" r="8" fill="white" stroke="black" strokeWidth="2.5" />
      <circle cx="72" cy="60" r="8" fill="black" stroke="black" strokeWidth="2.5" />
      <circle cx="56" cy="80" r="8" fill="white" stroke="black" strokeWidth="2.5" />
    </svg>
  ),
  // Step 4: Ready — rocket / launch
  ready: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M60 20C60 20 44 40 44 68C44 80 50 90 60 96C70 90 76 80 76 68C76 40 60 20 60 20Z" stroke="black" strokeWidth="2.5" fill="none" />
      <circle cx="60" cy="58" r="8" fill="#e8e8e8" stroke="black" strokeWidth="2" />
      <path d="M44 72C36 74 30 80 28 88L44 80" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M76 72C84 74 90 80 92 88L76 80" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="56" y1="96" x2="54" y2="106" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="96" x2="60" y2="108" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <line x1="64" y1="96" x2="66" y2="106" stroke="black" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

const STEPS = [
  { pictogram: 'welcome', logo: true, title: 'Welcome to WRMC', desc: 'Your Walmart Rewards Mastercard companion. See your rewards, shop smarter, and save more.' },
  { pictogram: 'card', title: 'Connect Your Card', desc: 'We\'ll verify your card ending in •••• 4829 to get started.' },
  { pictogram: 'permissions', title: 'Permissions', desc: 'Optional: Enable notifications to see rewards in real time and never miss a milestone.' },
  { pictogram: 'prefs', type: 'prefs', title: 'Tell Us About You', desc: 'Help us personalize your experience.' },
  { pictogram: 'ready', logo: true, title: 'Your Savings Hub Is Ready', desc: 'Track your Reward Dollars, manage your card, and pay your bill — all in one place.' },
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
      {/* TOP: Pictogram — large, occupying upper portion */}
      <div className="ob-pictogram">
        {PICTOGRAMS[current.pictogram]}
      </div>

      {/* BOTTOM: All content clustered together above the dots */}
      <div className="ob-content">
        {current.logo && (
          <img src="/logo.svg" alt="Walmart Rewards Mastercard" className="onboarding-logo" />
        )}
        <h1>{current.title}</h1>
        <p>{current.desc}</p>

        {step === 1 && verifying && (
          <div style={{ padding: 16, color: '#666', fontSize: 14 }}>Verifying card...</div>
        )}

        {current.type === 'prefs' && (
          <div style={{ width: '100%', maxWidth: 320, marginBottom: 20 }}>
            {PREFS.map(p => (
              <button
                key={p.id}
                className={`pref-option ${prefs.includes(p.id) ? 'selected' : ''}`}
                onClick={() => togglePref(p.id)}
                role="checkbox"
                aria-checked={prefs.includes(p.id)}
              >
                <span className="pref-check">{prefs.includes(p.id) ? '✓' : ''}</span>
                <span style={{ textAlign: 'left' }}>{p.label}</span>
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

        {/* Progress dots */}
        <div className="ob-dots" role="group" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
          {STEPS.map((_, i) => (
            <div key={i} className={`step-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
