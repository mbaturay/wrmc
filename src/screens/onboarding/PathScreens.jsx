import { useState } from 'react';
import { WRMCCard } from '../../components/WRMCCard';

// ─── i18n ───────────────────────────────────────────────
const i18n = {
  en: {
    back: 'Back',
    // B_verify
    bVerifyTitle: "Let's find your account",
    bVerifyBody: 'Enter a few details to connect your approved account.',
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
    bVerifyTitle: 'Trouvons votre compte',
    bVerifyBody: 'Entrez quelques informations pour connecter votre compte approuvé.',
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
// B_verify — Just approved verification
// ═══════════════════════════════════════════════════════
export function BVerify({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;
  return (
    <VerifyForm
      title={T.bVerifyTitle}
      body={T.bVerifyBody}
      ctaText={T.findAccount}
      loadingText={T.finding}
      helpText={T.helpLink}
      onSubmit={onNext}
      onBack={onBack}
      lang={lang}
    />
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
export function DVerify({ onBack, lang, goToBranch }) {
  const T = i18n[lang] || i18n.en;

  const handleVerified = () => {
    // In prototype: always route to D_already_active
    // Change to 'B_account_found' to simulate virtual_only card
    goToBranch('D_already_active');
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
