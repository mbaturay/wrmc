import { useState, useEffect } from 'react';
import { OTPInput } from '../../components/OTPInput';

// ─── i18n ───────────────────────────────────────────────
const i18n = {
  en: {
    // VerifyIntro
    verifyIntroTitle: "Let's confirm your identity",
    verifyIntroBody: 'We need to verify who you are before issuing your card. It takes about 2 minutes.',
    verifyItem1: 'Government-issued ID (driver\'s licence or passport)',
    verifyItem2: 'A quick selfie',
    verifyItem3: 'Your phone nearby for a confirmation code',
    getStarted: 'I agree \u2014 get started',
    verifyDisclaimer: 'Your information is encrypted and never stored on this device',
    idConsentLabel: 'I consent to the collection and processing of my identity document and biometric data (selfie) by Fairstone Bank of Canada and its verification partner Onfido for the purpose of confirming my identity.',
    idConsentNote: 'This data is used only for identity verification and is not stored on your device. You may withdraw consent by contacting us at 1-888-331-6133.',
    // IDScan
    idScanTitle: 'Scan your ID',
    idScanInstruction: 'Hold your driver\'s licence or passport flat and steady within the frame',
    scanFront: 'Scan front of ID',
    scanning: 'Scanning...',
    frontCaptured: 'Front captured',
    scanBack: 'Scan back of ID',
    bothCaptured: 'Both sides captured',
    continue: 'Continue',
    // SelfieCheck
    selfieTitle: 'Now a quick selfie',
    selfieInstruction: 'Look straight ahead. Remove glasses if you\'re wearing them.',
    takeSelfie: 'Take selfie',
    analyzing: 'Analyzing...',
    identityConfirmed: 'Identity confirmed',
    // CreditConsent
    consentTitle: 'Review and submit',
    consentBody: 'Almost done. Please confirm the following before we process your application.',
    consentExpandBtn: 'What does this mean?',
    consentExpandText1: 'A soft credit check lets us verify your identity and assess eligibility without impacting your credit score.',
    consentExpandText2: 'Your information is shared securely and used only for this application.',
    consentExpandText3: 'You can request deletion of your data at any time by contacting support.',
    consentCheckbox: 'I consent to a credit bureau check as described above',
    consentCheckbox2: 'I confirm that the information I have provided is accurate and complete to the best of my knowledge.',
    consentAgree: 'Submit my application',
    consentCancel: 'No thanks, cancel application',
    // OTPVerify
    otpTitle: 'Confirm your phone number',
    otpBody: 'We sent a 6-digit code to the phone number you just entered. Enter it below to continue.',
    verifying: 'Verifying...',
    resendCode: 'Resend code',
    codeResent: 'Code resent',
    // Processing
    processingTitle: 'Reviewing your application\u2026',
    processingSubtext: 'This usually takes less than a minute',
  },
  fr: {
    // VerifyIntro
    verifyIntroTitle: 'Confirmons votre identité',
    verifyIntroBody: 'Nous devons vérifier qui vous êtes avant d\'émettre votre carte. Cela prend environ 2 minutes.',
    verifyItem1: 'Pièce d\'identité avec photo (permis de conduire ou passeport)',
    verifyItem2: 'Un selfie rapide',
    verifyItem3: 'Votre téléphone à proximité pour un code de confirmation',
    getStarted: 'J\u2019accepte \u2014 commencer',
    verifyDisclaimer: 'Vos informations sont chiffr\u00e9es et jamais stock\u00e9es sur cet appareil',
    idConsentLabel: 'Je consens \u00e0 la collecte et au traitement de mon document d\u2019identit\u00e9 et de mes donn\u00e9es biom\u00e9triques (selfie) par Fairstone Banque du Canada et son partenaire de v\u00e9rification Onfido, aux fins de confirmation de mon identit\u00e9.',
    idConsentNote: 'Ces donn\u00e9es sont utilis\u00e9es uniquement \u00e0 des fins de v\u00e9rification d\u2019identit\u00e9 et ne sont pas stock\u00e9es sur votre appareil. Vous pouvez retirer votre consentement en nous contactant au 1-888-331-6133.',
    // IDScan
    idScanTitle: 'Numérisez votre pièce d\'identité',
    idScanInstruction: 'Tenez votre permis de conduire ou passeport à plat et stable dans le cadre',
    scanFront: 'Numériser le recto',
    scanning: 'Numérisation...',
    frontCaptured: 'Recto capturé',
    scanBack: 'Numériser le verso',
    bothCaptured: 'Les deux côtés capturés',
    continue: 'Continuer',
    // SelfieCheck
    selfieTitle: 'Maintenant un selfie rapide',
    selfieInstruction: 'Regardez droit devant. Retirez vos lunettes si vous en portez.',
    takeSelfie: 'Prendre un selfie',
    analyzing: 'Analyse...',
    identityConfirmed: 'Identité confirmée',
    // CreditConsent
    consentTitle: 'Vérifier et soumettre',
    consentBody: 'Presque terminé. Veuillez confirmer ce qui suit avant de traiter votre demande.',
    consentExpandBtn: 'Qu\'est-ce que cela signifie ?',
    consentExpandText1: 'Une vérification de crédit douce nous permet de vérifier votre identité et d\'évaluer votre admissibilité sans affecter votre cote de crédit.',
    consentExpandText2: 'Vos informations sont partagées en toute sécurité et utilisées uniquement pour cette demande.',
    consentExpandText3: 'Vous pouvez demander la suppression de vos données à tout moment en contactant le support.',
    consentCheckbox: 'Je consens à une vérification du dossier de crédit tel que décrit ci-dessus',
    consentCheckbox2: 'Je confirme que les informations que j\'ai fournies sont exactes et complètes au meilleur de ma connaissance.',
    consentAgree: 'Soumettre ma demande',
    consentCancel: 'Non merci, annuler la demande',
    // OTPVerify
    otpTitle: 'Confirmez votre numéro de téléphone',
    otpBody: 'Nous avons envoy\u00e9 un code \u00e0 6 chiffres au num\u00e9ro que vous venez d\u2019entrer. Saisissez-le pour continuer.',
    verifying: 'Vérification...',
    resendCode: 'Renvoyer le code',
    codeResent: 'Code renvoyé',
    // Processing
    processingTitle: 'Examen de votre demande\u2026',
    processingSubtext: 'Cela prend généralement moins d\'une minute',
  },
};

