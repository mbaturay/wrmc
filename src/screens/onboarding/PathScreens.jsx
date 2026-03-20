import { useState, useEffect, useRef } from 'react';
import { WRMCCard } from '../../components/WRMCCard';

// ─── i18n ───────────────────────────────────────────────
const i18n = {
  en: {
    back: 'Back',
    // B_verify (scan)
    bScanTitle: 'Scan your Shopping Pass',
    bScanBody: 'Point your camera at the barcode on your Temporary Shopping Pass \u2014 the paper you received when you were approved.',
    bScanCta: 'Scan barcode',
    bScanVerified: 'Pass verified',
    bScanFallback: "Don't have your pass? Verify with your details",
    // B_verify (fallback form)
    last4Label: 'Last 4 digits of your card',
    postalLabel: 'Postal code',
    dobLabel: 'Date of birth',
    findAccount: 'Find my account',
    finding: 'Finding your account...',
    helpLink: 'Having trouble? Call 1-800-XXX-XXXX',
    // B_account_found
    bFoundTitle: 'Welcome.',
    bFoundSub: 'Your Temporary Shopping Pass was issued at the store. Set up your account to manage your card and track rewards.',
    bFoundCta: 'Set up your account',
    bFoundBarcode: 'For Walmart purchases only \u00b7 Valid for 10 days from approval',
    // D_verify
    dVerifyTitle: "Let's connect your card",
    dVerifyBody: 'Enter your card details to access your account.',
    connectCard: 'Connect my card',
    connecting: 'Connecting...',
    // D_already_active
    dActiveTitle: "You're all set.",
    dActiveSub: 'Your card is active and ready to use.',
    dActiveCta: 'Set up your account',
  },
  fr: {
    back: 'Retour',
    bScanTitle: 'Scannez votre pass d\u2019achat',
    bScanBody: 'Pointez votre cam\u00e9ra vers le code-barres de votre pass d\u2019achat temporaire \u2014 le document re\u00e7u lors de votre approbation.',
    bScanCta: 'Scanner le code-barres',
    bScanVerified: 'Pass v\u00e9rifi\u00e9',
    bScanFallback: 'Pas de pass\u00a0? V\u00e9rifiez avec vos informations',
    last4Label: 'Les 4 derniers chiffres de votre carte',
    postalLabel: 'Code postal',
    dobLabel: 'Date de naissance',
    findAccount: 'Trouver mon compte',
    finding: 'Recherche de votre compte...',
    helpLink: 'Des difficultés\u00a0? Appelez le 1-800-XXX-XXXX',
    bFoundTitle: 'Bienvenue.',
    bFoundSub: 'Votre pass d\u2019achat temporaire a \u00e9t\u00e9 \u00e9mis en magasin. Configurez votre compte pour g\u00e9rer votre carte et suivre vos r\u00e9compenses.',
    bFoundCta: 'Configurer votre compte',
    bFoundBarcode: 'Pour les achats Walmart seulement \u00b7 Valide 10 jours \u00e0 compter de l\u2019approbation',
    dVerifyTitle: 'Connectons votre carte',
    dVerifyBody: 'Entrez les détails de votre carte pour accéder à votre compte.',
    connectCard: 'Connecter ma carte',
    connecting: 'Connexion...',
    dActiveTitle: 'Tout est prêt.',
    dActiveSub: 'Votre carte est active et prête à utiliser.',
    dActiveCta: 'Configurer votre compte',
  },
};

