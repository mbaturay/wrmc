const iconStyle = { flexShrink: 0, color: '#555' };
const sectionLabel = 'settings-section-label';

// ─── Row helper ────────────────────────────────────────
function HelpRow({ icon, label, sub, right, chevron, onClick, disabled, accent, last }) {
  return (
    <div
      className="menu-item"
      onClick={disabled ? undefined : onClick}
      style={{
        cursor: disabled ? 'default' : onClick ? 'pointer' : 'default',
        opacity: disabled ? 0.6 : 1,
        borderBottom: last ? 'none' : '1px solid var(--border)',
        borderLeft: accent ? '3px solid #FFC220' : undefined,
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {icon && <span style={iconStyle}>{icon}</span>}
      <span className="menu-label" style={{ flex: 1 }}>
        <span style={{ fontSize: 15, fontWeight: accent ? 600 : 500 }}>{label}</span>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </span>
      {right && typeof right === 'string' ? (
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', flexShrink: 0 }}>{right}</span>
      ) : right}
      {chevron && <span className="menu-arrow">›</span>}
    </div>
  );
}

// ─── SVG icons ─────────────────────────────────────────
const PhoneIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.61.68 2.37a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.76.32 1.56.55 2.37.68A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const ChatIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const ListIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01"/>
  </svg>
);
const DocIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const StarIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>
);
const PercentIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="19" y1="5" x2="5" y2="19"/>
    <circle cx="6.5" cy="6.5" r="2.5"/>
    <circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);
const InfoIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16V12M12 8H12.01"/>
  </svg>
);

const comingSoonBadge = (
  <span style={{
    fontSize: 10, fontWeight: 500,
    background: '#F3E8FF', color: '#6B21A8',
    borderRadius: 20, padding: '2px 8px', whiteSpace: 'nowrap',
  }}>Coming soon</span>
);

// ─── Sub-screens ───────────────────────────────────────
function FAQScreen() {
  const questions = [
    'How do I redeem Reward Dollars?',
    'When do rewards post to my account?',
    'How do I report a lost or stolen card?',
    'How do I dispute a transaction?',
  ];
  return (
    <div className="screen">
      <div className="card">
        {questions.map((q, i) => (
          <div key={i} className="menu-item" style={{
            borderBottom: i < questions.length - 1 ? '1px solid var(--border)' : 'none',
            cursor: 'pointer',
          }}>
            <span className="menu-label">{q}</span>
            <span className="menu-arrow">›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegalScreen() {
  return (
    <div className="screen" style={{ textAlign: 'center', paddingTop: 48 }}>
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Legal Documents</div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Legal documents coming soon.</div>
    </div>
  );
}

function EarnRatesScreen() {
  const items = [
    { rate: '3%', desc: 'back at Walmart stores and Walmart.ca (including Marketplace)' },
    { rate: '1%', desc: 'back everywhere else Mastercard is accepted' },
  ];
  return (
    <div className="screen">
      <div className="card">
        {items.map((item, i) => (
          <div key={i} style={{
            padding: '14px 16px',
            borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <span style={{
              fontSize: 20, fontWeight: 700, color: '#1A7F3C',
              minWidth: 40, flexShrink: 0,
            }}>{item.rate}</span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</span>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <div style={{ marginBottom: 8 }}>Rewards post the next business day after purchase.</div>
          <div>Reward Dollars never expire.</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Help screen ──────────────────────────────────
export function Help({ navigate, helpScreen, setHelpScreen }) {
  // Sub-screen rendering
  if (helpScreen === 'faq') return <FAQScreen />;
  if (helpScreen === 'legal') return <LegalScreen />;
  if (helpScreen === 'earnRates') return <EarnRatesScreen />;

  return (
    <div className="screen">

      {/* ── SUPPORT ── */}
      <div className={sectionLabel}>Support</div>
      <div className="card" style={{ marginBottom: 8 }}>
        <a
          href="tel:1-888-331-6133"
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
          <HelpRow
            icon={PhoneIcon}
            label="Call us"
            sub="Mon–Fri, 8am–8pm ET"
            right="1-888-331-6133"
          />
        </a>
        <HelpRow
          icon={ChatIcon}
          label="Chat with us"
          sub="Real-time support"
          right={comingSoonBadge}
          disabled
        />
        <HelpRow
          icon={ListIcon}
          label="FAQ"
          sub="Common questions answered"
          chevron
          onClick={() => setHelpScreen('faq')}
        />
        <HelpRow
          icon={DocIcon}
          label="Legal documents"
          sub="Cardholder agreement, privacy policy"
          chevron
          onClick={() => setHelpScreen('legal')}
          last
        />
      </div>

      {/* ── LEARN ── */}
      <div className={sectionLabel}>Learn</div>
      <div className="card" style={{ marginBottom: 8 }}>
        <HelpRow
          icon={StarIcon}
          label="How Rewards Work"
          sub="Earn rates, redemption, and program details"
          chevron
          onClick={() => navigate('main', 'howRewards')}
        />
        <HelpRow
          icon={PercentIcon}
          label="Earn rates"
          sub="3% at Walmart · 1% everywhere else"
          chevron
          onClick={() => setHelpScreen('earnRates')}
          last
        />
      </div>

      {/* ── APP ── */}
      <div className={sectionLabel}>App</div>
      <div className="card" style={{ marginBottom: 8 }}>
        <HelpRow
          icon={InfoIcon}
          label="About"
          sub="Version 1.0.0"
          last
        />
      </div>
    </div>
  );
}

// Export sub-screen info for header titles
export function getHelpSubScreenTitle(helpScreen) {
  const titles = { faq: 'FAQ', legal: 'Legal', earnRates: 'Earn Rates' };
  return titles[helpScreen] || 'Help';
}
