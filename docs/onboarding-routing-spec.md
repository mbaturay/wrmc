You are working on the WRMC React Native app prototype. This is a 
significant structural change. Read everything carefully and review 
the full codebase before writing a single line of code.

The app uses a custom state-based router — NOT React Navigation 
or React Router. The three state values are:
  screen:    'onboarding' | 'main'
  tab:       'home' | 'rewards' | 'activity' | 'settings'
  subScreen: null | 'account' | 'payment' | 'freeze' | 'txDetail' | ...

navigate() and goBack() in useAppState.js control all transitions.
OnboardingFlow.jsx has its own internal step/path/history[] machine.
App.jsx renders one of three branches: onboarding, subScreen, or tab.
BottomNav is always rendered but is a no-op during onboarding.

Do not introduce React Navigation, React Router, or any external 
navigation library. Work entirely within this existing architecture.

---

## Part 1 — AppRouter: launch detection before any screen renders

In App.jsx, before the current three-way render branch, add a 
launch detection sequence that runs once on mount.

Read from AsyncStorage in this exact order:

  1. sessionToken + sessionExpiry exist AND expiry > Date.now()?
     → setScreen('main') immediately, skip everything below

  2. sessionToken exists but sessionExpiry <= Date.now()?
     → setOnboardingPath('session_expired')
     → setScreen('onboarding')

  3. hasCompletedOnboarding === 'true' in storage?
     → setOnboardingPath('sign_in')
     → setScreen('onboarding')

  4. onboardingPath + onboardingStep exist in storage?
     → restore both into OnboardingFlow state
     → setScreen('onboarding')

  5. None of the above?
     → setOnboardingPath(null)
     → setScreen('onboarding') — shows WelcomeScreen

While detection is running show a splash:
  Walmart spark logo centered, white background
  No spinner, no text
  Cap at 800ms — call navigate() regardless after that

Add to useAppState.js:
  onboardingPath  — string | null, passed into OnboardingFlow
  cardStatus      — 'none' | 'virtual_only' | 'active'
  hasSession      — boolean
  sessionExpiry   — number | null
  failedAttempts  — number (for sign-in lockout)

Persist to AsyncStorage after every change:
  hasCompletedOnboarding, onboardingPath, onboardingStep,
  sessionToken, sessionExpiry, userJourney, cardStatus,
  languagePreference, biometricEnabled, paperlessEnrolled

---

## Part 2 — WelcomeScreen (shown only on fresh install, path 5 above)

Replace the current single-CTA welcome screen with four entry rows.
Each row is full-width with a title, subtitle, and right chevron.

  Row 1: "Apply for a card"
    Sub: "New to Walmart Rewards? Apply in minutes"
    onPress: setOnboardingPath('digital_apply') → next step:
      languagePreference set? → skip to A_intro
      not set? → LanguageScreen → A_intro

  Row 2: "I was just approved"
    Sub: "Approved in-store or online? Set up your account"
    onPress: setOnboardingPath('just_approved') → LanguageScreen 
      (or skip) → B_verify

  Row 3: "I already have a card"
    Sub: "Existing cardholder? Connect your account"
    onPress: setOnboardingPath('have_card') → LanguageScreen 
      (or skip) → D_verify

  Row 4: "Sign in"
    Sub: "Already set up? Sign in to your account"
    onPress: setOnboardingPath('sign_in') → E_signin
      (no language screen for this path)

Bottom of screen, always visible:
  "Need help? Call 1-800-XXX-XXXX"
  tel: link, tappable

---

## Part 3 — Language screen

Show when languagePreference is null, after any path except 
'sign_in'. Skip entirely if languagePreference is already set.

  Full screen, centered
  Walmart logo
  "Choose your language / Choisissez votre langue"
  Two equal large buttons: "English" | "Français"
  Stores to AsyncStorage immediately on tap
  Advances to the correct first step for the active path

---

## Part 4 — OnboardingFlow.jsx path branching

The internal step machine currently runs a single linear sequence.
Refactor it to branch based on onboardingPath.

