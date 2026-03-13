import { useState, useEffect } from 'react';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { REWARDS } from '../data/mock';

const INSIGHTS = [
  'You earned $8 more this month by choosing Great Value.',
  "You're 3 days away from your longest streak ever.",
  '12 items in your next Walmart cart qualify for 1.25%.',
];

export function Home({ thisMonth, lifetime, rewardsAvailable, navigate }) {
  const milestoneGap = REWARDS.nextMilestone - lifetime;
  const milestoneProgress = Math.min((lifetime / REWARDS.nextMilestone) * 100, 100);
  const streakProgress = (REWARDS.streakDays / 30) * 100;
  const [insightIdx, setInsightIdx] = useState(0);
  const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShimmer(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="screen home-screen">

      {/* ── 1. HERO ── */}
      <section className="home-hero" aria-label="Savings summary">
        <div className="home-hero-label">You've saved this month</div>
        <div className={`home-hero-number ${shimmer ? 'hero-shimmer' : ''}`}>
          <AnimatedCounter value={thisMonth} />
        </div>
        <div className="home-hero-sub">Includes rewards + Walmart savings</div>

        <div className="home-hero-stats">
          <div className="home-stat">
            <span className="home-stat-value">${rewardsAvailable.toFixed(2)}</span>
            <span className="home-stat-label">Available</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat">
            <span className="home-stat-value">
              <AnimatedCounter value={lifetime} />
            </span>
            <span className="home-stat-label">Lifetime</span>
          </div>
        </div>
      </section>

      {/* ── 2. MOMENTUM CARD ── */}
      <section className="home-momentum" aria-label="Streak and milestone progress">
        <div className="momentum-header">
          <span className="momentum-title">{REWARDS.streakDays}-Day Earning Streak</span>
        </div>

        {/* Milestone bar */}
        <div className="momentum-section">
          <div className="momentum-bar-labels">
            <span>${lifetime.toFixed(0)}</span>
            <span>${REWARDS.nextMilestone}</span>
          </div>
          <div className="progress-bar" style={{ height: 10 }}>
            <div className="progress-fill" style={{ width: `${milestoneProgress}%` }} />
          </div>
          <div className="momentum-caption">
            ${milestoneGap.toFixed(0)} to reach <strong>{REWARDS.milestoneName}</strong>
          </div>
        </div>

        {/* Friend nudge — inside card, not separate */}
        <div className="momentum-nudge">
          One Walmart trip this week could push you past ${REWARDS.nextMilestone}.
        </div>

        {/* Streak bar */}
        <div className="momentum-section" style={{ marginTop: 16 }}>
          <div className="momentum-bar-labels">
            <span>{REWARDS.streakDays} days</span>
            <span>30-day goal</span>
          </div>
          <div className="progress-bar" style={{ height: 6 }}>
            <div
              className="progress-fill"
              style={{ width: `${streakProgress}%`, background: 'var(--text-muted)' }}
            />
          </div>
        </div>
      </section>

      {/* ── 3. PRIMARY CTA ── */}
      {rewardsAvailable > 0 ? (
        <button
          className="btn btn-primary home-cta"
          onClick={() => navigate('main', 'redeem')}
        >
          Apply ${rewardsAvailable.toFixed(2)} to Statement
        </button>
      ) : (
        <button
          className="btn btn-primary home-cta"
          onClick={() => navigate('main', 'payment')}
        >
          Make a Payment
        </button>
      )}

      {/* ── 4. SMART INSIGHT (rotating) ── */}
      <section className="home-insight" aria-label="Smart insight" role="region">
        <div className="insight-content">
          <span className="insight-text">{INSIGHTS[insightIdx]}</span>
        </div>
        <div className="insight-nav">
          <button
            className="insight-arrow"
            onClick={() => setInsightIdx((insightIdx - 1 + INSIGHTS.length) % INSIGHTS.length)}
            aria-label="Previous insight"
          >
            &larr;
          </button>
          <span className="insight-dots">
            {INSIGHTS.map((_, i) => (
              <span key={i} className={`insight-dot ${i === insightIdx ? 'active' : ''}`} />
            ))}
          </span>
          <button
            className="insight-arrow"
            onClick={() => setInsightIdx((insightIdx + 1) % INSIGHTS.length)}
            aria-label="Next insight"
          >
            &rarr;
          </button>
        </div>
      </section>
    </div>
  );
}
