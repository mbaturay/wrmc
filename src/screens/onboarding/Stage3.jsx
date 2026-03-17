import { useState, useEffect, useRef } from 'react';
import { WRMCCard } from '../../components/WRMCCard';
import { SetupProgress } from '../../components/SetupProgress';
import { OnboardingTimeline } from '../../components/OnboardingTimeline';

// ─── i18n ───────────────────────────────────────────────
const i18n = {
  en: {
    // Approval (3.1)
    approvedHeadline: "You're approved.",
    approvedSubtext: 'Welcome to Walmart Rewards Mastercard',
    seeYourCard: 'See your card',
    // VirtualCard (3.2)
    vcTitle: 'Your card is ready to use',
    vcBody: 'Use this card number for online purchases at Walmart.ca right now. Your physical card is on its way.',
    cardNumber: 'Card number',
    expiry: 'Expiry',
    cvv: 'CVV',
    copy: 'Copy',
    copied: 'Copied!',
    reveal: 'Reveal',
    hide: 'Hide',
    vcInfoBox: 'Your physical card will arrive in 5\u20137 business days. We\u2019ll send you a push notification when it\u2019s ready to activate.',
    setupAccount: 'Set up your account',
    back: 'Back',
    // WhatsNext (3.3)
    wnTitle: "Here's what to expect",
    stepIdentity: 'Identity verified',
    stepIdentitySub: 'Done',
    stepMail: 'Physical card in the mail',
    stepMailSub: 'Arrives in 5\u20137 business days',
    stepActivate: 'Activate your physical card',
    stepActivateSub: "We'll remind you when it arrives",
    wnHighlight: 'In the meantime, use your virtual card at Walmart.ca',
    finishSetup: 'Finish setting up',
  },
  fr: {
    approvedHeadline: 'Vous \u00eates approuv\u00e9.',
    approvedSubtext: 'Bienvenue sur Walmart Rewards Mastercard',
    seeYourCard: 'Voir votre carte',
    vcTitle: 'Votre carte est pr\u00eate \u00e0 utiliser',
    vcBody: 'Utilisez ce num\u00e9ro de carte pour les achats en ligne sur Walmart.ca d\u00e8s maintenant. Votre carte physique est en route.',
    cardNumber: 'Num\u00e9ro de carte',
    expiry: 'Expiration',
    cvv: 'CVV',
    copy: 'Copier',
    copied: 'Copi\u00e9\u00a0!',
    reveal: 'Afficher',
    hide: 'Masquer',
    vcInfoBox: 'Votre carte physique arrivera dans 5 \u00e0 7 jours ouvrables. Nous vous enverrons une notification lorsqu\u2019elle sera pr\u00eate \u00e0 activer.',
    setupAccount: 'Configurer votre compte',
    back: 'Retour',
    wnTitle: 'Voici ce qui vous attend',
    stepIdentity: 'Identit\u00e9 v\u00e9rifi\u00e9e',
    stepIdentitySub: 'Termin\u00e9',
    stepMail: 'Carte physique en cours d\u2019envoi',
    stepMailSub: 'Arrive dans 5 \u00e0 7 jours ouvrables',
    stepActivate: 'Activer votre carte physique',
    stepActivateSub: 'Nous vous rappellerons \u00e0 son arriv\u00e9e',
    wnHighlight: 'En attendant, utilisez votre carte virtuelle sur Walmart.ca',
    finishSetup: 'Terminer la configuration',
  },
};

