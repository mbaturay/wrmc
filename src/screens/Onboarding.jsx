import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { AnimatedCounter } from '../components/AnimatedCounter';

// ─── Shared small components ───

function BackButton({ onClick, label = 'Back' }) {
  return (
    <Button
      onClick={onClick}
      startIcon={<ArrowBackIcon />}
      sx={{ alignSelf: 'flex-start', mb: 2, color: 'text.secondary', textTransform: 'none' }}
    >
      {label}
    </Button>
  );
}

function StepIndicator({ current, total }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'center', my: 1, mb: 2 }}>
      {Array.from({ length: total }, (_, i) => (
        <Box
          key={i}
          sx={{
            height: 8,
            borderRadius: 4,
            transition: 'all 0.3s',
            bgcolor: i <= current ? 'primary.main' : 'grey.300',
            width: i === current ? 20 : 8,
          }}
        />
      ))}
    </Box>
  );
}

function PasswordField({ label, id, value, onChange, error, autoComplete }) {
  const [showPw, setShowPw] = useState(false);
  return (
    <TextField
      id={id}
      label={label}
      type={showPw ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error}
      autoComplete={autoComplete}
      sx={{ mb: 1.5 }}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPw(!showPw)} edge="end" size="small" aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
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

  // Welcome animation
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

  const screenSx = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    minHeight: '100vh', px: 3, textAlign: 'center',
  };

  // ─── Resume ───
  if (view === 'resume') {
    return (
      <Box sx={{ ...screenSx, justifyContent: 'center' }}>
        <Box component="img" src="/logo.svg" alt="Walmart Rewards Mastercard" sx={{ width: 64, height: 64, mb: 3 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Welcome back, {pendingResume?.firstName}.
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          You were setting up your account.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
          Your card ending in {pendingResume?.cardNumMasked?.slice(-4)} still needs to be activated.
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Button variant="contained" size="large" onClick={() => {
            if (pendingResume?.firstName) setFirstName(pendingResume.firstName);
            if (pendingResume?.lastName) setLastName(pendingResume.lastName);
            if (pendingResume?.email) setEmail(pendingResume.email);
            setView('card-inactive');
          }}>
            Continue setup
          </Button>
          <Button variant="outlined" onClick={() => {
            localStorage.removeItem('wrmc_pending_signup');
            setPendingResume(null);
            setView('entry');
          }}>
            Start over
          </Button>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2.5 }}>
          Your account details were saved for 7 days
        </Typography>
      </Box>
    );
  }

  // ─── Entry ───
  if (view === 'entry') {
    return (
      <Box sx={{ ...screenSx, justifyContent: 'center' }}>
        <Box component="img" src="/logo.svg" alt="Walmart Rewards Mastercard" sx={{ width: 64, height: 64, mb: 2.5 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>Walmart Rewards Mastercard</Typography>
        <Typography color="text.secondary" sx={{ mb: 3.5, maxWidth: 300 }}>
          Manage your card, track your Reward Dollars, and pay your bill — all in one place.
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Button variant="contained" size="large" onClick={() => setView('create-details')}>Create Account</Button>
          <Button variant="outlined" size="large" onClick={() => setView('signin')}>Sign In</Button>
        </Box>
      </Box>
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
      <Box sx={{ ...screenSx, alignItems: 'stretch', pt: 2, textAlign: 'left' }}>
        <BackButton onClick={() => setView('entry')} />
        <Typography variant="h5" fontWeight={700} sx={{ textAlign: 'center', mb: 2 }}>Sign In</Typography>
        <Box sx={{ maxWidth: 340, mx: 'auto', width: '100%' }}>
          <TextField
            label="Email" id="sign-email" type="email" value={signEmail}
            onChange={e => setSignEmail(e.target.value)}
            placeholder="you@example.com" autoComplete="email" sx={{ mb: 1.5 }}
          />
          <PasswordField
            label="Password" id="sign-pass" value={signPass}
            onChange={e => { setSignPass(e.target.value); setSignError(''); }}
            error={signError} autoComplete="current-password"
          />
          <Button variant="contained" size="large" fullWidth onClick={handleSignIn} sx={{ mt: 1 }}>Sign In</Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => { setForgotEmail(signEmail); setView('forgot-email'); }}
              sx={{ cursor: 'pointer' }}
            >
              Forgot password?
            </Link>
          </Box>
        </Box>
      </Box>
    );
  }

  // ─── Forgot Password — Enter Email ───
  if (view === 'forgot-email') {
    return (
      <Box sx={{ ...screenSx, alignItems: 'stretch', pt: 2, textAlign: 'left' }}>
        <BackButton onClick={() => setView('signin')} />
        <Typography variant="h5" fontWeight={700} sx={{ textAlign: 'center', mb: 1 }}>Reset your password</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2.5, mx: 'auto' }}>
          Enter the email address on your account and we'll send you a reset link.
        </Typography>
        <Box sx={{ maxWidth: 340, mx: 'auto', width: '100%' }}>
          <TextField
            label="Email" id="forgot-email" type="email" value={forgotEmail}
            onChange={e => setForgotEmail(e.target.value)}
            placeholder="you@example.com" sx={{ mb: 1.5 }}
          />
          <Button variant="contained" size="large" fullWidth onClick={() => setView('forgot-sent')} sx={{ mt: 1 }}>
            Send Reset Link
          </Button>
        </Box>
      </Box>
    );
  }

  // ─── Forgot Password — Sent ───
  if (view === 'forgot-sent') {
    return (
      <Box sx={{ ...screenSx, justifyContent: 'center' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 48, mb: 2, color: 'success.main' }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>Check your email</Typography>
        <Typography color="text.secondary">We sent a reset link to {forgotEmail || 'your email'}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
          It may take a few minutes to arrive. Check your spam folder if you don't see it.
        </Typography>
        <Button variant="outlined" onClick={() => setView('signin')} sx={{ maxWidth: 300 }}>
          Back to Sign In
        </Button>
      </Box>
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
      <Box sx={{ ...screenSx, alignItems: 'stretch', pt: 2, textAlign: 'left' }}>
        <BackButton onClick={() => setView('entry')} />
        <Typography variant="h5" fontWeight={700} sx={{ textAlign: 'center' }}>Create Account</Typography>
        <StepIndicator current={0} total={3} />
        <Box sx={{ maxWidth: 340, mx: 'auto', width: '100%' }}>
          <TextField label="First name" id="c-first" value={firstName} onChange={e => setFirstName(e.target.value)} error={!!createErrors.firstName} helperText={createErrors.firstName} autoComplete="given-name" sx={{ mb: 1.5 }} />
          <TextField label="Last name" id="c-last" value={lastName} onChange={e => setLastName(e.target.value)} error={!!createErrors.lastName} helperText={createErrors.lastName} autoComplete="family-name" sx={{ mb: 1.5 }} />
          <TextField label="Email" id="c-email" type="email" value={email} onChange={e => setEmail(e.target.value)} error={!!createErrors.email} helperText={createErrors.email} autoComplete="email" sx={{ mb: 1.5 }} />
          <PasswordField label="Password" id="c-pass" value={password} onChange={e => setPassword(e.target.value)} error={createErrors.password} autoComplete="new-password" />
          <PasswordField label="Confirm password" id="c-pass2" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} error={createErrors.confirmPw} autoComplete="new-password" />
          <Button variant="contained" size="large" fullWidth onClick={handleContinue} sx={{ mt: 0.5 }}>Continue</Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1.25 }}>
            Pre-filled for demo
          </Typography>
        </Box>
      </Box>
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
      const expiryDigits = cardExpiry.replace(/\D/g, '');
      if (expiryDigits.length < 4) {
        setCardError('Please enter a valid expiry date (MM/YY)');
        return;
      }
      const expMonth = parseInt(expiryDigits.slice(0, 2), 10);
      const expYear = 2000 + parseInt(expiryDigits.slice(2, 4), 10);
      const now = new Date();
      if (expMonth < 1 || expMonth > 12) {
        setCardError('Please enter a valid expiry month (01–12)');
        return;
      }
      if (expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)) {
        setCardError('This card has expired. Please check the date on your card.');
        return;
      }
      if (digits.length < 4) { setCardError('Please enter your full card number'); return; }
      setCardVerifying(true);
      setCardError('');
      setTimeout(() => {
        setCardVerifying(false);
        if (digits.startsWith('0000')) {
          localStorage.setItem('wrmc_pending_signup', JSON.stringify({
            firstName, lastName, email,
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
      <Box sx={{ ...screenSx, alignItems: 'stretch', pt: 2, textAlign: 'left' }}>
        <BackButton onClick={() => setView('create-details')} />
        <Typography variant="h5" fontWeight={700} sx={{ textAlign: 'center' }}>Link Your Card</Typography>
        <StepIndicator current={1} total={3} />
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
          Enter the details from your Walmart Rewards Mastercard
        </Typography>
        <Box sx={{ maxWidth: 340, mx: 'auto', width: '100%' }}>
          <TextField
            label="Card number" id="c-card" value={cardNum}
            onChange={e => { setCardNum(formatCardNumber(e.target.value)); setCardError(''); }}
            error={!!cardError} placeholder="XXXX XXXX XXXX XXXX"
            inputMode="numeric"
            slotProps={{ htmlInput: { maxLength: 19 } }}
            sx={{ mb: 1.5 }}
          />
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              label="Expiry" id="c-exp" value={cardExpiry}
              onChange={e => setCardExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY" inputMode="numeric"
              slotProps={{ htmlInput: { maxLength: 5 } }}
              error={!!cardError} sx={{ flex: 1, mb: 1.5 }}
            />
            <TextField
              label="CVV" id="c-cvv" value={cardCvv}
              onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
              placeholder="123" inputMode="numeric"
              slotProps={{ htmlInput: { maxLength: 3 } }}
              error={!!cardError} sx={{ flex: 1, mb: 1.5 }}
            />
          </Box>
          {cardError && (
            <Alert severity="error" sx={{ mb: 1.5, fontSize: 13 }}>{cardError}</Alert>
          )}
          {cardVerifying ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary" component="span">Verifying your card...</Typography>
            </Box>
          ) : (
            <Button variant="contained" size="large" fullWidth onClick={handleVerify}>Continue</Button>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1.25 }}>
            Your card details are verified securely
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
            Pre-filled for demo
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Can't find your card details?
            </Typography>
            <Link href="tel:18883316133" variant="caption">
              Walmart Rewards Mastercard Support: 1-888-331-6133
            </Link>
          </Box>
        </Box>
      </Box>
    );
  }

  // ─── Card Not Activated ───
  if (view === 'card-inactive') {
    return (
      <Box sx={{ ...screenSx, alignItems: 'stretch', pt: 2 }}>
        <BackButton onClick={() => setView('create-card')} />
        <Box sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Box component="svg" width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true" sx={{ mb: 2.5 }}>
            <rect x="10" y="20" width="60" height="38" rx="5" stroke="black" strokeWidth="2" fill="none" />
            <rect x="10" y="30" width="60" height="8" fill="#e8e8e8" />
            <circle cx="60" cy="16" r="10" stroke="black" strokeWidth="2" fill="white" />
            <path d="M60 10V16L64 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
          </Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>One quick step first</Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 300 }}>
            Your card needs to be activated before we can link it to the app.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
            It takes about 2 minutes — just call the number below.
          </Typography>
          <Box sx={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 1.25, mt: 1 }}>
            <Button variant="contained" size="large" component="a" href="tel:18887792977" sx={{ textDecoration: 'none' }}>
              Call 1-888-779-2977
            </Button>
            <Button variant="outlined" onClick={() => setView('confirm-activated')}>
              I've activated my card
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>Available 24/7</Typography>
        </Box>
      </Box>
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
      <Box sx={{ ...screenSx, alignItems: 'stretch', pt: 2 }}>
        <BackButton onClick={() => setView('card-inactive')} />
        <Box sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, mb: 2.5, color: 'text.secondary' }} />
          <Typography variant="h6" fontWeight={700} gutterBottom>Just to confirm</Typography>
          <Typography color="text.secondary" gutterBottom>
            Have you called <strong>1-888-779-2977</strong> and completed the activation?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
            The call usually takes about 2 minutes.
          </Typography>
          {activationChecking ? (
            <Box sx={{ py: 2 }}>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary" component="span">Checking your card status...</Typography>
            </Box>
          ) : (
            <Box sx={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Button variant="contained" size="large" onClick={handleConfirm}>
                Yes, I completed the call
              </Button>
              <Button variant="outlined" onClick={() => setView('card-inactive')}>
                Not yet
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  // ─── Activation Pending ───
  if (view === 'activation-pending') {
    return (
      <Box sx={{ ...screenSx, alignItems: 'stretch', pt: 2 }}>
        <BackButton onClick={() => setView('confirm-activated')} />
        <Box sx={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Box component="svg" width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true" sx={{ mb: 2.5 }}>
            <circle cx="32" cy="32" r="28" stroke="black" strokeWidth="2" fill="none"/>
            <path d="M32 18V32L40 36" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>Not showing as active yet</Typography>
          <Typography color="text.secondary" gutterBottom>
            This can take a few minutes after your call.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5 }}>
            If you've already called, wait a moment and try again. If you haven't called yet, tap "Call again" below.
          </Typography>
          <Box sx={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            <Button variant="contained" size="large" onClick={() => setView('confirm-activated')}>
              Try again
            </Button>
            <Button
              variant="outlined"
              component="a"
              href="tel:18887792977"
              sx={{ textDecoration: 'none' }}
              onClick={() => {
                setActivationAttempts(0);
                setTimeout(() => setView('card-inactive'), 500);
              }}
            >
              Call again
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5 }}>
            Available 24/7 · 1-888-779-2977
          </Typography>
        </Box>
      </Box>
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
      <Box sx={{ ...screenSx, alignItems: 'stretch', pt: 2 }}>
        <BackButton onClick={() => setView('create-card')} />
        <Typography variant="h5" fontWeight={700} sx={{ textAlign: 'center' }}>Verify it's you</Typography>
        <StepIndicator current={2} total={3} />
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mx: 'auto', mb: 0.5 }}>
          We sent a 6-digit code to the phone number ending in ••89
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block', mb: 1 }}>
          This is the number on file with your account.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', my: 2, maxWidth: 280, mx: 'auto' }}>
          {otp.map((d, i) => (
            <Box
              key={i}
              component="input"
              ref={el => otpRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(i, e)}
              aria-label={`Digit ${i + 1}`}
              sx={{
                width: 42, height: 50,
                border: '1.5px solid',
                borderColor: otpError ? 'error.main' : d ? 'primary.main' : 'grey.400',
                borderRadius: 1.5,
                textAlign: 'center',
                fontSize: 22, fontWeight: 600,
                bgcolor: 'background.paper',
                color: 'text.primary',
                outline: 'none',
                transition: 'border-color 0.15s',
                '&:focus': { borderColor: 'primary.main' },
              }}
            />
          ))}
        </Box>
        {otpError && (
          <Alert severity="error" sx={{ mb: 1, mx: 'auto', maxWidth: 300, fontSize: 13 }}>{otpError}</Alert>
        )}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          {otpResent ? (
            <Typography variant="body2" color="success.main">Code sent!</Typography>
          ) : (
            <Link component="button" variant="body2" onClick={resendCode} sx={{ cursor: 'pointer' }}>
              Didn't receive it? Resend code
            </Link>
          )}
        </Box>
        <Box sx={{ maxWidth: 300, mx: 'auto', width: '100%' }}>
          <Button variant="contained" size="large" fullWidth onClick={() => verifyOtp()} disabled={otp.some(d => !d)}>
            Verify
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1.25 }}>
            Demo code: 123456
          </Typography>
        </Box>
      </Box>
    );
  }

  // ─── Welcome Moment ───
  if (view === 'welcome') {
    return (
      <Box sx={{ ...screenSx, justifyContent: 'center' }}>
        <Box component="img" src="/logo.svg" alt="Walmart Rewards Mastercard" sx={{ width: 48, height: 48, mb: 3 }} />
        <Typography variant="h5" fontWeight={700}>Welcome, {firstName}.</Typography>
        <Typography color="text.secondary" gutterBottom>Your card has been linked.</Typography>

        <Divider sx={{ width: '80%', my: 2.5 }} />

        <Box sx={{ textAlign: 'center', py: 1 }}>
          <Typography variant="body2" color="text.secondary">You already have</Typography>
          <Typography variant="h3" fontWeight={800} color="success.main" sx={{ py: 0.75 }}>
            {showCounter ? <AnimatedCounter value={3.82} /> : '$0.00'}
          </Typography>
          <Typography variant="body2" color="text.secondary">in Reward Dollars</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          Earned automatically since your card was activated
        </Typography>

        <Divider sx={{ width: '80%', my: 2.5 }} />

        <Box sx={{ maxWidth: 300, width: '100%', opacity: showGetStarted ? 1 : 0, transition: 'opacity 0.4s ease' }}>
          <Button variant="contained" size="large" fullWidth onClick={onCompleteNewUser}>Get Started</Button>
        </Box>
      </Box>
    );
  }

  return null;
}
