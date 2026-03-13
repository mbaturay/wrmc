import { useState } from 'react';

export function Redeem({ rewardsAvailable, autoApply, setAutoApply, onRedeem, redemptions }) {
  const [selected, setSelected] = useState('all');
  const [customVal, setCustomVal] = useState('');
  const [redeemed, setRedeemed] = useState(false);

  const amount = selected === 'custom'
    ? Math.min(+customVal || 0, rewardsAvailable)
    : selected === '10' ? Math.min(10, rewardsAvailable)
    : selected === '25' ? Math.min(25, rewardsAvailable)
    : rewardsAvailable;

  const remaining = Math.max(0, rewardsAvailable - amount);

  function handleRedeem() {
    if (amount > 0 && amount <= rewardsAvailable) {
      onRedeem(amount);
      setRedeemed(true);
    }
  }

  if (redeemed) {
    return (
      <div className="screen no-nav" style={{ textAlign: 'center', paddingTop: 48 }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>✓</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Rewards Applied!</div>
        <div className="text-muted mt-8">${amount.toFixed(2)} credited to your statement</div>

        <div className="card mt-24" style={{ textAlign: 'left' }}>
          <div className="receipt-line"><span>Amount redeemed</span><span><strong>${amount.toFixed(2)}</strong></span></div>
          <div className="receipt-line"><span>Remaining rewards</span><span>${remaining.toFixed(2)}</span></div>
          <div className="receipt-line"><span>Applied as</span><span>Statement Credit</span></div>
        </div>

        <button className="btn btn-secondary mt-24" onClick={() => setRedeemed(false)}>Done</button>
      </div>
    );
  }

  return (
    <div className="screen no-nav">
      {/* Available balance — prominent */}
      <div className="card" style={{ textAlign: 'center', paddingTop: 20, paddingBottom: 20 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Available to redeem</div>
        <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1 }}>
          ${rewardsAvailable.toFixed(2)}
        </div>
        {autoApply && (
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--success)' }}>
            Auto-apply is on — rewards apply each billing cycle
          </div>
        )}
      </div>

      {/* Redeem amount — stacked options like Payment screen */}
      <div className="card">
        <div className="card-title">Choose Amount</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {[
            { key: '10', label: '$10.00', note: 'Partial redemption', value: 10 },
            { key: '25', label: '$25.00', note: 'Partial redemption', value: 25 },
            { key: 'all', label: `$${rewardsAvailable.toFixed(2)}`, note: 'Redeem everything', value: rewardsAvailable },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => { setSelected(opt.key); setCustomVal(''); }}
              disabled={opt.value > rewardsAvailable}
              aria-pressed={selected === opt.key}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px',
                background: selected === opt.key ? 'var(--accent-light)' : 'var(--surface)',
                border: `2px solid ${selected === opt.key ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)', cursor: 'pointer',
                transition: 'all 0.15s',
                opacity: opt.value > rewardsAvailable ? 0.4 : 1,
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {opt.key === 'all' ? 'All rewards' : opt.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{opt.note}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{opt.label}</div>
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="input-group" style={{ marginBottom: 20 }}>
          <label
            htmlFor="redeem-amount"
            style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}
          >
            Or enter a custom amount
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              fontSize: 15, color: 'var(--text-muted)', pointerEvents: 'none',
            }}>$</span>
            <input
              id="redeem-amount"
              type="number"
              className="input"
              placeholder="0.00"
              value={selected === 'custom' ? customVal : ''}
              onChange={e => { setSelected('custom'); setCustomVal(e.target.value); }}
              onFocus={() => { setSelected('custom'); }}
              min={0}
              max={rewardsAvailable}
              step={0.01}
              style={{ paddingLeft: 28 }}
              aria-label="Custom redemption amount"
            />
          </div>
        </div>

        {/* Post-redeem preview */}
        {amount > 0 && (
          <div style={{
            padding: '10px 12px', background: '#f7f7f7', borderRadius: 'var(--radius)',
            fontSize: 13, marginBottom: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Remaining after redemption</span>
              <strong>${remaining.toFixed(2)}</strong>
            </div>
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={handleRedeem}
          disabled={amount <= 0}
          style={{ opacity: amount <= 0 ? 0.5 : 1 }}
        >
          Apply ${amount.toFixed(2)} to Statement
        </button>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 6 }}>
          Applies instantly as a statement credit
        </div>
      </div>

      {/* Auto-apply */}
      <div className="card">
        <div className="toggle-row" style={{ borderBottom: 'none' }}>
          <div>
            <span className="toggle-label">Auto-apply rewards</span>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Apply earned rewards each billing cycle
            </div>
          </div>
          <button
            className={`toggle ${autoApply ? 'on' : ''}`}
            onClick={() => setAutoApply(!autoApply)}
            role="switch"
            aria-checked={autoApply}
            aria-label="Auto-apply rewards toggle"
          />
        </div>
      </div>

      {/* History */}
      {redemptions.length > 0 && (
        <div className="card">
          <div className="card-title">Redemption History</div>
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
                <div style={{ fontSize: 15, fontWeight: 600 }}>${r.amount.toFixed(2)}</div>
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
