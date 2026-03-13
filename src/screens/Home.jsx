import { AnimatedCounter } from '../components/AnimatedCounter';
import { REWARDS, PAYMENT } from '../data/mock';

export function Home({ thisMonth, lifetime, rewardsAvailable, navigate, frozen }) {
  const progress = (lifetime / REWARDS.nextMilestone) * 100;
  const daysUntilDue = Math.max(0, Math.round((new Date(PAYMENT.dueDate) - new Date()) / 86400000));

  return (
    <div className="screen">
      {/* ── Hero: 3 numbers max ── */}
      <div className="card" style={{ textAlign: 'center', paddingTop: 20, paddingBottom: 20 }}>
        <div className="text-sm text-muted" style={{ marginBottom: 2 }}>You've saved this month</div>
        <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1 }}>
          <AnimatedCounter value={thisMonth} />
        </div>
        <div className="flex justify-between mt-16" style={{ maxWidth: 240, margin: '16px auto 0' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>${rewardsAvailable.toFixed(2)}</div>
            <div className="text-sm text-muted">Redeemable</div>
          </div>
          <div style={{ width: 1, background: 'var(--border)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}><AnimatedCounter value={lifetime} /></div>
            <div className="text-sm text-muted">Lifetime</div>
          </div>
        </div>
      </div>

      {/* ── Single primary CTA ── */}
      <button className="btn btn-primary mt-12" onClick={() => navigate('main', 'redeem')}>
        Apply ${rewardsAvailable.toFixed(2)} to Your Statement
      </button>
      <div className="flex gap-8 mt-8">
        <button className="btn btn-secondary" onClick={() => navigate('main', 'payment')}>
          Make a Payment
        </button>
      </div>

      {/* ── Competent-friend nudge ── */}
      <div className="friend-nudge mt-12">
        <div className="friend-nudge-icon">?</div>
        <div>
          {daysUntilDue <= 7
            ? <>Your payment of <strong>${PAYMENT.minimumDue.toFixed(2)}</strong> is due in <strong>{daysUntilDue} days</strong>. Paying the statement balance saves you interest.</>
            : <>You're on a <strong>{REWARDS.streakDays}-day earning streak</strong>. A $50 Walmart trip this week gets you past <strong>${REWARDS.nextMilestone} lifetime</strong>.</>
          }
        </div>
      </div>

      {/* ── Milestone & Streak viz ── */}
      <div className="card mt-12">
        <div className="flex justify-between items-center mb-8">
          <div className="card-title" style={{ marginBottom: 0 }}>Next Milestone</div>
          <span className="tag tag-default">${(REWARDS.nextMilestone - lifetime).toFixed(2)} to go</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <div className="flex justify-between mt-8 text-sm text-muted">
          <span>${lifetime.toFixed(0)} earned</span>
          <span>${REWARDS.nextMilestone} {REWARDS.milestoneName}</span>
        </div>

        {/* Streak calendar row */}
        <div className="streak-row mt-16">
          <div className="card-title" style={{ marginBottom: 6 }}>Earning Streak</div>
          <div className="streak-calendar">
            {Array.from({ length: 14 }, (_, i) => {
              const active = i < REWARDS.streakDays;
              const isToday = i === REWARDS.streakDays - 1;
              return (
                <div
                  key={i}
                  className={`streak-day ${active ? 'streak-active' : ''} ${isToday ? 'streak-today' : ''}`}
                  aria-label={active ? `Day ${i + 1} — active` : `Day ${i + 1}`}
                >
                  {active ? '●' : '○'}
                </div>
              );
            })}
          </div>
          <div className="text-sm text-muted mt-8">
            {REWARDS.streakDays} consecutive days earning rewards
          </div>
        </div>
      </div>

      {/* ── Quick Actions (demoted, smaller) ── */}
      <div className="quick-actions mt-12">
        <button className="quick-action" onClick={() => navigate('main', 'freeze')}>
          <span className="qa-icon">{frozen ? '▶' : '❄'}</span>
          {frozen ? 'Unfreeze' : 'Freeze'}
        </button>
        <button className="quick-action" onClick={() => navigate('activity')}>
          <span className="qa-icon">☰</span>
          Activity
        </button>
        <button className="quick-action" onClick={() => navigate('main', 'statements')}>
          <span className="qa-icon">▤</span>
          Statements
        </button>
        <button className="quick-action" onClick={() => navigate('shop')}>
          <span className="qa-icon">◈</span>
          Shop
        </button>
      </div>
    </div>
  );
}
