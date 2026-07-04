create extension if not exists pgcrypto;

create type app_role as enum ('member', 'moderator', 'admin', 'super_admin');
create type verification_status as enum ('pending', 'verified', 'rejected');

create table public.declaration_versions (
  version text primary key,
  published_at timestamptz not null,
  body jsonb not null,
  changelog jsonb not null default '[]',
  is_current boolean not null default false,
  created_at timestamptz not null default now()
);

create sequence public.jainz_id_sequence start 1;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  jainz_id text unique not null default ('JZB-' || extract(year from now())::int || '-' || lpad(nextval('public.jainz_id_sequence')::text, 6, '0')),
  role app_role not null default 'member',
  display_name text not null check (char_length(display_name) between 2 and 120),
  bio text,
  country text,
  city text,
  languages text[] not null default '{}',
  skills text[] not null default '{}',
  profession text,
  company text,
  links jsonb not null default '{}',
  contribution_score integer not null default 0 check (contribution_score >= 0),
  volunteer_hours numeric(10,2) not null default 0 check (volunteer_hours >= 0),
  navkar_count bigint not null default 0 check (navkar_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.declaration_signatures (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  declaration_version text not null references public.declaration_versions(version),
  country text not null,
  city text not null,
  profession text not null,
  organization text,
  signed_at timestamptz not null default now(),
  unique(profile_id, declaration_version)
);

create table public.directory_entries (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid references public.profiles(id) on delete set null,
  directory_type text not null check (directory_type in ('founder','student','professional','volunteer','mentor','sangh','temple','ngo')),
  name text not null,
  slug text not null unique,
  summary text not null,
  location jsonb not null default '{}',
  contact jsonb not null default '{}',
  metadata jsonb not null default '{}',
  verification_status verification_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_profile_id uuid references public.profiles(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location jsonb not null default '{}',
  capacity integer check (capacity is null or capacity > 0),
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.navkar_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  count integer not null check (count > 0),
  city text,
  country text,
  recorded_at timestamptz not null default now(),
  is_anonymous boolean not null default true
);

create index profiles_search_idx on public.profiles using gin (to_tsvector('english', coalesce(display_name,'') || ' ' || coalesce(profession,'') || ' ' || coalesce(company,'')));
create index directory_search_idx on public.directory_entries using gin (to_tsvector('english', name || ' ' || summary));
create index events_time_idx on public.events (starts_at, ends_at);
create index navkar_geo_time_idx on public.navkar_entries (country, city, recorded_at);

alter table public.profiles enable row level security;
alter table public.declaration_signatures enable row level security;
alter table public.directory_entries enable row level security;
alter table public.events enable row level security;
alter table public.navkar_entries enable row level security;

create policy "Public profiles are readable" on public.profiles for select using (true);
create policy "Public signatures are readable" on public.declaration_signatures for select using (true);
create policy "Verified directories are readable" on public.directory_entries for select using (verification_status = 'verified');
create policy "Events are readable" on public.events for select using (true);
create policy "Anonymous Navkar aggregates are readable" on public.navkar_entries for select using (is_anonymous = true);