// ─── Walmart Spark SVG ──────────────────────────────────
function WalmartSpark({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <g transform="translate(50,50)">
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <path
            key={angle}
            d="M0,-8 L5,-38 L0,-44 L-5,-38 Z"
            fill="#FFC220"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════
// Approval (Screen 3.1) — THE CELEBRATION SCREEN
// ═══════════════════════════════════════════════════════
export function Approval({ onNext, lang }) {
  const T = i18n[lang] || i18n.en;
  const [sparkReady, setSparkReady] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    // Trigger spark animation on mount
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
        {T.approvedHeadline}
      </h1>

      {/* Subtext */}
      <p
        style={{
          color: '#999999',
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 32,
        }}
      >
        {T.approvedSubtext}
      </p>

      {/* Card */}
      <div
        style={{
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 600ms ease-out, transform 600ms ease-out',
          marginBottom: 40,
          width: '100%',
        }}
      >
        <WRMCCard masked={true} name="S. MARTIN" />
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
        {T.seeYourCard}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// VirtualCard (Screen 3.2)
// ═══════════════════════════════════════════════════════
export function VirtualCard({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;
  const [copyLabel, setCopyLabel] = useState(T.copy);
  const [cvvRevealed, setCvvRevealed] = useState(false);
  const cvvTimerRef = useRef(null);

  // Update copy label text when lang changes
  useEffect(() => {
    setCopyLabel(T.copy);
  }, [lang]);

  // Clean up CVV timer on unmount
  useEffect(() => {
    return () => {
      if (cvvTimerRef.current) clearTimeout(cvvTimerRef.current);
    };
  }, []);

  const handleCopy = () => {
    setCopyLabel(T.copied);
    setTimeout(() => setCopyLabel(T.copy), 2000);
  };

  const handleRevealCvv = () => {
    setCvvRevealed(true);
    if (cvvTimerRef.current) clearTimeout(cvvTimerRef.current);
    cvvTimerRef.current = setTimeout(() => setCvvRevealed(false), 5000);
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid var(--border)',
  };

  const rowLabelStyle = {
    fontSize: 13,
    color: 'var(--text-secondary)',
  };

  const rowValueStyle = {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  return (
    <div className="ob-screen">
      {/* Back button */}
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

      <h1 className="ob-title" style={{ marginBottom: 16 }}>{T.vcTitle}</h1>

      {/* Card */}
      <div style={{ marginBottom: 16 }}>
        <WRMCCard masked={false} name="S. MARTIN" />
      </div>

      <p className="ob-body" style={{ marginBottom: 20 }}>{T.vcBody}</p>

      {/* Info rows */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={rowStyle}>
          <span style={rowLabelStyle}>{T.cardNumber}</span>
          <span style={rowValueStyle}>
            &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4821
            <button className="btn btn-ghost" style={{ fontSize: 12, padding: '4px 8px' }} onClick={handleCopy}>
              {copyLabel}
            </button>
          </span>
        </div>
        <div style={rowStyle}>
          <span style={rowLabelStyle}>{T.expiry}</span>
          <span style={rowValueStyle}>03/29</span>
        </div>
        <div style={{ ...rowStyle, borderBottom: 'none' }}>
          <span style={rowLabelStyle}>{T.cvv}</span>
          <span style={rowValueStyle}>
            {cvvRevealed ? '123' : '\u2022\u2022\u2022'}
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12, padding: '4px 8px' }}
              onClick={cvvRevealed ? () => setCvvRevealed(false) : handleRevealCvv}
            >
              {cvvRevealed ? T.hide : T.reveal}
            </button>
          </span>
        </div>
      </div>

      {/* Info card */}
      <div
        style={{
          background: '#EBF5FF',
          borderRadius: 'var(--radius)',
          padding: 14,
          fontSize: 13,
          color: 'var(--text-primary)',
          lineHeight: 1.5,
          marginBottom: 24,
        }}
      >
        {T.vcInfoBox}
      </div>

      <button className="btn btn-primary" onClick={() => onNext()}>
        {T.setupAccount}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// WhatsNext (Screen 3.3)
// ═══════════════════════════════════════════════════════
export function WhatsNext({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;

  const timelineSteps = [
    { status: 'complete', title: T.stepIdentity, subtitle: T.stepIdentitySub },
    { status: 'active', title: T.stepMail, subtitle: T.stepMailSub },
    { status: 'upcoming', title: T.stepActivate, subtitle: T.stepActivateSub },
  ];

  return (
    <div className="ob-screen">
      {/* Back button */}
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

      <h1 className="ob-title" style={{ marginBottom: 24 }}>{T.wnTitle}</h1>

      <OnboardingTimeline steps={timelineSteps} />

      {/* Highlight box */}
      <div
        className="card"
        style={{
          background: '#EBF5FF',
          marginTop: 20,
          marginBottom: 32,
          fontSize: 14,
          lineHeight: 1.5,
          color: 'var(--text-primary)',
        }}
      >
        {T.wnHighlight}
      </div>

      <button className="btn btn-primary" onClick={() => onNext()}>
        {T.finishSetup}
      </button>
    </div>
  );
}
