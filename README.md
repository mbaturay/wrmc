 Screens & Connections (22 interactive states)

  A) Onboarding (5 steps)

  1. Welcome → Continue
  2. Connect/Verify Card → simulated verification → Continue
  3. Permissions → Enable or Skip
  4. Preferences → pick from 3 options (weekly shopper, saving focus, GV nudges)
  5. Hub Ready → "Get Started" → Home

  B) Home / Dashboard

  - Animated savings counter (animates on load and when rewards change)
  - Make a Payment CTA → Payment flow
  - Apply Rewards CTA → Redemption flow
  - Quick Actions: Freeze, Transactions, Statements, Offers
  - Smart Insight card with milestone distance
  - Lifetime savings tracker with progress bar + streak badge
  - Available rewards card with Redeem button
  - Payment due card

  C) Activity Tab (Transactions)

  - Transaction list with category filter pills
  - Monthly summary (spend, rewards, effective rate)
  - Tap any transaction → Transaction Detail:
    - Amount, merchant, date, items
    - Reward earned + rate badge
    - Pre-tax calculation breakdown (receipt style)
    - Category bar visualization
    - "Why did I earn this?" expandable explanation
    - Link to "How Rewards Work" explainer page

  D) Shop Tab (Shopping Companion)

  - Cart Preview with 8 items (mix of Great Value and national brands)
  - "Earn 1.25%" tags on each item
  - Nudge cards on items with Great Value alternatives ("Switch and save $X")
  - Accept/decline the switch
  - Predictive reward preview before checkout
  - Checkout → Receipt breakdown showing rewards + switch savings + effective savings

  E) Redeem (from Home CTAs)

  - Available balance display
  - Quick-select amounts ($10, $25, All)
  - Custom amount input
  - One-tap redeem → celebration animation + updated balance
  - Auto-apply toggle
  - Redemption history

  F) Account Tab

  - Card visual (dark card with last 4 digits, frozen indicator)
  - Balance / credit utilization bar
  - Menu links to: Profile, Card Controls, Statements, Settings, How Rewards Work
  - Freeze/Unfreeze toggle screen
  - Make a Payment flow (min/statement/full quick-select + custom)
  - Statements list
  - Settings (toggles for notifications, alerts, GV suggestions, biometric)
  - Profile screen

  Prototype Controls Panel

  Press the lightning bolt button (bottom-right) to:
  - Simulate a new reward (+$3.25, animates the counters)
  - Trigger milestone celebration (confetti + modal)
  - Toggle auto-apply
  - Replay onboarding

  Navigation

  - Bottom nav: Home | Shop | Activity | Account
  - Back arrow on all sub-screens
  - Consistent header throughout
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
