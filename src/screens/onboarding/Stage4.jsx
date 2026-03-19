import { useState, useEffect, useRef } from 'react';
import { WRMCCard } from '../../components/WRMCCard';
import { SetupProgress } from '../../components/SetupProgress';
import { OnboardingTimeline } from '../../components/OnboardingTimeline';

// ─── i18n ───────────────────────────────────────────────
const i18n = {
  en: {
    back: 'Back',
    skipForNow: 'Skip for now',
    // BiometricSetup (4.1)
    bioHeadline: 'Open the app instantly',
    bioBody: 'Use Face ID or your fingerprint to skip your password and get straight to your account. You can also use it to confirm purchases with your Temporary Shopping Pass at checkout.',
    enableFaceId: 'Enable Face ID',
    bioModalTitle: 'Allow Walmart Rewards to use Face ID?',
    bioAllow: 'Allow',
    bioDontAllow: "Don't Allow",
    // PINSetup (4.2)
    pinHeadline: 'Create your card PIN',
    pinBody: "You'll use this PIN when making purchases at Walmart stores.",
    pinEnterLabel: 'Enter a 4-digit PIN',
    pinConfirmLabel: 'Confirm your PIN',
    pinCreated: 'PIN created',
    pinMismatch: "PINs don't match \u2014 try again",
    // EStatement (4.3)
    esHeadline: 'Go paperless',
    esBody: 'Get your monthly statements by email instead. Better for the environment, and easier to find when you need them.',
    esToggleLabel: 'Send my statements by email',
    esConfirm: 'Confirm',
    // NotificationPrefs (4.4)
    notifHeadline: 'Stay on top of your account',
    notifBody: "We'll let you know about transactions, payment reminders, and rewards updates.",
    notifTransaction: 'Transaction alerts',
    notifTransactionSub: 'Purchase, refund, cash advance',
    notifPayment: 'Payment reminders',
    notifPaymentSub: '3 days before due date',
    notifRewards: 'Rewards updates',
    notifRewardsSub: 'When rewards post',
    notifLowCredit: 'Low credit alerts',
    notifLowCreditSub: 'When available credit drops below $100',
    notifEnable: 'Enable notifications',
    notifNotNow: 'Not now',
  },
  fr: {
    back: 'Retour',
    skipForNow: 'Passer pour l\u2019instant',
    bioHeadline: 'Ouvrez l\u2019appli instantan\u00e9ment',
    bioBody: 'Utilisez Face ID ou votre empreinte digitale pour acc\u00e9der directement \u00e0 votre compte sans mot de passe. Vous pouvez aussi l\u2019utiliser pour confirmer vos achats avec votre pass d\u2019achat temporaire.',
    enableFaceId: 'Activer Face ID',
    bioModalTitle: 'Autoriser Walmart Rewards \u00e0 utiliser Face ID\u00a0?',
    bioAllow: 'Autoriser',
    bioDontAllow: 'Ne pas autoriser',
    pinHeadline: 'Cr\u00e9ez votre NIP de carte',
    pinBody: 'Vous utiliserez ce NIP pour les achats dans les magasins Walmart.',
    pinEnterLabel: 'Entrez un NIP \u00e0 4 chiffres',
    pinConfirmLabel: 'Confirmez votre NIP',
    pinCreated: 'NIP cr\u00e9\u00e9',
    pinMismatch: 'Les NIP ne correspondent pas \u2014 r\u00e9essayez',
    esHeadline: 'Passez au z\u00e9ro papier',
    esBody: 'Recevez vos relev\u00e9s mensuels par courriel. Mieux pour l\u2019environnement et plus facile \u00e0 retrouver.',
    esToggleLabel: 'Envoyer mes relev\u00e9s par courriel',
    esConfirm: 'Confirmer',
    notifHeadline: 'Restez inform\u00e9',
    notifBody: 'Nous vous tiendrons au courant des transactions, des rappels de paiement et des mises \u00e0 jour de r\u00e9compenses.',
    notifTransaction: 'Alertes de transaction',
    notifTransactionSub: 'Achat, remboursement, avance de fonds',
    notifPayment: 'Rappels de paiement',
    notifPaymentSub: '3 jours avant la date d\u2019\u00e9ch\u00e9ance',
    notifRewards: 'Mises \u00e0 jour des r\u00e9compenses',
    notifRewardsSub: 'Lorsque les r\u00e9compenses sont cr\u00e9dit\u00e9es',
    notifLowCredit: 'Alertes de cr\u00e9dit faible',
    notifLowCreditSub: 'Lorsque le cr\u00e9dit disponible descend sous 100\u00a0$',
    notifEnable: 'Activer les notifications',
    notifNotNow: 'Pas maintenant',
  },
};

