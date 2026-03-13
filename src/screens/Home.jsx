import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { REWARDS } from '../data/mock';

const INSIGHTS = [
  {
    main: 'You earned $8 more this month by choosing Great Value.',
    sub: 'Try 3 more swaps to add about $5.',
  },
  {
    main: "You're 3 days away from your longest streak ever.",
    sub: 'Keep using your card daily to hit 15 days.',
  },
  {
    main: '12 items in your next Walmart cart qualify for 1.25%.',
    sub: 'Check the Shop tab to preview your rewards before checkout.',
  },
];

export function Home({
  thisMonth,
  lifetime,
  rewardsAvailable,
  navigate,
  onSimulateReward,
  onSimulateMilestone,
  onToggleRewards,
}) {
  const milestoneTarget = REWARDS.nextMilestone;
  const milestoneGap = Math.max(0, milestoneTarget - lifetime);
  const milestoneProgress = Math.min((lifetime / milestoneTarget) * 100, 100);
  const streakProgress = (REWARDS.streakDays / 30) * 100;
  const milestoneReached = lifetime >= milestoneTarget;

  const [insightIdx, setInsightIdx] = useState(0);
  const [shimmer, setShimmer] = useState(true);
  const [microFeedback, setMicroFeedback] = useState(null);
  const [milestoneGlow, setMilestoneGlow] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [ctaPressed, setCtaPressed] = useState(false);
  const [protoOpen, setProtoOpen] = useState(false);

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

  const handleAddReward = useCallback(() => {
    if (onSimulateReward) onSimulateReward();
  }, [onSimulateReward]);

  const handleTriggerMilestone = useCallback(() => {
    if (onSimulateMilestone) onSimulateMilestone();
  }, [onSimulateMilestone]);

  return (
    <div className="screen home-v4">

      {/* ── 1. HERO — open, no card border ── */}
      <section className="hv4-hero" aria-label="Monthly savings">
        <div className="hv4-hero-glow" aria-hidden="true" />
        <div className="hv4-hero-label">You've saved this month</div>
        <div className={`hv4-hero-amount ${shimmer ? 'hv4-shimmer' : ''}`}>
          <AnimatedCounter value={thisMonth} />
        </div>
        {microFeedback && (
          <div className="hv4-micro-feedback" aria-live="polite">
            {microFeedback}
          </div>
        )}
        <div className="hv4-hero-sub">Includes rewards + Walmart savings</div>

        <div className="hv4-hero-stats">
          <div className="hv4-stat">
            <span className="hv4-stat-value">${rewardsAvailable.toFixed(2)}</span>
            <span className="hv4-stat-label">Available</span>
          </div>
          <div className="hv4-stat-sep" aria-hidden="true" />
          <div className="hv4-stat">
            <span className="hv4-stat-value">
              <AnimatedCounter value={lifetime} />
            </span>
            <span className="hv4-stat-label">Lifetime</span>
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
          {REWARDS.streakDays}-Day Earning Streak
        </div>

        {/* Milestone progress */}
        <div className="hv4-progress-section">
          <div className="hv4-bar-labels">
            <span>${lifetime.toFixed(0)}</span>
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
              ${milestoneGap.toFixed(0)} to reach <strong>{REWARDS.milestoneName}</strong>
            </div>
          ) : (
            <div className={`hv4-badge ${showBadge ? 'hv4-badge-in' : ''}`}>
              {REWARDS.milestoneName}
            </div>
          )}
        </div>

        {/* Guidance nudge */}
        {!milestoneReached && (
          <div className="hv4-nudge">
            One Walmart trip this week could push you past ${milestoneTarget}.
          </div>
        )}

        {/* Streak bar */}
        <div className="hv4-progress-section hv4-streak-section">
          <div className="hv4-bar-labels">
            <span>{REWARDS.streakDays} days</span>
            <span>30-day goal</span>
          </div>
          <div className="hv4-bar hv4-bar-sm">
            <div
              className="hv4-bar-fill hv4-bar-fill-muted"
              style={{ width: `${streakProgress}%` }}
            />
          </div>
        </div>
      </section>

      {/* ── 3. PRIMARY CTA ── */}
      <div className="hv4-cta-wrap">
        {rewardsAvailable > 0 ? (
          <>
            <button
              className={`btn btn-primary hv4-cta ${ctaPressed ? 'hv4-cta-press' : ''}`}
              onClick={() => navigate('main', 'redeem')}
              onPointerDown={() => setCtaPressed(true)}
              onPointerUp={() => setCtaPressed(false)}
              onPointerLeave={() => setCtaPressed(false)}
            >
              Apply ${rewardsAvailable.toFixed(2)} to Statement
            </button>
            <div className="hv4-cta-helper">Applies instantly</div>
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
            <div className="hv4-cta-helper">Takes ~30s</div>
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
          <div className="hv4-insight-main">{INSIGHTS[insightIdx].main}</div>
          <div className="hv4-insight-sub">{INSIGHTS[insightIdx].sub}</div>
        </div>
        <div className="hv4-insight-nav">
          <button
            className="hv4-insight-arrow"
            onClick={() => setInsightIdx((insightIdx - 1 + INSIGHTS.length) % INSIGHTS.length)}
            aria-label="Previous insight"
          >
            &larr;
          </button>
          <span className="hv4-insight-dots">
            {INSIGHTS.map((_, i) => (
              <span key={i} className={`hv4-idot ${i === insightIdx ? 'active' : ''}`} />
            ))}
          </span>
          <button
            className="hv4-insight-arrow"
            onClick={() => setInsightIdx((insightIdx + 1) % INSIGHTS.length)}
            aria-label="Next insight"
          >
            &rarr;
          </button>
        </div>
      </section>

      {/* ── PROTOTYPE CONTROLS (Home-only, collapsible) ── */}
      <button
        className="hv4-proto-fab"
        onClick={() => setProtoOpen(o => !o)}
        aria-label="Toggle prototype controls"
      >
        ⚡
      </button>
      {protoOpen && (
        <div className="hv4-proto-panel" role="dialog" aria-label="Prototype Controls">
          <div className="hv4-proto-title">Prototype Controls</div>
          <button className="proto-btn" onClick={handleAddReward}>
            + Add reward +$1.25
          </button>
          <button className="proto-btn" onClick={handleTriggerMilestone}>
            ★ Trigger milestone
          </button>
          <button className="proto-btn" onClick={onToggleRewards}>
            ↔ Toggle rewards available
          </button>
          <button className="proto-btn" onClick={() => setProtoOpen(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
