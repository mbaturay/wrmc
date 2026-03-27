import { Phone, ChatCircle, ClipboardText, BookOpen, Star, SealPercent, Info, ICON_WEIGHT } from '../icons';

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

// ─── Phosphor icon instances ──────────────────────────
const PhoneIcon = <Phone size={20} weight={ICON_WEIGHT} />;
const ChatIcon = <ChatCircle size={20} weight={ICON_WEIGHT} />;
const ListIcon = <ClipboardText size={20} weight={ICON_WEIGHT} />;
const DocIcon = <BookOpen size={20} weight={ICON_WEIGHT} />;
const StarIcon = <Star size={20} weight={ICON_WEIGHT} />;
const PercentIcon = <SealPercent size={20} weight={ICON_WEIGHT} />;
const InfoIcon = <Info size={20} weight={ICON_WEIGHT} />;

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
