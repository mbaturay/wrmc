import { useState, useEffect, useRef } from 'react';

export function Header({ title, onBack, tab, onAvatarTap, hideActions, onLogoLongPress }) {
  const isHome = !onBack && tab === 'home';
  const isActivity = !onBack && tab === 'activity';
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef(null);
  const longPressTimer = useRef(null);

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
            <img
              src="/logo.svg"
              alt="Walmart Rewards Mastercard"
              className="header-logo"
              onTouchStart={() => {
                if (!onLogoLongPress) return;
                longPressTimer.current = setTimeout(() => { onLogoLongPress(); }, 600);
              }}
              onTouchEnd={() => { clearTimeout(longPressTimer.current); }}
              onTouchMove={() => { clearTimeout(longPressTimer.current); }}
            />
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
          {!hideActions && isHome && (
            <button className="header-btn" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 2C7.24 2 5 4.24 5 7V11L3 14H17L15 11V7C15 4.24 12.76 2 10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M8 14V15C8 16.1 8.9 17 10 17C11.1 17 12 16.1 12 15V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          {!hideActions && isActivity && (
            <button className="header-btn" aria-label="Search transactions">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          {/* Avatar — visible on tab screens, hidden on sub-screens and onboarding */}
          {!hideActions && !onBack && (
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
  const icons = {
    home: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    rewards: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    activity: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 6H20M4 12H20M4 18H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    settings: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'activity', label: 'Activity' },
    { id: 'settings', label: 'Settings' },
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
          <span className="nav-icon">{icons[t.id]}</span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
