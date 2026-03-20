import { useState } from 'react';
import { OTPInput } from '../../components/OTPInput';
import { WalmartSpark } from '../../components/WalmartSpark';

// ─── i18n ───────────────────────────────────────────────
const i18n = {
  en: {
    welcomeHeadline: 'Welcome to Walmart Rewards Mastercard',
    welcomeSubtext: 'Manage your card, track rewards, and make payments — all in one place.',
    signIn: 'Sign in',
    createAccount: 'Create account',
    createAccountSub: 'New here? Get started in minutes.',
    // GetStarted
    getStartedTitle: 'How can we help?',
    getStartedSub: 'Choose the option that best describes you.',
    optJustApproved: 'I was just approved in-store',
    optJustApprovedSub: 'Got a paper barcode at the till? Set up your account.',
    optHaveCard: 'I already have a card',
    optHaveCardSub: 'Physical card, activated by phone. First time in the app.',
    optApply: 'Apply for a card',
    optApplySub: 'No card yet? Apply in about 5 minutes.',
    // Apply
    applyTitle: 'Apply for a card',
    applyBody: 'Applications are quick and take about 5 minutes.',
    continueApp: 'Continue application',
    // ExistingCardVerify
    verifyTitle: 'Verify your card',
    last4Label: 'Last 4 digits of your card',
    postalLabel: 'Postal code',
    dobLabel: 'Date of birth',
    verifyBtn: 'Verify',
    otpTitle: 'Enter verification code',
    otpBody: 'We sent a 6-digit code to your phone.',
  },
  fr: {
    welcomeHeadline: 'Bienvenue sur Walmart Rewards Mastercard',
    welcomeSubtext: 'Gérez votre carte, suivez vos récompenses et effectuez des paiements — tout en un seul endroit.',
    signIn: 'Se connecter',
    createAccount: 'Créer un compte',
    createAccountSub: 'Nouveau\u00a0? Commencez en quelques minutes.',
    getStartedTitle: 'Comment pouvons-nous vous aider\u00a0?',
    getStartedSub: 'Choisissez l\u2019option qui vous correspond.',
    optJustApproved: 'Je viens d\u2019\u00eatre approuv\u00e9 en magasin',
    optJustApprovedSub: 'Vous avez re\u00e7u un code-barres papier\u00a0? Configurez votre compte.',
    optHaveCard: 'J\u2019ai d\u00e9j\u00e0 une carte',
    optHaveCardSub: 'Carte physique, activ\u00e9e par t\u00e9l\u00e9phone. Premi\u00e8re utilisation de l\u2019appli.',
    optApply: 'Demander une carte',
    optApplySub: 'Pas encore de carte\u00a0? Faites une demande en 5 minutes.',
    applyTitle: 'Demander une carte',
    applyBody: 'Les demandes sont rapides et prennent environ 5 minutes.',
    continueApp: 'Continuer la demande',
    verifyTitle: 'Vérifiez votre carte',
    last4Label: 'Les 4 derniers chiffres de votre carte',
    postalLabel: 'Code postal',
    dobLabel: 'Date de naissance',
    verifyBtn: 'Vérifier',
    otpTitle: 'Entrez le code de vérification',
    otpBody: 'Nous avons envoyé un code à 6 chiffres à votre téléphone.',
  },
};


