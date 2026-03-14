import { useState, useEffect, useRef } from 'react';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { REWARDS, PAYMENT } from '../data/mock';
import { redeemableAmount } from '../data/rewards';

export function Home({
  thisMonth,
  lifetime,
  rewardsAvailable,
  navigate,
  isNewUser,
}) {
  // New user data overrides
  const displayThisMonth = isNewUser ? 3.82 : thisMonth;
  const displayLifetime = isNewUser ? 3.82 : lifetime;
  const displayRewardsAvailable = isNewUser ? 3.82 : rewardsAvailable;
  const displayStreak = isNewUser ? 1 : REWARDS.streakDays;

  const milestoneTarget = isNewUser ? 50 : REWARDS.nextMilestone;
  const milestoneName = isNewUser ? 'First $50 saved' : REWARDS.milestoneName;
  const milestoneGap = Math.max(0, milestoneTarget - displayLifetime);
  const milestoneProgress = Math.min((displayLifetime / milestoneTarget) * 100, 100);
  const streakProgress = (displayStreak / 30) * 100;
  const milestoneReached = displayLifetime >= milestoneTarget;

  // Dynamic insights — reflect live state
  const RETURNING_INSIGHTS = [
    {
      main: `You earned $${displayThisMonth.toFixed(2)} in rewards this month.`,
      sub: 'Just from your regular Walmart shopping — no extra steps.',
    },
    {
      main: `$${redeemableAmount(displayRewardsAvailable).toFixed(2)} is ready to use at your next Walmart checkout.`,
      sub: 'Tell the terminal how much to apply — in $5 increments.',
    },
    {
      main: `You're $${Math.max(0, milestoneTarget - displayLifetime).toFixed(0)} away from $${milestoneTarget} in lifetime savings.`,
      sub: 'One regular grocery run should get you there.',
    },
  ];

  const NEW_USER_INSIGHTS = [
    {
      main: 'Welcome — your first $3.82 is already waiting.',
      sub: 'Use your card at Walmart to keep earning.',
    },
    {
      main: 'Earn $3 back for every $100 at Walmart.',
      sub: 'Your rewards build automatically — no extra steps.',
    },
    {
      main: 'Your Reward Dollars never expire.',
      sub: 'Save them up or use them at your next checkout.',
    },
  ];

  const INSIGHTS = isNewUser ? NEW_USER_INSIGHTS : RETURNING_INSIGHTS;

  const [insightIdx, setInsightIdx] = useState(0);
  const safeIdx = insightIdx % INSIGHTS.length;
  const [shimmer, setShimmer] = useState(true);
  const [microFeedback, setMicroFeedback] = useState(null);
  const [milestoneGlow, setMilestoneGlow] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [ctaPressed, setCtaPressed] = useState(false);
  const prevThisMonth = useRef(thisMonth);
  const prevLifetime = useRef(lifetime);

  // Initial shimmer
  useEffect(() => {
    const t = setTimeout(() => setShimmer(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Detect reward increment → micro-feedback
  useEffect(() => {
    const delta = +(thisMonth - prevThisMonth.current).toFixed(2);
    if (delta > 0 && prevThisMonth.current > 0) {
      setMicroFeedback(`+$${delta.toFixed(2)}`);
      setShimmer(true);
      const t1 = setTimeout(() => setMicroFeedback(null), 1800);
      const t2 = setTimeout(() => setShimmer(false), 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    prevThisMonth.current = thisMonth;
  }, [thisMonth]);

  // Detect milestone reached → glow + badge
  useEffect(() => {
    if (lifetime >= milestoneTarget && prevLifetime.current < milestoneTarget) {
      setMilestoneGlow(true);
      setTimeout(() => setShowBadge(true), 600);
      setTimeout(() => setMilestoneGlow(false), 2000);
    }
    prevLifetime.current = lifetime;
  }, [lifetime, milestoneTarget]);

  // Also show badge when milestone already reached (e.g. after trigger)
  useEffect(() => {
    if (milestoneReached) setShowBadge(true);
  }, [milestoneReached]);

  return (
    <div className="screen home-v4">

      {/* ── 1. HERO — open, no card border ── */}
      <section className="hv4-hero" aria-label="Monthly savings">
        <div className="hv4-hero-glow" aria-hidden="true" />
        <div className="hv4-hero-label">You've saved this month</div>
        <div className={`hv4-hero-amount ${shimmer ? 'hv4-shimmer' : ''}`}>
          <AnimatedCounter value={displayThisMonth} />
        </div>
        {microFeedback && (
          <div className="hv4-micro-feedback" aria-live="polite">
            {microFeedback}
          </div>
        )}
        <div className="hv4-hero-sub">Earned automatically on your Walmart purchases</div>

        <div className="hv4-hero-stats">
          <div className="hv4-stat">
            <span className="hv4-stat-value">${redeemableAmount(displayRewardsAvailable).toFixed(2)}</span>
            <span className="hv4-stat-label">Ready to Redeem</span>
          </div>
          <div className="hv4-stat-sep" aria-hidden="true" />
          <div className="hv4-stat">
            <span className="hv4-stat-value">
              <AnimatedCounter value={displayLifetime} />
            </span>
            <span className="hv4-stat-label">Saved lifetime</span>
          </div>
        </div>
      </section>

      {/* ── 2. MOMENTUM — streak + milestone, single card ── */}
      <section
        className={`hv4-momentum ${milestoneGlow ? 'hv4-glow' : ''}`}
        aria-label="Streak and milestone"
      >
        <div className="hv4-momentum-title">
          <span className="hv4-flame" aria-hidden="true">&#x2022;</span>
          {isNewUser ? 'Day 1 of your earning streak' : `${displayStreak}-Day Earning Streak`}
        </div>

        {/* Milestone progress */}
        <div className="hv4-progress-section">
          <div className="hv4-bar-labels">
            <span>${displayLifetime.toFixed(0)}</span>
            <span>${milestoneTarget}</span>
          </div>
          <div className="hv4-bar">
            <div
              className="hv4-bar-fill"
              style={{ width: `${milestoneProgress}%` }}
            />
          </div>
          {!milestoneReached ? (
            <div className="hv4-bar-caption">
              ${milestoneGap.toFixed(0)} to reach <strong>{milestoneName}</strong>
            </div>
          ) : (
            <div className={`hv4-badge ${showBadge ? 'hv4-badge-in' : ''}`}>
              {milestoneName}
            </div>
          )}
        </div>

        {/* Guidance nudge */}
        {!milestoneReached && (
          <div className="hv4-nudge">
            {isNewUser
              ? 'Keep using your card at Walmart — your rewards build with every purchase.'
              : `One regular grocery run and you'll hit your $${milestoneTarget} milestone.`
            }
          </div>
        )}

        {/* Streak bar — hide for new users */}
        {!isNewUser && (
          <div className="hv4-progress-section hv4-streak-section">
            <div className="hv4-bar-labels">
              <span>{displayStreak} days</span>
              <span>30-day goal</span>
            </div>
            <div className="hv4-bar hv4-bar-sm">
              <div
                className="hv4-bar-fill hv4-bar-fill-muted"
                style={{ width: `${streakProgress}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* ── 3. PRIMARY CTA ── */}
      <div className="hv4-cta-wrap">
        {displayRewardsAvailable > 0 ? (
          <>
            <button
              className={`btn btn-primary hv4-cta ${ctaPressed ? 'hv4-cta-press' : ''}`}
              onClick={() => navigate('rewards')}
              onPointerDown={() => setCtaPressed(true)}
              onPointerUp={() => setCtaPressed(false)}
              onPointerLeave={() => setCtaPressed(false)}
            >
              ${redeemableAmount(displayRewardsAvailable).toFixed(2)} ready to use at Walmart
            </button>
            <div className="hv4-cta-helper">No codes, no coupons — just use your card</div>
          </>
        ) : (
          <>
            <button
              className={`btn btn-primary hv4-cta ${ctaPressed ? 'hv4-cta-press' : ''}`}
              onClick={() => navigate('main', 'payment')}
              onPointerDown={() => setCtaPressed(true)}
              onPointerUp={() => setCtaPressed(false)}
              onPointerLeave={() => setCtaPressed(false)}
            >
              Make a Payment
            </button>
            <div className="hv4-cta-helper">Due {PAYMENT.dueDate}</div>
          </>
        )}
      </div>

      {/* ── 4. SMART INSIGHT — coach-like ── */}
      <section className="hv4-insight" aria-label="Smart insight" role="region">
        <div className="hv4-insight-header">
          <span className="hv4-insight-icon" aria-hidden="true">&#x2726;</span>
          <span className="hv4-insight-title">Insight</span>
        </div>
        <div className="hv4-insight-body">
          <div className="hv4-insight-main">{INSIGHTS[safeIdx].main}</div>
          <div className="hv4-insight-sub">{INSIGHTS[safeIdx].sub}</div>
        </div>
        <div className="hv4-insight-nav">
          <button
            className="hv4-insight-arrow"
            onClick={() => setInsightIdx((safeIdx - 1 + INSIGHTS.length) % INSIGHTS.length)}
            aria-label="Previous insight"
          >
            &larr;
          </button>
          <span className="hv4-insight-dots">
            {INSIGHTS.map((_, i) => (
              <span key={i} className={`hv4-idot ${i === safeIdx ? 'active' : ''}`} />
            ))}
          </span>
          <button
            className="hv4-insight-arrow"
            onClick={() => setInsightIdx((safeIdx + 1) % INSIGHTS.length)}
            aria-label="Next insight"
          >
            &rarr;
          </button>
        </div>
      </section>

    </div>
  );
}
