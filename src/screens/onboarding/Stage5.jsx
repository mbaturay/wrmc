import { useState, useEffect, useRef } from 'react';
import { WRMCCard } from '../../components/WRMCCard';
import { WalmartSpark } from '../../components/WalmartSpark';
import { SetupProgress } from '../../components/SetupProgress';
import { OnboardingTimeline } from '../../components/OnboardingTimeline';

// ─── i18n ───────────────────────────────────────────────
const i18n = {
  en: {
    back: 'Back',
    // CardArrival (5.1)
    arrivalTitle: 'Your card has arrived',
    arrivalBody: 'Activate it now to start using it in stores',
    activateNow: 'Activate now',
    later: 'Later',
    // CardActivate (5.2)
    activateTitle: 'Activate your card',
    activateBody: "Enter the last 4 digits of your new card to confirm it's yours.",
    activateError: "Those digits don't match. Try again.",
    noCardYet: "I don't have my card yet",
    // ActivationSuccess (5.3)
    successHeadline: 'Your card is active.',
    successSubtext: "You're ready to use your Walmart Rewards Mastercard everywhere Mastercard is accepted.",
    goToAccount: 'Go to my account',
  },
  fr: {
    back: 'Retour',
    arrivalTitle: 'Votre carte est arriv\u00e9e',
    arrivalBody: 'Activez-la maintenant pour commencer \u00e0 l\u2019utiliser en magasin',
    activateNow: 'Activer maintenant',
    later: 'Plus tard',
    activateTitle: 'Activez votre carte',
    activateBody: 'Entrez les 4 derniers chiffres de votre nouvelle carte pour confirmer qu\u2019elle est la v\u00f4tre.',
    activateError: 'Ces chiffres ne correspondent pas. R\u00e9essayez.',
    noCardYet: 'Je n\u2019ai pas encore ma carte',
    successHeadline: 'Votre carte est active.',
    successSubtext: 'Vous \u00eates pr\u00eat \u00e0 utiliser votre Walmart Rewards Mastercard partout o\u00f9 Mastercard est accept\u00e9e.',
    goToAccount: 'Acc\u00e9der \u00e0 mon compte',
  },
};


// ═══════════════════════════════════════════════════════
// CardArrival (Screen 5.1) — Bottom sheet notification
// ═══════════════════════════════════════════════════════
export function CardArrival({ onNext, onDismiss, lang }) {
  const T = i18n[lang] || i18n.en;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-up animation on mount
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 400ms ease-out',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px 16px 0 0',
          padding: 24,
          paddingBottom: 'calc(var(--nav-height) + 24px)',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>
          {T.arrivalTitle}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.4 }}>
          {T.arrivalBody}
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onNext()}>
            {T.activateNow}
          </button>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => onDismiss()}>
            {T.later}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CardActivate (Screen 5.2)
