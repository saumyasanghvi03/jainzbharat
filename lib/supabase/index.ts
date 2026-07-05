export { getSupabaseServerClient } from './server';
export { getSupabaseBrowserClient } from './client';
export { getSupabaseAdminClient } from './admin';
export type * from './types';
export * from './repositories';

// Service layer
export {
  getOrCreateProfile,
  updateProfileWithAudit,
  searchProfilesWithBadges,
  getProfileRanking,
} from './services/profile.service';

export {
  signDeclaration,
} from './services/declaration.service';

export {
  submitDirectoryEntry,
  verifyDirectoryEntry,
} from './services/directory.service';

export {
  createEventWithNotifications,
  registerWithConfirmation,
} from './services/event.service';

export {
  performNavkar,
} from './services/navkar.service';

export {
  issueCertificate,
  getUserCertificates,
} from './services/certificate.service';

export {
  awardBadgeWithNotification,
  getUserBadges,
  hasBadge,
} from './services/badge.service';

export {
  getNotifications,
  sendNotification,
  dismissNotifications,
  dismissAll,
} from './services/notification.service';

export {
  logAction,
  queryAuditLogs,
} from './services/audit.service';