// ─── Shared Back Button ─────────────────────────────────
function BackBtn({ onClick, lang }) {
  const T = i18n[lang] || i18n.en;
  return (
    <button
      onClick={onClick}
      style={{
        alignSelf: 'flex-start', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 4,
        fontSize: 13, color: 'var(--text-secondary)',
        background: 'none', border: 'none', cursor: 'pointer',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {T.back}
    </button>
  );
}

// ─── Verification form (shared by B_verify and D_verify) ─
function VerifyForm({ title, body, ctaText, loadingText, helpText, onSubmit, onBack, lang }) {
  const T = i18n[lang] || i18n.en;
  const [form, setForm] = useState({ last4: '', postal: 'M5V 1J2', dob: '1990-01-15' });
  const [loading, setLoading] = useState(false);

  const allFilled = form.last4.length === 4 && form.postal.trim() !== '' && form.dob.trim() !== '';

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => onSubmit(), 1000);
  };

  return (
    <div className="ob-screen">
      <BackBtn onClick={onBack} lang={lang} />

      <h1 className="ob-title" style={{ marginBottom: 8 }}>{title}</h1>
      <p className="ob-body" style={{ marginBottom: 24 }}>{body}</p>

      <div style={{ marginBottom: 14 }}>
        <label
          htmlFor="verify-last4"
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}
        >
          {T.last4Label}
        </label>
        <input
          id="verify-last4"
          type="text"
          inputMode="numeric"
          maxLength={4}
          className="input"
          value={form.last4}
          onChange={(e) => updateField('last4', e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="0000"
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label
          htmlFor="verify-postal"
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}
        >
          {T.postalLabel}
        </label>
        <input
          id="verify-postal"
          type="text"
          className="input"
          value={form.postal}
          onChange={(e) => updateField('postal', e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label
          htmlFor="verify-dob"
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}
        >
          {T.dobLabel}
        </label>
        <input
          id="verify-dob"
          type="text"
          className="input"
          value={form.dob}
          onChange={(e) => updateField('dob', e.target.value)}
          placeholder="YYYY-MM-DD"
        />
      </div>

      <button
        className="btn btn-primary"
        disabled={!allFilled || loading}
        onClick={handleSubmit}
        style={{ marginTop: 16, opacity: (!allFilled || loading) ? 0.5 : 1 }}
      >
        {loading ? loadingText : ctaText}
      </button>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <a
          href="tel:1-800-XXX-XXXX"
          style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}
        >
          {helpText}
        </a>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// B_verify — Barcode scan + fallback form
// ═══════════════════════════════════════════════════════
export function BVerify({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;
  // 'idle' | 'scanning' | 'verified'
  const [scanState, setScanState] = useState('idle');
  const [showFallback, setShowFallback] = useState(false);
  const [progress, setProgress] = useState(0);
  const autoAdvance = useRef(null);

  // Scan animation — 2s progress bar
  useEffect(() => {
    if (scanState !== 'scanning') return;
    setProgress(0);
    const start = Date.now();
    const duration = 2000;
    let raf;
    const tick = () => {
      const pct = Math.min((Date.now() - start) / duration, 1);
      setProgress(pct * 100);
      if (pct < 1) { raf = requestAnimationFrame(tick); }
      else { setScanState('verified'); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scanState]);

  // Auto-advance after verified
  useEffect(() => {
    if (scanState !== 'verified') return;
    autoAdvance.current = setTimeout(() => onNext(), 500);
    return () => clearTimeout(autoAdvance.current);
  }, [scanState, onNext]);

  // Viewfinder content
  const renderFrame = () => {
    if (scanState === 'verified') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" fill="#E8F5E9" stroke="#1A7F3C" strokeWidth="2"/>
            <path d="M15 24L21 30L33 18" stroke="#1A7F3C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1A7F3C' }}>{T.bScanVerified}</span>
        </div>
      );
    }
    if (scanState === 'scanning') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '80%' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ animation: 'viewfinder-pulse 1s ease-in-out infinite' }}>
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="var(--accent)" strokeWidth="1.5"/>
            <path d="M6 10H18M6 14H18M6 18H14" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
          </svg>
          <div style={{ width: '100%', height: 4, background: '#E5E5E5', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', borderRadius: 2, transition: 'width 50ms linear' }} />
          </div>
        </div>
      );
    }
    // idle — barcode icon placeholder
    return (
      <svg width="64" height="48" viewBox="0 0 64 48" fill="none" aria-hidden="true" style={{ opacity: 0.35 }}>
        <rect x="4" y="4" width="4" height="40" fill="currentColor"/>
        <rect x="12" y="4" width="2" height="40" fill="currentColor"/>
        <rect x="18" y="4" width="6" height="40" fill="currentColor"/>
        <rect x="28" y="4" width="2" height="40" fill="currentColor"/>
        <rect x="34" y="4" width="4" height="40" fill="currentColor"/>
        <rect x="42" y="4" width="2" height="40" fill="currentColor"/>
        <rect x="48" y="4" width="6" height="40" fill="currentColor"/>
        <rect x="58" y="4" width="4" height="40" fill="currentColor"/>
      </svg>
    );
  };

  // Step progress data
  const progressSteps = [
    { label: lang === 'fr' ? 'Vérifier le pass' : 'Verify pass' },
    { label: lang === 'fr' ? 'Confirmer tél.' : 'Confirm phone' },
    { label: lang === 'fr' ? 'Créer le compte' : 'Set up account' },
  ];
  const currentProgressStep = 0;

  return (
    <div className="ob-screen">
      <BackBtn onClick={onBack} lang={lang} />

      {/* Step progress indicator */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%', marginBottom: 24 }}>
        {progressSteps.map((step, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', flex: idx < progressSteps.length - 1 ? 1 : undefined }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 600,
                background: idx === currentProgressStep ? 'var(--accent)' : 'transparent',
                color: idx === currentProgressStep ? '#fff' : 'var(--text-muted)',
                border: idx === currentProgressStep ? '2px solid var(--accent)' : '2px solid #D1D5DB',
              }}>
                {idx + 1}
              </div>
              <div style={{
                fontSize: 12, marginTop: 4, textAlign: 'center',
                color: idx === currentProgressStep ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: idx === currentProgressStep ? 600 : 400,
              }}>
                {step.label}
              </div>
            </div>
            {idx < progressSteps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: '#D1D5DB', marginTop: 14, minWidth: 20 }} />
            )}
          </div>
        ))}
      </div>

      <h1 className="ob-title" style={{ marginBottom: 8 }}>{T.bScanTitle}</h1>
      <p className="ob-body" style={{ marginBottom: 24 }}>{T.bScanBody}</p>

      {/* Viewfinder */}
      <div
        className="ob-viewfinder"
        style={{
          width: 280, height: 180, margin: '0 auto 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: scanState === 'verified' ? 'none' : undefined,
          borderColor: scanState === 'verified' ? '#1A7F3C' : undefined,
          borderStyle: scanState === 'verified' ? 'solid' : undefined,
        }}
      >
        {renderFrame()}
      </div>

      {/* Scan CTA + fallback button */}
      {scanState === 'idle' && !showFallback && (
        <>
          <button
            className="btn btn-primary"
            onClick={() => setScanState('scanning')}
          >
            {T.bScanCta}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{lang === 'fr' ? 'ou' : 'or'}</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
          </div>

          <button
            onClick={() => setShowFallback(true)}
            style={{
              width: '100%', height: 44, background: 'transparent',
              border: '1.5px solid var(--border)', borderRadius: 'var(--radius)',
              fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            {lang === 'fr' ? 'Entrer les détails manuellement' : 'Enter details manually'}
          </button>
        </>
      )}

      {/* Fallback form */}
      {showFallback && scanState === 'idle' && (
        <FallbackVerifyForm lang={lang} onSubmit={onNext} />
      )}

      {/* Help link */}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <a
          href="tel:1-800-XXX-XXXX"
          style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}
        >
          {T.helpLink}
        </a>
      </div>
    </div>
  );
}

