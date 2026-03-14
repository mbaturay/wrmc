import { useState, useEffect, useRef } from 'react';

export function Header({ title, onBack, tab, onAvatarTap }) {
  const isHome = !onBack && tab === 'home';
  const isActivity = !onBack && tab === 'activity';
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="header-sentinel" />
      <header className={`header ${scrolled ? 'header-scrolled' : ''}`} role="banner">

        {/* Left zone */}
        <div className="header-left">
          {onBack ? (
            <button className="header-btn" onClick={onBack} aria-label="Go back">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ) : (
            <img src="/logo.svg" alt="Walmart Rewards Mastercard" className="header-logo" />
          )}
        </div>

        {/* Center: title */}
        <div className="header-center">
          {onBack ? (
            <span className="header-title">{title}</span>
          ) : isHome ? null : (
            <span className="header-title-large">{title}</span>
          )}
        </div>

        {/* Right zone — contextual actions + avatar */}
        <div className="header-right" style={{ width: 'auto', gap: 2, display: 'flex' }}>
          {isHome && (
            <button className="header-btn" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 2C7.24 2 5 4.24 5 7V11L3 14H17L15 11V7C15 4.24 12.76 2 10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M8 14V15C8 16.1 8.9 17 10 17C11.1 17 12 16.1 12 15V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          {isActivity && (
            <button className="header-btn" aria-label="Search transactions">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          {/* Avatar — always visible on tab screens, hidden on sub-screens */}
          {!onBack && (
            <button
              className="header-btn"
              onClick={onAvatarTap}
              aria-label="Account"
              style={{ marginLeft: 4 }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--accent-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600, color: 'var(--text-primary)',
              }}>
                S
              </div>
            </button>
          )}
        </div>
      </header>
    </>
  );
}

export function BottomNav({ active, onNavigate }) {
  const tabs = [
    { id: 'home', icon: '⌂', label: 'Home' },
    { id: 'rewards', icon: '★', label: 'Rewards' },
    { id: 'activity', icon: '☰', label: 'Activity' },
    { id: 'settings', icon: '⚙', label: 'Settings' },
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
