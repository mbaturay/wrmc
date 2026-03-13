export function Header({ title, onBack, action }) {
  const isHome = !onBack && title === 'Home';

  return (
    <header className="header" role="banner">
      {onBack ? (
        <button className="header-back" onClick={onBack} aria-label="Go back">&larr;</button>
      ) : <span className="header-spacer" />}
      {isHome ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <img src="/logo.svg" alt="Walmart Rewards Mastercard" style={{ height: 24 }} />
        </div>
      ) : (
        <h1>{title}</h1>
      )}
      {action || <span className="header-spacer" />}
    </header>
  );
}

export function BottomNav({ active, onNavigate }) {
  const tabs = [
    { id: 'home', icon: '⌂', label: 'Home' },
    { id: 'shop', icon: '◈', label: 'Shop' },
    { id: 'activity', icon: '☰', label: 'Activity' },
    { id: 'account', icon: '○', label: 'Account' },
  ];
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`nav-tab ${active === t.id ? 'active' : ''}`}
          onClick={() => onNavigate(t.id)}
          aria-label={t.label}
          aria-current={active === t.id ? 'page' : undefined}
        >
          <span className="nav-icon">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
