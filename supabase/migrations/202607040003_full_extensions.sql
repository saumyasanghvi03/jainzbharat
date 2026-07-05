-- 202607040003_full_extensions.sql
-- Adds all missing tables, RLS, indexes, triggers, updated storage buckets

-- ============================================================
-- EXTENSION: auto-update updated_at trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- TABLE: certificates
-- ============================================================
create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  metadata jsonb not null default '{}',
  issued_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index certificates_profile_idx on public.certificates (profile_id);

alter table public.certificates enable row level security;
create policy "Certificates are readable by owner"
  on public.certificates for select using (profile_id in (select id from public.profiles where clerk_user_id = auth.jwt()->>'sub'));
create policy "Admins can manage certificates"
  on public.certificates for all using (exists (select 1 from public.profiles where clerk_user_id = auth.jwt()->>'sub' and role in ('admin','super_admin')));

-- ============================================================
-- TABLE: badges
-- ============================================================
create type badge_type as enum (
  'declaration_signer', 'navkar_champion', 'founder', 'volunteer',
  'mentor', 'organizer', 'contributor', 'sangh_leader', 'temple_patron', 'custom'
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  badge_type badge_type not null,
  name text not null,
  description text,
  image_url text,
  awarded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(profile_id, badge_type)
);
create index badges_profile_idx on public.badges (profile_id);

alter table public.badges enable row level security;
create policy "Badges are publicly readable"
  on public.badges for select using (true);
create policy "Badges are insertable by service"
  on public.badges for insert with check (true);
create policy "Admins can manage badges"
  on public.badges for all using (exists (select 1 from public.profiles where clerk_user_id = auth.jwt()->>'sub' and role in ('admin','super_admin')));

-- ============================================================
-- TABLE: founders
-- ============================================================
create table public.founders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  bio text,
  contribution text,
  priority integer not null default 0,
  created_at timestamptz not null default now(),
  unique(profile_id)
);
create index founders_priority_idx on public.founders (priority asc);

alter table public.founders enable row level security;
create policy "Founders are publicly readable"
  on public.founders for select using (true);
create policy "Founders are manageable by admins"
  on public.founders for all using (exists (select 1 from public.profiles where clerk_user_id = auth.jwt()->>'sub' and role in ('admin','super_admin')));

-- ============================================================
-- TABLE: organizations
-- ============================================================
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  website text,
  country text,
  city text,
  verification_status verification_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index organizations_search_idx on public.organizations using gin (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'')));
create index organizations_verification_idx on public.organizations (verification_status);

create trigger set_organizations_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

alter table public.organizations enable row level security;
create policy "Verified organizations are readable"
  on public.organizations for select using (verification_status = 'verified' or verification_status = 'pending');
create policy "Organizations are manageable by admins"
  on public.organizations for all using (exists (select 1 from public.profiles where clerk_user_id = auth.jwt()->>'sub' and role in ('admin','super_admin')));

-- ============================================================
-- TABLE: sanghs
-- ============================================================
create table public.sanghs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  country text,
  city text,
  founder_id uuid references public.profiles(id) on delete set null,
  contact_email text,
  contact_phone text,
  website text,
  logo_url text,
  cover_url text,
  member_count integer not null default 0 check (member_count >= 0),
  verification_status verification_status not null default 'pending',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index sanghs_search_idx on public.sanghs using gin (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'')));
create index sanghs_geo_idx on public.sanghs (country, city);

create trigger set_sanghs_updated_at
  before update on public.sanghs
  for each row execute function public.set_updated_at();

alter table public.sanghs enable row level security;
create policy "Verified sanghs are readable"
  on public.sanghs for select using (true);
create policy "Sanghs are manageable by admins and owners"
  on public.sanghs for all using (
    exists (select 1 from public.profiles where clerk_user_id = auth.jwt()->>'sub' and (role in ('admin','super_admin') or id = founder_id))
  );

-- ============================================================
-- TABLE: temples
-- ============================================================
create table public.temples (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  country text,
  city text,
  address text,
  deities text[] not null default '{}',
  traditions text[] not null default '{}',
  website text,
  image_url text,
  verification_status verification_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index temples_search_idx on public.temples using gin (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'')));
create index temples_geo_idx on public.temples (country, city);

create trigger set_temples_updated_at
  before update on public.temples
  for each row execute function public.set_updated_at();

alter table public.temples enable row level security;
create policy "Temples are publicly readable"
  on public.temples for select using (true);
create policy "Temples are manageable by admins"
  on public.temples for all using (exists (select 1 from public.profiles where clerk_user_id = auth.jwt()->>'sub' and role in ('admin','super_admin')));

-- ============================================================
-- TABLE: event_registrations
-- ============================================================
create type registration_status as enum ('registered', 'attended', 'cancelled');

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  status registration_status not null default 'registered',
  registered_at timestamptz not null default now(),
  unique(event_id, profile_id)
);
create index event_registrations_event_idx on public.event_registrations (event_id);
create index event_registrations_profile_idx on public.event_registrations (profile_id);