// ═══════════════════════════════════════════════════════
// BiometricSetup (Screen 4.1)
// ═══════════════════════════════════════════════════════
export function BiometricSetup({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="ob-screen" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          margin: '0 20px',
          marginBottom: 0,
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 13,
          color: 'var(--text-secondary)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {T.back}
      </button>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingTop: 8, paddingBottom: 120 }}>
        <SetupProgress steps={4} current={1} />

        {/* Icon */}
        <div style={{ textAlign: 'center', margin: '32px 0 24px' }}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
            <circle cx="30" cy="24" r="10" stroke="#333" strokeWidth="2" fill="none" />
            <path d="M15 45c0-8.28 6.72-15 15-15s15 6.72 15 15" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        <h1 className="ob-title" style={{ marginBottom: 8 }}>{T.bioHeadline}</h1>
        <p className="ob-body" style={{ marginBottom: 32 }}>{T.bioBody}</p>
      </div>

      {/* Fixed footer */}
      <div style={{
        padding: '12px 20px',
        paddingBottom: 'calc(var(--nav-height) + 12px)',
        background: 'var(--surface)',
        borderTop: '0.5px solid var(--border)',
      }}>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ marginBottom: 16 }}>
          {T.enableFaceId}
        </button>

        <button
          onClick={() => onNext()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: 14,
            fontWeight: 500,
            padding: 8,
            alignSelf: 'center',
            display: 'block',
            margin: '0 auto',
          }}
        >
          {T.skipForNow}
        </button>
      </div>

      {/* Biometric modal */}
      {showModal && (
        <div className="ob-modal-overlay">
          <div className="ob-modal-sheet">
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, textAlign: 'center' }}>
              {T.bioModalTitle}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-primary" onClick={() => onNext()}>
                {T.bioAllow}
              </button>
              <button className="btn btn-ghost" onClick={() => onNext()}>
                {T.bioDontAllow}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PINSetup (Screen 4.2)
