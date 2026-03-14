import { useState, useEffect, useRef } from 'react';

export function Header({ title, onBack, tab }) {
  const isHome = !onBack && tab === 'home';
  const isActivity = !onBack && tab === 'activity';
  const isAccount = !onBack && tab === 'account';
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

        {/* Right zone — contextual actions */}
        <div className="header-right">
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
          {isAccount && (
            <button className="header-btn" aria-label="Settings">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 2V4M10 16V18M2 10H4M16 10H18M4.22 4.22L5.64 5.64M14.36 14.36L15.78 15.78M15.78 4.22L14.36 5.64M5.64 14.36L4.22 15.78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
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
