import { useState } from 'react';
import { Welcome, GetStarted, Language } from './onboarding/Stage1';
import { VerifyIntro, IDScan, SelfieCheck, CreditConsent, OTPVerify, Processing } from './onboarding/Stage2';
import { Declined, Approval, Pending, PendingHome } from './onboarding/Stage3';
import { BiometricSetup, EStatement } from './onboarding/Stage4';
import { BppOffer } from './onboarding/Stage5';
import { SignIn, ReAuth, ForgotPassword, CheckEmail, AccountLocked } from './onboarding/AuthScreens';
import { BVerify, BAccountFound, DVerify, DAlreadyActive } from './onboarding/PathScreens';
import { Disclosure, ApplyIntro, PersonalInfo, FinancialInfo, CreatePassword } from './onboarding/ApplyScreens';

// ─── Stub screen for steps without full UI yet ──────────
function StubScreen({ stepId, title, subtitle, onNext, onBack, lang }) {
  return (
    <div className="ob-screen">
      {onBack && (
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
          {lang === 'fr' ? 'Retour' : 'Back'}
        </button>
      )}

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '40px 0',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: '#F0F0F0', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 20, fontSize: 11, fontWeight: 600,
          color: 'var(--text-muted)', fontFamily: 'monospace',
        }}>
          {stepId}
        </div>
        <h1 className="ob-title" style={{ marginBottom: 8 }}>{title}</h1>
        {subtitle && <p className="ob-body" style={{ marginBottom: 32 }}>{subtitle}</p>}
      </div>

      <button className="btn btn-primary" onClick={onNext}>
        {lang === 'fr' ? 'Continuer' : 'Continue'}
      </button>
    </div>
  );
}

// ─── Paths that require Welcome screen before starting ──
const WELCOME_PATHS = ['digital_apply', 'just_approved', 'have_card'];