// ─── Shared Back Button ─────────────────────────────────
function BackBtn({ onClick, lang }) {
  return (
    <button
      className="header-btn"
      onClick={onClick}
      style={{ alignSelf: 'flex-start', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)' }}
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {lang === 'fr' ? 'Retour' : 'Back'}
    </button>
  );
}

// ═══════════════════════════════════════════════════════
// VerifyIntro (Screen 2.1)
// ═══════════════════════════════════════════════════════
export function VerifyIntro({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;
  const [whyOpen, setWhyOpen] = useState(false);
  const [consented, setConsented] = useState(false);

  const icons = [
    <svg key="id" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="6" y1="10" x2="12" y2="10"/>
      <line x1="6" y1="14" x2="10" y2="14"/>
      <circle cx="17" cy="12" r="2.5"/>
    </svg>,
    <svg key="cam" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>,
    <svg key="phone" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2"/>
      <line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round" strokeWidth="2"/>
    </svg>,
  ];

  const items = [
    { icon: icons[0], text: T.verifyItem1 },
    { icon: icons[1], text: T.verifyItem2 },
    { icon: icons[2], text: T.verifyItem3 },
  ];

  const iconCircle = {
    width: 40, height: 40, borderRadius: '50%',
    background: '#F5F5F5', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  };

  return (
    <div className="ob-screen">
      <h1 className="ob-title" style={{ marginBottom: 8 }}>{T.verifyIntroTitle}</h1>
      <p className="ob-body" style={{ marginBottom: 28 }}>{T.verifyIntroBody}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16, width: '100%' }}>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '4px 0' }}>
            <div style={iconCircle}>{item.icon}</div>
            <span style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.4 }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Why do we need this? */}
      <div style={{
        marginBottom: 32, width: '100%',
        background: '#F5F5F5', border: '1px solid #E5E5E5',
        borderRadius: 8, overflow: 'hidden',
      }}>
        <button
          onClick={() => setWhyOpen(!whyOpen)}
          style={{
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px',
          }}
        >
          <span style={{
            width: 20, height: 20, borderRadius: '50%',
            background: '#E5E5E5', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 11, color: '#666', fontWeight: 600, flexShrink: 0,
          }}>?</span>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#333', textAlign: 'left' }}>
            {lang === 'fr' ? 'Pourquoi est-ce nécessaire\u00a0?' : 'Why do we need this?'}
          </span>
          <span style={{
            fontSize: 14, color: '#999',
            transition: 'transform 0.2s',
            transform: whyOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          }}>&#x203A;</span>
        </button>
        {whyOpen && (
          <div style={{
            fontSize: 13, color: '#666', lineHeight: 1.6,
            padding: '12px 16px',
            borderTop: '1px solid #E5E5E5',
          }}>
            {lang === 'fr'
              ? 'La vérification d\u2019identité vous protège et garantit que vous seul pouvez accéder à votre compte. Nous utilisons Onfido, un service tiers sécurisé, pour faire correspondre votre pièce d\u2019identité à votre visage. Vos données sont chiffrées et jamais stockées sur cet appareil.'
              : 'Identity verification helps protect you and ensures only you can access your account. We use Onfido, a secure third-party service, to match your ID to your face. Your data is encrypted and never stored on this device.'}
          </div>
        )}
      </div>

      {/* Biometric consent checkbox */}
      <div
        onClick={() => setConsented(!consented)}
        style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '14px 16px', background: '#F9F9F9',
          border: '1px solid var(--border)', borderRadius: 8,
          marginBottom: 8, cursor: 'pointer', userSelect: 'none',
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
          border: consented ? '2px solid var(--accent)' : '2px solid var(--border)',
          background: consented ? 'var(--accent)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s',
        }}>
          {consented && (
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {T.idConsentLabel}
        </span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 8, marginBottom: 20 }}>
        {T.idConsentNote}
      </p>

      <button
        className="btn btn-primary"
        onClick={() => onNext()}
        disabled={!consented}
        style={{ marginBottom: 16, opacity: consented ? 1 : 0.5 }}
      >
        {T.getStarted}
      </button>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
        {T.verifyDisclaimer}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// IDScan (Screen 2.2)
