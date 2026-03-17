import { useState, useEffect, useRef } from 'react';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { REWARDS } from '../data/mock';
import { redeemableAmount } from '../data/rewards';

export function Home({
  thisMonth,
  lifetime,
  rewardsAvailable,
  navigate,
  isNewUser,
  frozen,
}) {
  // New user data overrides
  const displayThisMonth = isNewUser ? 3.82 : thisMonth;
  const displayLifetime = isNewUser ? 3.82 : lifetime;
  const displayRewardsAvailable = isNewUser ? 3.82 : rewardsAvailable;
  const displayStreak = isNewUser ? 1 : REWARDS.streakDays;

  const milestoneTarget = isNewUser ? 50 : REWARDS.nextMilestone;
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
      main: `You're $${milestoneGap.toFixed(0)} away from $${milestoneTarget} in lifetime savings.`,
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

  useEffect(() => {
    if (milestoneReached) setShowBadge(true);
  }, [milestoneReached]);

  return (
    <div className="screen home-v4">

      {/* ── 1. HERO — glanceable rewards snapshot ── */}
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
        {frozen && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 12, padding: '6px 14px',
            background: '#EEF2F5', borderRadius: 20,
            fontSize: 12, fontWeight: 600, color: '#3b6fa0',
          }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 3L12 5.5H14.5L13 8L14.5 10.5H12L10 13L8 10.5H5.5L7 8L5.5 5.5H8L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
            </svg>
            Card frozen
          </div>
        )}
      </section>

      {/* ── 2. EARNING STREAK — compact single line ── */}
      {!isNewUser && (
        <section
          className={`hv4-momentum ${milestoneGlow ? 'hv4-glow' : ''}`}
          aria-label="Earning streak"
          style={{ padding: '14px 20px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="hv4-flame" aria-hidden="true">&#x2022;</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{displayStreak}-Day Streak</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{displayStreak}/30 days</span>
          </div>
          <div className="hv4-bar hv4-bar-sm">
            <div
              className="hv4-bar-fill hv4-bar-fill-muted"
              style={{ width: `${streakProgress}%` }}
            />
          </div>
        </section>
      )}

      {/* "See full rewards breakdown →" link */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => navigate('rewards')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: 'var(--text-muted)', fontWeight: 500,
            padding: '4px 0',
          }}
        >
          See full rewards breakdown →
        </button>
      </div>

      {/* ── 3. QUICK ACTIONS — task-based, all navigate ── */}
      <section aria-label="Quick actions">
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
          Quick actions
        </div>
        <div className="quick-actions" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {/* Pay now */}
          <button
            className="quick-action"
            onClick={() => navigate('main', 'payment')}
          >
            <span className="qa-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="5" width="14" height="10" rx="2" stroke="#333" strokeWidth="1.5" fill="none"/>
                <path d="M10 12V7M10 7L7.5 9.5M10 7L12.5 9.5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Pay now
          </button>

          {/* Freeze / Unfreeze card — navigates to Card Controls */}
          <button
            className="quick-action"
            onClick={() => navigate('main', 'freeze')}
            style={frozen ? { background: '#EEF2F5', borderColor: '#c8d6e0' } : undefined}
          >
            <span className="qa-icon" aria-hidden="true">
              {frozen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="#333" strokeWidth="1.5" fill="none"/>
                  <path d="M10 6V14M7 8L10 6L13 8M7 12L10 14L13 12" stroke="#333" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3L12 5.5H14.5L13 8L14.5 10.5H12L10 13L8 10.5H5.5L7 8L5.5 5.5H8L10 3Z" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                  <circle cx="10" cy="8" r="1.5" fill="#333"/>
                </svg>
              )}
            </span>
            {frozen ? 'Unfreeze' : 'Freeze card'}
          </button>

          {/* View statement */}
          <button
            className="quick-action"
            onClick={() => navigate('main', 'statements')}
          >
            <span className="qa-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="4" y="3" width="12" height="14" rx="2" stroke="#333" strokeWidth="1.5" fill="none"/>
                <path d="M7 7H13M7 10H13M7 13H10" stroke="#333" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </span>
            Statements
          </button>
        </div>
      </section>

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