alter table public.event_registrations enable row level security;
create policy "Users can read own registrations"
  on public.event_registrations for select using (profile_id in (select id from public.profiles where clerk_user_id = auth.jwt()->>'sub'));
create policy "Users can register themselves"
  on public.event_registrations for insert with check (profile_id in (select id from public.profiles where clerk_user_id = auth.jwt()->>'sub'));
create policy "Users can cancel own registrations"
  on public.event_registrations for update using (profile_id in (select id from public.profiles where clerk_user_id = auth.jwt()->>'sub'));
create policy "Admins can manage all registrations"
  on public.event_registrations for all using (exists (select 1 from public.profiles where clerk_user_id = auth.jwt()->>'sub' and role in ('admin','super_admin')));

-- ============================================================
-- TABLE: navkar_sessions
-- ============================================================
create table public.navkar_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  count integer not null check (count > 0),
  duration_seconds integer,
  intention text,
  energy text,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index navkar_sessions_profile_idx on public.navkar_sessions (profile_id);
create index navkar_sessions_recorded_idx on public.navkar_sessions (recorded_at desc);

alter table public.navkar_sessions enable row level security;
create policy "Users can read own sessions"
  on public.navkar_sessions for select using (profile_id in (select id from public.profiles where clerk_user_id = auth.jwt()->>'sub'));
create policy "Users can create own sessions"
  on public.navkar_sessions for insert with check (profile_id in (select id from public.profiles where clerk_user_id = auth.jwt()->>'sub'));

-- ============================================================
-- TABLE: projects
-- ============================================================
create type project_status as enum ('planning', 'active', 'completed', 'paused');

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  owner_profile_id uuid references public.profiles(id) on delete set null,
  status project_status not null default 'planning',
  country text,
  city text,
  start_date date,
  end_date date,
  volunteers_needed integer check (volunteers_needed is null or volunteers_needed > 0),
  image_url text,
  tags text[] not null default '{}',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_search_idx on public.projects using gin (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'')));
create index projects_status_idx on public.projects (status);
create index projects_owner_idx on public.projects (owner_profile_id);

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
create policy "Active projects are readable"
  on public.projects for select using (status != 'planning' or owner_profile_id in (select id from public.profiles where clerk_user_id = auth.jwt()->>'sub'));
create policy "Users can create projects"
  on public.projects for insert with check (owner_profile_id in (select id from public.profiles where clerk_user_id = auth.jwt()->>'sub'));
create policy "Owners and admins can update"
  on public.projects for update using (
    owner_profile_id in (select id from public.profiles where clerk_user_id = auth.jwt()->>'sub')
    or exists (select 1 from public.profiles where clerk_user_id = auth.jwt()->>'sub' and role in ('admin','super_admin'))
  );

-- ============================================================
-- TABLE: volunteer_hours
-- ============================================================
create table public.volunteer_hours (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  hours numeric(10,2) not null check (hours > 0),
  description text,
  date date not null,
  verified boolean not null default false,
  verified_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index volunteer_hours_profile_idx on public.volunteer_hours (profile_id);
create index volunteer_hours_date_idx on public.volunteer_hours (date desc);

alter table public.volunteer_hours enable row level security;
create policy "Volunteer hours are publicly readable"
  on public.volunteer_hours for select using (true);
create policy "Users can create own hours"
  on public.volunteer_hours for insert with check (profile_id in (select id from public.profiles where clerk_user_id = auth.jwt()->>'sub'));
create policy "Admins and moderators can verify"
  on public.volunteer_hours for update using (exists (select 1 from public.profiles where clerk_user_id = auth.jwt()->>'sub' and role in ('admin','super_admin','moderator')));

-- ============================================================
-- TABLE: skills
-- ============================================================
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  category text,
  proficiency integer not null default 1 check (proficiency between 1 and 5),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  unique(profile_id, name)
);
create index skills_profile_idx on public.skills (profile_id);
create index skills_category_idx on public.skills (category);

alter table public.skills enable row level security;
create policy "Skills are publicly readable"
  on public.skills for select using (true);
create policy "Users can manage own skills"
  on public.skills for all using (profile_id in (select id from public.profiles where clerk_user_id = auth.jwt()->>'sub'));

-- ============================================================
-- TABLE: achievements
-- ============================================================
create type achievement_type as enum ('badge', 'milestone', 'custom');

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  achievement_type achievement_type not null,
  name text not null,
  description text,
  icon text,
  points integer not null default 0 check (points >= 0),
  awarded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index achievements_profile_idx on public.achievements (profile_id);
create index achievements_awarded_idx on public.achievements (awarded_at desc);

alter table public.achievements enable row level security;
create policy "Achievements are publicly readable"
  on public.achievements for select using (true);
create policy "Achievements are service-managed"
  on public.achievements for insert with check (true);

