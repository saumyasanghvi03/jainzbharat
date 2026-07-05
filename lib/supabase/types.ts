// ──────────────────────────────────────────────
// ENUMS
// ──────────────────────────────────────────────

export type AppRole = 'member' | 'moderator' | 'admin' | 'super_admin';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type DirectoryType = 'founder' | 'student' | 'professional' | 'volunteer' | 'mentor' | 'sangh' | 'temple' | 'ngo';
export type BadgeType = 'declaration_signer' | 'navkar_champion' | 'founder' | 'volunteer' | 'mentor' | 'organizer' | 'contributor' | 'sangh_leader' | 'temple_patron' | 'custom';
export type RegistrationStatus = 'registered' | 'attended' | 'cancelled';
export type ProjectStatus = 'planning' | 'active' | 'completed' | 'paused';
export type AchievementType = 'badge' | 'milestone' | 'custom';
export type NotificationType = 'badge_earned' | 'certificate_issued' | 'signature_confirmed' | 'event_reminder' | 'event_update' | 'project_invite' | 'achievement_unlocked' | 'profile_verified' | 'system';

// ──────────────────────────────────────────────
// TABLE: profiles
// ──────────────────────────────────────────────

export interface Profile {
  id: string;
  clerk_user_id: string;
  jainz_id: string;
  role: AppRole;
  display_name: string;
  bio: string | null;
  country: string | null;
  city: string | null;
  languages: string[];
  skills: string[];
  profession: string | null;
  company: string | null;
  links: Record<string, unknown>;
  contribution_score: number;
  volunteer_hours: number;
  navkar_count: number;
  profile_edited_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  clerk_user_id: string;
  display_name: string;
  bio?: string | null;
  country?: string | null;
  city?: string | null;
  languages?: string[];
  skills?: string[];
  profession?: string | null;
  company?: string | null;
  links?: Record<string, unknown>;
}

export interface ProfileUpdate {
  display_name?: string;
  bio?: string | null;
  country?: string | null;
  city?: string | null;
  languages?: string[];
  skills?: string[];
  profession?: string | null;
  company?: string | null;
  links?: Record<string, unknown>;
  role?: AppRole;
  contribution_score?: number;
  volunteer_hours?: number;
  navkar_count?: number;
  jainz_id?: string;
}

// ──────────────────────────────────────────────
// TABLE: declaration_versions
// ──────────────────────────────────────────────

export interface DeclarationVersion {
  version: string;
  published_at: string;
  body: Record<string, unknown>;
  changelog: Record<string, unknown>[];
  is_current: boolean;
  created_at: string;
}

export interface DeclarationVersionInsert {
  version: string;
  published_at: string;
  body: Record<string, unknown>;
  changelog?: Record<string, unknown>[];
  is_current?: boolean;
}

export interface DeclarationVersionUpdate {
  body?: Record<string, unknown>;
  changelog?: Record<string, unknown>[];
  is_current?: boolean;
}

// ──────────────────────────────────────────────
// TABLE: declaration_signatures
// ──────────────────────────────────────────────

export interface DeclarationSignature {
  id: string;
  profile_id: string;
  declaration_version: string;
  country: string;
  city: string;
  profession: string;
  organization: string | null;
  signed_at: string;
}

export interface DeclarationSignatureInsert {
  profile_id: string;
  declaration_version: string;
  country: string;
  city: string;
  profession: string;
  organization?: string | null;
}

// ──────────────────────────────────────────────
// TABLE: directory_entries
// ──────────────────────────────────────────────

