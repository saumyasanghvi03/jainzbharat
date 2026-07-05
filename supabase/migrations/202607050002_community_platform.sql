-- Community Platform: Clubs, Kalyanmitra, Organizations, Forum, Chat, Feeds & Events

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  mission text,
  logo_url text,
  banner_url text,
  privacy text check (privacy in ('public','private')),
  founder_id uuid references public.profiles(id) on delete cascade,
  member_count integer default 0,
  verification_status verification_status default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.club_members (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references public.clubs(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  role text check (role in ('owner','admin','moderator','member')),
  status text check (status in ('active','pending','banned')) default 'pending',
  joined_at timestamptz default now(),
  unique(club_id, profile_id)
);

create table public.kalyanmitra_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  category text check (category in ('blood_donation','education','animal_welfare','healthcare','temple_service','disaster_relief','environment','food_distribution','community_service')),
  logo_url text,
  banner_url text,
  founder_id uuid references public.profiles(id) on delete cascade,
  member_count integer default 0,
  city text,
  country text,
  verification_status verification_status default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.kalyanmitra_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.kalyanmitra_groups(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  role text check (role in ('owner','admin','moderator','member')),
  status text check (status in ('active','pending','banned')) default 'pending',
  volunteer_hours numeric(10,2) default 0,
  joined_at timestamptz default now(),
  unique(group_id, profile_id)
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text check (type in ('sangh','temple','trust','ngo','startup','institution','university')),
  description text,
  logo_url text,
  website text,
  country text,
  city text,
  founder_profile_id uuid references public.profiles(id) on delete set null,
  verification_status verification_status default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  role text check (role in ('owner','admin','member')),
  status text check (status in ('active','pending','banned')) default 'pending',
  joined_at timestamptz default now(),
  unique(organization_id, profile_id)
);

create table public.forum_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  sort_order integer default 0,
  club_id uuid references public.clubs(id) on delete cascade,
  created_at timestamptz default now()
);

