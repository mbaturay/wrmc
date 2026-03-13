import { useState } from 'react';

export function Redeem({ rewardsAvailable, autoApply, setAutoApply, onRedeem, redemptions }) {
  const [amount, setAmount] = useState(rewardsAvailable);
  const [redeemed, setRedeemed] = useState(false);

  function handleRedeem() {
    if (amount > 0 && amount <= rewardsAvailable) {
      onRedeem(amount);
      setRedeemed(true);
    }
  }

  if (redeemed) {
    return (
      <div className="screen no-nav" style={{ textAlign: 'center', paddingTop: 60 }}>
        <div className="celebrate">
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Rewards Applied!</div>
          <div className="text-muted mt-8">${amount.toFixed(2)} credited to your statement</div>
        </div>
        <div className="card mt-24">
          <div className="receipt-line">
            <span>Amount redeemed</span>
            <span><strong>${amount.toFixed(2)}</strong></span>
          </div>
          <div className="receipt-line">
            <span>Remaining rewards</span>
            <span>${(rewardsAvailable - amount).toFixed(2)}</span>
          </div>
          <div className="receipt-line">
            <span>Applied as</span>
            <span>Statement Credit</span>
          </div>
        </div>
        <button className="btn btn-secondary mt-16" onClick={() => setRedeemed(false)}>Done</button>
      </div>
    );
  }

  return (
    <div className="screen no-nav">
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="card-title">Available to Redeem</div>
        <div style={{ fontSize: 36, fontWeight: 700, margin: '8px 0' }}>
          ${rewardsAvailable.toFixed(2)}
        </div>
      </div>

      {/* Quick redeem */}
      <div className="card">
        <div className="card-title">Redeem Amount</div>
        <div className="flex gap-8 mb-16">
          {[10, 25, rewardsAvailable].map(v => (
            <button
              key={v}
              className={`btn btn-sm ${amount === v ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setAmount(v)}
              disabled={v > rewardsAvailable}
            >
              {v === rewardsAvailable ? 'All' : `$${v}`}
            </button>
          ))}
        </div>
        <div className="input-group">
          <label htmlFor="redeem-amount">Custom amount</label>
          <input
            id="redeem-amount"
            type="number"
            className="input"
            value={amount}
            onChange={e => setAmount(Math.min(+e.target.value, rewardsAvailable))}
            min={0}
            max={rewardsAvailable}
            step={0.01}
          />
        </div>
        <button className="btn btn-success" onClick={handleRedeem}>
          Apply ${amount.toFixed(2)} as Statement Credit
        </button>
      </div>

      {/* Auto-apply */}
      <div className="card">
        <div className="toggle-row">
          <span className="toggle-label">Auto-apply rewards</span>
          <button
            className={`toggle ${autoApply ? 'on' : ''}`}
            onClick={() => setAutoApply(!autoApply)}
            role="switch"
            aria-checked={autoApply}
            aria-label="Auto-apply rewards toggle"
          />
        </div>
        <div className="text-sm text-muted mt-8">
          Automatically apply earned rewards as statement credits each billing cycle.
        </div>
      </div>

      {/* History */}
      <div className="card">
        <div className="card-title">Redemption History</div>
        {redemptions.map(r => (
          <div key={r.id} className="receipt-line" style={{ padding: '8px 0', borderBottom: '1px solid var(--accent-light)' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>${r.amount.toFixed(2)}</div>
              <div className="text-sm text-muted">{r.type}</div>
            </div>
            <span className="text-sm text-muted">{r.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
