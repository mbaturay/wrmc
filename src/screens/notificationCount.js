// Extracted from NotificationCenter.jsx so that App.jsx can import it
// without statically pulling in the full NotificationCenter component.
export function getNotificationCount({ cardStatus, userJourney, paperlessEnrolled, biometricEnabled, notificationsConfigured, nudgePaperlessDismissed, nudgeFaceIdDismissed, nudgeNotifDismissed }) {
  const isNewUser = userJourney === 'new_user';
  let count = 0;
  if (cardStatus === 'virtual_only' && isNewUser) count++;
  if (isNewUser && !paperlessEnrolled && !nudgePaperlessDismissed) count++;
  if (isNewUser && !biometricEnabled && !nudgeFaceIdDismissed) count++;
  if (isNewUser && !notificationsConfigured && !nudgeNotifDismissed) count++;
  return count;
}