Add onboardingPath as a prop from App.jsx.

The step machine must support these named steps:

  SHARED STEPS (used by multiple paths):
    'language'          — language selection
    'otp'               — 6-digit OTP verification
    'biometric_setup'   — enable Face ID / fingerprint
    'pin_setup'         — create card PIN
    'estatement'        — go paperless
    'notifications'     — push notification prefs

  PATH: 'digital_apply'
    welcome → language → A_intro → A_personal → A_id_intro →
    A_id_scan → A_selfie → A_financial → A_consent → otp →
    A_processing → [A_approved | A_declined] →
    A_virtual_card → A_whats_next →
    biometric_setup → pin_setup → estatement → notifications →
    COMPLETE

  PATH: 'just_approved'
    welcome → language → B_verify → otp → B_account_found →
    biometric_setup → pin_setup → estatement → notifications →
    COMPLETE

  PATH: 'have_card'
    welcome → language → D_verify → otp → D_card_status_check →
    [D_already_active | D_needs_activation] →
    biometric_setup → pin_setup → estatement → notifications →
    COMPLETE

  PATH: 'sign_in'
    welcome → E_signin → [E_success | H_forgot_password]

  PATH: 'session_expired'
    G_reauth → [G_success | H_forgot_password]

Each step name maps to a component in a steps lookup object:
  const STEPS = {
    'language': <LanguageScreen />,
    'A_intro': <ApplyIntroScreen />,
    ... etc
  }

The history[] stack and goBack() already exist — keep them as-is.

Save onboardingStep to AsyncStorage after every step transition
so interrupted flows can be resumed.

eKYC steps (A_id_scan, A_selfie) must NOT be saved as resumable.
If onboardingStep is one of these on app launch, walk back to 
A_id_intro so the user re-starts from the intro screen.

On COMPLETE: call the existing onComplete(isNewUser, 
notifSkipped, paperlessEnrolled) — do not change its signature.

---

## Part 5 — New step screens to build

Build these new screens as step components for OnboardingFlow.
Each receives { onNext, onBack } props. Use existing screen 
layout patterns from the current onboarding screens.

### WelcomeScreen (replaces current welcome)
  As specified in Part 2 above.
  Does not receive onNext — it sets onboardingPath directly.

### A_intro — Apply intro
  "Apply for your Walmart Rewards Mastercard"
  3 benefit rows (icon + text):
    "1.25% back on every Walmart purchase"
    "No annual fee"  
    "Up to $25 welcome bonus"
  CTA: "Start application"
  Link: "See full card details" → inline modal with card terms stub

### A_personal — Personal information
  Fields: Full name, Date of birth, Phone number, 
          Email, Home address
  Progress bar: Step 1 of 4
  CTA: "Continue"
  Prototype: any values accepted

### A_id_intro — Identity verification intro
  (Already exists — keep it, just move it into the step machine)

### A_id_scan — ID document scan
  (Already exists — keep it, just move it into the step machine)

### A_selfie — Selfie check
  (Already exists — keep it, just move it into the step machine)

### A_financial — Financial information
  Fields: Annual income (numeric), Employment status (picker),
          Housing status (picker)
  Progress bar: Step 2 of 4
  CTA: "Continue"

### A_consent — Credit bureau consent
  (Already exists — keep it, just move it into the step machine)

### A_processing — Processing wait
  (Already exists — auto-advances)
  In prototype: always routes to A_approved
  Add a commented-out line: 
    // To simulate decline: route to 'A_declined' instead

### A_approved — Approval celebration
  (Already exists as screen 3.1 — move into step machine)
  Sets: cardStatus = 'virtual_only', userJourney = 'new_user'

