import { REDEMPTION_INCREMENT, redeemableAmount } from '../data/rewards';

export function Rewards({ rewardsAvailable, redemptions, earningHistory, pendingRewards, welcomeBonus, isNewUser }) {
  const redeemable = redeemableAmount(rewardsAvailable);
  const remainder = +(rewardsAvailable - redeemable).toFixed(2);
  const untilNext5 = +(REDEMPTION_INCREMENT - remainder).toFixed(2);

  const showWelcomeBonus = isNewUser && welcomeBonus && !(welcomeBonus.paperlessEarned && welcomeBonus.purchaseBonus.qualifyingPurchases >= welcomeBonus.purchaseBonus.requiredPurchases);
  const pb = welcomeBonus?.purchaseBonus;

  return (
    <div className="screen">

      {/* Welcome Bonus progress card */}
      {showWelcomeBonus && (
        <div className="card" style={{
          background: '#FEFCE8',
          border: '1px solid #E5D5A0',
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
            Welcome bonus — up to ${welcomeBonus.total.toFixed(0)}
          </div>

          {/* Purchase bonus row */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Make 2 qualifying purchases</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>${pb.target.toFixed(2)}</span>
            </div>
            {/* Progress bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4,
            }}>
              <div style={{
                flex: 1, height: 6, background: '#E8E0C8', borderRadius: 3, overflow: 'hidden',
              }}>
                <div style={{
                  width: `${(pb.qualifyingPurchases / pb.requiredPurchases) * 100}%`,
                  height: '100%', background: '#B8860B', borderRadius: 3,
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {pb.qualifyingPurchases} / {pb.requiredPurchases} purchases
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              1 at Walmart + 1 anywhere · {pb.daysRemaining} days remaining
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #E5D5A0', marginBottom: 14 }} />

          {/* Paperless row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>Sign up for paperless statements</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>$10.00</span>
              {welcomeBonus.paperlessEarned ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 600, color: 'var(--success, #3B6D11)' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" fill="var(--success, #3B6D11)" />
                    <path d="M4.5 7L6.5 9L9.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Done
                </span>
              ) : (
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Pending</span>
              )}
            </div>
          </div>

          {/* Footer note */}
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 14, lineHeight: 1.4 }}>
            Reward Dollars post within 5 business days of qualifying
          </div>
        </div>
      )}

      {/* Balance card */}
      <div className="card" style={{ textAlign: 'center', paddingTop: 24, paddingBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>
          Walmart Reward Dollars
        </div>
        <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>
          ${rewardsAvailable.toFixed(2)}
        </div>
        <div style={{ marginTop: 6, fontSize: 13, color: 'var(--text-muted)' }}>
          Ready to use at Walmart
        </div>

        {/* Pending — explicit, not hidden */}
        {pendingRewards > 0 && (
          <div style={{
            marginTop: 16, paddingTop: 16,
            borderTop: '1px solid var(--border)',
            fontSize: 13,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Pending</span>
              <span>+${pendingRewards.toFixed(2)}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Earned on recent purchases — posts within 1–2 business days
            </div>
          </div>
        )}
      </div>

      {/* Earned this year */}
      <div className="card">
        <div className="card-title">Earned this year</div>
        {earningHistory.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '10px 0', lineHeight: 1.5 }}>
            No rewards earned yet — your first purchase will show up here.
          </div>
        ) : (
          <>
            {earningHistory.map((entry, i) => (
              <div
                key={entry.month}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: i < earningHistory.length - 1 ? '1px solid var(--accent-light)' : 'none',
                }}
              >
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{entry.month}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--success)' }}>+${entry.amount.toFixed(2)}</span>
              </div>
            ))}
            {/* Progress note toward next $5 */}
            {remainder > 0 && redeemable < rewardsAvailable && (
              <div style={{
                marginTop: 10, padding: '8px 10px',
                background: 'var(--accent-light)',
                borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--text-muted)',
              }}>
                ${untilNext5.toFixed(2)} more to unlock your next reward dollar
              </div>
            )}
          </>
        )}
      </div>

      {/* Earning rate reminder */}
      <div
        className="card"
        style={{
          background: '#F5F5F5',
          border: 'none',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
          You earn 1.25% back on every Walmart purchase — automatically.
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Use your card in-store or on Walmart.ca
        </div>
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
            Skip it at checkout anytime — your balance never expires and there's no pressure to use it.
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

      {/* Empty state */}
      {redemptions.length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: 20 }}>
          No redemptions yet — your balance is building.
        </div>
      )}
    </div>
  );
}
