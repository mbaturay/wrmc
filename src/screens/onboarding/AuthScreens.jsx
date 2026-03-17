import { useState, useEffect } from 'react';

// ─── i18n ───────────────────────────────────────────────
const i18n = {
  en: {
    // E_signin
    signIn: 'Sign in',
    email: 'Email',
    password: 'Password',
    signInBtn: 'Sign in',
    signingIn: 'Signing in...',
    forgotPw: 'Forgot your password?',
    noAccount: "Don't have an account?",
    faceIdBtn: 'Sign in with Face ID',
    usePwInstead: 'Use password instead',
    // G_reauth
    reauthTitle: 'You were signed out for security',
    reauthSub: 'Sign in to continue',
    // H_forgot_pw
    resetTitle: 'Reset your password',
    resetBody: "Enter your email and we'll send a reset link.",
    sendReset: 'Send reset link',
    sending: 'Sending...',
    // H_check_email
    checkTitle: 'Check your inbox',
    checkBodyPre: 'We sent a reset link to ',
    checkBodyPost: '. Check your spam folder if you don\'t see it.',
    backToSignIn: 'Back to sign in',
    resend: 'Resend link',
    needHelp: 'Need help? Call 1-800-XXX-XXXX',
    // H_locked
    lockedTitle: 'Account temporarily locked',
    lockedBody: 'Too many failed attempts. For your security, we\'ve temporarily locked your account.',
    resetByEmail: 'Reset by email',
    callToUnlock: 'Call us to unlock',
    callNumber: '1-800-XXX-XXXX',
    lockedNote: 'Locks clear automatically after 30 minutes',
    back: 'Back',
  },
  fr: {
    signIn: 'Connexion',
    email: 'Courriel',
    password: 'Mot de passe',
    signInBtn: 'Se connecter',
    signingIn: 'Connexion en cours...',
    forgotPw: 'Mot de passe oublié\u00a0?',
    noAccount: 'Pas encore de compte\u00a0?',
    faceIdBtn: 'Se connecter avec Face ID',
    usePwInstead: 'Utiliser le mot de passe',
    reauthTitle: 'Vous avez été déconnecté pour votre sécurité',
    reauthSub: 'Connectez-vous pour continuer',
    resetTitle: 'Réinitialiser votre mot de passe',
    resetBody: 'Entrez votre courriel et nous vous enverrons un lien de réinitialisation.',
    sendReset: 'Envoyer le lien',
    sending: 'Envoi en cours...',
    checkTitle: 'Vérifiez votre boîte de réception',
    checkBodyPre: 'Nous avons envoyé un lien de réinitialisation à ',
    checkBodyPost: '. Vérifiez vos courriels indésirables si vous ne le voyez pas.',
    backToSignIn: 'Retour à la connexion',
    resend: 'Renvoyer le lien',
    needHelp: 'Besoin d\'aide\u00a0? Appelez le 1-800-XXX-XXXX',
    lockedTitle: 'Compte temporairement verrouillé',
    lockedBody: 'Trop de tentatives échouées. Pour votre sécurité, nous avons temporairement verrouillé votre compte.',
    resetByEmail: 'Réinitialiser par courriel',
    callToUnlock: 'Appelez-nous pour déverrouiller',
    callNumber: '1-800-XXX-XXXX',
    lockedNote: 'Le verrouillage se lève automatiquement après 30 minutes',
    back: 'Retour',
  },
};

