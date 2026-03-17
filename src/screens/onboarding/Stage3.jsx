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
    bonusTeaser: 'Up to $25 in Reward Dollars waiting for you',
    bonusTeaserSub: 'Complete two purchases to unlock your welcome bonus',
    // VirtualCard (3.2)
    vcTitle: 'Your card is ready to use',
    vcBody: 'Your temporary shopping pass is ready. Use it for Walmart purchases while your physical card is on its way.',
    vcPassLabel: 'TEMPORARY SHOPPING PASS',
    vcDetailUse: 'For Walmart purchases only',
    vcDetailLimit: 'Up to $1,000 \u00b7 Valid 10 days',
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
    bonusTeaser: 'Jusqu\u2019\u00e0 25\u00a0$ en Dollars R\u00e9compenses vous attendent',
    bonusTeaserSub: 'Effectuez deux achats pour d\u00e9bloquer votre bonus de bienvenue',
    vcTitle: 'Votre carte est pr\u00eate \u00e0 utiliser',
    vcBody: 'Votre pass d\u2019achat temporaire est pr\u00eat. Utilisez-le pour vos achats Walmart pendant que votre carte physique est en route.',
    vcPassLabel: 'PASS D\u2019ACHAT TEMPORAIRE',
    vcDetailUse: 'Pour les achats Walmart seulement',
    vcDetailLimit: 'Jusqu\u2019\u00e0 1\u00a0000\u00a0$ \u00b7 Valide 10 jours',
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
// A_declined — Application under review
// ═══════════════════════════════════════════════════════
export function Declined({ onNext, lang }) {
  return (
    <div className="ob-screen ob-center" style={{ justifyContent: 'center', minHeight: '100vh', gap: 0 }}>
      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--warning-bg)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="var(--warning)" strokeWidth="1.5" fill="none" />
          <path d="M12 8V13" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="1" fill="var(--warning)" />
        </svg>
      </div>

      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>
        {lang === 'fr' ? 'Votre demande est en cours d\u2019examen' : 'Your application is under review'}
      </h1>

      <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5, marginBottom: 32, maxWidth: 300 }}>
        {lang === 'fr'
          ? 'Nous examinons votre demande et vous enverrons une décision par courriel dans 1 à 2 jours ouvrables.'
          : 'We\u2019re reviewing your application and will send you a decision by email within 1\u20132 business days.'}
      </p>

      <button className="btn btn-primary" onClick={() => onNext()} style={{ marginBottom: 16 }}>
        {lang === 'fr' ? 'Explorer la carte sécurisée' : 'Explore secured card option'}
      </button>

      <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
        {lang === 'fr' ? 'Des questions\u00a0? Appelez le 1-800-XXX-XXXX' : 'Questions? Call 1-800-XXX-XXXX'}
      </div>
    </div>
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
          marginBottom: 24,
          width: '100%',
        }}
      >
        <WRMCCard masked={true} name="S. MARTIN" />
      </div>

      {/* Welcome bonus teaser */}
      <div
        style={{
          opacity: ctaVisible ? 1 : 0,
          transition: 'opacity 500ms ease-out',
          textAlign: 'center',
          marginBottom: 28,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: '#FFC220' }}>
          {T.bonusTeaser}
        </div>
        <div style={{ fontSize: 12, color: '#888888', marginTop: 4 }}>
          {T.bonusTeaserSub}
        </div>
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

      {/* Pass label */}
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 1,
        color: 'var(--text-muted)', marginBottom: 8, textAlign: 'center',
      }}>
        {T.vcPassLabel}
      </div>

      {/* Card */}
      <div style={{ marginBottom: 12, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <WRMCCard masked={false} name="S. MARTIN" />
      </div>

      {/* Details row */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 16,
        fontSize: 12, color: 'var(--text-muted)', marginBottom: 16,
      }}>
        <span>{T.vcDetailUse}</span>
        <span>{T.vcDetailLimit}</span>
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