// ═══════════════════════════════════════════════════════
export function CardActivate({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;
  const [digits, setDigits] = useState('');
  const [state, setState] = useState('idle'); // 'idle' | 'loading' | 'error'
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Check digits when 4 are entered
  useEffect(() => {
    if (digits.length !== 4) return;

    if (digits === '4821') {
      setState('loading');
      setTimeout(() => onNext(), 1000);
    } else {
      setState('error');
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setDigits('');
        setState('idle');
        if (inputRef.current) inputRef.current.focus();
      }, 1500);
    }
  }, [digits]);

  const handleInput = (e) => {
    if (state === 'loading') return;
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setDigits(val);
    if (state === 'error') setState('idle');
  };

  return (
    <div className="ob-screen">
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          marginBottom: 16,
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

      <h1 className="ob-title" style={{ marginBottom: 8 }}>{T.activateTitle}</h1>
      <p className="ob-body" style={{ marginBottom: 20 }}>{T.activateBody}</p>

      {/* Card */}
      <div style={{ marginBottom: 24, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <WRMCCard masked={true} name="S. MARTIN" />
      </div>

      {/* 4-digit input */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={digits}
          onChange={handleInput}
          maxLength={4}
          placeholder="0000"
          autoComplete="off"
          className={shake ? 'shake' : ''}
          style={{
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: 8,
            textAlign: 'center',
            maxWidth: 160,
            width: '100%',
            padding: '12px 16px',
            border: `2px solid ${state === 'error' ? '#e53e3e' : 'var(--border)'}`,
            borderRadius: 'var(--radius)',
            outline: 'none',
            color: 'var(--text-primary)',
            transition: 'border-color 0.2s',
          }}
        />
      </div>

      {/* Loading indicator */}
      {state === 'loading' && (
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
          {lang === 'fr' ? 'Activation en cours...' : 'Activating...'}
        </p>
      )}

      {/* Error message */}
      {state === 'error' && (
        <p style={{ textAlign: 'center', fontSize: 14, color: '#e53e3e', fontWeight: 500 }}>
          {T.activateError}
        </p>
      )}

      <div style={{ flex: 1 }} />

      {/* No card yet link */}
      <button
        onClick={() => onBack()}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          fontSize: 14,
          fontWeight: 500,
          padding: 8,
          alignSelf: 'center',
          marginTop: 32,
        }}
      >
        {T.noCardYet}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// BppOffer — Balance Protection Plan upsell
// ═══════════════════════════════════════════════════════
export function BppOffer({ onNext, lang }) {
  const [showSheet, setShowSheet] = useState(false);

  return (
    <div className="ob-screen ob-center" style={{ justifyContent: 'center', minHeight: '100vh', gap: 0 }}>
      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--accent-light)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4, textAlign: 'center' }}>
        {lang === 'fr' ? 'Encore une chose' : 'One more thing'}
      </h1>

      <h2 style={{ fontSize: 17, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 16, textAlign: 'center' }}>
        {lang === 'fr' ? 'Protégez votre solde' : 'Protect your balance'}
      </h2>

      <p style={{
        fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center',
        lineHeight: 1.5, marginBottom: 32, maxWidth: 300,
      }}>
        {lang === 'fr'
          ? 'Le Régime de protection du solde aide à couvrir vos paiements minimums en cas de perte d\u2019emploi, d\u2019invalidité ou de maladie grave.'
          : 'Balance Protection Plan helps cover your minimum payments if you experience job loss, disability, or critical illness.'}
      </p>

      <button className="btn btn-primary" onClick={() => setShowSheet(true)} style={{ marginBottom: 16 }}>
        {lang === 'fr' ? 'En savoir plus' : 'Tell me more'}
      </button>

      <button
        onClick={() => onNext()}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500,
          padding: 8,
        }}
      >
        {lang === 'fr' ? 'Non merci, accéder à mon compte' : 'No thanks, take me to my account'}
      </button>

      {/* Stub bottom sheet */}
      {showSheet && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: '16px 16px 0 0',
            padding: 24, paddingBottom: 'calc(var(--nav-height) + 24px)',
            width: '100%', maxWidth: 420,
          }}>
            <div style={{
              width: 36, height: 4, borderRadius: 2,
              background: 'var(--border)', margin: '0 auto 16px',
            }} />
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
              {lang === 'fr' ? 'Régime de protection du solde' : 'Balance Protection Plan'}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
              {lang === 'fr'
                ? 'Les détails du Régime de protection du solde seront bientôt disponibles. Un conseiller communiquera avec vous.'
                : 'Balance Protection Plan details coming soon. An agent will follow up.'}
            </p>
            <button className="btn btn-primary" onClick={() => { setShowSheet(false); onNext(); }}>
              {lang === 'fr' ? 'Compris, continuer' : 'Got it, continue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ActivationSuccess (Screen 5.3) — Dark bookend
// ═══════════════════════════════════════════════════════
export function ActivationSuccess({ onNext, lang }) {
  const T = i18n[lang] || i18n.en;
  const [sparkReady, setSparkReady] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const t0 = requestAnimationFrame(() => setSparkReady(true));
    const t1 = setTimeout(() => setCardVisible(true), 1000);
    const t2 = setTimeout(() => setCtaVisible(true), 1500);
    return () => {
      cancelAnimationFrame(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      className="ob-screen ob-dark ob-center"
      style={{
        background: '#0a0a0a',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 0,
        paddingBottom: 'calc(var(--nav-height) + 24px)',
      }}
    >
      {/* Spark logo */}
      <div
        style={{
          transform: sparkReady ? 'scale(1)' : 'scale(0.5)',
          opacity: sparkReady ? 1 : 0,
          transition: 'transform 500ms ease-out, opacity 500ms ease-out',
          marginBottom: 24,
        }}
      >
        <WalmartSpark size={60} />
      </div>

      {/* Headline */}
      <h1
        style={{
          color: '#ffffff',
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        {T.successHeadline}
      </h1>

      {/* Subtext */}
      <p
        style={{
          color: '#999999',
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 32,
          maxWidth: 300,
          lineHeight: 1.5,
        }}
      >
        {T.successSubtext}
      </p>

      {/* Card */}
      <div
        style={{
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 600ms ease-out, transform 600ms ease-out',
          marginBottom: 40,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <WRMCCard masked={true} active={true} name="S. MARTIN" />
      </div>

      {/* CTA */}
      <button
        onClick={() => onNext()}
        style={{
          opacity: ctaVisible ? 1 : 0,
          transform: ctaVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 500ms ease-out, transform 500ms ease-out',
          border: '2px solid white',
          background: 'transparent',
          color: 'white',
          padding: '14px 32px',
          borderRadius: 10,
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {T.goToAccount}
      </button>
    </div>
  );
}