// ═══════════════════════════════════════════════════════
export function PINSetup({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;
  const [stage, setStage] = useState('entering'); // 'entering' | 'confirming' | 'error' | 'success'
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  // Focus the hidden input on mount and stage changes
  useEffect(() => {
    if (inputRef.current && stage !== 'success') {
      inputRef.current.focus();
    }
  }, [stage]);

  // Handle 4-digit completion (300ms delay so the 4th dot visibly fills)
  useEffect(() => {
    if (pin.length !== 4) return;

    const timer = setTimeout(() => {
      if (stage === 'entering') {
        setFirstPin(pin);
        setPin('');
        setStage('confirming');
      } else if (stage === 'confirming') {
        if (pin === firstPin) {
          setStage('success');
          setTimeout(() => onNext(), 800);
        } else {
          setStage('error');
          setShake(true);
          setTimeout(() => {
            setShake(false);
            setPin('');
            setFirstPin('');
            setStage('entering');
          }, 1500);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pin]);

  const handleInput = (e) => {
    if (stage === 'success' || stage === 'error') return;
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(val);
  };

  const promptText =
    stage === 'confirming'
      ? T.pinConfirmLabel
      : stage === 'success'
        ? T.pinCreated
        : stage === 'error'
          ? T.pinMismatch
          : T.pinEnterLabel;

  const promptColor =
    stage === 'success'
      ? 'var(--success)'
      : stage === 'error'
        ? '#e53e3e'
        : 'var(--text-secondary)';

  return (
    <div className="ob-screen" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          margin: '0 20px',
          marginBottom: 0,
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 13,
          color: 'var(--text-secondary)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {T.back}
      </button>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingTop: 8, paddingBottom: 'calc(var(--nav-height) + 12px)' }}>
        <SetupProgress steps={4} current={2} />

        <h1 className="ob-title" style={{ marginBottom: 8, marginTop: 24 }}>{T.pinHeadline}</h1>
        <p className="ob-body" style={{ marginBottom: 32 }}>{T.pinBody}</p>

        {/* PIN prompt */}
        <p style={{ fontSize: 14, color: promptColor, textAlign: 'center', marginBottom: 16, fontWeight: 500 }}>
          {promptText}
        </p>

        {/* PIN dots */}
        <div
          className={`pin-container${shake ? ' shake' : ''}`}
          onClick={() => inputRef.current && inputRef.current.focus()}
          style={{ cursor: 'pointer' }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`pin-dot${pin.length > i ? ' filled' : ''}`} />
          ))}
        </div>

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={pin}
          onChange={handleInput}
          maxLength={4}
          autoComplete="off"
          style={{
            position: 'absolute',
            opacity: 0,
            width: 1,
            height: 1,
            pointerEvents: 'none',
          }}
        />

        <div style={{ flex: 1 }} />

        <button
          onClick={() => onNext()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: 14,
            fontWeight: 500,
            padding: 8,
            display: 'block',
            margin: '32px auto 0',
          }}
        >
          {T.skipForNow}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// EStatement (Screen 4.3)
// ═══════════════════════════════════════════════════════
export function EStatement({ onNext, onBack, lang, email: propEmail }) {
  const T = i18n[lang] || i18n.en;
  const [emailValue, setEmailValue] = useState(propEmail || 'user@example.com');
  const [paperless, setPaperless] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = () => {
    if (paperless) {
      setShowSuccess(true);
      setTimeout(() => onNext(true), 1500);
    } else {
      onNext(false);
    }
  };

  return (
    <div className="ob-screen" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          margin: '0 20px',
          marginBottom: 0,
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 13,
          color: 'var(--text-secondary)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {T.back}
      </button>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingTop: 8, paddingBottom: 120 }}>
        <SetupProgress steps={4} current={3} />

        <h1 className="ob-title" style={{ marginBottom: 8, marginTop: 24 }}>{T.esHeadline}</h1>
        <p className="ob-body" style={{ marginBottom: 24 }}>{T.esBody}</p>

        {/* Email field */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}
          >
            Email
          </label>
          <input
            type="email"
            className="input"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          />
        </div>

        {/* Toggle */}
        <div className="toggle-row" onClick={() => setPaperless(!paperless)} style={{ cursor: 'pointer' }}>
          <span className="toggle-label">{T.esToggleLabel}</span>
          <div className={`toggle${paperless ? ' on' : ''}`} />
        </div>

        {/* Paperless confirmation message */}
        {showSuccess && (
          <div style={{
            marginTop: 20,
            padding: '14px 16px',
            background: '#F0F7FF',
            borderRadius: 'var(--radius)',
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            animation: 'fade-in 0.3s ease',
          }}>
            {lang === 'fr'
              ? 'Vous recevrez vos relevés mensuels par courriel. Vous pouvez modifier ce choix en tout temps dans les Paramètres.'
              : "You'll receive monthly statements by email. You can change this anytime in Settings."}
          </div>
        )}
      </div>

      {/* Fixed footer */}
      {!showSuccess && (
        <div style={{
          padding: '12px 20px',
          paddingBottom: 'calc(var(--nav-height) + 12px)',
          background: 'var(--surface)',
          borderTop: '0.5px solid var(--border)',
        }}>
          <button className="btn btn-primary" onClick={handleConfirm} style={{ marginBottom: 16 }}>
            {T.esConfirm}
          </button>

          <button
            onClick={() => onNext(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: 14,
              fontWeight: 500,
              padding: 8,
              display: 'block',
              margin: '0 auto',
            }}
          >
            {T.skipForNow}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// NotificationPrefs (Screen 4.4)
// ═══════════════════════════════════════════════════════
export function NotificationPrefs({ onNext, lang }) {
  const T = i18n[lang] || i18n.en;
  const [prefs, setPrefs] = useState({
    transaction: true,
    payment: true,
    rewards: true,
    lowCredit: true,
  });

  const togglePref = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notifItems = [
    { key: 'transaction', title: T.notifTransaction, sub: T.notifTransactionSub },
    { key: 'payment', title: T.notifPayment, sub: T.notifPaymentSub },
    { key: 'rewards', title: T.notifRewards, sub: T.notifRewardsSub },
    { key: 'lowCredit', title: T.notifLowCredit, sub: T.notifLowCreditSub },
  ];

  return (
    <div className="ob-screen" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingTop: 8, paddingBottom: 120 }}>
        <SetupProgress steps={4} current={4} />

        <h1 className="ob-title" style={{ marginBottom: 8, marginTop: 24 }}>{T.notifHeadline}</h1>
        <p className="ob-body" style={{ marginBottom: 24 }}>{T.notifBody}</p>

        {/* Toggle list */}
        <div style={{ marginBottom: 32 }}>
          {notifItems.map((item) => (
            <div
              key={item.key}
              className="toggle-row"
              onClick={() => togglePref(item.key)}
              style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'stretch' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="toggle-label">{item.title}</span>
                <div className={`toggle${prefs[item.key] ? ' on' : ''}`} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {item.sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed footer */}
      <div style={{
        padding: '12px 20px',
        paddingBottom: 'calc(var(--nav-height) + 12px)',
        background: 'var(--surface)',
        borderTop: '0.5px solid var(--border)',
      }}>
        <button className="btn btn-primary" onClick={() => onNext('enabled')} style={{ marginBottom: 16 }}>
          {T.notifEnable}
        </button>

        <button
          onClick={() => onNext('skipped')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: 14,
            fontWeight: 500,
            padding: 8,
            display: 'block',
            margin: '0 auto',
          }}
        >
          {T.notifNotNow}
        </button>
      </div>
    </div>
  );
}
