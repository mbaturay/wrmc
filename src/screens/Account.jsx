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
  const [payAmount, setPayAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handlePay() {
    if (+payAmount > 0) {
      setSubmitted(true);
      setPaymentMade(true);
    }
  }

  if (submitted) {
    return (
      <div className="screen no-nav" style={{ textAlign: 'center', paddingTop: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>Payment Submitted</div>
        <div className="text-muted mt-8">${(+payAmount).toFixed(2)} will be applied to your balance</div>
        <div className="text-sm text-muted mt-8">Usually processes within 1-2 business days</div>
        <button className="btn btn-secondary mt-24" onClick={onBack}>Done</button>
      </div>
    );
  }

  return (
    <div className="screen no-nav">
      <div className="card">
        <div className="receipt-line"><span>Statement balance</span><span>${PAYMENT.statementBalance.toFixed(2)}</span></div>
        <div className="receipt-line"><span>Minimum due</span><span>${PAYMENT.minimumDue.toFixed(2)}</span></div>
        <div className="receipt-line"><span>Due date</span><span>{PAYMENT.dueDate}</span></div>
      </div>
      <div className="card">
        <div className="card-title">Payment Amount</div>
        <div className="flex gap-8 mb-16">
          <button className={`btn btn-sm ${+payAmount === PAYMENT.minimumDue ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPayAmount(PAYMENT.minimumDue.toString())}>
            Min ${PAYMENT.minimumDue}
          </button>
          <button className={`btn btn-sm ${+payAmount === PAYMENT.statementBalance ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPayAmount(PAYMENT.statementBalance.toString())}>
            Statement
          </button>
          <button className={`btn btn-sm ${+payAmount === PAYMENT.currentBalance ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPayAmount(PAYMENT.currentBalance.toString())}>
            Full
          </button>
        </div>
        <div className="input-group">
          <label htmlFor="pay-amount">Custom amount</label>
          <input
            id="pay-amount"
            type="number"
            className="input"
            placeholder="0.00"
            value={payAmount}
            onChange={e => setPayAmount(e.target.value)}
            min={0}
          />
        </div>
        <button className="btn btn-primary" onClick={handlePay} disabled={!payAmount || +payAmount <= 0}>
          Pay ${payAmount ? (+payAmount).toFixed(2) : '0.00'}
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
