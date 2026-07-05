-- Diary Security (separate from profiles)
create table public.diary_security (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique not null references public.profiles(id) on delete cascade,
  pin_hash text,
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  recovery_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Diary Tags (shared across entries)
create table public.diary_tags (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  color text default '#f97316',
  unique(profile_id, name)
);

-- Diary Attachments
create table public.diary_attachments (
  id uuid primary key default gen_random_uuid(),
  diary_entry_id uuid not null references public.diary_entries(id) on delete cascade,
  file_url text not null,
  file_type text not null,
  file_name text not null,
  file_size integer,
  created_at timestamptz not null default now()
);

-- Diary Reminders
create table public.diary_reminders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Write in your diary',
  time time not null,
  frequency text not null default 'daily',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Diary Moods (standalone mood tracking)
create table public.diary_moods (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  mood text not null,
  note text,
  entry_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique(profile_id, entry_date)
);

-- Diary AI Summaries
create table public.diary_ai_summaries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  summary_type text not null check (summary_type in ('weekly', 'monthly', 'yearly', 'mood_trends', 'gratitude', 'goals', 'learning')),
  period_start date not null,
  period_end date not null,
  content text not null,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  unique(profile_id, summary_type, period_start, period_end)
);

-- Add version_id to diary_entries for current live version
alter table public.diary_entries add column if not exists current_version_id uuid;

-- RLS
alter table public.diary_security enable row level security;
alter table public.diary_tags enable row level security;
alter table public.diary_attachments enable row level security;
alter table public.diary_reminders enable row level security;
alter table public.diary_moods enable row level security;
alter table public.diary_ai_summaries enable row level security;

-- Diary security: owner only
create policy "Owner can manage diary security" on public.diary_security for all using (profile_id = auth.uid());
-- Diary tags: owner only
create policy "Owner can manage diary tags" on public.diary_tags for all using (profile_id = auth.uid());
-- Diary attachments: owner only
create policy "Owner can manage diary attachments" on public.diary_attachments for all using (diary_entry_id in (select id from public.diary_entries where profile_id = auth.uid()));
-- Diary reminders: owner only
create policy "Owner can manage diary reminders" on public.diary_reminders for all using (profile_id = auth.uid());
-- Diary moods: owner only
create policy "Owner can manage diary moods" on public.diary_moods for all using (profile_id = auth.uid());
-- Diary AI summaries: owner only
create policy "Owner can view diary AI summaries" on public.diary_ai_summaries for all using (profile_id = auth.uid());
