create type diary_privacy as enum ('private', 'friends', 'community', 'public');
create type diary_journal_type as enum ('personal', 'learning', 'reading', 'meditation', 'volunteer', 'gratitude', 'reflection');

create table public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null default '',
  content_encrypted boolean not null default false,
  mood text,
  gratitude text,
  goals text,
  reflections text,
  journal_type diary_journal_type not null default 'personal',
  privacy diary_privacy not null default 'private',
  is_highlight boolean not null default false,
  highlight_summary text,
  highlight_media jsonb not null default '[]',
  tags text[] not null default '{}',
  published_at timestamptz,
  entry_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.diary_drafts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  content text,
  mood text,
  gratitude text,
  goals text,
  reflections text,
  journal_type text default 'personal',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index diary_entries_profile_date_idx on public.diary_entries (profile_id, entry_date desc);
create index diary_entries_tags_idx on public.diary_entries using gin (tags);
create index diary_entries_highlights_idx on public.diary_entries (profile_id, is_highlight) where is_highlight = true;

alter table public.diary_entries enable row level security;
alter table public.diary_drafts enable row level security;

create policy "Users can read own diary entries" on public.diary_entries for select using (profile_id = auth.uid());
create policy "Users can insert own diary entries" on public.diary_entries for insert with check (profile_id = auth.uid());
create policy "Users can update own diary entries" on public.diary_entries for update using (profile_id = auth.uid());
create policy "Users can delete own diary entries" on public.diary_entries for delete using (profile_id = auth.uid());

create policy "Users can read own drafts" on public.diary_drafts for select using (profile_id = auth.uid());
create policy "Users can insert own drafts" on public.diary_drafts for insert with check (profile_id = auth.uid());
create policy "Users can update own drafts" on public.diary_drafts for update using (profile_id = auth.uid());
create policy "Users can delete own drafts" on public.diary_drafts for delete using (profile_id = auth.uid());
