import { useState } from 'react';
import { USER, PAYMENT } from '../data/mock';

export function Account({ navigate, frozen, setFrozen }) {
  const menuItems = [
    { icon: '○', label: 'Profile', action: () => navigate('main', 'profile') },
    { icon: '◇', label: 'Card Controls', action: () => navigate('main', 'freeze') },
    { icon: '▤', label: 'Statements', action: () => navigate('main', 'statements') },
    { icon: '⚙', label: 'Settings', action: () => navigate('main', 'settings') },
    { icon: '?', label: 'How Rewards Work', action: () => navigate('main', 'howRewards') },
  ];

  return (
    <div className="screen">
      {/* Card visual */}
      <div className="card" style={{ background: '#2a2a2a', color: 'white', padding: 20 }}>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Walmart Rewards Mastercard</div>
        <div style={{ fontSize: 18, letterSpacing: 2, marginBottom: 16 }}>•••• •••• •••• {USER.cardLast4}</div>
        <div className="flex justify-between" style={{ fontSize: 12, opacity: 0.7 }}>
          <span>{USER.name}</span>
          <span>Member since {USER.memberSince}</span>
        </div>
        {frozen && (
          <div style={{ marginTop: 12, padding: '4px 12px', background: 'rgba(255,255,255,0.15)', borderRadius: 4, fontSize: 12, display: 'inline-block' }}>
            Card Frozen
          </div>
        )}
      </div>

      {/* Balance */}
      <div className="card">
        <div className="flex justify-between">
          <div>
            <div className="card-title">Current Balance</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>${PAYMENT.currentBalance.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="card-title">Available Credit</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>${PAYMENT.availableCredit.toFixed(2)}</div>
          </div>
        </div>
        <div className="progress-bar mt-12">
          <div className="progress-fill" style={{ width: `${(PAYMENT.currentBalance / PAYMENT.creditLimit) * 100}%` }} />
        </div>
        <div className="text-sm text-muted mt-8">${PAYMENT.creditLimit.toFixed(2)} credit limit</div>
      </div>

      {/* Menu */}
      <div className="card">
        {menuItems.map((item, i) => (
          <div
            key={i}
            className="menu-item"
            onClick={item.action}
            tabIndex={0}
            role="button"
            onKeyDown={e => e.key === 'Enter' && item.action()}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
            <span className="menu-arrow">→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FreezeCard({ frozen, setFrozen, onBack }) {
  return (
    <div className="screen no-nav">
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{frozen ? '▶' : '❄'}</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          Card is {frozen ? 'Frozen' : 'Active'}
        </div>
        <div className="text-muted mb-16">
          {frozen
            ? 'Your card is temporarily frozen. No new purchases can be made.'
            : 'Your card is active and ready to use.'
          }
        </div>
        <button
          className={`btn ${frozen ? 'btn-success' : 'btn-primary'}`}
          onClick={() => setFrozen(!frozen)}
        >
          {frozen ? 'Unfreeze Card' : 'Freeze Card'}
        </button>
      </div>
    </div>
  );
}

export function MakePayment({ onBack, paymentMade, setPaymentMade }) {
  const [payAmount, setPayAmount] = useState(PAYMENT.statementBalance.toString());
  const [selected, setSelected] = useState('statement');
  const [submitted, setSubmitted] = useState(false);

  const daysUntilDue = Math.max(0, Math.round((new Date(PAYMENT.dueDate) - new Date()) / 86400000));
  const utilizationPct = ((PAYMENT.currentBalance / PAYMENT.creditLimit) * 100).toFixed(0);
  const amount = +payAmount || 0;
  const remainingAfter = Math.max(0, PAYMENT.currentBalance - amount);

  function selectPreset(key, value) {
    setSelected(key);
    setPayAmount(value.toString());
  }

  function handleCustomChange(e) {
    setSelected('custom');
    setPayAmount(e.target.value);
  }

  function handlePay() {
    if (amount > 0) {
      setSubmitted(true);
      setPaymentMade(true);
    }
  }

  if (submitted) {
    return (
      <div className="screen no-nav" style={{ textAlign: 'center', paddingTop: 48 }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>✓</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Payment Submitted</div>
        <div className="text-muted mt-8">${amount.toFixed(2)} will be applied to your balance</div>
        <div className="text-sm text-muted mt-8">Usually processes within 1-2 business days</div>

        <div className="card mt-24" style={{ textAlign: 'left' }}>
          <div className="receipt-line"><span>Amount paid</span><span><strong>${amount.toFixed(2)}</strong></span></div>
          <div className="receipt-line"><span>Remaining balance</span><span>${remainingAfter.toFixed(2)}</span></div>
          <div className="receipt-line"><span>Payment method</span><span>Bank account ••89</span></div>
        </div>

        <button className="btn btn-secondary mt-24" onClick={onBack}>Done</button>
      </div>
    );
  }

  return (
    <div className="screen no-nav">
      {/* Due date urgency banner */}
      {daysUntilDue <= 14 && (
        <div style={{
          padding: '10px 14px', borderRadius: 'var(--radius)',
          background: daysUntilDue <= 5 ? '#fff0f0' : 'var(--warning-bg)',
          border: `1px solid ${daysUntilDue <= 5 ? '#e8c0c0' : '#e6d5a0'}`,
          fontSize: 13, lineHeight: 1.4, marginBottom: 16,
          color: daysUntilDue <= 5 ? '#8b3a3a' : 'var(--warning)',
        }}>
          Payment due in <strong>{daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}</strong> ({PAYMENT.dueDate}).
          {selected === 'min' && ' Paying only the minimum will result in interest charges.'}
        </div>
      )}

      {/* Balance summary */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div>
            <div className="card-title" style={{ marginBottom: 2 }}>Current Balance</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>${PAYMENT.currentBalance.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="text-sm text-muted">{utilizationPct}% of limit</div>
            <div className="text-sm text-muted">${PAYMENT.creditLimit.toFixed(0)} limit</div>
          </div>
        </div>
        <div className="progress-bar" style={{ height: 6 }}>
          <div className="progress-fill" style={{ width: `${utilizationPct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
          <span>Statement: ${PAYMENT.statementBalance.toFixed(2)}</span>
          <span>Min due: ${PAYMENT.minimumDue.toFixed(2)}</span>
        </div>
      </div>

      {/* Amount selection */}
      <div className="card">
        <div className="card-title">Choose Amount</div>

        {/* Preset options — stacked for clarity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {[
            { key: 'min', label: 'Minimum due', value: PAYMENT.minimumDue, note: 'Interest will apply' },
            { key: 'statement', label: 'Statement balance', value: PAYMENT.statementBalance, note: 'Recommended — avoids interest' },
            { key: 'full', label: 'Full balance', value: PAYMENT.currentBalance, note: 'Includes recent charges' },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => selectPreset(opt.key, opt.value)}
              aria-pressed={selected === opt.key}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px',
                background: selected === opt.key ? 'var(--accent-light)' : 'var(--surface)',
                border: `2px solid ${selected === opt.key ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{opt.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{opt.note}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>${opt.value.toFixed(2)}</div>
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="input-group" style={{ marginBottom: 20 }}>
          <label htmlFor="pay-amount" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
            Or enter a custom amount
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              fontSize: 15, color: 'var(--text-muted)', pointerEvents: 'none',
            }}>$</span>
            <input
              id="pay-amount"
              type="number"
              className="input"
              placeholder="0.00"
              value={selected === 'custom' ? payAmount : ''}
              onChange={handleCustomChange}
              onFocus={() => { setSelected('custom'); setPayAmount(''); }}
              min={0}
              step={0.01}
              style={{ paddingLeft: 28 }}
              aria-label="Custom payment amount"
            />
          </div>
        </div>

        {/* Post-payment preview */}
        {amount > 0 && (
          <div style={{
            padding: '10px 12px', background: '#f7f7f7', borderRadius: 'var(--radius)',
            fontSize: 13, marginBottom: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Balance after payment</span>
              <strong>${remainingAfter.toFixed(2)}</strong>
            </div>
          </div>
        )}

        {/* Pay button */}
        <button
          className="btn btn-primary"
          onClick={handlePay}
          disabled={amount <= 0}
          style={{ opacity: amount <= 0 ? 0.5 : 1 }}
        >
          Pay ${amount.toFixed(2)}
        </button>
      </div>
    </div>
  );
}

export function Statements() {
  const statements = [
    { period: 'Feb 2026', amount: 412.33, paid: true },
    { period: 'Jan 2026', amount: 389.56, paid: true },
    { period: 'Dec 2025', amount: 567.12, paid: true },
  ];
  return (
    <div className="screen no-nav">
      <div className="card">
        {statements.map((s, i) => (
          <div key={i} className="menu-item">
            <span className="menu-icon">▤</span>
            <span className="menu-label">
              {s.period}
              <div className="text-sm text-muted">${s.amount.toFixed(2)} &middot; {s.paid ? 'Paid' : 'Due'}</div>
            </span>
            <span className="menu-arrow">→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Settings() {
  return (
    <div className="screen no-nav">
      <div className="card">
        <div className="toggle-row">
          <span className="toggle-label">Push notifications</span>
          <button className="toggle on" role="switch" aria-checked="true" aria-label="Push notifications" />
        </div>
        <div className="toggle-row">
          <span className="toggle-label">Reward alerts</span>
          <button className="toggle on" role="switch" aria-checked="true" aria-label="Reward alerts" />
        </div>
        <div className="toggle-row">
          <span className="toggle-label">Great Value suggestions</span>
          <button className="toggle on" role="switch" aria-checked="true" aria-label="Great Value suggestions" />
        </div>
        <div className="toggle-row">
          <span className="toggle-label">Biometric login</span>
          <button className="toggle" role="switch" aria-checked="false" aria-label="Biometric login" />
        </div>
      </div>
      <div className="card">
        <div className="menu-item"><span className="menu-icon">?</span><span className="menu-label">Help & Support</span><span className="menu-arrow">→</span></div>
        <div className="menu-item"><span className="menu-icon">▤</span><span className="menu-label">Legal & Privacy</span><span className="menu-arrow">→</span></div>
        <div className="menu-item"><span className="menu-icon">↔</span><span className="menu-label">Language: English</span><span className="menu-arrow">→</span></div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-muted)' }}>
        WRMC Prototype v1.0
      </div>
    </div>
  );
}

export function Profile() {
  return (
    <div className="screen no-nav">
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-light)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>S</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Sarah</div>
        <div className="text-sm text-muted">Member since March 2024</div>
      </div>
      <div className="card">
        <div className="receipt-line"><span className="text-muted">Card</span><span>•••• 4829</span></div>
        <div className="receipt-line"><span className="text-muted">Email</span><span>sarah@example.com</span></div>
        <div className="receipt-line"><span className="text-muted">Phone</span><span>+1 (416) •••-••89</span></div>
      </div>
    </div>
  );
}
