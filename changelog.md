 What changed and why

  Breathing room & visual hierarchy. The Home screen now uses gap: 28px between sections (up from 20px), the hero has no
  card border at all — it floats in open space with a subtle radial glow behind the number. Cards use softer shadows (0
  1px 4px) instead of bordered outlines, and the overall side padding is 20px instead of 16px. The result feels more
  spacious and premium without adding visual weight.

  Motion that means something. Three specific micro-interactions now exist, each tied to a real event:
  - Hero shimmer on load (0-to-value count-up + a 1s gradient sweep that fades out).
  - "+$1.25" micro-feedback — when a reward is added via Prototype Controls, a green "+$X.XX" pops up briefly below the
  savings number, then fades. The shimmer replays. This makes the number feel alive.
  - Milestone glow + badge — when lifetime crosses $400, the momentum card pulses its shadow twice (no confetti), and a
  small "$400 Lifetime Saver" badge animates in with a satisfying scale-bounce. Calm, satisfying, done.

  CTA press interaction. The primary button scales down slightly on pointer-down and springs back on release, giving
  tactile feedback. A small helper line underneath ("Applies instantly" / "Takes ~30s") reduces friction without adding
  clutter.

  Insight card upgraded to coach format. Each insight now has a main line (bold, primary color) and a sub line (smaller,
  muted) — directive rather than just informational. A small "✦" spark icon anchors the section header. Pagination dots
  are smaller and the arrows have more padding.

  Home-specific Prototype Controls. The global ProtoControls is hidden on the Home tab. Instead, Home renders its own
  collapsible FAB with three controls: "+$1.25 reward" (triggers the micro-feedback), "Trigger milestone" (pushes lifetime
   to 400, fires the glow+badge), and "Toggle rewards available" (switches between Apply vs Payment CTA). This keeps the
  demo self-contained on the screen that matters.

_____
Changes (Home screen only)                                                                                              
   
  Removed:                                                                                                                
  - Quick action tiles (Freeze, Activity, Statements, Shop) — bottom nav handles navigation
  - Separate "Make a Payment" secondary button — CTA is now singular
  - Friend-nudge as a separate standalone element — folded into the momentum card
  - Streak dot calendar (14 overflowing circles) — replaced with a clean progress bar

  Restructured into 4 sections:

  1. Hero — "You've saved this month" heading + large animated counter with shimmer on load + two subtle secondary stats
  (Available / Lifetime) separated by a thin divider. Nothing else.
  2. Momentum card — single card merging streak + milestone. Shows "{N}-Day Earning Streak" title, milestone progress bar
  ($342 → $400) with caption, a friend-nudge line built into the card ("One Walmart trip this week could push you past
  $400"), and a streak progress bar (12/30 days) — horizontal bar, no dots.
  3. Primary CTA — one button. If rewards > 0: "Apply $56.84 to Statement". If rewards = 0: "Make a Payment". Only one
  visible at a time.
  4. Smart Insight card — rotating single-insight with left/right arrows and dot indicators. Three mock insights cycle
  through.

____
What changed                                          
                                                                                                                          
  1. Home — reduced cognitive load                                                                                        
  - Hero card now shows exactly 3 numbers: savings this month (hero), redeemable, lifetime (secondary pair)
  - Removed the separate "Available Rewards" card, separate "Payment Due" card, and the "Smart Insight" card              
  - Single primary CTA: "Apply $56.84 to Your Statement" — specific, actionable
  - "Make a Payment" demoted to secondary button; quick actions pushed below the fold

  2. "Why did I earn this?" — clearer structure
  - Added a one-sentence plain-English summary directly in the green reward box (e.g., "You earned $1.59 from the 1.25%
  Walmart rate, calculated on $112.77 before tax.")
  - The expandable section is now labeled "See full calculation" and only shows the receipt math — no longer buries the
  explanation behind a click

  3. Three "competent friend" nudges (one per major screen)
  - Home: Contextual — if payment is due within 7 days, suggests paying statement balance to avoid interest; otherwise,
  suggests a next action toward the milestone
  - Cart (Shop): Summarizes how many items have GV alternatives and the total potential savings in one line
  - Transaction detail: If Walmart, explains that GV lowers spend without affecting rate; if non-Walmart, shows the exact
  dollar amount they'd earn extra at Walmart.ca

  4. Milestone + streak visualization on Home
  - Progress bar with "$ to go" tag showing distance to next milestone
  - 14-dot streak calendar — filled dots for active days, highlighted dot for today, with a count label ("12 consecutive
  days earning rewards")