// ═══════════════════════════════════════════════════════
export function IDScan({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;

  // 'idle' | 'scanning-front' | 'front-done' | 'scanning-back' | 'done'
  const [scanState, setScanState] = useState('idle');

  useEffect(() => {
    let timer;
    if (scanState === 'scanning-front') {
      timer = setTimeout(() => setScanState('front-done'), 2000);
    } else if (scanState === 'scanning-back') {
      timer = setTimeout(() => setScanState('done'), 2000);
    }
    return () => clearTimeout(timer);
  }, [scanState]);

  const isScanning = scanState === 'scanning-front' || scanState === 'scanning-back';

  const renderFrameContent = () => {
    if (scanState === 'scanning-front' || scanState === 'scanning-back') {
      return <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>{T.scanning}</span>;
    }
    if (scanState === 'front-done') {
      return (
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 36, color: 'var(--success)' }}>&#10003;</span>
          <p style={{ fontSize: 13, color: 'var(--success)', marginTop: 4, fontWeight: 500 }}>{T.frontCaptured}</p>
        </div>
      );
    }
    if (scanState === 'done') {
      return (
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 36, color: 'var(--success)' }}>&#10003;</span>
          <p style={{ fontSize: 13, color: 'var(--success)', marginTop: 4, fontWeight: 500 }}>{T.bothCaptured}</p>
        </div>
      );
    }
    return null;
  };

  const renderButton = () => {
    if (scanState === 'idle') {
      return (
        <button className="btn btn-primary" onClick={() => setScanState('scanning-front')}>
          {T.scanFront}
        </button>
      );
    }
    if (scanState === 'front-done') {
      return (
        <button className="btn btn-primary" onClick={() => setScanState('scanning-back')}>
          {T.scanBack}
        </button>
      );
    }
    if (scanState === 'done') {
      return (
        <button className="btn btn-primary" onClick={() => onNext()}>
          {T.continue}
        </button>
      );
    }
    return null;
  };

  return (
    <div className="ob-screen">
      <h1 className="ob-title" style={{ marginBottom: 8 }}>{T.idScanTitle}</h1>
      <p className="ob-body" style={{ marginBottom: 24 }}>{T.idScanInstruction}</p>

      <div className="ob-viewfinder" style={{ width: 280, height: 180, margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {renderFrameContent()}
      </div>

      {renderButton()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SelfieCheck (Screen 2.3)
// ═══════════════════════════════════════════════════════
export function SelfieCheck({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;

  // 'idle' | 'scanning' | 'done'
  const [state, setState] = useState('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (state !== 'scanning') return;

    // Animate progress from 0 to 100 over 3 seconds
    setProgress(0);
    const start = Date.now();
    const duration = 3000;
    let raf;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct * 100);
      if (pct < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setState('done');
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [state]);

  // SVG circle parameters
  const circleR = 92;
  const circumference = 2 * Math.PI * circleR;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="ob-screen">
      <h1 className="ob-title" style={{ marginBottom: 8 }}>{T.selfieTitle}</h1>
      <p className="ob-body" style={{ marginBottom: 24 }}>{T.selfieInstruction}</p>

      <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 24px' }}>
        <div
          className="ob-viewfinder-circle"
          style={{
            width: 200,
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {state === 'scanning' && (
            <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>{T.analyzing}</span>
          )}
          {state === 'done' && (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 40, color: 'var(--success)' }}>&#10003;</span>
              <p style={{ fontSize: 13, color: 'var(--success)', marginTop: 4, fontWeight: 500 }}>{T.identityConfirmed}</p>
            </div>
          )}
        </div>

        {(state === 'scanning' || state === 'done') && (
          <>
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
            >
              {/* Track */}
              <circle cx="100" cy="100" r={circleR} fill="none" stroke="#E5E5E5" strokeWidth="4" />
              {/* Progress */}
              <circle
                cx="100"
                cy="100"
                r={circleR}
                fill="none"
                stroke="#FFC220"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={state === 'done' ? 0 : dashOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
              />
            </svg>
          </>
        )}
      </div>

      {state === 'idle' && (
        <button className="btn btn-primary" onClick={() => setState('scanning')}>
          {T.takeSelfie}
        </button>
      )}
      {state === 'done' && (
        <button className="btn btn-primary" onClick={() => onNext()}>
          {T.continue}
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CreditConsent (Screen 2.4)
// ═══════════════════════════════════════════════════════
export function CreditConsent({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="ob-screen">
      <h1 className="ob-title" style={{ marginBottom: 8 }}>{T.consentTitle}</h1>
      <p className="ob-body" style={{ marginBottom: 20, lineHeight: 1.6 }}>{T.consentBody}</p>

      {/* Expandable section */}
      <button
        className="expandable-header"
        onClick={() => setExpanded(!expanded)}
        style={{ marginBottom: expanded ? 8 : 20 }}
      >
        <span>{T.consentExpandBtn}</span>
        <span style={{ transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: 12 }}>
          &#9660;
        </span>
      </button>

      {expanded && (
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20, paddingLeft: 4 }}>
          <p style={{ marginBottom: 8 }}>{T.consentExpandText1}</p>
          <p style={{ marginBottom: 8 }}>{T.consentExpandText2}</p>
          <p>{T.consentExpandText3}</p>
        </div>
      )}

      {/* Checkbox */}
      <div
        onClick={() => setChecked(!checked)}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          cursor: 'pointer',
          marginBottom: 8,
          padding: '4px 0',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            border: checked ? '2px solid var(--accent)' : '2px solid var(--border)',
            background: checked ? 'var(--accent)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s',
            marginTop: 1,
          }}
        >
          {checked && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 }}>
          {T.consentCheckbox}
        </span>
      </div>

      {/* Accuracy confirmation checkbox */}
      <div
        onClick={() => setConfirmed(!confirmed)}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          cursor: 'pointer',
          marginBottom: 32,
          padding: '4px 0',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            border: confirmed ? '2px solid var(--accent)' : '2px solid var(--border)',
            background: confirmed ? 'var(--accent)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s',
            marginTop: 1,
          }}
        >
          {confirmed && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 }}>
          {T.consentCheckbox2}
        </span>
      </div>

      <button
        className="btn btn-primary"
        disabled={!checked || !confirmed}
        onClick={() => onNext()}
        style={{ opacity: (checked && confirmed) ? 1 : 0.5, marginBottom: 16 }}
      >
        {T.consentAgree}
      </button>

      <button
        onClick={() => onBack('welcome')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          fontSize: 13,
          textAlign: 'center',
          width: '100%',
          padding: 8,
        }}
      >
        {T.consentCancel}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// OTPVerify (Screen 2.5)
// ═══════════════════════════════════════════════════════
export function OTPVerify({ onNext, onBack, lang }) {
  const T = i18n[lang] || i18n.en;
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleCode = () => {
    setLoading(true);
    setTimeout(() => {
      onNext();
    }, 1000);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  return (
    <div className="ob-screen">
      <h1 className="ob-title" style={{ marginBottom: 8 }}>{T.otpTitle}</h1>
      <p className="ob-body" style={{ marginBottom: 24 }}>{T.otpBody}</p>

      <OTPInput length={6} onComplete={handleCode} />

      {loading && (
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 16, textAlign: 'center' }}>
          {T.verifying}
        </p>
      )}

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button
          onClick={handleResend}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 14,
            color: 'var(--text-secondary)',
            cursor: resendTimer > 0 ? 'default' : 'pointer',
            opacity: resendTimer > 0 ? 0.4 : 1,
            pointerEvents: resendTimer > 0 ? 'none' : 'auto',
            transition: 'opacity 0.3s',
          }}
        >
          {T.resendCode}{resendTimer > 0 ? ` (${resendTimer}s)` : ''}
        </button>
      </div>

      {/* Toast */}
      {toastVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--accent)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: 'var(--radius)',
            fontSize: 14,
            fontWeight: 500,
            boxShadow: 'var(--shadow-md)',
            zIndex: 50,
          }}
        >
          {T.codeResent}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// Processing (Screen 2.6)
// ═══════════════════════════════════════════════════════
const pulseKeyframes = `
@keyframes ob-pulse-dot {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1.2); }
}
`;

export function Processing({ onNext, lang }) {
  const T = i18n[lang] || i18n.en;

  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="ob-screen ob-center" style={{ justifyContent: 'center', minHeight: '100vh', gap: 0 }}>
      <style>{pulseKeyframes}</style>

      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'var(--accent)',
              animation: 'ob-pulse-dot 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <h1 className="ob-title" style={{ marginBottom: 8 }}>{T.processingTitle}</h1>
      <p className="ob-subtitle">{T.processingSubtext}</p>
    </div>
  );
}