// ─── Walmart Spark SVG ──────────────────────────────────
function WalmartSpark({ size = 48 }) {
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

// ─── Face ID icon ───────────────────────────────────────
function FaceIdIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="40" height="40" rx="10" stroke="#333" strokeWidth="2" fill="none" />
      <circle cx="17" cy="20" r="2" fill="#333" />
      <circle cx="31" cy="20" r="2" fill="#333" />
      <path d="M16 30C18 33 22 35 24 35C26 35 30 33 32 30" stroke="#333" strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="24" y1="20" x2="24" y2="27" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Phone call row ─────────────────────────────────────
function CallRow({ lang }) {
  const T = i18n[lang] || i18n.en;
  return (
    <a
      href="tel:1-800-XXX-XXXX"
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px', background: '#F5F5F5',
        borderRadius: 'var(--radius-lg, 12px)', textDecoration: 'none',
        color: 'var(--text-primary)', marginTop: 12,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3 4.5C3 3.67 3.67 3 4.5 3H7.5L9 7L7.5 8C8.5 10 10 11.5 12 12.5L13 11L17 12.5V15.5C17 16.33 16.33 17 15.5 17C8.6 17 3 11.4 3 4.5Z" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      </svg>
      <span style={{ fontSize: 15, fontWeight: 600 }}>{T.callNumber}</span>
    </a>
  );
}

// ═══════════════════════════════════════════════════════
// E_signin — Sign in
// ═══════════════════════════════════════════════════════
export function SignIn({
  onNext, onBack, lang,
  biometricEnabled, failedAttempts, setFailedAttempts,
  goToBranch, onComplete,
}) {
  const T = i18n[lang] || i18n.en;
  const [email, setEmail] = useState('sarah@example.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(!biometricEnabled);
  const [bioLoading, setBioLoading] = useState(false);

  const handleSignIn = () => {
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      // Prototype: any credentials succeed
      onComplete(false, false, false);
    }, 1000);
  };

  const handleBiometric = () => {
    setBioLoading(true);
    setTimeout(() => {
      onComplete(false, false, false);
    }, 1000);
  };

  return (
    <div className="ob-screen">
      <div style={{ textAlign: 'center', marginBottom: 24, marginTop: 16 }}>
        <WalmartSpark size={48} />
      </div>

      <h1 className="ob-title" style={{ marginBottom: 24, textAlign: 'center' }}>
        {T.signIn}
      </h1>

      {/* Biometric option */}
      {biometricEnabled && !showForm && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button
            onClick={handleBiometric}
            disabled={bioLoading}
            style={{
              background: 'none', border: '2px solid var(--border)',
              borderRadius: 16, padding: '24px 40px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 12, margin: '0 auto', opacity: bioLoading ? 0.6 : 1,
            }}
          >
            <FaceIdIcon />
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
              {bioLoading ? T.signingIn : T.faceIdBtn}
            </span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500,
              marginTop: 20, padding: 8,
            }}
          >
            {T.usePwInstead}
          </button>
        </div>
      )}

      {/* Email/password form */}
      {showForm && (
        <>
          <div style={{ marginBottom: 14 }}>
            <label
              htmlFor="signin-email"
              style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}
            >
              {T.email}
            </label>
            <input
              id="signin-email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label
              htmlFor="signin-password"
              style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}
            >
              {T.password}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                style={{ paddingRight: 60 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500,
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: 24 }}>
            <button
              onClick={() => goToBranch('H_forgot_pw')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500,
                padding: '4px 0',
              }}
            >
              {T.forgotPw}
            </button>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSignIn}
            disabled={loading || !email || !password}
            style={{ opacity: (loading || !email || !password) ? 0.6 : 1, marginBottom: 20 }}
          >
            {loading ? T.signingIn : T.signInBtn}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={onBack}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500,
                padding: 8,
              }}
            >
              {T.noAccount}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// G_reauth — Session expired re-auth
// ═══════════════════════════════════════════════════════
export function ReAuth({ lang, biometricEnabled, goToBranch, onComplete }) {
  const T = i18n[lang] || i18n.en;
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(!biometricEnabled);
  const [bioLoading, setBioLoading] = useState(false);

  const handleSignIn = () => {
    if (!password) return;
    setLoading(true);
    setTimeout(() => {
      onComplete(false, false, false);
    }, 1000);
  };

  const handleBiometric = () => {
    setBioLoading(true);
    setTimeout(() => {
      onComplete(false, false, false);
    }, 1000);
  };

  return (
    <div className="ob-screen">
      <div style={{ textAlign: 'center', marginBottom: 24, marginTop: 16 }}>
        <WalmartSpark size={48} />
      </div>

      <h1 className="ob-title" style={{ marginBottom: 8, textAlign: 'center' }}>
        {T.reauthTitle}
      </h1>
      <p className="ob-body" style={{ marginBottom: 32, textAlign: 'center' }}>
        {T.reauthSub}
      </p>

      {/* Biometric option */}
      {biometricEnabled && !showForm && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button
            onClick={handleBiometric}
            disabled={bioLoading}
            style={{
              background: 'none', border: '2px solid var(--border)',
              borderRadius: 16, padding: '24px 40px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 12, margin: '0 auto', opacity: bioLoading ? 0.6 : 1,
            }}
          >
            <FaceIdIcon />
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
              {bioLoading ? T.signingIn : T.faceIdBtn}
            </span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500,
              marginTop: 20, padding: 8,
            }}
          >
            {T.usePwInstead}
          </button>
        </div>
      )}

      {/* Password form */}
      {showForm && (
        <>
          <div style={{ marginBottom: 14 }}>
            <label
              style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}
            >
              {T.email}
            </label>
            <input
              type="email"
              className="input"
              value="sarah@example.com"
              disabled
              style={{ opacity: 0.5 }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label
              htmlFor="reauth-password"
              style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}
            >
              {T.password}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reauth-password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                style={{ paddingRight: 60 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500,
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: 24 }}>
            <button
              onClick={() => goToBranch('H_forgot_pw')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500,
                padding: '4px 0',
              }}
            >
              {T.forgotPw}
            </button>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSignIn}
            disabled={loading || !password}
            style={{ opacity: (loading || !password) ? 0.6 : 1 }}
          >
            {loading ? T.signingIn : T.signInBtn}
          </button>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// H_forgot_pw — Forgot password
