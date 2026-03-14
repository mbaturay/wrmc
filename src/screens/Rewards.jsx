import { REDEMPTION_INCREMENT, redeemableAmount } from '../data/rewards';

export function Rewards({ rewardsAvailable, redemptions }) {
  const redeemable = redeemableAmount(rewardsAvailable);
  const remainder = +(rewardsAvailable - redeemable).toFixed(2);
  const untilNext5 = +(REDEMPTION_INCREMENT - remainder).toFixed(2);

  return (
    <div className="screen">
      {/* Balance card */}
      <div className="card" style={{ textAlign: 'center', paddingTop: 24, paddingBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>
          Walmart Reward Dollars
        </div>
        <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>
          ${rewardsAvailable.toFixed(2)}
        </div>
        <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-muted)' }}>
          Redeemable at Walmart only
        </div>
      </div>

      {/* Redemption breakdown */}
      <div className="card">
        <div className="card-title">Redemption Breakdown</div>
        <div className="receipt-line">
          <span>Total balance</span>
          <strong>${rewardsAvailable.toFixed(2)}</strong>
        </div>
        <div className="receipt-line">
          <span>Available to redeem now</span>
          <strong className="text-success">${redeemable.toFixed(2)}</strong>
        </div>
        {remainder > 0 && (
          <div className="receipt-line">
            <span>Saving toward next $5</span>
            <span>${remainder.toFixed(2)}</span>
          </div>
        )}
        {redeemable < REDEMPTION_INCREMENT && (
          <div style={{
            marginTop: 12, padding: '10px 12px',
            background: 'var(--warning-bg)', border: '1px solid #e6d5a0',
            borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--warning)',
          }}>
            Keep earning — you need ${untilNext5.toFixed(2)} more to redeem your first $5.
          </div>
        )}
        {redeemable >= REDEMPTION_INCREMENT && (
          <div style={{
            marginTop: 12, padding: '10px 12px',
            background: 'var(--success-bg)',
            borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--success)',
          }}>
            You have ${redeemable.toFixed(2)} ready to use at your next Walmart checkout.
          </div>
        )}
      </div>

      {/* How to use */}
      <div className="card">
        <div className="card-title">How to Use Your Reward Dollars</div>
        <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>At Walmart checkout</div>
            Swipe your physical card at the terminal. It will ask if you want to apply Reward Dollars. Choose your amount in $5 increments.
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>On Walmart.ca</div>
            At checkout, select "Redeem Reward Dollars" and choose your amount in $5 increments.
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Want to save up?</div>
            Just skip it at checkout — your balance never expires.
          </div>
        </div>
      </div>

      {/* History */}
      {redemptions.length > 0 && (
        <div className="card">
          <div className="card-title">Recent Redemptions</div>
          {redemptions.map((r, i) => (
            <div
              key={r.id}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < redemptions.length - 1 ? '1px solid var(--accent-light)' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>-${r.amount.toFixed(2)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.type}</div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{r.date}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
