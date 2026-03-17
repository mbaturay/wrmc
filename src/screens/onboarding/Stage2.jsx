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
    getStarted: 'Get started',
    verifyDisclaimer: 'Your information is encrypted and never stored on this device',
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
    consentTitle: 'One more step',
    consentBody: 'To complete your application, we need to perform a credit check through Equifax and TransUnion. This is a soft inquiry and will not affect your credit score.',
    consentExpandBtn: 'What does this mean?',
    consentExpandText1: 'A soft credit check lets us verify your identity and assess eligibility without impacting your credit score.',
    consentExpandText2: 'Your information is shared securely and used only for this application.',
    consentExpandText3: 'You can request deletion of your data at any time by contacting support.',
    consentCheckbox: 'I consent to a credit bureau check as described above',
    consentAgree: 'I agree and continue',
    consentCancel: 'No thanks, cancel application',
    // OTPVerify
    otpTitle: 'Confirm your phone number',
    otpBody: 'We sent a 6-digit code to +1 (•••) •••-4821',
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
    getStarted: 'Commencer',
    verifyDisclaimer: 'Vos informations sont chiffrées et jamais stockées sur cet appareil',
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
    consentTitle: 'Une dernière étape',
    consentBody: 'Pour compléter votre demande, nous devons effectuer une vérification de crédit auprès d\'Equifax et TransUnion. Il s\'agit d\'une enquête douce qui n\'affectera pas votre cote de crédit.',
    consentExpandBtn: 'Qu\'est-ce que cela signifie ?',
    consentExpandText1: 'Une vérification de crédit douce nous permet de vérifier votre identité et d\'évaluer votre admissibilité sans affecter votre cote de crédit.',
    consentExpandText2: 'Vos informations sont partagées en toute sécurité et utilisées uniquement pour cette demande.',
    consentExpandText3: 'Vous pouvez demander la suppression de vos données à tout moment en contactant le support.',
    consentCheckbox: 'Je consens à une vérification du dossier de crédit tel que décrit ci-dessus',
    consentAgree: 'J\'accepte et continue',
    consentCancel: 'Non merci, annuler la demande',
    // OTPVerify
    otpTitle: 'Confirmez votre numéro de téléphone',
    otpBody: 'Nous avons envoyé un code à 6 chiffres au +1 (•••) •••-4821',
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

  const items = [
    { icon: '\uD83E\uDEAA', text: T.verifyItem1 },
    { icon: '\uD83D\uDCF8', text: T.verifyItem2 },
    { icon: '\uD83D\uDCF1', text: T.verifyItem3 },
  ];

  return (
    <div className="ob-screen">
      <BackBtn onClick={onBack} lang={lang} />

      <h1 className="ob-title" style={{ marginBottom: 8 }}>{T.verifyIntroTitle}</h1>
      <p className="ob-body" style={{ marginBottom: 28 }}>{T.verifyIntroBody}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32, width: '100%' }}>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
            <span style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.4 }}>{item.text}</span>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" onClick={() => onNext()} style={{ marginBottom: 16 }}>
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
      <BackBtn onClick={onBack} lang={lang} />

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
      <BackBtn onClick={onBack} lang={lang} />

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

        {state === 'scanning' && (
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
          >
            <circle
              cx="100"
              cy="100"
              r={circleR}
              fill="none"
              stroke="var(--success)"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>
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

  return (
    <div className="ob-screen">
      <BackBtn onClick={onBack} lang={lang} />

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
          marginBottom: 24,
          padding: '12px 0',
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

      <button
        className="btn btn-primary"
        disabled={!checked}
        onClick={() => onNext()}
        style={{ opacity: checked ? 1 : 0.5, marginBottom: 16 }}
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
      <BackBtn onClick={onBack} lang={lang} />

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