create table public.forum_topics (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.forum_categories(id) on delete cascade,
  title text not null,
  slug text not null,
  author_id uuid references public.profiles(id) on delete cascade,
  pinned boolean default false,
  solved boolean default false,
  view_count integer default 0,
  reply_count integer default 0,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.forum_topics(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  is_first_post boolean default false,
  upvotes integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.forum_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.forum_posts(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(post_id, profile_id)
);

create table public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('direct','group','club','event')),
  name text,
  club_id uuid references public.clubs(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  created_at timestamptz default now()
);

create table public.chat_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.chat_conversations(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  last_read_at timestamptz,
  is_online boolean default false,
  joined_at timestamptz default now(),
  unique(conversation_id, profile_id)
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.chat_conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  message_type text check (message_type in ('text','image','file','gif','system')) default 'text',
  file_url text,
  reply_to_id uuid references public.chat_messages(id) on delete set null,
  created_at timestamptz default now()
);

create table public.chat_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references public.chat_messages(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  emoji text not null,
  created_at timestamptz default now(),
  unique(message_id, profile_id, emoji)
);

create table public.community_feeds (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  feed_type text check (feed_type in ('announcement','post','event','volunteer','club','discussion')),
  title text not null,
  content text,
  link text,
  source_id text,
  created_at timestamptz default now()
);

create table public.event_submissions (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  slug text unique not null,
  description text not null,
  category text check (category in ('conference','hackathon','retreat','networking','workshop','seminar','cultural','other')),
  venue text,
  google_maps_link text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer,
  registration_link text,
  banner_url text,
  tags text[] default '{}',
  status text check (status in ('draft','submitted','approved','published','completed','cancelled')) default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes

create index club_members_club_profile_idx on public.club_members (club_id, profile_id);
create index club_members_profile_idx on public.club_members (profile_id);

create index kalyanmitra_members_group_profile_idx on public.kalyanmitra_members (group_id, profile_id);
create index kalyanmitra_members_profile_idx on public.kalyanmitra_members (profile_id);

create index organization_members_org_profile_idx on public.organization_members (organization_id, profile_id);
create index organization_members_profile_idx on public.organization_members (profile_id);

create index forum_topics_category_created_idx on public.forum_topics (category_id, created_at);
create index forum_topics_author_idx on public.forum_topics (author_id);

create index forum_posts_topic_created_idx on public.forum_posts (topic_id, created_at);

create index chat_messages_conversation_created_idx on public.chat_messages (conversation_id, created_at);

create index chat_participants_profile_idx on public.chat_participants (profile_id);
create index chat_participants_conversation_idx on public.chat_participants (conversation_id);

create index community_feeds_profile_created_idx on public.community_feeds (profile_id, created_at);

create index event_submissions_organizer_idx on public.event_submissions (organizer_id);
create index event_submissions_status_starts_idx on public.event_submissions (status, starts_at);

-- Row Level Security

alter table public.clubs enable row level security;
alter table public.club_members enable row level security;
alter table public.kalyanmitra_groups enable row level security;
alter table public.kalyanmitra_members enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.forum_categories enable row level security;
alter table public.forum_topics enable row level security;
alter table public.forum_posts enable row level security;
alter table public.forum_likes enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_participants enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_reactions enable row level security;
alter table public.community_feeds enable row level security;
alter table public.event_submissions enable row level security;

-- RLS Policies

create policy "Verified clubs are readable" on public.clubs for select using (verification_status = 'verified');
create policy "Members can insert clubs" on public.clubs for insert with check (auth.role() = 'authenticated');
create policy "Founders and admins can update clubs" on public.clubs for update using (founder_id = auth.uid() or exists (select 1 from public.club_members where club_id = clubs.id and profile_id = auth.uid() and role in ('owner','admin','moderator')));
create policy "Founders and admins can delete clubs" on public.clubs for delete using (founder_id = auth.uid() or exists (select 1 from public.club_members where club_id = clubs.id and profile_id = auth.uid() and role in ('owner','admin')));

create policy "Members can view club memberships" on public.club_members for select using (status = 'active' or profile_id = auth.uid());
create policy "Authenticated users can request to join" on public.club_members for insert with check (auth.role() = 'authenticated');
create policy "Owners and admins can update members" on public.club_members for update using (exists (select 1 from public.club_members cm where cm.club_id = club_members.club_id and cm.profile_id = auth.uid() and cm.role in ('owner','admin','moderator')));
create policy "Owners and admins can delete members" on public.club_members for delete using (exists (select 1 from public.club_members cm where cm.club_id = club_members.club_id and cm.profile_id = auth.uid() and cm.role in ('owner','admin')));

create policy "Verified kalyanmitra groups are readable" on public.kalyanmitra_groups for select using (verification_status = 'verified');
create policy "Authenticated users can insert groups" on public.kalyanmitra_groups for insert with check (auth.role() = 'authenticated');
create policy "Founders and admins can update groups" on public.kalyanmitra_groups for update using (founder_id = auth.uid() or exists (select 1 from public.kalyanmitra_members where group_id = kalyanmitra_groups.id and profile_id = auth.uid() and role in ('owner','admin','moderator')));
create policy "Founders and admins can delete groups" on public.kalyanmitra_groups for delete using (founder_id = auth.uid() or exists (select 1 from public.kalyanmitra_members where group_id = kalyanmitra_groups.id and profile_id = auth.uid() and role in ('owner','admin')));

create policy "Active kalyanmitra members are readable" on public.kalyanmitra_members for select using (status = 'active' or profile_id = auth.uid());
create policy "Authenticated users can request to join" on public.kalyanmitra_members for insert with check (auth.role() = 'authenticated');
create policy "Owners and admins can update members" on public.kalyanmitra_members for update using (exists (select 1 from public.kalyanmitra_members km where km.group_id = kalyanmitra_members.group_id and km.profile_id = auth.uid() and km.role in ('owner','admin','moderator')));
create policy "Owners and admins can delete members" on public.kalyanmitra_members for delete using (exists (select 1 from public.kalyanmitra_members km where km.group_id = kalyanmitra_members.group_id and km.profile_id = auth.uid() and km.role in ('owner','admin')));

create policy "Verified organizations are readable" on public.organizations for select using (verification_status = 'verified');
create policy "Authenticated users can insert organizations" on public.organizations for insert with check (auth.role() = 'authenticated');
create policy "Founders and admins can update organizations" on public.organizations for update using (founder_profile_id = auth.uid() or exists (select 1 from public.organization_members where organization_id = organizations.id and profile_id = auth.uid() and role in ('owner','admin')));
create policy "Founders and admins can delete organizations" on public.organizations for delete using (founder_profile_id = auth.uid() or exists (select 1 from public.organization_members where organization_id = organizations.id and profile_id = auth.uid() and role in ('owner','admin')));

create policy "Active organization members are readable" on public.organization_members for select using (status = 'active' or profile_id = auth.uid());
create policy "Authenticated users can request to join" on public.organization_members for insert with check (auth.role() = 'authenticated');
create policy "Owners and admins can update members" on public.organization_members for update using (exists (select 1 from public.organization_members om where om.organization_id = organization_members.organization_id and om.profile_id = auth.uid() and om.role in ('owner','admin')));
create policy "Owners and admins can delete members" on public.organization_members for delete using (exists (select 1 from public.organization_members om where om.organization_id = organization_members.organization_id and om.profile_id = auth.uid() and om.role in ('owner','admin')));

create policy "Forum categories are readable" on public.forum_categories for select using (true);
create policy "Authenticated users can insert categories" on public.forum_categories for insert with check (auth.role() = 'authenticated');
create policy "Admins can update categories" on public.forum_categories for update using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','super_admin')));
create policy "Admins can delete categories" on public.forum_categories for delete using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','super_admin')));

create policy "Forum topics are readable" on public.forum_topics for select using (true);
create policy "Authenticated users can create topics" on public.forum_topics for insert with check (auth.role() = 'authenticated');
create policy "Authors and moderators can update topics" on public.forum_topics for update using (author_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','super_admin','moderator')));
create policy "Authors and admins can delete topics" on public.forum_topics for delete using (author_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','super_admin')));

create policy "Forum posts are readable" on public.forum_posts for select using (true);
create policy "Authenticated users can create posts" on public.forum_posts for insert with check (auth.role() = 'authenticated');
create policy "Authors and moderators can update posts" on public.forum_posts for update using (author_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','super_admin','moderator')));
create policy "Authors and admins can delete posts" on public.forum_posts for delete using (author_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','super_admin')));

create policy "Forum likes are readable" on public.forum_likes for select using (true);
create policy "Authenticated users can like posts" on public.forum_likes for insert with check (auth.role() = 'authenticated');
create policy "Users can update their own likes" on public.forum_likes for update using (profile_id = auth.uid());
create policy "Users can delete their own likes" on public.forum_likes for delete using (profile_id = auth.uid());

create policy "Participants can view conversations" on public.chat_conversations for select using (exists (select 1 from public.chat_participants where conversation_id = chat_conversations.id and profile_id = auth.uid()));
create policy "Authenticated users can create conversations" on public.chat_conversations for insert with check (auth.role() = 'authenticated');
create policy "Participants can update conversations" on public.chat_conversations for update using (exists (select 1 from public.chat_participants where conversation_id = chat_conversations.id and profile_id = auth.uid()));
create policy "Participants can delete conversations" on public.chat_conversations for delete using (exists (select 1 from public.chat_participants where conversation_id = chat_conversations.id and profile_id = auth.uid()));

create policy "Participants can see other participants" on public.chat_participants for select using (exists (select 1 from public.chat_participants cp where cp.conversation_id = chat_participants.conversation_id and cp.profile_id = auth.uid()));
create policy "Authenticated users can join conversations" on public.chat_participants for insert with check (auth.role() = 'authenticated');
create policy "Users can update their own participant status" on public.chat_participants for update using (profile_id = auth.uid());
create policy "Users can leave conversations" on public.chat_participants for delete using (profile_id = auth.uid());

create policy "Participants can read messages" on public.chat_messages for select using (exists (select 1 from public.chat_participants where conversation_id = chat_messages.conversation_id and profile_id = auth.uid()));
create policy "Participants can send messages" on public.chat_messages for insert with check (auth.role() = 'authenticated' and exists (select 1 from public.chat_participants where conversation_id = chat_messages.conversation_id and profile_id = auth.uid()));
create policy "Senders can update their messages" on public.chat_messages for update using (sender_id = auth.uid());
create policy "Senders can delete their messages" on public.chat_messages for delete using (sender_id = auth.uid());

create policy "Participants can see reactions" on public.chat_reactions for select using (exists (select 1 from public.chat_messages cm join public.chat_participants cp on cp.conversation_id = cm.conversation_id where cm.id = chat_reactions.message_id and cp.profile_id = auth.uid()));
create policy "Authenticated users can react" on public.chat_reactions for insert with check (auth.role() = 'authenticated');
create policy "Users can update their own reactions" on public.chat_reactions for update using (profile_id = auth.uid());
create policy "Users can remove their own reactions" on public.chat_reactions for delete using (profile_id = auth.uid());

create policy "Feeds are publicly readable" on public.community_feeds for select using (true);
create policy "Authenticated users can create feed items" on public.community_feeds for insert with check (auth.role() = 'authenticated');
create policy "Authors can update their feed items" on public.community_feeds for update using (profile_id = auth.uid());
create policy "Authors can delete their feed items" on public.community_feeds for delete using (profile_id = auth.uid());

create policy "Published events are readable" on public.event_submissions for select using (status in ('approved','published','completed') or organizer_id = auth.uid());
create policy "Authenticated users can submit events" on public.event_submissions for insert with check (auth.role() = 'authenticated');
create policy "Organizers and admins can update events" on public.event_submissions for update using (organizer_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','super_admin')));
create policy "Organizers and admins can delete events" on public.event_submissions for delete using (organizer_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','super_admin')));