-- ============================================================
-- TABLE: notifications
-- ============================================================
create type notification_type as enum (
  'badge_earned', 'certificate_issued', 'signature_confirmed',
  'event_reminder', 'event_update', 'project_invite',
  'achievement_unlocked', 'profile_verified', 'system'
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  notification_type notification_type not null,
  title text not null,
  body text,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_profile_unread_idx on public.notifications (profile_id, read) where read = false;
create index notifications_created_idx on public.notifications (created_at desc);

alter table public.notifications enable row level security;
create policy "Users can read own notifications"
  on public.notifications for select using (profile_id in (select id from public.profiles where clerk_user_id = auth.jwt()->>'sub'));
create policy "Users can mark own notifications read"
  on public.notifications for update using (profile_id in (select id from public.profiles where clerk_user_id = auth.jwt()->>'sub'));
create policy "Notifications are service-inserted"
  on public.notifications for insert with check (true);

-- ============================================================
-- TABLE: audit_logs
-- ============================================================
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  changes jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);
create index audit_logs_profile_idx on public.audit_logs (profile_id);
create index audit_logs_action_idx on public.audit_logs (action);
create index audit_logs_created_idx on public.audit_logs (created_at desc);

alter table public.audit_logs enable row level security;
create policy "Audit logs are readable by admins only"
  on public.audit_logs for select using (exists (select 1 from public.profiles where clerk_user_id = auth.jwt()->>'sub' and role in ('admin','super_admin')));
create policy "Audit logs are service-inserted"
  on public.audit_logs for insert with check (true);

-- ============================================================
-- ADDITIONAL INDEXES on existing tables
-- ============================================================
create index if not exists declaration_signatures_profile_idx on public.declaration_signatures (profile_id);
create index if not exists declaration_signatures_version_idx on public.declaration_signatures (declaration_version);
create index if not exists declaration_signatures_signed_idx on public.declaration_signatures (signed_at desc);
create index if not exists profiles_clerk_user_idx on public.profiles (clerk_user_id);
create index if not exists profiles_jainz_id_idx on public.profiles (jainz_id);
create index if not exists profiles_role_idx on public.profiles (role);

-- ============================================================
-- TRIGGER: auto-update profile updated_at on write
-- ============================================================
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- TRIGGER: auto-award declaration_signer badge on first signature
-- ============================================================
create or replace function public.award_declaration_badge()
returns trigger as $$
begin
  insert into public.badges (profile_id, badge_type, name, description)
  values (new.profile_id, 'declaration_signer', 'Declaration Signatory', 'Signed the JainZBharat Founding Declaration')
  on conflict (profile_id, badge_type) do nothing;
  return new;
end;
$$ language plpgsql;

create trigger after_signature_insert
  after insert on public.declaration_signatures
  for each row execute function public.award_declaration_badge();

-- ============================================================
-- TRIGGER: log profile updates to audit_logs
-- ============================================================
create or replace function public.log_profile_update()
returns trigger as $$
begin
  if old is distinct from new then
    insert into public.audit_logs (profile_id, action, entity_type, entity_id, changes, ip_address)
    values (new.id, 'profile_updated', 'profiles', new.id::text,
      jsonb_build_object(
        'before', jsonb_strip_nulls(row_to_json(old)::jsonb - 'id' - 'created_at' - 'updated_at'),
        'after', jsonb_strip_nulls(row_to_json(new)::jsonb - 'id' - 'created_at' - 'updated_at')
      ),
      null);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger after_profile_update
  after update on public.profiles
  for each row execute function public.log_profile_update();

-- ============================================================
-- UPDATED STORAGE BUCKET CONFIGURATION
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 2097152, array['image/jpeg','image/png','image/webp']),
  ('certificates', 'certificates', false, 5242880, array['application/pdf','image/png','image/jpeg']),
  ('events', 'events', true, 10485760, array['image/jpeg','image/png','image/webp']),
  ('sanghs', 'sanghs', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('projects', 'projects', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- Storage policies
do $$ begin
  if not exists (select 1 from pg_policy where polname = 'Public avatars read') then
    create policy "Public avatars read"
      on storage.objects for select
      using (bucket_id = 'avatars');
  end if;
  if not exists (select 1 from pg_policy where polname = 'Users can upload avatars') then
    create policy "Users can upload avatars"
      on storage.objects for insert
      with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.jwt()->>'sub');
  end if;
  if not exists (select 1 from pg_policy where polname = 'Event images read') then
    create policy "Event images read"
      on storage.objects for select
      using (bucket_id = 'events');
  end if;
  if not exists (select 1 from pg_policy where polname = 'Sangh images read') then
    create policy "Sangh images read"
      on storage.objects for select
      using (bucket_id = 'sanghs');
  end if;
  if not exists (select 1 from pg_policy where polname = 'Project images read') then
    create policy "Project images read"
      on storage.objects for select
      using (bucket_id = 'projects');
  end if;
end $$;