### A_declined — Application declined (NEW)
  Background: white
  Icon: neutral, non-alarming (document with X, or similar)
  Title: "We couldn't approve your application"
  Body: "Based on the information provided, we're unable to 
    approve your application at this time."
  Info box: "This decision was based on your credit report. 
    You have the right to request a free copy from Equifax 
    and TransUnion."
  Two options:
    Primary button: "Learn about our secured card" 
      → stub screen: title "Secured Card", body "Coming soon"
    Secondary link: "Return to start"
      → confirm dialog: "Are you sure? Your progress will 
        be lost." → on confirm: clear onboarding state, 
        navigate to WelcomeScreen
  Bottom: "Questions? Call 1-800-XXX-XXXX" (tel: link)
  Small text: "You may reapply after 30 days"

### A_virtual_card — Virtual card issued
  (Already exists as screen 3.2 — move into step machine)

### A_whats_next — What happens next
  (Already exists as screen 3.3 — move into step machine)

### B_verify — Just approved verification (NEW)
  Title: "Let's find your account"
  Body: "Enter a few details to connect your approved account."
  Fields:
    Last 4 digits of card number
    Postal code
    Date of birth
  CTA: "Find my account"
  1 second delay, any values accepted
  Link: "Having trouble? Call 1-800-XXX-XXXX" (tel: link)

### B_account_found — Account connected (NEW)
  White background (not black — lighter welcome-back feel)
  WRMCCard component, horizontally centered, masked=true
  Title: "Welcome."
  Subtext: "Your account is ready to set up."
  CTA: "Set up your account"
  Sets: userJourney = 'new_user', cardStatus = 'virtual_only'

### D_verify — Have card verification (NEW)
  Same layout as B_verify but:
  Title: "Let's connect your card"
  Body: "Enter your card details to access your account."
  Same fields as B_verify
  After verification: check mock cardStatus
    If 'active' → go to D_already_active
    If 'virtual_only' → go to B_account_found (reuse)

### D_already_active — Card already active (NEW)
  Title: "You're all set."
  Subtext: "Your card is active and ready to use."
  WRMCCard, centered, active=true (shows ACTIVE badge)
  CTA: "Set up your account"
  
  CRITICAL: No activation CTA here. Card is already active.
  Do not show "Activate your card" — this would break trust.
  
  Sets: userJourney = 'new_user', cardStatus = 'active'

### E_signin — Sign in (NEW)
  Walmart logo top
  Title: "Sign in"
  Email field (pre-fill from AsyncStorage if available)
  Password field with show/hide toggle
  Primary CTA: "Sign in"
    On tap: increment failedAttempts if wrong
    After 5 failures: navigate to H_locked
    Prototype: any credentials succeed after 1 second delay
    On success: set sessionToken, sessionExpiry (+1 hour),
                hasCompletedOnboarding=true,
                userJourney='existing_user',
                call onComplete(false, false, false)
  Links:
    "Forgot your password?" → push 'H_forgot_pw' onto history
    "Don't have an account?" → goBack to WelcomeScreen

  If biometricEnabled is true:
    Show this ABOVE the form:
    Large Face ID / fingerprint button, centered
    "Sign in with Face ID"
    Link below: "Use password instead" (collapses biometric, 
      shows form)
    Prototype: biometric tap succeeds after 1 second

### G_reauth — Session expired re-auth (NEW)
  Lighter version of sign-in — not a full new login
  Title: "You were signed out for security"
  Subtitle: "Sign in to continue"
  
  If biometricEnabled: show Face ID button first (same as E)
  Otherwise: email pre-filled + greyed out, password field only
  CTA: "Sign in"
  Link: "Forgot your password?" → H_forgot_pw
  
  On success: restore session, call onComplete(false, false, false)
  
  Do not show "Don't have an account" — they have one.

### H_forgot_pw — Forgot password (NEW)
  Title: "Reset your password"
  Body: "Enter your email and we'll send a reset link."
  Email field
  CTA: "Send reset link"
  1 second delay, any email accepted
  → advances to H_check_email

### H_check_email — Check your email (NEW)
  Title: "Check your inbox"
  Body: "We sent a reset link to [email]. Check your spam 
    folder if you don't see it."
  CTA: "Back to sign in" → goBack to E_signin
  Resend link: 30 second cooldown, then active
  "Need help? Call 1-800-XXX-XXXX" (tel: link)

