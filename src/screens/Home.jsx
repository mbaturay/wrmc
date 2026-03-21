import { useState, useEffect, useRef } from 'react';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { redeemableAmount } from '../data/rewards';
import { ArrowRight, Sparkle, LockKey, CreditCard, FileText, Snowflake, ICON_WEIGHT } from '../icons';

export function Home({
  thisMonth,
  lifetime,
  rewardsAvailable,
  navigate,
  isNewUser,
  frozen,
  profile,
  cardStatus,
}) {
  const displayThisMonth = thisMonth;
  const displayLifetime = lifetime;
  const displayRewardsAvailable = rewardsAvailable;
  const displayStreak = profile.streakDays;

  const milestoneTarget = profile.nextMilestone;
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

  const NEW_USER_INSIGHTS = displayThisMonth > 0 ? [
    {
      main: 'Your first rewards are here — and your $25 welcome bonus is on its way.',
      sub: `You've earned $${displayThisMonth.toFixed(2)} so far.`,
    },
    {
      main: 'Earn $3 back for every $100 at Walmart.',
      sub: 'Your rewards build automatically — no extra steps.',
    },
    {
      main: 'Your Reward Dollars never expire.',
      sub: 'Save them up or use them at your next checkout.',
    },
  ] : [
    {
      main: 'Make a $75+ Walmart purchase within 30 days to unlock your $25 welcome bonus.',
      sub: 'One qualifying purchase is all it takes.',
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
        <div className="hv4-hero-sub">
          {isNewUser && displayThisMonth === 0 ? 'Make your first purchase to start earning' : 'Earned automatically on your Walmart purchases'}
        </div>
        {frozen && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 12, padding: '6px 14px',
            background: '#EEF2F5', borderRadius: 20,
            fontSize: 12, fontWeight: 600, color: '#3b6fa0',
          }}>
            <Snowflake size={14} weight={ICON_WEIGHT} />
            Card frozen
          </div>
        )}
      </section>

      {/* ── 2. EARNING STREAK — compact single line ── */}
      {isNewUser && displayStreak === 0 ? (
        <section
          className="hv4-momentum"
          aria-label="Earning streak"
          style={{ padding: '14px 20px' }}
        >
          <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
            Start your streak — make your first purchase
          </div>
        </section>
      ) : (
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
              <CreditCard size={20} weight={ICON_WEIGHT} />
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
              <Snowflake size={20} weight={frozen ? 'fill' : ICON_WEIGHT} />
            </span>
            {frozen ? 'Unfreeze' : 'Freeze card'}
          </button>

          {/* View statement */}
          <button
            className="quick-action"
            onClick={() => navigate('main', 'statements')}
          >
            <span className="qa-icon" aria-hidden="true">
              <FileText size={20} weight={ICON_WEIGHT} />
            </span>
            Statements
          </button>
        </div>
      </section>

      {/* ── 3b. PRE-SHOP AWARENESS CARD ── */}
      {!isNewUser && displayRewardsAvailable > 0 && (
        <section
          onClick={() => navigate('rewards')}
          style={{
            background: '#FFFBEB', border: '0.5px solid #E6D5A0',
            borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 12,
            borderLeft: '3px solid #FFC220',
          }}
          aria-label="Rewards available"
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#8D6E00', fontWeight: 500, marginBottom: 2 }}>
              Ready to use at Walmart
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#5D4200' }}>
              ${displayRewardsAvailable.toFixed(2)} in Reward Dollars
            </div>
            <div style={{ fontSize: 12, color: '#8D6E00', marginTop: 2 }}>
              Redeem in $5 increments at checkout — no codes needed
            </div>
          </div>
          <ArrowRight size={16} weight={ICON_WEIGHT} color="#8D6E00" style={{ flexShrink: 0 }} />
        </section>
      )}

      {isNewUser && profile.welcomeBonus && (
        <section
          style={{
            background: profile.welcomeBonus.unlocked ? '#F0F7EC' : '#EFF6FF',
            border: `0.5px solid ${profile.welcomeBonus.unlocked ? '#C6DEBB' : '#BFDBFE'}`,
            borderRadius: 12, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            borderLeft: `3px solid ${profile.welcomeBonus.unlocked ? '#3B6D11' : '#3B82F6'}`,
          }}
          aria-label="Welcome bonus"
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: profile.welcomeBonus.unlocked ? '#3B6D11' : '#1E40AF', fontWeight: 500, marginBottom: 2 }}>
              Welcome bonus — ${profile.welcomeBonus.total.toFixed(0)}
            </div>
            {profile.welcomeBonus.unlocked ? (
              <>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#3B6D11', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Unlocked! <span style={{ fontSize: 16 }}>✓</span>
                </div>
                <div style={{ fontSize: 12, color: '#3B6D11', marginTop: 2 }}>
                  Your $25 bonus will be credited within 5 business days
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1E3A5F' }}>
                  Make a single Walmart purchase of $75 or more within 30 days of approval
                </div>
                <div style={{ fontSize: 12, color: '#1E40AF', marginTop: 4 }}>
                  {profile.welcomeBonus.daysRemaining} days remaining
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ── 4. SMART INSIGHT — coach-like ── */}
      <section className="hv4-insight" aria-label="Smart insight" role="region">
        <div className="hv4-insight-header">
          <span className="hv4-insight-icon" aria-hidden="true"><Sparkle size={16} weight={ICON_WEIGHT} /></span>
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

      {/* ── Physical card subtle indicator ── */}
      {cardStatus === 'virtual_only' && isNewUser && (
        <div
          onClick={() => navigate('main', 'notifications')}
          style={{
            background: '#F5F5F5', borderRadius: 8, padding: '10px 14px',
            fontSize: 12, color: 'var(--text-muted)', textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          Your physical card is on its way — expected in 5–7 business days
        </div>
      )}

    </div>
  );
}
