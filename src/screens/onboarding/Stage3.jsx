import { useState, useEffect } from 'react';
import { WRMCCard } from '../../components/WRMCCard';
import { WalmartSpark } from '../../components/WalmartSpark';

// ─── i18n ───────────────────────────────────────────────
const i18n = {
  en: {
    // Approval (3.1)
    approvedHeadline: "You're approved.",
    approvedSubtext: 'Welcome to Walmart Rewards Mastercard',
    setupAccount: 'Set up your account',
    bonusTeaser: 'Up to $25 in Reward Dollars waiting for you',
    bonusTeaserSub: 'Complete two purchases to unlock your welcome bonus',
    tspDetail: 'For Walmart purchases only',
    tspValidity: 'Valid for 10 days from approval',
    tspInfoBox: 'Your physical card will arrive in 5\u20137 business days. We\u2019ll notify you when it\u2019s ready to activate.',
    // Pending
    pendingTitle: 'Your application is being reviewed',
    pendingSub: 'We\u2019re reviewing your information. You\u2019ll receive an email at',
    pendingSub2: 'with a decision within 1\u20132 business days.',
    pendingCta: 'Got it',
    pendingHelp: 'Questions? Call 1-800-XXX-XXXX',
  },
  fr: {
    approvedHeadline: 'Vous \u00eates approuv\u00e9.',
    approvedSubtext: 'Bienvenue sur Walmart Rewards Mastercard',
    setupAccount: 'Configurer votre compte',
    bonusTeaser: 'Jusqu\u2019\u00e0 25\u00a0$ en Dollars R\u00e9compenses vous attendent',
    bonusTeaserSub: 'Effectuez deux achats pour d\u00e9bloquer votre bonus de bienvenue',
    tspDetail: 'Pour les achats Walmart seulement',
    tspValidity: 'Valide 10 jours \u00e0 compter de l\u2019approbation',
    tspInfoBox: 'Votre carte physique arrivera dans 5 \u00e0 7 jours ouvrables. Nous vous aviserons lorsqu\u2019elle sera pr\u00eate \u00e0 activer.',
    pendingTitle: 'Votre demande est en cours d\u2019examen',
    pendingSub: 'Nous examinons vos informations. Vous recevrez un courriel \u00e0',
    pendingSub2: 'avec une d\u00e9cision dans 1 \u00e0 2 jours ouvrables.',
    pendingCta: 'Compris',
    pendingHelp: 'Questions\u00a0? Appelez le 1-800-XXX-XXXX',
  },
};


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
export function Approval({ onNext, lang, tspLimit = 1000 }) {
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

  const limitStr = tspLimit >= 1000 ? '$1,000' : `$${tspLimit}`;

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

      <h1 style={{ color: '#ffffff', fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
        {T.approvedHeadline}
      </h1>
      <p style={{ color: '#999999', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
        {T.approvedSubtext}
      </p>

      {/* TSP Card */}
      <div
        style={{
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 600ms ease-out, transform 600ms ease-out',
          marginBottom: 12,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <WRMCCard variant="tsp" />
      </div>

      {/* TSP details line */}
      <div
        style={{
          opacity: cardVisible ? 1 : 0,
          transition: 'opacity 500ms ease-out',
          textAlign: 'center',
          fontSize: 12,
          color: '#999',
          marginBottom: 20,
        }}
      >
        {T.tspDetail}  &middot;  Up to {limitStr}  &middot;  {T.tspValidity}
      </div>

      {/* Info box */}
      <div
        style={{
          opacity: ctaVisible ? 1 : 0,
          transition: 'opacity 500ms ease-out',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 10,
          padding: '12px 16px',
          fontSize: 13,
          color: '#ccc',
          lineHeight: 1.5,
          marginBottom: 20,
          width: '100%',
          maxWidth: 320,
        }}
      >
        {T.tspInfoBox}
      </div>

      {/* Welcome bonus teaser */}
      <div
        style={{
          opacity: ctaVisible ? 1 : 0,
          transition: 'opacity 500ms ease-out',
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: '#FFC220' }}>
          {T.bonusTeaser}
        </div>
        <div style={{ fontSize: 12, color: '#888888', marginTop: 4 }}>
          {T.bonusTeaserSub}
        </div>
      </div>

      {/* CTA — "Set up your account" */}
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
        {T.setupAccount}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// A_pending — Application under review (income < $30K)
// ═══════════════════════════════════════════════════════
export function Pending({ onNext, lang, email = 'sarah@example.com' }) {
  const T = i18n[lang] || i18n.en;

  return (
    <div className="ob-screen ob-center" style={{ justifyContent: 'center', minHeight: '100vh', gap: 0 }}>
      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: '#FFF8E1', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
          <path d="M12 8V13" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="1" fill="#F59E0B" />
        </svg>
      </div>

      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>
        {T.pendingTitle}
      </h1>

      <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.5, marginBottom: 32, maxWidth: 300 }}>
        {T.pendingSub} <strong>{email}</strong> {T.pendingSub2}
      </p>

      <button className="btn btn-primary" onClick={() => onNext()} style={{ marginBottom: 16 }}>
        {T.pendingCta}
      </button>

      <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
        {T.pendingHelp}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// A_pending_home — Holding home for pending users
// ═══════════════════════════════════════════════════════

const pulseKeyframes = `
@keyframes pending-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
`;

export function PendingHome({ lang, email = 'sarah@example.com' }) {
  const T = i18n[lang] || i18n.en;

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px' }}>
      <style>{pulseKeyframes}</style>

      {/* Clock icon */}
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ marginBottom: 16, opacity: 0.5 }}>
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M24 14V26L30 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Title */}
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>
        {T.pendingTitle}
      </div>

      {/* Email + timeline text */}
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 280, textAlign: 'center', marginBottom: 24 }}>
        {T.pendingSub} <strong>{email}</strong> {T.pendingSub2}
      </div>

      {/* Status card */}
      <div style={{
        width: '100%', background: '#FAEEDA',
        border: '0.5px solid #F59E0B', borderRadius: 12,
        padding: 16, marginBottom: 16,
      }}>
        {/* Step 1 — complete */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2 }}>
            <div style={{
              width: 12, height: 12, borderRadius: '50%',
              background: '#16A34A', flexShrink: 0,
            }} />
            <div style={{ width: 1.5, flex: 1, background: '#D4D4D4', marginTop: 4 }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
              {lang === 'fr' ? 'Demande soumise' : 'Application submitted'}
            </div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
              {lang === 'fr' ? 'Re\u00e7ue et en cours d\u2019examen' : 'Received and under review'}
            </div>
          </div>
        </div>

        {/* Step 2 — active (pulsing) */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 2 }}>
            <div style={{
              width: 12, height: 12, borderRadius: '50%',
              background: '#F59E0B', flexShrink: 0,
              animation: 'pending-pulse 2s ease-in-out infinite',
            }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
              {lang === 'fr' ? 'D\u00e9cision en attente' : 'Decision pending'}
            </div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
              {lang === 'fr' ? 'Habituellement dans 1 \u00e0 2 jours ouvrables' : 'Usually within 1\u20132 business days'}
            </div>
          </div>
        </div>
      </div>

      {/* While you wait info section */}
      <div style={{
        width: '100%', background: '#fff',
        border: '0.5px solid #E5E5E5', borderRadius: 12,
        padding: 16, marginBottom: 24,
      }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 12 }}>
          {lang === 'fr' ? 'En attendant' : 'While you wait'}
        </div>

        {/* Row 1: Learn how rewards work */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0', borderBottom: '0.5px solid #F0F0F0',
            cursor: 'pointer',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
            <path d="M10 1L12.7 6.5L19 7.5L14.5 11.8L15.6 18L10 15L4.4 18L5.5 11.8L1 7.5L7.3 6.5L10 1Z" fill="#FFC220" />
          </svg>
          <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>
            {lang === 'fr' ? 'Comment fonctionnent les r\u00e9compenses Walmart' : 'Learn how Walmart Rewards work'}
          </span>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
            <path d="M7 4L13 10L7 16" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Row 2: Secured Mastercard */}
        <div
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '10px 0',
            cursor: 'pointer',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M10 18S16 15 16 10V4.5L10 2L4 4.5V10C4 15 10 18 10 18Z" fill="#6B21A8" opacity="0.15" stroke="#6B21A8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 10L9.5 12L13 8" stroke="#6B21A8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>
              {lang === 'fr' ? 'D\u00e9couvrir notre Mastercard garantie' : 'Explore our Secured Mastercard'}
            </div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
              {lang === 'fr' ? 'Une option si votre demande n\u00e9cessite un examen' : 'An option if your application needs review'}
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 4 }}>
            <path d="M7 4L13 10L7 16" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Help link */}
      <a
        href="tel:1-800-XXX-XXXX"
        style={{ fontSize: 13, color: '#666', textDecoration: 'none', marginBottom: 12 }}
      >
        {T.pendingHelp}
      </a>

      {/* Reassurance text */}
      <div style={{ fontSize: 11, color: '#999', textAlign: 'center', lineHeight: 1.5, maxWidth: 260 }}>
        {lang === 'fr'
          ? 'Vous pouvez fermer l\u2019appli et revenir quand vous voulez \u2014 nous vous aviserons par courriel lorsque votre d\u00e9cision sera pr\u00eate.'
          : 'You can close the app and return anytime \u2014 we\u2019ll notify you by email when your decision is ready.'}
      </div>
    </div>
  );
}