### H_locked — Account locked (NEW)
  Title: "Account temporarily locked"
  Body: "Too many failed attempts. For your security, we've 
    temporarily locked your account."
  Two options:
    "Reset by email" → H_forgot_pw
    "Call us to unlock" — large tappable row with phone icon
      1-800-XXX-XXXX, opens tel: link
  Small text: "Locks clear automatically after 30 minutes"
  
  The call option must be visually prominent — not a small link.
  This is the final safety net for locked-out users.

---

## Part 6 — Physical card activation (lives in main app, not onboarding)

Path C users are already in the main app (screen='main').
Activation is triggered from the home screen.

### Add 'activate' to the subScreens map in App.jsx

### Home screen banner (when cardStatus === 'virtual_only')
  Show a persistent card below the quick actions row:
  
  Background: light blue (#E6F1FB or var(--color-background-info))
  Icon: card or envelope icon
  Text: "Your physical card is on its way"
  Sub: "Activate it when it arrives to start using in stores"
  Small: "Expected in 5–7 business days"
  Tap anywhere on the card: navigate('main', 'activate')
  
  This banner disappears when cardStatus === 'active'
  Do not show if cardStatus === 'active' or 'none'

### Activation subScreen ('activate')

Screen 1 — Card arrival prompt
  Title: "Activate your card"
  Subtext: "Enter the last 4 digits of your new card to confirm."
  WRMCCard component, horizontally centered, masked=true
  4-digit input, large, centered below card
  CTA: "Activate"
  Prototype: '4821' is the correct answer
    Correct → 1s loading → Screen 2
    Wrong → shake animation → "Those digits don't match — 
      try again" in red below input
  Link: "I don't have my card yet" → goBack()
  Link: "Having trouble? Call 1-800-XXX-XXXX" (tel: link)

Screen 2 — Activation success
  Full screen, black background
  Spark logo animates in (scale 0.5→1.0, 500ms ease-out)
  WRMCCard, centered, active=true, ACTIVE badge visible
  Headline (white, large): "Your card is active."
  Subtext (light gray): "You're ready to use it everywhere 
    Mastercard is accepted."
  After 1.5 seconds, CTA appears (white outlined button):
    "Go to my account" → setCardStatus('active') → goBack()
  
  On return to home: banner is gone, card shows ACTIVE state

---

## Part 7 — Help system (contextual, on every onboarding screen)

Add a "?" icon button to the top-right of the Header component
when screen === 'onboarding' and the current step is not a 
black celebration screen (A_approved, activation success).

Tapping opens a bottom sheet (not a modal — slide up from bottom).

The sheet content is driven by the current step:

  Steps A_intro → A_consent:
    "Applying for your card"
    "If you have questions about the application process, 
    we're here to help."
    [Call 1-800-XXX-XXXX]

  Steps A_id_intro → A_selfie:
    "Verifying your identity"
    "We use secure verification to protect your account. 
    If your ID won't scan, try better lighting. 
    Still stuck? We can help."
    [Call 1-800-XXX-XXXX]

  Steps otp, B_verify, D_verify:
    "Confirming your details"
    "If you didn't receive a code, tap Resend after 30 seconds. 
    Wrong number on file? Call us."
    [Call 1-800-XXX-XXXX]

  Steps E_signin, G_reauth:
    "Signing into your account"
    "Forgotten your password? Tap 'Forgot password' below the 
    sign-in button. Still stuck? We can help."
    [Call 1-800-XXX-XXXX]

  Steps H_forgot_pw, H_check_email, H_locked:
    "Resetting your password"
    "If you're not receiving our emails, check your spam folder 
    or call us and we can reset your account directly."
    [Call 1-800-XXX-XXXX]

  'activate' subScreen:
    "Activating your card"
    "Enter the last 4 digits on the front of your new card. 
    Card not working? Call us and we can activate it for you."
    [Call 1-800-XXX-XXXX]

The phone number in every sheet is a large, prominent, 
tappable row — not a small text link. It should look like 
a button:
  Phone icon + "Call 1-800-XXX-XXXX"
  Full-width tappable row, opens tel: link

---

## Part 8 — Interrupted onboarding resume screen

Shown when AppRouter detects saved onboardingPath + onboardingStep.

  Title: "Welcome back"
  Body: "You started an application — want to continue?"
  
  Show progress summary:
    "Last completed: [human-readable step name]"
    "Next step: [human-readable next step name]"
  
  Two options:
    Primary: "Continue" 
      → restore onboardingPath and onboardingStep
      → navigate into OnboardingFlow at saved step
    Secondary: "Start over"
      → confirm dialog: "This will clear your progress."
      → on confirm: clear onboardingPath, onboardingStep 
        from AsyncStorage → navigate to WelcomeScreen
  
  Note on eKYC steps: if saved onboardingStep is 'A_id_scan' 
  or 'A_selfie', override and resume from 'A_id_intro' instead.
  Show a note: "You'll need to re-scan your ID — this is 
  for your security."

Map step IDs to human-readable names:
  'A_personal': 'Personal information'
  'A_id_intro': 'Identity verification'
  'A_financial': 'Financial information'
  'A_consent': 'Credit check consent'
  'otp': 'Phone confirmation'
  'biometric_setup': 'Face ID setup'
  'pin_setup': 'PIN creation'
  'estatement': 'Paperless statements'
  'notifications': 'Notification preferences'

---

## Part 9 — Prototype controls (Settings tab)

Replace the existing prototype controls with these, each using 
the correct state manipulation for the architecture:

  "Fresh install (Path A)"
    AsyncStorage.clear() → reload AppRouter

  "Just approved in-store (Path B)"
    Set hasCompletedOnboarding=false, onboardingPath='just_approved'
    → setScreen('onboarding'), OnboardingFlow starts at B_verify

  "Simulate card arrival (Path C)"
    Set cardStatus='virtual_only', hasCompletedOnboarding=true,
    sessionToken='mock', sessionExpiry=future
    → setScreen('main'), setTab('home')
    → home banner appears

  "Already activated by phone (Path D)"
    Set hasCompletedOnboarding=false, onboardingPath='have_card'
    → setScreen('onboarding'), starts at D_verify

  "Returning cardholder (Path E)"
    Set hasCompletedOnboarding=true, clear sessionToken
    → setScreen('onboarding'), setOnboardingPath='sign_in'

  "Session expired (Path G)"
    Set hasCompletedOnboarding=true, sessionToken='mock',
    sessionExpiry=Date.now()-1000 (past)
    → re-run AppRouter detection

  "Forgot password (Path H)"
    Set hasCompletedOnboarding=true, clear sessionToken
    → setOnboardingPath='sign_in', jump step to H_forgot_pw

  "Interrupted onboarding (Path I)"
    Set onboardingPath='digital_apply',
    onboardingStep='A_financial'
    → re-run AppRouter detection → shows resume screen

  "Switch user data: New ↔ Existing"
    Toggle userJourney between 'new_user' and 'existing_user'
    All screens re-read from mockData on next render

  Divider and label: "Prototype controls — workshop use only"

---

## Constraints

- Do not introduce any navigation library
- Work entirely within the navigate() / goBack() / 
  OnboardingFlow step machine architecture
- BottomNav remains a no-op during screen='onboarding' 
  (existing behaviour — do not change)
- BottomNav visible during screen='main' including 
  the 'activate' subScreen
- Black celebration screens (A_approved, activation success) 
  hide the Header entirely — existing pattern, keep it
- WRMCCard must be horizontally centered on every screen 
  where it appears
- All phone numbers rendered as 1-800-XXX-XXXX with tel: link
- All data reads from constants/mockData.ts, 
  profile selected by userJourney value
- Persist state to AsyncStorage after every transition
- Test all 9 paths using prototype controls before done
