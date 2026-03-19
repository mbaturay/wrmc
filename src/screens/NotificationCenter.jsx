export function NotificationCenter({
  cardStatus,
  userJourney,
  paperlessEnrolled,
  biometricEnabled,
  notificationsConfigured,
  nudgePaperlessDismissed,
  setNudgePaperlessDismissed,
  nudgeFaceIdDismissed,
  setNudgeFaceIdDismissed,
  nudgeNotifDismissed,
  setNudgeNotifDismissed,
  navigate,
  setHighlightedSetting,
}) {
  const isNewUser = userJourney === 'new_user';
  const notifications = [];

  // 1. Physical card — only for new users with virtual_only status
  if (cardStatus === 'virtual_only' && isNewUser) {
    notifications.push({
      id: 'card',
      iconBg: '#FAEEDA',
      iconColor: '#B45309',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="4" width="16" height="12" rx="2" stroke="#B45309" strokeWidth="1.5" fill="none"/>
          <path d="M2 8H18" stroke="#B45309" strokeWidth="1.5"/>
          <path d="M6 12H10" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Your physical card is on its way',
      sub: "Expected in 5\u20137 business days. We'll notify you when it arrives and is ready to activate.",
      action: 'View activation steps \u2192',
      onAction: () => navigate('main', 'cardActivate'),
      dismissable: false,
    });
  }

  // 2. Paperless — new users only
  if (isNewUser && !paperlessEnrolled && !nudgePaperlessDismissed) {
    notifications.push({
      id: 'paperless',
      iconBg: '#E1F5EE',
      iconColor: '#1A7F3C',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2C6.5 2 4 5 4 8C4 11 5 13 7 15C8 16 8 17 10 17C12 17 12 16 13 15C15 13 16 11 16 8C16 5 13.5 2 10 2Z" stroke="#1A7F3C" strokeWidth="1.5" fill="none"/>
          <path d="M10 17V19" stroke="#1A7F3C" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7 19H13" stroke="#1A7F3C" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Go paperless',
      sub: 'Get your monthly statements by email \u2014 better for the environment and easier to find.',
      action: 'Set up in Settings \u2192',
      onAction: () => { setHighlightedSetting('paperless'); navigate('settings'); },
      dismissable: true,
      onDismiss: () => setNudgePaperlessDismissed(true),
    });
  }

  // 3. Face ID — new users only
  if (isNewUser && !biometricEnabled && !nudgeFaceIdDismissed) {
    notifications.push({
      id: 'faceid',
      iconBg: '#F3E8FF',
      iconColor: '#6B21A8',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="8" r="5" stroke="#6B21A8" strokeWidth="1.5" fill="none"/>
          <path d="M4 16C4 13.8 6.7 12 10 12C13.3 12 16 13.8 16 16" stroke="#6B21A8" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </svg>
      ),
      title: 'Enable Face ID',
      sub: "Open the app instantly \u2014 perfect for accessing your Temporary Shopping Pass at Walmart checkout.",
      action: 'Set up in Settings \u2192',
      onAction: () => { setHighlightedSetting('biometric'); navigate('settings'); },
      dismissable: true,
      onDismiss: () => setNudgeFaceIdDismissed(true),
    });
  }

  // 4. Notifications — new users only
  if (isNewUser && !notificationsConfigured && !nudgeNotifDismissed) {
    notifications.push({
      id: 'notif',
      iconBg: '#E6F1FB',
      iconColor: '#185FA5',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2C7.24 2 5 4.24 5 7V11L3 14H17L15 11V7C15 4.24 12.76 2 10 2Z" stroke="#185FA5" strokeWidth="1.5" fill="none"/>
          <path d="M8 14V15C8 16.1 8.9 17 10 17C11.1 17 12 16.1 12 15V14" stroke="#185FA5" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Set up transaction alerts',
      sub: "Know instantly when your card is used \u2014 transactions, payments, and rewards.",
      action: 'Set up in Settings \u2192',
      onAction: () => { setHighlightedSetting('notifications'); navigate('settings'); },
      dismissable: true,
      onDismiss: () => setNudgeNotifDismissed(true),
    });
  }

  // Empty state
  if (notifications.length === 0) {
    return (
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
        <svg width="48" height="48" viewBox="0 0 20 20" fill="none" style={{ marginBottom: 16 }}>
          <path d="M10 2C7.24 2 5 4.24 5 7V11L3 14H17L15 11V7C15 4.24 12.76 2 10 2Z" stroke="#CCC" strokeWidth="1.5" fill="none"/>
          <path d="M8 14V15C8 16.1 8.9 17 10 17C11.1 17 12 16.1 12 15V14" stroke="#CCC" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 4 }}>You're all caught up</div>
        <div style={{ fontSize: 14, color: '#999' }}>No new notifications</div>
      </div>
    );
  }

  return (
    <div className="screen" style={{ paddingTop: 8 }}>
      {notifications.map((n) => (
        <div key={n.id} style={{
          background: '#fff', border: '0.5px solid #E5E5E5',
          borderRadius: 10, padding: 14, marginBottom: 8,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: n.iconBg, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {n.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#333', marginBottom: 2 }}>{n.title}</div>
            <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5, marginBottom: 6 }}>{n.sub}</div>
            {n.action && (
              <button
                onClick={n.onAction}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#000', padding: 0 }}
              >
                {n.action}
              </button>
            )}
          </div>
          {n.dismissable && (
            <button
              onClick={n.onDismiss}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#CCC', padding: 0, lineHeight: 1, flexShrink: 0 }}
            >
              &times;
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// Compute badge count — exported for use in Layout
export function getNotificationCount({ cardStatus, userJourney, paperlessEnrolled, biometricEnabled, notificationsConfigured, nudgePaperlessDismissed, nudgeFaceIdDismissed, nudgeNotifDismissed }) {
  const isNewUser = userJourney === 'new_user';
  let count = 0;
  if (cardStatus === 'virtual_only' && isNewUser) count++;
  if (isNewUser && !paperlessEnrolled && !nudgePaperlessDismissed) count++;
  if (isNewUser && !biometricEnabled && !nudgeFaceIdDismissed) count++;
  if (isNewUser && !notificationsConfigured && !nudgeNotifDismissed) count++;
  return count;
}
