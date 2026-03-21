import { useState, useEffect, useRef } from 'react';
import { House, Star, List, Question, Gear, Bell, MagnifyingGlass, CaretLeft, ICON_WEIGHT } from '../icons';

export function Header({ title, onBack, tab, onAvatarTap, hideActions, onLogoLongPress, onSparkTripleTap, onBellTap, notificationCount }) {
  const isHome = !onBack && tab === 'home';
  const isActivity = !onBack && tab === 'activity';
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef(null);
  const longPressTimer = useRef(null);
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

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
              <CaretLeft size={20} weight={ICON_WEIGHT} />
            </button>
          ) : (
            <img
              src="/logo.svg"
              alt="Walmart Rewards Mastercard"
              className="header-logo"
              onClick={() => {
                if (!onSparkTripleTap) return;
                tapCount.current += 1;
                clearTimeout(tapTimer.current);
                if (tapCount.current === 3) {
                  tapCount.current = 0;
                  onSparkTripleTap();
                  return;
                }
                tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 500);
              }}
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
            <button className="header-btn" aria-label="Notifications" onClick={onBellTap} style={{ position: 'relative' }}>
              <Bell size={24} weight={ICON_WEIGHT} />
              {notificationCount > 0 && (
                <span style={{
                  position: 'absolute', top: 2, right: 2,
                  width: 18, height: 18, borderRadius: '50%',
                  background: '#E24B4A', color: 'white',
                  fontSize: 6, fontWeight: 500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1,
                }}>
                  {notificationCount}
                </span>
              )}
            </button>
          )}
          {!hideActions && isActivity && (
            <button className="header-btn" aria-label="Search transactions">
              <MagnifyingGlass size={20} weight={ICON_WEIGHT} />
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
                width: 32, height: 32, borderRadius: '50%',
                background: '#333',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 600, color: '#fff',
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
  const iconMap = {
    home: House,
    rewards: Star,
    activity: List,
    help: Question,
    settings: Gear,
  };
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'activity', label: 'Activity' },
    { id: 'help', label: 'Help' },
    { id: 'settings', label: 'Settings' },
  ];
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {tabs.map(t => {
        const Icon = iconMap[t.id];
        return (
          <button
            key={t.id}
            className={`nav-tab ${active === t.id ? 'active' : ''}`}
            onClick={() => onNavigate(t.id)}
            aria-label={t.label}
            aria-current={active === t.id ? 'page' : undefined}
          >
            <span className="nav-icon"><Icon size={24} weight={active === t.id ? 'fill' : ICON_WEIGHT} /></span>
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
