import { Tag, CheckCircle, Confetti, Info, CreditCard, Bell, ICON_WEIGHT } from '../icons';

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
      icon: <CreditCard size={20} weight={ICON_WEIGHT} color="#B45309" />,
      title: 'Your physical card is on its way',
      sub: "Expected in 5\u20137 business days. We'll notify you when it arrives and is ready to activate.",
      action: 'View activation steps \u2192',
      onAction: () => navigate('main', 'activateCall'),
      dismissable: false,
    });
  }

  // 2. Paperless — new users only
  if (isNewUser && !paperlessEnrolled && !nudgePaperlessDismissed) {
    notifications.push({
      id: 'paperless',
      iconBg: '#E1F5EE',
      iconColor: '#1A7F3C',
      icon: <Tag size={20} weight={ICON_WEIGHT} color="#1A7F3C" />,
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
      icon: <CheckCircle size={20} weight={ICON_WEIGHT} color="#6B21A8" />,
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
      icon: <Bell size={20} weight={ICON_WEIGHT} color="#185FA5" />,
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
        <Bell size={48} weight={ICON_WEIGHT} color="#CCC" style={{ marginBottom: 16 }} />
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

// Re-export for backwards compatibility
export { getNotificationCount } from './notificationCount';
