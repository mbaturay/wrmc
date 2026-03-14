import { useState, useEffect, useRef } from 'react';
import { AnimatedCounter } from '../components/AnimatedCounter';

// ─── Shared small components ───

function BackButton({ onClick, label = 'Back' }) {
  return (
    <button
      className="header-btn"
      onClick={onClick}
      aria-label={label}
      style={{
        alignSelf: 'flex-start',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 13,
        color: 'var(--text-secondary)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {label}
    </button>
  );
}

function StepIndicator({ current, total }) {
  return (
    <div className="step-indicator">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`step-dot-sm ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`} />
      ))}
    </div>
  );
}

function FormField({ label, id, type = 'text', value, onChange, error, placeholder, autoComplete, maxLength, inputMode, style }) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === 'password';
  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={isPw ? (showPw ? 'text' : 'password') : type}
          className={`input ${error ? 'error' : ''}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          inputMode={inputMode}
          style={{ width: '100%', ...style }}
        />
        {isPw && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)',
            }}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

// ─── Main Onboarding component ───

export function Onboarding({ onboardingData, setOnboardingData, onComplete, onCompleteNewUser }) {
  const [view, setView] = useState('entry');

  // Sign-in state
  const [signEmail, setSignEmail] = useState('');
  const [signPass, setSignPass] = useState('');
  const [signError, setSignError] = useState('');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');

  // Create account
  const [firstName, setFirstName] = useState(onboardingData.firstName);
  const [lastName, setLastName] = useState(onboardingData.lastName);
  const [email, setEmail] = useState(onboardingData.email);
  const [password, setPassword] = useState('demo1234');
  const [confirmPw, setConfirmPw] = useState('demo1234');
  const [createErrors, setCreateErrors] = useState({});

  // Card linking
  const [cardNum, setCardNum] = useState('4829');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('');
  const [cardVerifying, setCardVerifying] = useState(false);
  const [cardError, setCardError] = useState('');

  // Card activation
  const [activationAttempts, setActivationAttempts] = useState(0);
  const [activationChecking, setActivationChecking] = useState(false);

  // OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpResent, setOtpResent] = useState(false);
  const otpRefs = useRef([]);

  // Welcome
  const [showCounter, setShowCounter] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);

  // Resume
  const [pendingResume, setPendingResume] = useState(null);

  // Welcome animation — must be at top level (Rules of Hooks)
  useEffect(() => {
    if (view !== 'welcome') return;
    setShowCounter(false);
    setShowGetStarted(false);
    const t1 = setTimeout(() => setShowCounter(true), 600);
    const t2 = setTimeout(() => setShowGetStarted(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [view]);

  // Check for pending signup on mount
  useEffect(() => {
    const pending = localStorage.getItem('wrmc_pending_signup');
    if (pending) {
      try {
        const data = JSON.parse(pending);
        const savedAt = new Date(data.savedAt);
        const daysSince = (Date.now() - savedAt) / (1000 * 60 * 60 * 24);
        if (daysSince <= 7) {
          setPendingResume(data);
          setView('resume');
        } else {
          localStorage.removeItem('wrmc_pending_signup');
        }
      } catch {
        localStorage.removeItem('wrmc_pending_signup');
      }
    }
  }, []);

  // ─── Resume ───
  if (view === 'resume') {
    return (
      <div className="onboarding-screen" style={{ justifyContent: 'center' }}>
        <img src="/logo.svg" alt="Walmart Rewards Mastercard"
          className="onboarding-logo" style={{ width: 64, height: 64, marginBottom: 24 }} />

        <h1 style={{ fontSize: 22, marginBottom: 8 }}>
          Welcome back, {pendingResume?.firstName}.
        </h1>
        <p style={{ textAlign: 'center', marginBottom: 4 }}>
          You were setting up your account.
        </p>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>
          Your card ending in {pendingResume?.cardNumMasked?.slice(-4)} still needs to be activated.
        </p>

        <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (pendingResume?.firstName) setFirstName(pendingResume.firstName);
              if (pendingResume?.lastName) setLastName(pendingResume.lastName);
              if (pendingResume?.email) setEmail(pendingResume.email);
              setView('card-inactive');
            }}
          >
            Continue setup
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              localStorage.removeItem('wrmc_pending_signup');
              setPendingResume(null);
              setView('entry');
            }}
          >
            Start over
          </button>
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 20, textAlign: 'center' }}>
          Your account details were saved for 7 days
        </div>
      </div>
    );
  }

  // ─── Entry ───
  if (view === 'entry') {
    return (
      <div className="onboarding-screen" style={{ justifyContent: 'center' }}>
        <img src="/logo.svg" alt="Walmart Rewards Mastercard" className="onboarding-logo" style={{ width: 64, height: 64, marginBottom: 20 }} />
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>Walmart Rewards Mastercard</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
          Manage your card, track your Reward Dollars, and pay your bill — all in one place.
        </p>
        <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-primary" onClick={() => setView('create-details')}>Create Account</button>
          <button className="btn btn-ghost" onClick={() => setView('signin')}>Sign In</button>
        </div>
      </div>
    );
  }

  // ─── Sign In ───
  if (view === 'signin') {
    function handleSignIn() {
      if (signPass === 'wrong123') {
        setSignError('Email or password is incorrect. Please try again.');
        setSignPass('');
        return;
      }
      onComplete();
    }
    return (
      <div className="onboarding-screen" style={{ alignItems: 'stretch', paddingTop: 16 }}>
        <BackButton onClick={() => setView('entry')} />
        <h1 style={{ textAlign: 'center' }}>Sign In</h1>
        <div style={{ maxWidth: 340, margin: '0 auto', width: '100%' }}>
          <FormField label="Email" id="sign-email" type="email" value={signEmail} onChange={e => setSignEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          <FormField
            label="Password" id="sign-pass" type="password" value={signPass}
            onChange={e => { setSignPass(e.target.value); setSignError(''); }}
            error={signError} autoComplete="current-password"
          />
          <button className="btn btn-primary" onClick={handleSignIn} style={{ marginTop: 8 }}>Sign In</button>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => { setForgotEmail(signEmail); setView('forgot-email'); }}
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Forgot Password — Enter Email ───
  if (view === 'forgot-email') {
    return (
      <div className="onboarding-screen" style={{ alignItems: 'stretch', paddingTop: 16 }}>
        <BackButton onClick={() => setView('signin')} />
        <h1 style={{ textAlign: 'center' }}>Reset your password</h1>
        <p style={{ textAlign: 'center', margin: '0 auto 20px' }}>Enter the email address on your account and we'll send you a reset link.</p>
        <div style={{ maxWidth: 340, margin: '0 auto', width: '100%' }}>
          <FormField label="Email" id="forgot-email" type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="you@example.com" />
          <button className="btn btn-primary" onClick={() => setView('forgot-sent')} style={{ marginTop: 8 }}>Send Reset Link</button>
        </div>
      </div>
    );
  }

  // ─── Forgot Password — Sent ───
  if (view === 'forgot-sent') {
    return (
      <div className="onboarding-screen" style={{ justifyContent: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h1>Check your email</h1>
        <p>We sent a reset link to {forgotEmail || 'your email'}</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 0 }}>It may take a few minutes to arrive. Check your spam folder if you don't see it.</p>
        <button className="btn btn-ghost" onClick={() => setView('signin')} style={{ maxWidth: 300, marginTop: 16 }}>Back to Sign In</button>
      </div>
    );
  }

  // ─── Create Account — Personal Details ───
  if (view === 'create-details') {
    function handleContinue() {
      const errs = {};
      if (!firstName.trim()) errs.firstName = 'Required';
      if (!lastName.trim()) errs.lastName = 'Required';
      if (!email.includes('@')) errs.email = 'Please enter a valid email address';
      if (password.length < 8) errs.password = 'Password must be at least 8 characters';
      if (password !== confirmPw) errs.confirmPw = "Passwords don't match";
      setCreateErrors(errs);
      if (Object.keys(errs).length > 0) return;
      setOnboardingData(prev => ({ ...prev, firstName, lastName, email }));
      setView('create-card');
    }
    return (
      <div className="onboarding-screen" style={{ alignItems: 'stretch', paddingTop: 16 }}>
        <BackButton onClick={() => setView('entry')} />
        <h1 style={{ textAlign: 'center' }}>Create Account</h1>
        <StepIndicator current={0} total={3} />
        <div style={{ maxWidth: 340, margin: '0 auto', width: '100%' }}>
          <FormField label="First name" id="c-first" value={firstName} onChange={e => setFirstName(e.target.value)} error={createErrors.firstName} autoComplete="given-name" />
          <FormField label="Last name" id="c-last" value={lastName} onChange={e => setLastName(e.target.value)} error={createErrors.lastName} autoComplete="family-name" />
          <FormField label="Email" id="c-email" type="email" value={email} onChange={e => setEmail(e.target.value)} error={createErrors.email} autoComplete="email" />
          <FormField label="Password" id="c-pass" type="password" value={password} onChange={e => setPassword(e.target.value)} error={createErrors.password} autoComplete="new-password" />
          <FormField label="Confirm password" id="c-pass2" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} error={createErrors.confirmPw} autoComplete="new-password" />
          <button className="btn btn-primary" onClick={handleContinue} style={{ marginTop: 4 }}>Continue</button>
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>Pre-filled for demo</div>
        </div>
      </div>
    );
  }

  // ─── Create Account — Link Card ───
  if (view === 'create-card') {
    function formatCardNumber(val) {
      const digits = val.replace(/\D/g, '').slice(0, 16);
      return digits.replace(/(.{4})/g, '$1 ').trim();
    }
    function formatExpiry(val) {
      const digits = val.replace(/\D/g, '').slice(0, 4);
      if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
      return digits;
    }
    function handleVerify() {
      const digits = cardNum.replace(/\D/g, '');

      // Expiry validation
      const expiryDigits = cardExpiry.replace(/\D/g, '');
      if (expiryDigits.length < 4) {
        setCardError('Please enter a valid expiry date (MM/YY)');
        return;
      }
      const expMonth = parseInt(expiryDigits.slice(0, 2), 10);
      const expYear = 2000 + parseInt(expiryDigits.slice(2, 4), 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      if (expMonth < 1 || expMonth > 12) {
        setCardError('Please enter a valid expiry month (01–12)');
        return;
      }
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        setCardError('This card has expired. Please check the date on your card.');
        return;
      }

      // Card number check
      if (digits.length < 4) { setCardError('Please enter your full card number'); return; }
      setCardVerifying(true);
      setCardError('');
      setTimeout(() => {
        setCardVerifying(false);
        if (digits.startsWith('0000')) {
          localStorage.setItem('wrmc_pending_signup', JSON.stringify({
            firstName,
            lastName,
            email,
            cardNumMasked: '•••• •••• •••• ' + digits.slice(-4),
            savedAt: new Date().toISOString(),
          }));
          setView('card-inactive');
        } else if (digits.startsWith('4829')) {
          setOnboardingData(prev => ({ ...prev, cardLast4: digits.slice(-4) }));
          setView('otp');
        } else {
          setCardError("We couldn't find a card with those details. Please check your card number, expiry, and CVV and try again.");
        }
      }, 1200);
    }
    return (
      <div className="onboarding-screen" style={{ alignItems: 'stretch', paddingTop: 16 }}>
        <BackButton onClick={() => setView('create-details')} />
        <h1 style={{ textAlign: 'center' }}>Link Your Card</h1>
        <StepIndicator current={1} total={3} />
        <p style={{ textAlign: 'center', margin: '0 auto 16px' }}>Enter the details from your Walmart Rewards Mastercard</p>
        <div style={{ maxWidth: 340, margin: '0 auto', width: '100%' }}>
          <FormField
            label="Card number" id="c-card" value={cardNum}
            onChange={e => { setCardNum(formatCardNumber(e.target.value)); setCardError(''); }}
            error={cardError ? ' ' : ''} placeholder="XXXX XXXX XXXX XXXX" inputMode="numeric" maxLength={19}
          />
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <FormField
                label="Expiry" id="c-exp" value={cardExpiry}
                onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY" inputMode="numeric" maxLength={5}
                error={cardError ? ' ' : ''}
              />
            </div>
            <div style={{ flex: 1 }}>
              <FormField
                label="CVV" id="c-cvv" value={cardCvv}
                onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123" inputMode="numeric" maxLength={3}
                error={cardError ? ' ' : ''}
              />
            </div>
          </div>
          {cardError && <div className="field-error" style={{ marginBottom: 12, marginTop: -8 }}>{cardError}</div>}
          {cardVerifying ? (
            <div style={{ textAlign: 'center', padding: 14, fontSize: 14, color: 'var(--text-muted)' }}>Verifying your card...</div>
          ) : (
            <button className="btn btn-primary" onClick={handleVerify}>Continue</button>
          )}
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
            Your card details are verified securely with Fairstone Bank
          </div>
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Pre-filled for demo</div>
          <div style={{ textAlign: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
              Can't find your card details?
            </div>
            <a
              href="tel:18883316133"
              style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'underline' }}
            >
              Call Fairstone support: 1-888-331-6133
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─── Card Not Activated ───
  if (view === 'card-inactive') {
    return (
      <div className="onboarding-screen" style={{ alignItems: 'stretch', paddingTop: 16 }}>
        <BackButton onClick={() => setView('create-card')} />
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true" style={{ marginBottom: 20 }}>
            <rect x="10" y="20" width="60" height="38" rx="5" stroke="black" strokeWidth="2" fill="none" />
            <rect x="10" y="30" width="60" height="8" fill="#e8e8e8" />
            <circle cx="60" cy="16" r="10" stroke="black" strokeWidth="2" fill="white" />
            <path d="M60 10V16L64 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <h1>One quick step first</h1>
          <p>Your card needs to be activated before we can link it to the app.</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 0 }}>It takes about 2 minutes — just call the number below.</p>
          <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            <a href="tel:18887792977" className="btn btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }}>Call 1-888-779-2977</a>
            <button className="btn btn-ghost" onClick={() => setView('confirm-activated')}>
              I've activated my card
            </button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Available 24/7</div>
        </div>
      </div>
    );
  }

  // ─── Confirm Activated ───
  if (view === 'confirm-activated') {
    function handleConfirm() {
      setActivationChecking(true);
      setTimeout(() => {
        setActivationChecking(false);
        const attempts = activationAttempts + 1;
        setActivationAttempts(attempts);
        if (attempts >= 2) {
          setOnboardingData(prev => ({ ...prev, cardLast4: '0000' }));
          setView('otp');
        } else {
          setView('activation-pending');
        }
      }, 1500);
    }

    return (
      <div className="onboarding-screen" style={{ alignItems: 'stretch', paddingTop: 16 }}>
        <BackButton onClick={() => setView('card-inactive')} />
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true" style={{ marginBottom: 20 }}>
            <circle cx="32" cy="32" r="28" stroke="black" strokeWidth="2" fill="none"/>
            <path d="M20 32L28 40L44 24" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>Just to confirm</h1>
          <p style={{ marginBottom: 4 }}>
            Have you called <strong>1-888-779-2977</strong> and completed the activation?
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>
            The call usually takes about 2 minutes.
          </p>
          {activationChecking ? (
            <div style={{ fontSize: 14, color: 'var(--text-muted)', padding: 16 }}>
              Checking your card status...
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-primary" onClick={handleConfirm}>
                Yes, I completed the call
              </button>
              <button className="btn btn-ghost" onClick={() => setView('card-inactive')}>
                Not yet
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Activation Pending ───
  if (view === 'activation-pending') {
    return (
      <div className="onboarding-screen" style={{ alignItems: 'stretch', paddingTop: 16 }}>
        <BackButton onClick={() => setView('confirm-activated')} />
        <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true" style={{ marginBottom: 20 }}>
            <circle cx="32" cy="32" r="28" stroke="black" strokeWidth="2" fill="none"/>
            <path d="M32 18V32L40 36" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          </svg>
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>Not showing as active yet</h1>
          <p style={{ marginBottom: 4 }}>
            This can take a few minutes after your call.
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>
            If you've already called, wait a moment and try again. If you haven't called yet, tap "Call again" below.
          </p>
          <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              className="btn btn-primary"
              onClick={() => setView('confirm-activated')}
            >
              Try again
            </button>
            <a
              href="tel:18887792977"
              className="btn btn-ghost"
              style={{ textDecoration: 'none', textAlign: 'center' }}
              onClick={() => {
                setActivationAttempts(0);
                setTimeout(() => setView('card-inactive'), 500);
              }}
            >
              Call again
            </a>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
            Available 24/7 · 1-888-779-2977
          </div>
        </div>
      </div>
    );
  }

  // ─── OTP Verification ───
  if (view === 'otp') {
    function handleOtpChange(idx, val) {
      if (val.length > 1) val = val.slice(-1);
      if (val && !/\d/.test(val)) return;
      const next = [...otp];
      next[idx] = val;
      setOtp(next);
      setOtpError('');
      if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
      // Auto-submit when all filled
      if (val && idx === 5 && next.every(d => d)) {
        setTimeout(() => verifyOtp(next), 150);
      }
    }
    function handleOtpKeyDown(idx, e) {
      if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
        otpRefs.current[idx - 1]?.focus();
      }
    }
    function verifyOtp(code) {
      const joined = (code || otp).join('');
      if (joined === '123456') {
        localStorage.removeItem('wrmc_pending_signup');
        setView('welcome');
      } else {
        const attempts = otpAttempts + 1;
        setOtpAttempts(attempts);
        if (attempts >= 3) {
          setOtpError("Too many attempts. We've sent a new code.");
          setOtp(['', '', '', '', '', '']);
          setOtpAttempts(0);
          otpRefs.current[0]?.focus();
        } else {
          setOtpError("That code doesn't match. Please try again or resend.");
        }
      }
    }
    function resendCode() {
      setOtpResent(true);
      setOtp(['', '', '', '', '', '']);
      setOtpError('');
      setOtpAttempts(0);
      otpRefs.current[0]?.focus();
      setTimeout(() => setOtpResent(false), 3000);
    }
    return (
      <div className="onboarding-screen" style={{ alignItems: 'stretch', paddingTop: 16 }}>
        <BackButton onClick={() => setView('create-card')} />
        <h1 style={{ textAlign: 'center' }}>Verify it's you</h1>
        <StepIndicator current={2} total={3} />
        <p style={{ textAlign: 'center', margin: '0 auto 4px' }}>We sent a 6-digit code to the phone number ending in ••89</p>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', margin: '0 auto 8px' }}>This is the number on file with Fairstone Bank.</p>
        <div className="otp-grid">
          {otp.map((d, i) => (
            <input
              key={i}
              ref={el => otpRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(i, e)}
              className={`otp-input ${d ? 'filled' : ''} ${otpError ? 'error' : ''}`}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>
        {otpError && <div className="field-error" style={{ textAlign: 'center', marginBottom: 8 }}>{otpError}</div>}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          {otpResent ? (
            <span style={{ fontSize: 13, color: 'var(--success)' }}>Code sent!</span>
          ) : (
            <button
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
              onClick={resendCode}
            >
              Didn't receive it? Resend code
            </button>
          )}
        </div>
        <div style={{ maxWidth: 300, margin: '0 auto', width: '100%' }}>
          <button className="btn btn-primary" onClick={() => verifyOtp()} disabled={otp.some(d => !d)}>Verify</button>
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>Demo code: 123456</div>
        </div>
      </div>
    );
  }

  // ─── Welcome Moment ───
  if (view === 'welcome') {
    return (
      <div className="onboarding-screen" style={{ justifyContent: 'center' }}>
        <img src="/logo.svg" alt="Walmart Rewards Mastercard" className="onboarding-logo" style={{ width: 48, height: 48, marginBottom: 24 }} />
        <h1 style={{ fontSize: 24 }}>Welcome, {firstName}.</h1>
        <p style={{ marginBottom: 4 }}>Your card has been linked.</p>

        <div style={{ width: '80%', height: 1, background: 'var(--border)', margin: '20px auto' }} />

        <div className="welcome-reward">
          <div className="welcome-reward-label">You already have</div>
          <div className="welcome-reward-amount">
            {showCounter ? <AnimatedCounter value={3.82} /> : '$0.00'}
          </div>
          <div className="welcome-reward-label">in Reward Dollars</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          Earned automatically since your card was activated
        </div>

        <div style={{ width: '80%', height: 1, background: 'var(--border)', margin: '20px auto' }} />

        <div style={{ maxWidth: 300, width: '100%', opacity: showGetStarted ? 1 : 0, transition: 'opacity 0.4s ease' }}>
          <button className="btn btn-primary" onClick={onCompleteNewUser}>Get Started</button>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