export interface DirectoryEntry {
  id: string;
  owner_profile_id: string | null;
  directory_type: DirectoryType;
  name: string;
  slug: string;
  summary: string;
  location: Record<string, unknown>;
  contact: Record<string, unknown>;
  metadata: Record<string, unknown>;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface DirectoryEntryInsert {
  owner_profile_id?: string | null;
  directory_type: DirectoryType;
  name: string;
  slug: string;
  summary: string;
  location?: Record<string, unknown>;
  contact?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  verification_status?: VerificationStatus;
}

export interface DirectoryEntryUpdate {
  name?: string;
  summary?: string;
  location?: Record<string, unknown>;
  contact?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  verification_status?: VerificationStatus;
}

// ──────────────────────────────────────────────
// TABLE: events
// ──────────────────────────────────────────────

export interface Event {
  id: string;
  organizer_profile_id: string | null;
  title: string;
  slug: string;
  description: string;
  starts_at: string;
  ends_at: string;
  location: Record<string, unknown>;
  capacity: number | null;
  created_at: string;
}

export interface EventInsert {
  organizer_profile_id?: string | null;
  title: string;
  slug: string;
  description: string;
  starts_at: string;
  ends_at: string;
  location?: Record<string, unknown>;
  capacity?: number | null;
}

export interface EventUpdate {
  title?: string;
  description?: string;
  starts_at?: string;
  ends_at?: string;
  location?: Record<string, unknown>;
  capacity?: number | null;
}

// ──────────────────────────────────────────────
// TABLE: navkar_entries
// ──────────────────────────────────────────────

export interface NavkarEntry {
  id: string;
  profile_id: string | null;
  count: number;
  city: string | null;
  country: string | null;
  recorded_at: string;
  is_anonymous: boolean;
}

export interface NavkarEntryInsert {
  profile_id?: string | null;
  count: number;
  city?: string | null;
  country?: string | null;
  is_anonymous?: boolean;
}

// ──────────────────────────────────────────────
// TABLE: certificates
// ──────────────────────────────────────────────

export interface Certificate {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  issued_at: string;
  created_at: string;
}

export interface CertificateInsert {
  profile_id: string;
  title: string;
  description?: string | null;
  metadata?: Record<string, unknown>;
  issued_at?: string;
}

// ──────────────────────────────────────────────
// TABLE: badges
// ──────────────────────────────────────────────

export interface Badge {
  id: string;
  profile_id: string;
  badge_type: BadgeType;
  name: string;
  description: string | null;
  image_url: string | null;
  awarded_at: string;
  created_at: string;
}

export interface BadgeInsert {
  profile_id: string;
  badge_type: BadgeType;
  name: string;
  description?: string | null;
  image_url?: string | null;
  awarded_at?: string;
}

// ──────────────────────────────────────────────
// TABLE: founders
// ──────────────────────────────────────────────

export interface Founder {
  id: string;
  profile_id: string;
  title: string;
  bio: string | null;
  contribution: string | null;
  priority: number;
  created_at: string;
}

export interface FounderInsert {
  profile_id: string;
  title: string;
  bio?: string | null;
  contribution?: string | null;
  priority?: number;
}

export interface FounderUpdate {
  title?: string;
  bio?: string | null;
  contribution?: string | null;
  priority?: number;
}

// ──────────────────────────────────────────────
// TABLE: organizations
// ──────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  country: string | null;
  city: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface OrganizationInsert {
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  website?: string | null;
  country?: string | null;
  city?: string | null;
  verification_status?: VerificationStatus;
}

export interface OrganizationUpdate {
  name?: string;
  description?: string | null;
  logo_url?: string | null;
  website?: string | null;
  country?: string | null;
  city?: string | null;
  verification_status?: VerificationStatus;
}

// ──────────────────────────────────────────────
// TABLE: sanghs
// ──────────────────────────────────────────────

export interface Sangh {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  country: string | null;
  city: string | null;
  founder_id: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  logo_url: string | null;
  cover_url: string | null;
  member_count: number;
  verification_status: VerificationStatus;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SanghInsert {
  name: string;
  slug: string;
  description?: string | null;
  country?: string | null;
  city?: string | null;
  founder_id?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  website?: string | null;
  logo_url?: string | null;
  cover_url?: string | null;
  member_count?: number;
  verification_status?: VerificationStatus;
  metadata?: Record<string, unknown>;
}

export interface SanghUpdate {
  name?: string;
  description?: string | null;
  country?: string | null;
  city?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  website?: string | null;
  logo_url?: string | null;
  cover_url?: string | null;
  member_count?: number;
  verification_status?: VerificationStatus;
  metadata?: Record<string, unknown>;
}

// ──────────────────────────────────────────────
// TABLE: temples
// ──────────────────────────────────────────────

export interface Temple {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  deities: string[];
  traditions: string[];
  website: string | null;
  image_url: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface TempleInsert {
  name: string;
  slug: string;
  description?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  deities?: string[];
  traditions?: string[];
  website?: string | null;
  image_url?: string | null;
  verification_status?: VerificationStatus;
}

export interface TempleUpdate {
  name?: string;
  description?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  deities?: string[];
  traditions?: string[];
  website?: string | null;
  image_url?: string | null;
  verification_status?: VerificationStatus;
}

// ──────────────────────────────────────────────
// TABLE: event_registrations
// ──────────────────────────────────────────────

export interface EventRegistration {
  id: string;
  event_id: string;
  profile_id: string;
  status: RegistrationStatus;
  registered_at: string;
}

export interface EventRegistrationInsert {
  event_id: string;
  profile_id: string;
  status?: RegistrationStatus;
}

export interface EventRegistrationUpdate {
  status?: RegistrationStatus;
}

// ──────────────────────────────────────────────
// TABLE: navkar_sessions
// ──────────────────────────────────────────────

export interface NavkarSession {
  id: string;
  profile_id: string;
  count: number;
  duration_seconds: number | null;
  intention: string | null;
  energy: string | null;
  recorded_at: string;
  created_at: string;
}

export interface NavkarSessionInsert {
  profile_id: string;
  count: number;
  duration_seconds?: number | null;
  intention?: string | null;
  energy?: string | null;
  recorded_at?: string;
}

// ──────────────────────────────────────────────
// TABLE: volunteer_hours
// ──────────────────────────────────────────────

export interface VolunteerHour {
  id: string;
  profile_id: string;
  event_id: string | null;
  project_id: string | null;
  hours: number;
  description: string | null;
  date: string;
  verified: boolean;
  verified_by: string | null;
  created_at: string;
}

export interface VolunteerHourInsert {
  profile_id: string;
  event_id?: string | null;
  project_id?: string | null;
  hours: number;
  description?: string | null;
  date: string;
}

export interface VolunteerHourUpdate {
  hours?: number;
  description?: string | null;
  verified?: boolean;
  verified_by?: string | null;
}

// ──────────────────────────────────────────────
// TABLE: projects
// ──────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  owner_profile_id: string | null;
  status: ProjectStatus;
  country: string | null;
  city: string | null;
  start_date: string | null;
  end_date: string | null;
  volunteers_needed: number | null;
  image_url: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProjectInsert {
  name: string;
  slug: string;
  description: string;
  owner_profile_id?: string | null;
  status?: ProjectStatus;
  country?: string | null;
  city?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  volunteers_needed?: number | null;
  image_url?: string | null;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  country?: string | null;
  city?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  volunteers_needed?: number | null;
  image_url?: string | null;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

// ──────────────────────────────────────────────
// TABLE: skills
// ──────────────────────────────────────────────

export interface Skill {
  id: string;
  profile_id: string;
  name: string;
  category: string | null;
  proficiency: number;
  verified: boolean;
  created_at: string;
}

export interface SkillInsert {
  profile_id: string;
  name: string;
  category?: string | null;
  proficiency?: number;
}

export interface SkillUpdate {
  name?: string;
  category?: string | null;
  proficiency?: number;
  verified?: boolean;
}

// ──────────────────────────────────────────────
// TABLE: achievements
// ──────────────────────────────────────────────

export interface Achievement {
  id: string;
  profile_id: string;
  achievement_type: AchievementType;
  name: string;
  description: string | null;
  icon: string | null;
  points: number;
  awarded_at: string;
  created_at: string;
}

export interface AchievementInsert {
  profile_id: string;
  achievement_type: AchievementType;
  name: string;
  description?: string | null;
  icon?: string | null;
  points?: number;
  awarded_at?: string;
}

// ──────────────────────────────────────────────
// TABLE: notifications
// ──────────────────────────────────────────────

export interface Notification {
  id: string;
  profile_id: string;
  notification_type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

export interface NotificationInsert {
  profile_id: string;
  notification_type: NotificationType;
  title: string;
  body?: string | null;
  link?: string | null;
}

export interface NotificationUpdate {
  read?: boolean;
}

// ──────────────────────────────────────────────
// TABLE: audit_logs
// ──────────────────────────────────────────────

export interface AuditLog {
  id: string;
  profile_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  changes: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

export interface AuditLogInsert {
  profile_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  changes?: Record<string, unknown> | null;
  ip_address?: string | null;
}

// ──────────────────────────────────────────────
// TABLE: clubs
// ──────────────────────────────────────────────

export type ClubPrivacy = 'public' | 'private';
export type ClubMemberRole = 'owner' | 'admin' | 'moderator' | 'member';
export type ClubMemberStatus = 'active' | 'pending' | 'banned';

export interface Club {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  mission: string | null;
  logo_url: string | null;
  banner_url: string | null;
  privacy: ClubPrivacy;
  founder_id: string | null;
  member_count: number;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface ClubInsert {
  name: string;
  slug: string;
  description?: string | null;
  mission?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  privacy?: ClubPrivacy;
  founder_id?: string | null;
  member_count?: number;
  verification_status?: VerificationStatus;
}

export interface ClubUpdate {
  name?: string;
  description?: string | null;
  mission?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  privacy?: ClubPrivacy;
  member_count?: number;
  verification_status?: VerificationStatus;
}

export interface ClubMember {
  id: string;
  club_id: string;
  profile_id: string;
  role: ClubMemberRole;
  status: ClubMemberStatus;
  joined_at: string;
}

export interface ClubMemberInsert {
  club_id: string;
  profile_id: string;
  role?: ClubMemberRole;
  status?: ClubMemberStatus;
}

export interface ClubMemberUpdate {
  role?: ClubMemberRole;
  status?: ClubMemberStatus;
}

// ──────────────────────────────────────────────
// TABLE: kalyanmitra_groups
// ──────────────────────────────────────────────

export type KalyanmitraCategory = 'blood_donation' | 'education' | 'animal_welfare' | 'healthcare' | 'temple_service' | 'disaster_relief' | 'environment' | 'food_distribution' | 'community_service';
export type KalyanmitraMemberRole = 'owner' | 'admin' | 'moderator' | 'member';

export interface KalyanmitraGroup {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: KalyanmitraCategory | null;
  logo_url: string | null;
  banner_url: string | null;
  founder_id: string | null;
  member_count: number;
  city: string | null;
  country: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface KalyanmitraGroupInsert {
  name: string;
  slug: string;
  description?: string | null;
  category?: KalyanmitraCategory | null;
  logo_url?: string | null;
  banner_url?: string | null;
  founder_id?: string | null;
  member_count?: number;
  city?: string | null;
  country?: string | null;
  verification_status?: VerificationStatus;
}

export interface KalyanmitraGroupUpdate {
  name?: string;
  description?: string | null;
  category?: KalyanmitraCategory | null;
  logo_url?: string | null;
  banner_url?: string | null;
  member_count?: number;
  city?: string | null;
  country?: string | null;
  verification_status?: VerificationStatus;
}

export interface KalyanmitraMember {
  id: string;
  group_id: string;
  profile_id: string;
  role: KalyanmitraMemberRole;
  status: ClubMemberStatus;
  volunteer_hours: number;
  joined_at: string;
}

export interface KalyanmitraMemberInsert {
  group_id: string;
  profile_id: string;
  role?: KalyanmitraMemberRole;
  status?: ClubMemberStatus;
  volunteer_hours?: number;
}

export interface KalyanmitraMemberUpdate {
  role?: KalyanmitraMemberRole;
  status?: ClubMemberStatus;
  volunteer_hours?: number;
}

// ──────────────────────────────────────────────
// TABLE: organization_members
// ──────────────────────────────────────────────

export type OrganizationMemberRole = 'owner' | 'admin' | 'member';
export type OrganizationMemberStatus = 'active' | 'pending' | 'banned';

export interface OrganizationMember {
  id: string;
  organization_id: string;
  profile_id: string;
  role: OrganizationMemberRole;
  status: OrganizationMemberStatus;
  joined_at: string;
}

export interface OrganizationMemberInsert {
  organization_id: string;
  profile_id: string;
  role?: OrganizationMemberRole;
  status?: OrganizationMemberStatus;
}

export interface OrganizationMemberUpdate {
  role?: OrganizationMemberRole;
  status?: OrganizationMemberStatus;
}

// ──────────────────────────────────────────────
// TABLE: forum_categories
// ──────────────────────────────────────────────

export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  club_id: string | null;
  created_at: string;
}

export interface ForumCategoryInsert {
  name: string;
  slug: string;
  description?: string | null;
  sort_order?: number;
  club_id?: string | null;
}

export interface ForumCategoryUpdate {
  name?: string;
  description?: string | null;
  sort_order?: number;
}

// ──────────────────────────────────────────────
// TABLE: forum_topics
// ──────────────────────────────────────────────

export interface ForumTopic {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  author_id: string;
  pinned: boolean;
  solved: boolean;
  view_count: number;
  reply_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ForumTopicInsert {
  category_id: string;
  title: string;
  slug: string;
  author_id: string;
  pinned?: boolean;
  solved?: boolean;
  tags?: string[];
}

export interface ForumTopicUpdate {
  title?: string;
  pinned?: boolean;
  solved?: boolean;
  tags?: string[];
}

// ──────────────────────────────────────────────
// TABLE: forum_posts
// ──────────────────────────────────────────────

export interface ForumPost {
  id: string;
  topic_id: string;
  author_id: string;
  content: string;
  is_first_post: boolean;
  upvotes: number;
  created_at: string;
  updated_at: string;
}

export interface ForumPostInsert {
  topic_id: string;
  author_id: string;
  content: string;
  is_first_post?: boolean;
}

export interface ForumPostUpdate {
  content?: string;
  upvotes?: number;
}

// ──────────────────────────────────────────────
// TABLE: forum_likes
// ──────────────────────────────────────────────

export interface ForumLike {
  id: string;
  post_id: string;
  profile_id: string;
  created_at: string;
}

export interface ForumLikeInsert {
  post_id: string;
  profile_id: string;
}

// ──────────────────────────────────────────────
// TABLE: chat_conversations
// ──────────────────────────────────────────────

export type ChatConversationType = 'direct' | 'group' | 'club' | 'event';

export interface ChatConversation {
  id: string;
  type: ChatConversationType;
  name: string | null;
  club_id: string | null;
  event_id: string | null;
  created_at: string;
}

export interface ChatConversationInsert {
  type: ChatConversationType;
  name?: string | null;
  club_id?: string | null;
  event_id?: string | null;
}

export interface ChatConversationUpdate {
  name?: string | null;
}

// ──────────────────────────────────────────────
// TABLE: chat_participants
// ──────────────────────────────────────────────

export interface ChatParticipant {
  id: string;
  conversation_id: string;
  profile_id: string;
  last_read_at: string | null;
  is_online: boolean;
  joined_at: string;
}

export interface ChatParticipantInsert {
  conversation_id: string;
  profile_id: string;
  is_online?: boolean;
}

export interface ChatParticipantUpdate {
  last_read_at?: string | null;
  is_online?: boolean;
}

// ──────────────────────────────────────────────
// TABLE: chat_messages
// ──────────────────────────────────────────────

export type ChatMessageType = 'text' | 'image' | 'file' | 'gif' | 'system';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: ChatMessageType;
  file_url: string | null;
  reply_to_id: string | null;
  created_at: string;
}

export interface ChatMessageInsert {
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type?: ChatMessageType;
  file_url?: string | null;
  reply_to_id?: string | null;
}

export interface ChatMessageUpdate {
  content?: string;
}

// ──────────────────────────────────────────────
// TABLE: chat_reactions
// ──────────────────────────────────────────────

export interface ChatReaction {
  id: string;
  message_id: string;
  profile_id: string;
  emoji: string;
  created_at: string;
}

export interface ChatReactionInsert {
  message_id: string;
  profile_id: string;
  emoji: string;
}

// ──────────────────────────────────────────────
// TABLE: community_feeds
// ──────────────────────────────────────────────

export type FeedType = 'announcement' | 'post' | 'event' | 'volunteer' | 'club' | 'discussion';

export interface CommunityFeed {
  id: string;
  profile_id: string;
  feed_type: FeedType;
  title: string;
  content: string | null;
  link: string | null;
  source_id: string | null;
  created_at: string;
}

export interface CommunityFeedInsert {
  profile_id: string;
  feed_type: FeedType;
  title: string;
  content?: string | null;
  link?: string | null;
  source_id?: string | null;
}

export interface CommunityFeedUpdate {
  title?: string;
  content?: string | null;
  link?: string | null;
}

// ──────────────────────────────────────────────
// TABLE: event_submissions
// ──────────────────────────────────────────────

export type EventSubmissionCategory = 'conference' | 'hackathon' | 'retreat' | 'networking' | 'workshop' | 'seminar' | 'cultural' | 'other';
export type EventSubmissionStatus = 'draft' | 'submitted' | 'approved' | 'published' | 'completed' | 'cancelled';

export interface EventSubmission {
  id: string;
  organizer_id: string;
  title: string;
  slug: string;
  description: string;
  category: EventSubmissionCategory;
  venue: string | null;
  google_maps_link: string | null;
  starts_at: string;
  ends_at: string;
  capacity: number | null;
  registration_link: string | null;
  banner_url: string | null;
  tags: string[];
  status: EventSubmissionStatus;
  created_at: string;
  updated_at: string;
}

export interface EventSubmissionInsert {
  organizer_id: string;
  title: string;
  slug: string;
  description: string;
  category: EventSubmissionCategory;
  venue?: string | null;
  google_maps_link?: string | null;
  starts_at: string;
  ends_at: string;
  capacity?: number | null;
  registration_link?: string | null;
  banner_url?: string | null;
  tags?: string[];
  status?: EventSubmissionStatus;
}

export interface EventSubmissionUpdate {
  title?: string;
  description?: string;
  category?: EventSubmissionCategory;
  venue?: string | null;
  google_maps_link?: string | null;
  starts_at?: string;
  ends_at?: string;
  capacity?: number | null;
  registration_link?: string | null;
  banner_url?: string | null;
  tags?: string[];
  status?: EventSubmissionStatus;
}

// ──────────────────────────────────────────────
// TABLE: diary_entries
// ──────────────────────────────────────────────

export type DiaryPrivacy = 'private' | 'friends' | 'community' | 'public';
export type DiaryJournalType = 'personal' | 'learning' | 'reading' | 'meditation' | 'volunteer' | 'gratitude' | 'reflection';

export interface DiaryEntry {
  id: string;
  profile_id: string;
  title: string;
  content: string;
  content_encrypted: boolean;
  mood: string | null;
  gratitude: string | null;
  goals: string | null;
  reflections: string | null;
  journal_type: DiaryJournalType;
  privacy: DiaryPrivacy;
  is_highlight: boolean;
  highlight_summary: string | null;
  highlight_media: unknown[];
  tags: string[];
  published_at: string | null;
  entry_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface DiaryEntryInsert {
  profile_id: string;
  title: string;
  content?: string;
  content_encrypted?: boolean;
  mood?: string | null;
  gratitude?: string | null;
  goals?: string | null;
  reflections?: string | null;
  journal_type?: DiaryJournalType;
  privacy?: DiaryPrivacy;
  is_highlight?: boolean;
  highlight_summary?: string | null;
  highlight_media?: unknown[];
  tags?: string[];
  entry_date?: string;
}

export interface DiaryEntryUpdate {
  title?: string;
  content?: string;
  mood?: string | null;
  gratitude?: string | null;
  goals?: string | null;
  reflections?: string | null;
  journal_type?: DiaryJournalType;
  privacy?: DiaryPrivacy;
  is_highlight?: boolean;
  highlight_summary?: string | null;
  highlight_media?: unknown[];
  tags?: string[];
  published_at?: string | null;
  deleted_at?: string | null;
}

// ──────────────────────────────────────────────
// TABLE: diary_drafts
// ──────────────────────────────────────────────

export interface DiaryDraft {
  id: string;
  profile_id: string;
  title: string | null;
  content: string | null;
  mood: string | null;
  gratitude: string | null;
  goals: string | null;
  reflections: string | null;
  journal_type: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface DiaryDraftInsert {
  profile_id: string;
  title?: string | null;
  content?: string | null;
  mood?: string | null;
  gratitude?: string | null;
  goals?: string | null;
  reflections?: string | null;
  journal_type?: string;
  tags?: string[];
}

export interface DiaryDraftUpdate {
  title?: string | null;
  content?: string | null;
  mood?: string | null;
  gratitude?: string | null;
  goals?: string | null;
  reflections?: string | null;
  journal_type?: string;
  tags?: string[];
}

// ──────────────────────────────────────────────
// DATABASE TYPE (for typed Supabase client)
// ──────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: ProfileInsert; Update: ProfileUpdate };
      declaration_versions: { Row: DeclarationVersion; Insert: DeclarationVersionInsert; Update: DeclarationVersionUpdate };
      declaration_signatures: { Row: DeclarationSignature; Insert: DeclarationSignatureInsert; Update: Record<string, never> };
      directory_entries: { Row: DirectoryEntry; Insert: DirectoryEntryInsert; Update: DirectoryEntryUpdate };
      events: { Row: Event; Insert: EventInsert; Update: EventUpdate };
      navkar_entries: { Row: NavkarEntry; Insert: NavkarEntryInsert; Update: Record<string, never> };
      certificates: { Row: Certificate; Insert: CertificateInsert; Update: Record<string, never> };
      badges: { Row: Badge; Insert: BadgeInsert; Update: Record<string, never> };
      founders: { Row: Founder; Insert: FounderInsert; Update: FounderUpdate };
      organizations: { Row: Organization; Insert: OrganizationInsert; Update: OrganizationUpdate };
      sanghs: { Row: Sangh; Insert: SanghInsert; Update: SanghUpdate };
      temples: { Row: Temple; Insert: TempleInsert; Update: TempleUpdate };
      event_registrations: { Row: EventRegistration; Insert: EventRegistrationInsert; Update: EventRegistrationUpdate };
      navkar_sessions: { Row: NavkarSession; Insert: NavkarSessionInsert; Update: Record<string, never> };
      volunteer_hours: { Row: VolunteerHour; Insert: VolunteerHourInsert; Update: VolunteerHourUpdate };
      projects: { Row: Project; Insert: ProjectInsert; Update: ProjectUpdate };
      skills: { Row: Skill; Insert: SkillInsert; Update: SkillUpdate };
      achievements: { Row: Achievement; Insert: AchievementInsert; Update: Record<string, never> };
      notifications: { Row: Notification; Insert: NotificationInsert; Update: NotificationUpdate };
      audit_logs: { Row: AuditLog; Insert: AuditLogInsert; Update: Record<string, never> };
      clubs: { Row: Club; Insert: ClubInsert; Update: ClubUpdate };
      club_members: { Row: ClubMember; Insert: ClubMemberInsert; Update: ClubMemberUpdate };
      kalyanmitra_groups: { Row: KalyanmitraGroup; Insert: KalyanmitraGroupInsert; Update: KalyanmitraGroupUpdate };
      kalyanmitra_members: { Row: KalyanmitraMember; Insert: KalyanmitraMemberInsert; Update: KalyanmitraMemberUpdate };
      organization_members: { Row: OrganizationMember; Insert: OrganizationMemberInsert; Update: OrganizationMemberUpdate };
      forum_categories: { Row: ForumCategory; Insert: ForumCategoryInsert; Update: ForumCategoryUpdate };
      forum_topics: { Row: ForumTopic; Insert: ForumTopicInsert; Update: ForumTopicUpdate };
      forum_posts: { Row: ForumPost; Insert: ForumPostInsert; Update: ForumPostUpdate };
      forum_likes: { Row: ForumLike; Insert: ForumLikeInsert; Update: Record<string, never> };
      chat_conversations: { Row: ChatConversation; Insert: ChatConversationInsert; Update: ChatConversationUpdate };
      chat_participants: { Row: ChatParticipant; Insert: ChatParticipantInsert; Update: ChatParticipantUpdate };
      chat_messages: { Row: ChatMessage; Insert: ChatMessageInsert; Update: ChatMessageUpdate };
      chat_reactions: { Row: ChatReaction; Insert: ChatReactionInsert; Update: Record<string, never> };
      community_feeds: { Row: CommunityFeed; Insert: CommunityFeedInsert; Update: CommunityFeedUpdate };
      event_submissions: { Row: EventSubmission; Insert: EventSubmissionInsert; Update: EventSubmissionUpdate };
      diary_entries: { Row: DiaryEntry; Insert: DiaryEntryInsert; Update: DiaryEntryUpdate };
      diary_drafts: { Row: DiaryDraft; Insert: DiaryDraftInsert; Update: DiaryDraftUpdate };
    };
  };
}