// ─── Fallback form (inline within B_verify) ──────────
function FallbackVerifyForm({ lang, onSubmit }) {
  const T = i18n[lang] || i18n.en;
  const [form, setForm] = useState({ last4: '', postal: 'M5V 1J2', dob: '1990-01-15' });
  const [loading, setLoading] = useState(false);
  const allFilled = form.last4.length === 4 && form.postal.trim() !== '' && form.dob.trim() !== '';
  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => onSubmit(), 1000);
  };

  const labelStyle = { fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 };

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="fb-last4" style={labelStyle}>{T.last4Label}</label>
        <input id="fb-last4" type="text" inputMode="numeric" maxLength={4} className="input"
          value={form.last4} onChange={(e) => updateField('last4', e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="0000" />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="fb-postal" style={labelStyle}>{T.postalLabel}</label>
        <input id="fb-postal" type="text" className="input"
          value={form.postal} onChange={(e) => updateField('postal', e.target.value)} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="fb-dob" style={labelStyle}>{T.dobLabel}</label>
        <input id="fb-dob" type="text" className="input"
          value={form.dob} onChange={(e) => updateField('dob', e.target.value)} placeholder="YYYY-MM-DD" />
      </div>
      <button
        className="btn btn-primary"
        disabled={!allFilled || loading}
        onClick={handleSubmit}
        style={{ marginTop: 8, opacity: (!allFilled || loading) ? 0.5 : 1 }}
      >
        {loading ? T.finding : T.findAccount}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// B_account_found — Account connected
// ═══════════════════════════════════════════════════════
export function BAccountFound({ onNext, lang, setUserJourney, setCardStatus }) {
  const T = i18n[lang] || i18n.en;

  const handleContinue = () => {
    setUserJourney('new_user');
    setCardStatus('virtual_only');
    onNext();
  };

  return (
    <div className="ob-screen ob-center" style={{ justifyContent: 'center', minHeight: '100vh', gap: 0 }}>
      <div style={{ marginBottom: 24, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <WRMCCard variant="tsp" />
      </div>

      <h1 className="ob-title" style={{ marginBottom: 8, textAlign: 'center' }}>
        {T.bFoundTitle}
      </h1>
      <p className="ob-body" style={{ marginBottom: 16, textAlign: 'center', maxWidth: 300 }}>
        {T.bFoundSub}
      </p>

      <div style={{ textAlign: 'center', fontSize: 12, color: '#999', marginBottom: 32 }}>
        {T.bFoundBarcode}
      </div>

      <button className="btn btn-primary" onClick={handleContinue}>
        {T.bFoundCta}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// D_verify — Have card verification
// ═══════════════════════════════════════════════════════
export function DVerify({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;

  const handleVerified = () => {
    onNext();
  };

  return (
    <VerifyForm
      title={T.dVerifyTitle}
      body={T.dVerifyBody}
      ctaText={T.connectCard}
      loadingText={T.connecting}
      helpText={T.helpLink}
      onSubmit={handleVerified}
      onBack={onBack}
      lang={lang}
    />
  );
}

// ═══════════════════════════════════════════════════════
// D_already_active — Card already active
// ═══════════════════════════════════════════════════════
export function DAlreadyActive({ onNext, lang, setUserJourney, setCardStatus }) {
  const T = i18n[lang] || i18n.en;

  const handleContinue = () => {
    setUserJourney('new_user');
    setCardStatus('active');
    onNext();
  };

  return (
    <div className="ob-screen ob-center" style={{ justifyContent: 'center', minHeight: '100vh', gap: 0 }}>
      <div style={{ marginBottom: 24, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <WRMCCard masked={true} active={true} name="S. MARTIN" />
      </div>

      <h1 className="ob-title" style={{ marginBottom: 8, textAlign: 'center' }}>
        {T.dActiveTitle}
      </h1>
      <p className="ob-body" style={{ marginBottom: 32, textAlign: 'center' }}>
        {T.dActiveSub}
      </p>

      <button className="btn btn-primary" onClick={handleContinue}>
        {T.dActiveCta}
      </button>
    </div>
  );
}