// ═══════════════════════════════════════════════════════
// OnboardingFlow — declarative step renderer
// ═══════════════════════════════════════════════════════
export function OnboardingFlow({
  onComplete,
  language,
  setLanguage,
  onboardingPath,
  setPath,
  currentStep,
  goNext,
  goBackStep,
  goToBranch,
  goToStep,
  // State setters passed through from useAppState
  biometricEnabled,
  failedAttempts,
  setFailedAttempts,
  setUserJourney,
  setCardStatus,
  skipWelcome,
  approvalOutcome,
  setApprovalOutcome,
  setTspLimit,
  tspLimit,
  setPendingEmail,
  pendingEmail,
}) {
  const lang = language;

  // ─── All hooks must be called before any early return ─
  const [pathSelected, setPathSelected] = useState(
    skipWelcome || !WELCOME_PATHS.includes(onboardingPath)
  );
  const [paperlessEnrolled, setPaperlessEnrolled] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);

  // ─── Welcome / GetStarted gate ──────────────────────────
  if (!pathSelected) {
    if (showGetStarted) {
      return (
        <GetStarted
          onNext={(selectedPath) => {
            const pathMap = {
              approved: 'just_approved',
              existing: 'have_card',
              apply: 'digital_apply',
            };
            setPath(pathMap[selectedPath]);
            setShowGetStarted(false);
            setPathSelected(true);
          }}
          onBack={() => setShowGetStarted(false)}
          lang={lang}
        />
      );
    }
    return (
      <Welcome
        onNext={(selectedPath) => {
          if (selectedPath === 'signin') {
            setPath('sign_in');
            setPathSelected(true);
          }
        }}
        onShowGetStarted={() => setShowGetStarted(true)}
        lang={lang}
      />
    );
  }

  // ─── Back to Welcome handler ──────────────────────────
  const backToWelcome = () => {
    setPathSelected(false);
  };

  // ─── Step → Component map ─────────────────────────────
  const stepMap = {

    // ── Shared steps ──────────────────────────────────
    language: (
      <Language
        onNext={(selectedLang) => {
          setLanguage(selectedLang);
          goNext();
        }}
      />
    ),

    otp: (
      <OTPVerify
        onNext={() => goNext()}
        onBack={() => goBackStep()}
        lang={lang}
      />
    ),

    biometric_setup: (
      <BiometricSetup
        onNext={() => goNext()}
        onBack={() => goBackStep()}
        lang={lang}
      />
    ),

    estatement: (
      <EStatement
        onNext={(enrolled) => {
          if (enrolled) setPaperlessEnrolled(true);
          const isNewUser = onboardingPath === 'digital_apply' || onboardingPath === 'just_approved';
          onComplete(isNewUser, true, enrolled || paperlessEnrolled);
        }}
        onBack={() => goBackStep()}
        lang={lang}
        email="sarah@example.com"
      />
    ),

    // ── Path A: digital_apply ─────────────────────────
    A_disclosure: (
      <Disclosure
        onNext={() => goNext()}
        onBack={() => goBackStep()}
        lang={lang}
      />
    ),

    A_intro: (
      <ApplyIntro
        onNext={() => goNext()}
        onBack={() => goBackStep()}
        lang={lang}
      />
    ),

    A_personal: (
      <PersonalInfo
        onNext={() => goNext()}
        onBack={() => goBackStep()}
        lang={lang}
      />
    ),

    A_id_intro: (
      <VerifyIntro
        onNext={() => goNext()}
        onBack={() => goBackStep()}
        lang={lang}
      />
    ),

    A_id_scan: (
      <IDScan
        onNext={() => goNext()}
        onBack={() => goBackStep()}
        lang={lang}
      />
    ),

    A_selfie: (
      <SelfieCheck
        onNext={() => goNext()}
        onBack={() => goBackStep()}
        lang={lang}
      />
    ),

    A_financial: (
      <FinancialInfo
        onNext={() => goNext()}
        onBack={() => goBackStep()}
        lang={lang}
        onIncomeSubmit={(income) => {
          if (income >= 80000) {
            setApprovalOutcome('approved_1000');
            setTspLimit(1000);
          } else if (income >= 30000) {
            setApprovalOutcome('approved_500');
            setTspLimit(500);
          } else {
            setApprovalOutcome('pending');
          }
        }}
      />
    ),

    A_consent: (
      <CreditConsent
        onNext={() => goNext()}
        onBack={() => goBackStep()}
        lang={lang}
      />
    ),

    A_processing: (
      <Processing
        onNext={() => {
          if (approvalOutcome === 'pending') {
            goToBranch('A_pending');
          } else {
            goNext(); // → A_approved
          }
        }}
        lang={lang}
      />
    ),

    A_declined: (
      <Declined
        onNext={() => goNext()}
        lang={lang}
      />
    ),

    A_approved: (
      <Approval
        onNext={() => {
          setUserJourney('new_user');
          setCardStatus('virtual_only');
          goNext();
        }}
        lang={lang}
        tspLimit={tspLimit}
      />
    ),

    A_create_password: (
      <CreatePassword
        onNext={() => {
          const isLastStep = onboardingPath === 'just_approved' || onboardingPath === 'have_card';
          if (isLastStep) {
            onComplete(true, true, false);
          } else {
            goNext();
          }
        }}
        onBack={() => goBackStep()}
        lang={lang}
        email="sarah@example.com"
      />
    ),

    bpp_offer: (
      <BppOffer
        onNext={() => onComplete(true, true, false)}
        lang={lang}
      />
    ),

    A_pending: (
      <Pending
        onNext={() => {
          setPendingEmail('sarah@example.com');
          onComplete(true, true, false);
        }}
        lang={lang}
        email="sarah@example.com"
      />
    ),

    // ── Path B: just_approved ─────────────────────────
    B_verify: (
      <BVerify
        onNext={() => goNext()}
        onBack={() => goBackStep()}
        lang={lang}
      />
    ),

    B_account_found: (
      <BAccountFound
        onNext={() => goNext()}
        lang={lang}
        setUserJourney={setUserJourney}
        setCardStatus={setCardStatus}
      />
    ),

    // ── Path D: have_card ─────────────────────────────
    D_verify: (
      <DVerify
        onBack={() => goBackStep()}
        lang={lang}
        goToBranch={goToBranch}
      />
    ),

    D_already_active: (
      <DAlreadyActive
        onNext={() => goNext()}
        lang={lang}
        setUserJourney={setUserJourney}
        setCardStatus={setCardStatus}
      />
    ),

    // ── Path E: sign_in ───────────────────────────────
    E_signin: (
      <SignIn
        onNext={() => onComplete(false, false, false)}
        onBack={backToWelcome}
        onCreateAccount={() => {
          setShowGetStarted(true);
          setPathSelected(false);
        }}
        lang={lang}
        biometricEnabled={biometricEnabled}
        failedAttempts={failedAttempts}
        setFailedAttempts={setFailedAttempts}
        goToBranch={goToBranch}
        onComplete={onComplete}
      />
    ),

    // ── Path G: session_expired ───────────────────────
    G_reauth: (
      <ReAuth
        lang={lang}
        biometricEnabled={biometricEnabled}
        goToBranch={goToBranch}
        onComplete={onComplete}
      />
    ),

    // ── Branch H: password reset / lockout ────────────
    H_forgot_pw: (
      <ForgotPassword
        onBack={() => goBackStep()}
        lang={lang}
        goToBranch={goToBranch}
      />
    ),

    H_check_email: (
      <CheckEmail
        lang={lang}
        goToBranch={goToBranch}
      />
    ),

    H_locked: (
      <AccountLocked
        lang={lang}
        goToBranch={goToBranch}
      />
    ),
  };

  // ─── Render ─────────────────────────────────────────
  const component = stepMap[currentStep];

  if (!component) {
    return (
      <StubScreen
        stepId={currentStep}
        title={`Unknown step: ${currentStep}`}
        subtitle="This step has not been implemented yet."
        onNext={() => goNext()}
        onBack={() => goBackStep()}
        lang={lang}
      />
    );
  }

  return component;
}