// ═══════════════════════════════════════════════════════
export function ForgotPassword({ onBack, lang, goToBranch }) {
  const T = i18n[lang] || i18n.en;
  const [email, setEmail] = useState('sarah@example.com');
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      goToBranch('H_check_email');
    }, 1000);
  };

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
        {T.back}
      </button>

      <h1 className="ob-title" style={{ marginBottom: 8 }}>{T.resetTitle}</h1>
      <p className="ob-body" style={{ marginBottom: 24 }}>{T.resetBody}</p>

      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="reset-email"
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}
        >
          {T.email}
        </label>
        <input
          id="reset-email"
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={handleSend}
        disabled={loading || !email}
        style={{ opacity: (loading || !email) ? 0.6 : 1 }}
      >
        {loading ? T.sending : T.sendReset}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// H_check_email — Check your inbox
// ═══════════════════════════════════════════════════════
export function CheckEmail({ lang, goToBranch }) {
  const T = i18n[lang] || i18n.en;
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  return (
    <div className="ob-screen">
      <div style={{ textAlign: 'center', marginTop: 32, marginBottom: 24 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect x="6" y="12" width="36" height="24" rx="3" stroke="#333" strokeWidth="2" fill="none" />
          <path d="M6 15L24 27L42 15" stroke="#333" strokeWidth="2" strokeLinejoin="round" fill="none" />
        </svg>
      </div>

      <h1 className="ob-title" style={{ marginBottom: 8, textAlign: 'center' }}>{T.checkTitle}</h1>
      <p className="ob-body" style={{ marginBottom: 32, textAlign: 'center' }}>
        {T.checkBodyPre}<strong>sarah@example.com</strong>{T.checkBodyPost}
      </p>

      <button
        className="btn btn-primary"
        onClick={() => goToBranch('E_signin')}
        style={{ marginBottom: 16 }}
      >
        {T.backToSignIn}
      </button>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button
          onClick={() => { if (resendTimer <= 0) setResendTimer(30); }}
          style={{
            background: 'none', border: 'none', cursor: resendTimer > 0 ? 'default' : 'pointer',
            fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500,
            opacity: resendTimer > 0 ? 0.4 : 1, padding: 8,
          }}
        >
          {T.resend}{resendTimer > 0 ? ` (${resendTimer}s)` : ''}
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <a
          href="tel:1-800-XXX-XXXX"
          style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}
        >
          {T.needHelp}
        </a>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// H_locked — Account locked
// ═══════════════════════════════════════════════════════
export function AccountLocked({ lang, goToBranch }) {
  const T = i18n[lang] || i18n.en;

  return (
    <div className="ob-screen">
      <div style={{ textAlign: 'center', marginTop: 32, marginBottom: 24 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect x="12" y="20" width="24" height="18" rx="3" stroke="#333" strokeWidth="2" fill="none" />
          <path d="M16 20V16C16 11.58 19.58 8 24 8C28.42 8 32 11.58 32 16V20" stroke="#333" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="24" cy="30" r="2.5" fill="#333" />
        </svg>
      </div>

      <h1 className="ob-title" style={{ marginBottom: 8, textAlign: 'center' }}>{T.lockedTitle}</h1>
      <p className="ob-body" style={{ marginBottom: 32, textAlign: 'center' }}>{T.lockedBody}</p>

      <button
        className="btn btn-primary"
        onClick={() => goToBranch('H_forgot_pw')}
        style={{ marginBottom: 12 }}
      >
        {T.resetByEmail}
      </button>

      <a
        href="tel:1-800-XXX-XXXX"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '14px 16px', background: '#F5F5F5',
          borderRadius: 'var(--radius-lg, 12px)', textDecoration: 'none',
          color: 'var(--text-primary)', marginBottom: 24,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 4.5C3 3.67 3.67 3 4.5 3H7.5L9 7L7.5 8C8.5 10 10 11.5 12 12.5L13 11L17 12.5V15.5C17 16.33 16.33 17 15.5 17C8.6 17 3 11.4 3 4.5Z" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
        </svg>
        <span style={{ fontSize: 15, fontWeight: 600 }}>{T.callToUnlock}</span>
        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{T.callNumber}</span>
      </a>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
        {T.lockedNote}
      </p>
    </div>
  );
}
