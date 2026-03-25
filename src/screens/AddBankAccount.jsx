import { useState, useEffect } from 'react';

const BANKS = [
  { id: 'td', name: 'TD Canada Trust', inst: '004' },
  { id: 'rbc', name: 'RBC Royal Bank', inst: '003' },
  { id: 'scotiabank', name: 'Scotiabank', inst: '002' },
  { id: 'bmo', name: 'BMO', inst: '001' },
  { id: 'cibc', name: 'CIBC', inst: '010' },
  { id: 'desjardins', name: 'Desjardins', inst: '815' },
  { id: 'national', name: 'National Bank', inst: '006' },
  { id: 'tangerine', name: 'Tangerine', inst: '614' },
];

const BankIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21H21" />
    <path d="M5 21V11" />
    <path d="M19 21V11" />
    <path d="M9 21V14H15V21" />
    <path d="M3 11L12 4L21 11" />
  </svg>
);

export function AddBankAccount({ onBack, onComplete }) {
  const [step, setStep] = useState('select'); // 'select' | 'details' | 'processing' | 'confirm'
  const [selectedBank, setSelectedBank] = useState(null);
  const [transit, setTransit] = useState('');
  const [acctNumber, setAcctNumber] = useState('');

  const bank = BANKS.find(b => b.id === selectedBank);
  const last4 = acctNumber.slice(-4);
  const canContinue = transit.length >= 5 && acctNumber.length >= 7;

  // Auto-advance from processing
  useEffect(() => {
    if (step !== 'processing') return;
    const timer = setTimeout(() => setStep('confirm'), 2000);
    return () => clearTimeout(timer);
  }, [step]);

  // ── Processing ──
  if (step === 'processing') {
    return (
      <div className="screen" style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', minHeight: '60vh',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          border: '3px solid #E8E8E8', borderTopColor: 'var(--accent)',
          animation: 'spin 0.8s linear infinite',
          marginBottom: 24,
        }} />
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Verifying your account</div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          This usually takes a moment
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Confirm ──
  if (step === 'confirm') {
    return (
      <div className="screen">
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          paddingTop: 32, paddingBottom: 24,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--success-bg)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M9 16L14 21L23 11" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Account linked</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Your bank account has been connected for payments.
          </div>
        </div>

        <div style={{
          padding: 16, background: '#FAFAFA', borderRadius: 12,
          border: '1px solid var(--border)', marginBottom: 24,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
            Linked account
          </div>
          {[
            { label: 'Bank', value: bank?.name },
            { label: 'Account', value: `Chequing ••${last4}` },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', padding: '8px 0',
              borderBottom: i === 0 ? '1px solid var(--border)' : 'none',
              fontSize: 14,
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
              <span style={{ fontWeight: 500 }}>{row.value}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" onClick={() => {
          onComplete({ bankName: bank?.name, last4 });
        }}>
          Continue to payment
        </button>
      </div>
    );
  }

  // ── Details ──
  if (step === 'details') {
    return (
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', paddingTop: 8, paddingBottom: 120 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, marginTop: 16 }}>Account details</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
            Enter your chequing account details for {bank?.name}. You can find these on a void cheque or in your banking app.
          </p>

          {/* Bank (read-only) */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Bank
            </label>
            <div style={{
              height: 48, padding: '0 16px', border: '1px solid #E5E5E5', borderRadius: 8,
              background: '#F9F9F9', fontSize: 15, color: '#333',
              display: 'flex', alignItems: 'center',
            }}>
              {bank?.name}
            </div>
          </div>

          {/* Institution number (auto-filled) */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Institution number
            </label>
            <div style={{
              height: 48, padding: '0 16px', border: '1px solid #E5E5E5', borderRadius: 8,
              background: '#F9F9F9', fontSize: 15, color: '#333',
              display: 'flex', alignItems: 'center',
            }}>
              {bank?.inst}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Auto-filled from your bank selection
            </div>
          </div>

          {/* Transit number */}
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="transit" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Transit number
            </label>
            <input
              id="transit"
              type="text"
              inputMode="numeric"
              className="input"
              placeholder="5 digits"
              value={transit}
              onChange={(e) => setTransit(e.target.value.replace(/\D/g, '').slice(0, 5))}
            />
          </div>

          {/* Account number */}
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="acct-num" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              Account number
            </label>
            <input
              id="acct-num"
              type="text"
              inputMode="numeric"
              className="input"
              placeholder="7–12 digits"
              value={acctNumber}
              onChange={(e) => setAcctNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
            />
          </div>

          {/* Help note */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 8,
            padding: '12px 14px', background: '#F5F5F5', borderRadius: 8,
            marginTop: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="8" cy="8" r="7" stroke="#999" strokeWidth="1.5" fill="none" />
              <path d="M8 7V11" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="5" r="0.75" fill="#999" />
            </svg>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Look for your transit and account numbers on a void cheque, or check the account details section of your banking app.
            </div>
          </div>
        </div>

        <div style={{
          padding: '12px 20px',
          paddingBottom: 'calc(var(--nav-height) + 12px)',
          background: 'var(--surface)',
          borderTop: '0.5px solid var(--border)',
        }}>
          <button
            className="btn btn-primary"
            onClick={() => setStep('processing')}
            disabled={!canContinue}
            style={!canContinue ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
          >
            Link account
          </button>
        </div>
      </div>
    );
  }

  // ── Select bank ──
  return (
    <div className="screen">
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Connect a bank account</h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
        Select your bank to set up payments from your chequing account.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {BANKS.map((b) => (
          <button
            key={b.id}
            onClick={() => { setSelectedBank(b.id); setStep('details'); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8, cursor: 'pointer',
              transition: 'all 0.15s',
              width: '100%', textAlign: 'left',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F5F5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface)'; }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: '#F5F5F5', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, color: '#555',
            }}>
              <BankIcon />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>{b.name}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L13 10L7 16" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
