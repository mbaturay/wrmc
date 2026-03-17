import { useState } from 'react';
import { WRMCCard } from '../components/WRMCCard';

export function Account({ navigate, frozen, profile }) {
  return (
    <div className="screen">

      {/* Card visual */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <WRMCCard masked={true} active={!frozen} frozen={frozen} name="S. MARTIN" />
      </div>

      {/* Balance */}
      <div className="card">
        <div className="flex justify-between">
          <div>
            <div className="card-title">Current Balance</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>${profile.accountBalance.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="card-title">Available Credit</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>${profile.availableCredit.toFixed(2)}</div>
          </div>
        </div>
        <div className="progress-bar mt-12">
          <div className="progress-fill" style={{ width: `${(profile.accountBalance / profile.creditLimit) * 100}%` }} />
        </div>
        <div className="text-sm text-muted mt-8">${profile.creditLimit.toFixed(2)} credit limit</div>
      </div>

      {/* Menu */}
      <div className="card">
        {[
          { icon: '○', label: 'Profile', sub: null, action: () => navigate('main', 'profile') },
          { icon: '◈', label: 'Make a Payment', sub: profile.paymentDue ? `Due ${profile.paymentDue}` : 'No payment due', action: () => navigate('main', 'payment') },
          { icon: '◇', label: 'Card Controls', sub: frozen ? 'Card frozen' : 'Card active', action: () => navigate('main', 'freeze') },
          { icon: '▤', label: 'Statements', sub: null, action: () => navigate('main', 'statements') },
        ].map((item, i, arr) => (
          <div
            key={i}
            className="menu-item"
            onClick={item.action}
            tabIndex={0}
            role="button"
            onKeyDown={e => e.key === 'Enter' && item.action()}
            style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">
              {item.label}
              {item.sub && <div style={{ fontSize: 11, color: frozen && item.icon === '◇' ? 'var(--warning)' : 'var(--text-muted)', marginTop: 1 }}>{item.sub}</div>}
            </span>
            <span className="menu-arrow">→</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export function FreezeCard({ frozen, setFrozen, onBack }) {
  const [successMsg, setSuccessMsg] = useState(null);

  function handleToggle() {
    if (frozen) {
      const ok = confirm('Unfreeze your card? You will be able to make purchases again.');
      if (!ok) return;
      setFrozen(false);
      setSuccessMsg('Your card is now active.');
    } else {
      const ok = confirm("Freeze your card? You won't be able to make purchases until you unfreeze it.");
      if (!ok) return;
      setFrozen(true);
      setSuccessMsg('Your card has been frozen.');
    }
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  return (
    <div className="screen">
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{frozen ? '❄' : '▶'}</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          Card is {frozen ? 'Frozen' : 'Active'}
        </div>
        <div className="text-muted mb-16">
          {frozen
            ? 'Your card is temporarily frozen. No new purchases can be made.'
            : 'Your card is active and ready to use.'
          }
        </div>
        {successMsg && (
          <div style={{
            padding: '10px 14px', background: 'var(--success-bg)',
            border: '1px solid var(--success)', borderRadius: 'var(--radius)',
            fontSize: 13, color: 'var(--success)', marginBottom: 16, lineHeight: 1.5,
          }}>
            {successMsg}
          </div>
        )}
        <button
          className={`btn ${frozen ? 'btn-success' : 'btn-primary'}`}
          onClick={handleToggle}
        >
          {frozen ? 'Unfreeze my card' : 'Freeze my card'}
        </button>
      </div>
    </div>
  );
}

export function MakePayment({ onBack, paymentMade, setPaymentMade, profile }) {
  const [payAmount, setPayAmount] = useState(profile.statementBalance.toString());
  const [selected, setSelected] = useState('statement');
  const [submitted, setSubmitted] = useState(false);

  const daysUntilDue = profile.paymentDue ? Math.max(0, Math.round((new Date(profile.paymentDue) - new Date()) / 86400000)) : 999;
  const utilizationPct = ((profile.accountBalance / profile.creditLimit) * 100).toFixed(0);
  const amount = +payAmount || 0;
  const remainingAfter = Math.max(0, profile.accountBalance - amount);

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
      <div className="screen" style={{ textAlign: 'center', paddingTop: 48 }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>✓</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Payment Submitted</div>
        <div className="text-muted mt-8">${amount.toFixed(2)} will be applied to your balance</div>
        <div className="text-sm text-muted mt-8">Usually processes within 1-2 business days</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          Your Reward Dollars balance is unaffected.
        </div>

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
    <div className="screen">
      {/* Clarification */}
      <div style={{
        padding: '8px 12px', background: '#f0f0f0', borderRadius: 'var(--radius)',
        fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.4,
      }}>
        This pays your credit card balance — separate from your Reward Dollars.
      </div>

      {/* Due date urgency banner */}
      {daysUntilDue <= 14 && (
        <div style={{
          padding: '10px 14px', borderRadius: 'var(--radius)',
          background: daysUntilDue <= 5 ? '#fff0f0' : 'var(--warning-bg)',
          border: `1px solid ${daysUntilDue <= 5 ? '#e8c0c0' : '#e6d5a0'}`,
          fontSize: 13, lineHeight: 1.4, marginBottom: 16,
          color: daysUntilDue <= 5 ? '#8b3a3a' : 'var(--warning)',
        }}>
          Payment due in <strong>{daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}</strong> ({profile.paymentDue}).
          {selected === 'min' && ' Paying only the minimum will result in interest charges.'}
        </div>
      )}

      {/* Balance summary */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div>
            <div className="card-title" style={{ marginBottom: 2 }}>Current Balance</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>${profile.accountBalance.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="text-sm text-muted">{utilizationPct}% of limit</div>
            <div className="text-sm text-muted">${profile.creditLimit.toFixed(0)} limit</div>
          </div>
        </div>
        <div className="progress-bar" style={{ height: 6 }}>
          <div className="progress-fill" style={{ width: `${utilizationPct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
          <span>Statement: ${profile.statementBalance.toFixed(2)}</span>
          <span>Min due: ${profile.minimumDue.toFixed(2)}</span>
        </div>
      </div>

      {/* Amount selection */}
      <div className="card">
        <div className="card-title">Choose Amount</div>

        {/* Preset options — stacked for clarity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {[
            { key: 'min', label: 'Minimum due', value: profile.minimumDue, note: 'Interest will apply' },
            { key: 'statement', label: 'Statement balance', value: profile.statementBalance, note: 'Recommended — avoids interest' },
            { key: 'full', label: 'Full balance', value: profile.accountBalance, note: 'Includes recent charges' },
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
    { period: 'March 2026' },
    { period: 'February 2026' },
    { period: 'January 2026' },
  ];
  const [loading, setLoading] = useState(null);

  function handleTap(period) {
    setLoading(period);
    setTimeout(() => setLoading(null), 2000);
  }

  return (
    <div className="screen">
      <div className="card">
        {statements.map((s, i) => (
          <div
            key={i}
            className="menu-item"
            onClick={() => handleTap(s.period)}
            style={{ borderBottom: i < statements.length - 1 ? '1px solid var(--border)' : 'none' }}
          >
            <span className="menu-label" style={{ fontSize: 15 }}>{s.period}</span>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="PDF">
                <rect x="3" y="1" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.3" fill="none"/>
                <path d="M7 7H11M7 10H11M7 13H9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                <path d="M10 1V5H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </span>
          </div>
        ))}
      </div>
      {loading && (
        <div style={{
          textAlign: 'center', padding: 20,
          fontSize: 13, color: 'var(--text-muted)',
        }}>
          Loading statement...
        </div>
      )}
    </div>
  );
}

function SettingsToggle({ label, sub, checked, onChange, last }) {
  return (
    <div className="toggle-row" style={{ borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      <div>
        <span className="toggle-label">{label}</span>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{sub}</div>}
      </div>
      <button
        className={`toggle ${checked ? 'on' : ''}`}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
      />
    </div>
  );
}

export function Settings({ navigate, prefGV, setPrefGV, onResetOnboarding, onSimulateCardArrival, onSwitchLanguage, language, userJourney, onSwitchUserJourney }) {
  const [notifPush, setNotifPush] = useState(true);
  const [notifRewards, setNotifRewards] = useState(true);
  const [notifPayment, setNotifPayment] = useState(true);
  const [prefBiometric, setPrefBiometric] = useState(false);

  return (
    <div className="screen">

      {/* Notifications */}
      <div className="settings-section-label">Notifications</div>
      <div className="card" style={{ marginBottom: 8 }}>
        <SettingsToggle label="Push notifications" checked={notifPush} onChange={() => setNotifPush(v => !v)} />
        <SettingsToggle label="Reward alerts" sub="When you earn Reward Dollars" checked={notifRewards} onChange={() => setNotifRewards(v => !v)} />
        <SettingsToggle label="Payment reminders" sub="Before your due date" checked={notifPayment} onChange={() => setNotifPayment(v => !v)} last />
      </div>

      {/* Preferences */}
      <div className="settings-section-label">Preferences</div>
      <div className="card" style={{ marginBottom: 8 }}>
        <SettingsToggle label="Great Value suggestions" sub="Savings tips on your Walmart transactions" checked={prefGV} onChange={() => setPrefGV(v => !v)} />
        <SettingsToggle label="Biometric login" sub="Face ID or fingerprint" checked={prefBiometric} onChange={() => setPrefBiometric(v => !v)} last />
        <div className="menu-item" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="menu-icon">↔</span>
          <span className="menu-label">
            Language
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>English</div>
          </span>
          <span className="menu-arrow">→</span>
        </div>
      </div>

      {/* Learn */}
      <div className="settings-section-label">Learn</div>
      <div className="card" style={{ marginBottom: 8 }}>
        <div className="menu-item" onClick={() => navigate('main', 'howRewards')}>
          <span className="menu-icon">?</span>
          <span className="menu-label">How Rewards Work</span>
          <span className="menu-arrow">→</span>
        </div>
      </div>

      {/* Support */}
      <div className="settings-section-label">Support</div>
      <div className="card" style={{ marginBottom: 8 }}>
        <div className="menu-item">
          <span className="menu-icon">☎</span>
          <span className="menu-label">
            Help & Support
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>1-888-331-6133</div>
          </span>
          <span className="menu-arrow">→</span>
        </div>
        <div className="menu-item" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="menu-icon">▤</span>
          <span className="menu-label">Legal & Privacy</span>
          <span className="menu-arrow">→</span>
        </div>
      </div>

      {/* App */}
      <div className="settings-section-label">App</div>
      <div className="card">
        <div className="menu-item" onClick={() => navigate('main', 'about')}>
          <span className="menu-icon">ℹ</span>
          <span className="menu-label">
            About
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Version 1.0.0</div>
          </span>
          <span className="menu-arrow">→</span>
        </div>
        <div className="menu-item" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="menu-icon">↑</span>
          <span className="menu-label">Check for updates</span>
          <span style={{ fontSize: 12, color: 'var(--success)' }}>Up to date</span>
        </div>
      </div>

      {/* Prototype controls */}
      <div className="settings-section-label" style={{ color: 'var(--warning)' }}>⚠ Prototype Controls</div>
      <div className="card" style={{ border: '2px dashed var(--warning)', background: 'var(--warning-bg)' }}>
        <div style={{ fontSize: 11, color: 'var(--warning)', marginBottom: 8 }}>
          For workshop testing only — not visible in production
        </div>
        {[
          { label: 'Reset onboarding', sub: 'Return to welcome screen', action: onResetOnboarding },
          { label: 'Simulate card arrival', sub: 'Trigger activation flow', action: onSimulateCardArrival },
          { label: `Switch language (${language === 'en' ? 'EN → FR' : 'FR → EN'})`, sub: 'Toggle English / French', action: onSwitchLanguage },
          { label: `Switch to: ${userJourney === 'new_user' ? 'Existing user' : 'New user'}`, sub: `Currently: ${userJourney === 'new_user' ? 'New user' : 'Existing user'}`, action: () => onSwitchUserJourney(userJourney === 'new_user' ? 'existing_user' : 'new_user') },
        ].map((item, i, arr) => (
          <div
            key={i}
            className="menu-item"
            onClick={item.action}
            tabIndex={0}
            role="button"
            style={{ borderBottom: i < arr.length - 1 ? '1px solid #e6d5a0' : 'none' }}
          >
            <span className="menu-label">
              {item.label}
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{item.sub}</div>
            </span>
            <span className="menu-arrow">→</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export function Profile() {
  const [editing, setEditing] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [newValue, setNewValue] = useState('');

  const fields = [
    { key: 'card',    label: 'Card',    value: '•••• 4829',              editable: false },
    { key: 'email',   label: 'Email',   value: 'sarah@example.com',       editable: true },
    { key: 'phone',   label: 'Phone',   value: '+1 (416) •••-••89',       editable: true },
    { key: 'address', label: 'Address', value: '123 Main St, Toronto ON', editable: true },
  ];

  if (editing) {
    const field = fields.find(f => f.key === editing);
    return (
      <div className="screen">
        <div className="card">
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
            Update {field.label}
          </div>
          <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>
            Current: {field.value}
          </div>
          <input
            className="input"
            style={{ width: '100%', marginBottom: 12 }}
            placeholder={`New ${field.label.toLowerCase()}`}
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            autoFocus
          />
          <div style={{
            padding: '10px 12px', background: 'var(--warning-bg)',
            borderRadius: 'var(--radius)', fontSize: 12,
            color: 'var(--warning)', marginBottom: 16, lineHeight: 1.5,
          }}>
            Changes take 1–2 business days and may require identity verification.
          </div>
          <button
            className="btn btn-primary"
            disabled={!newValue.trim()}
            style={{ opacity: newValue.trim() ? 1 : 0.5 }}
            onClick={() => {
              setSubmitted(field.label);
              setEditing(null);
              setNewValue('');
            }}
          >
            Submit request
          </button>
          <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => { setEditing(null); setNewValue(''); }}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">

      {submitted && (
        <div style={{
          padding: '10px 14px', background: 'var(--success-bg)',
          border: '1px solid var(--success)', borderRadius: 'var(--radius)',
          fontSize: 13, color: 'var(--success)', marginBottom: 12, lineHeight: 1.5,
        }}>
          Your {submitted.toLowerCase()} update request has been submitted. Changes typically take 1–2 business days.
        </div>
      )}

      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--accent-light)', margin: '0 auto 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
        }}>S</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Sarah</div>
        <div className="text-sm text-muted">Member since March 2024</div>
      </div>

      <div className="card">
        {fields.map((f, i) => (
          <div
            key={f.key}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0',
              borderBottom: i < fields.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{f.label}</div>
              <div style={{ fontSize: 14 }}>{f.value}</div>
            </div>
            {f.editable && (
              <button
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--accent)', fontSize: 13,
                  cursor: 'pointer', textDecoration: 'underline',
                }}
                onClick={() => setEditing(f.key)}
              >
                Update
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export function About() {
  return (
    <div className="screen">
      <div className="card" style={{ textAlign: 'center', paddingTop: 28, paddingBottom: 28 }}>
        <img src="/logo.svg" alt="Walmart Rewards Mastercard" style={{ width: 56, height: 56, marginBottom: 16 }} />
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Walmart Rewards Mastercard</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Version 1.0.0</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>March 2026</div>
      </div>
      <div className="card">
        {['Cardholder Agreement', 'Privacy Policy', 'Terms of Use'].map((label, i, arr) => (
          <div key={i} className="menu-item" style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span className="menu-label">{label}</span>
            <span className="menu-arrow">→</span>
          </div>
        ))}
      </div>
      <div style={{ padding: '16px 4px', fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7, textAlign: 'center' }}>
        <div>Issued by Fairstone Bank of Canada</div>
        <div>® / ™ Mastercard International Incorporated</div>
        <div style={{ marginTop: 4 }}>© 2026 Walmart Canada Corp. All rights reserved.</div>
      </div>
    </div>
  );
}
