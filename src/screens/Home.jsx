import { AnimatedCounter } from '../components/AnimatedCounter';
import { REWARDS, PAYMENT } from '../data/mock';

export function Home({ thisMonth, lifetime, rewardsAvailable, navigate, frozen }) {
  const progress = (lifetime / REWARDS.nextMilestone) * 100;

  return (
    <div className="screen">
      {/* Savings counter */}
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="card-title">Savings This Month</div>
        <div style={{ fontSize: 36, fontWeight: 700, margin: '8px 0' }}>
          <AnimatedCounter value={thisMonth} />
        </div>
        <div className="text-sm text-muted">1.25% cashback at Walmart &middot; 1% everywhere else</div>
      </div>

      {/* CTAs */}
      <div className="flex gap-8 mt-12">
        <button className="btn btn-primary" onClick={() => navigate('main', 'payment')}>
          Make a Payment
        </button>
        <button className="btn btn-success" onClick={() => navigate('main', 'redeem')}>
          Apply Rewards
        </button>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions mt-12">
        <button className="quick-action" onClick={() => navigate('main', 'freeze')}>
          <span className="qa-icon">{frozen ? '▶' : '❄'}</span>
          {frozen ? 'Unfreeze' : 'Freeze'}
        </button>
        <button className="quick-action" onClick={() => navigate('activity')}>
          <span className="qa-icon">☰</span>
          Transactions
        </button>
        <button className="quick-action" onClick={() => navigate('main', 'statements')}>
          <span className="qa-icon">▤</span>
          Statements
        </button>
        <button className="quick-action" onClick={() => navigate('shop')}>
          <span className="qa-icon">★</span>
          Offers
        </button>
      </div>

      {/* Smart Insight */}
      <div className="insight-card mt-12">
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Smart Insight</div>
        <div style={{ fontSize: 15 }}>
          You earned <strong>${thisMonth}</strong> this month.{' '}
          You're <strong>${(REWARDS.nextMilestone - lifetime).toFixed(2)}</strong> away from the{' '}
          <em>{REWARDS.milestoneName}</em> milestone!
        </div>
      </div>

      {/* Lifetime tracker */}
      <div className="card mt-12">
        <div className="card-title">Lifetime Savings</div>
        <div className="flex justify-between items-center mb-8">
          <span style={{ fontSize: 22, fontWeight: 700 }}>
            <AnimatedCounter value={lifetime} />
          </span>
          <span className="tag tag-default">{REWARDS.streakDays}-day streak</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <div className="flex justify-between mt-8 text-sm text-muted">
          <span>$0</span>
          <span>${REWARDS.nextMilestone} milestone</span>
        </div>
      </div>

      {/* Rewards available */}
      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <div className="card-title">Available Rewards</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>${rewardsAvailable.toFixed(2)}</div>
          </div>
          <button className="btn btn-sm btn-success" onClick={() => navigate('main', 'redeem')}>
            Redeem
          </button>
        </div>
        <div className="text-sm text-muted mt-8">
          Pending: ${REWARDS.pendingRewards.toFixed(2)}
        </div>
      </div>

      {/* Payment due */}
      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <div className="card-title">Payment Due</div>
            <div style={{ fontSize: 15 }}>
              <strong>${PAYMENT.minimumDue.toFixed(2)}</strong> min &middot; by {PAYMENT.dueDate}
            </div>
          </div>
          <button className="btn btn-sm btn-secondary" onClick={() => navigate('main', 'payment')}>
            Pay
          </button>
        </div>
      </div>
    </div>
  );
}