// ═══════════════════════════════════════════════════════
// Welcome (Screen 1.1)
// ═══════════════════════════════════════════════════════
export function Welcome({ onNext, onShowGetStarted, lang }) {
  const T = i18n[lang] || i18n.en;

  return (
    <div className="ob-screen ob-center" style={{ justifyContent: 'center', minHeight: '100vh', gap: 0 }}>
      <div style={{ marginBottom: 32 }}>
        <WalmartSpark size={80} />
      </div>

      <h1 className="ob-title" style={{ marginBottom: 12, maxWidth: 280, lineHeight: 1.3 }}>
        {T.welcomeHeadline}
      </h1>
      <p className="ob-subtitle" style={{ marginBottom: 40, maxWidth: 300, lineHeight: 1.5 }}>
        {T.welcomeSubtext}
      </p>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button className="btn btn-primary" onClick={() => onNext('signin')}>
          {T.signIn}
        </button>
        <button className="btn btn-secondary" onClick={() => onShowGetStarted()}>
          {T.createAccount}
        </button>
      </div>

      <a
        href="tel:1-800-XXX-XXXX"
        style={{
          fontSize: 12,
          color: 'var(--text-muted)',
          marginTop: 24,
          textDecoration: 'none',
        }}
      >
        {lang === 'fr' ? 'Besoin d\u2019aide\u00a0? Appelez le 1-800-XXX-XXXX' : 'Need help? Call 1-800-XXX-XXXX'}
      </a>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// GetStarted (Screen 1.1b) — Branching question
// ═══════════════════════════════════════════════════════
export function GetStarted({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;

  const options = [
    { key: 'approved', title: T.optJustApproved, sub: T.optJustApprovedSub },
    { key: 'existing', title: T.optHaveCard, sub: T.optHaveCardSub },
    { key: 'apply', title: T.optApply, sub: T.optApplySub },
  ];

  return (
    <div className="ob-screen">
      <button
        onClick={onBack}
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
        {lang === 'fr' ? 'Retour' : 'Back'}
      </button>

      <h1 className="ob-title" style={{ marginBottom: 8 }}>{T.getStartedTitle}</h1>
      <p className="ob-body" style={{ marginBottom: 24 }}>{T.getStartedSub}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onNext(opt.key)}
            style={{
              width: '100%',
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{opt.title}</div>
              <div style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)', lineHeight: 1.4 }}>{opt.sub}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginLeft: 12 }}>
              <path d="M7 4L13 10L7 16" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Apply (Screen 1.2)
// ═══════════════════════════════════════════════════════
export function Apply({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;

  return (
    <div className="ob-screen">
      <button
        className="header-btn"
        onClick={onBack}
        style={{ alignSelf: 'flex-start', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {lang === 'fr' ? 'Retour' : 'Back'}
      </button>

      <h1 className="ob-title" style={{ marginBottom: 8 }}>{T.applyTitle}</h1>
      <p className="ob-body" style={{ marginBottom: 24 }}>{T.applyBody}</p>

      <div style={{ marginBottom: 14 }}>
        <label
          htmlFor="apply-email"
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}
        >
          Email
        </label>
        <input
          id="apply-email"
          type="email"
          className="input"
          value="user@example.com"
          disabled
          style={{ opacity: 0.6 }}
        />
      </div>

      <button className="btn btn-primary" onClick={() => onNext()} style={{ marginTop: 16 }}>
        {T.continueApp}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Language (Screen 1.3)
// ═══════════════════════════════════════════════════════
export function Language({ onNext }) {
  return (
    <div className="ob-screen ob-center" style={{ justifyContent: 'center', minHeight: '100vh', gap: 0 }}>
      <div style={{ marginBottom: 32 }}>
        <WalmartSpark size={64} />
      </div>

      <h1 className="ob-title" style={{ marginBottom: 40, maxWidth: 300, lineHeight: 1.3 }}>
        Choose your language
        <br />
        Choisissez votre langue
      </h1>

      <div style={{ display: 'flex', gap: 12, width: '100%' }}>
        <button
          onClick={() => onNext('en')}
          style={{
            flex: 1,
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            height: 48,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            color: 'var(--text-primary)',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          English
        </button>
        <button
          onClick={() => onNext('fr')}
          style={{
            flex: 1,
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            height: 48,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            color: 'var(--text-primary)',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          Français
        </button>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 24, lineHeight: 1.5, textAlign: 'center' }}>
        You can change this anytime in Settings
        <br />
        Vous pouvez modifier cela dans Paramètres
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ExistingCardVerify (Screen 1.4)
// ═══════════════════════════════════════════════════════
export function ExistingCardVerify({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;

  const [form, setForm] = useState({
    last4: '',
    postal: 'M5V 1J2',
    dob: '1990-01-15',
  });
  const [showOtp, setShowOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const allFilled = form.last4.length === 4 && form.postal.trim() !== '' && form.dob.trim() !== '';

  const handleVerify = () => {
    setShowOtp(true);
  };

  const handleOtpComplete = () => {
    setVerifying(true);
    setTimeout(() => {
      onNext();
    }, 1000);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="ob-screen">
      <button
        className="header-btn"
        onClick={onBack}
        style={{ alignSelf: 'flex-start', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {lang === 'fr' ? 'Retour' : 'Back'}
      </button>

      <h1 className="ob-title" style={{ marginBottom: 20 }}>{T.verifyTitle}</h1>

      {!showOtp ? (
        <>
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="last4" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              {T.last4Label}
            </label>
            <input
              id="last4"
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
            <label htmlFor="postal" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              {T.postalLabel}
            </label>
            <input
              id="postal"
              type="text"
              className="input"
              value={form.postal}
              onChange={(e) => updateField('postal', e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label htmlFor="dob" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              {T.dobLabel}
            </label>
            <input
              id="dob"
              type="text"
              className="input"
              value={form.dob}
              onChange={(e) => updateField('dob', e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>

          <button
            className="btn btn-primary"
            disabled={!allFilled}
            onClick={handleVerify}
            style={{ marginTop: 16, opacity: allFilled ? 1 : 0.5 }}
          >
            {T.verifyBtn}
          </button>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{T.otpTitle}</h2>
          <p className="ob-body" style={{ marginBottom: 20 }}>{T.otpBody}</p>
          <OTPInput length={6} onComplete={handleOtpComplete} />
          {verifying && (
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 16 }}>
              {lang === 'fr' ? 'Vérification en cours...' : 'Verifying...'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
