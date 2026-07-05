-- ============================================================
-- SEED DATA FOR JAINZBHARAT
-- ============================================================

-- Declaration versions
insert into public.declaration_versions (version, published_at, body, changelog, is_current)
values (
  'v1.0',
  '2026-07-04T00:00:00Z',
  '{
    "title": "Founding Declaration",
    "preamble": "We, the Jain diaspora and friends of Jain values, declare our commitment to a world where compassion, truth, and responsible innovation guide humanity.",
    "principles": [
      "Compassion without exclusion",
      "Truth with humility",
      "Responsible innovation",
      "Service before status",
      "Non-possession in purpose",
      "Discipline for freedom",
      "Equality in practice",
      "Forgiveness as strength",
      "Knowledge without arrogance",
      "Action with awareness"
    ],
    "commitments": [
      "Live ahimsa in daily choices",
      "Speak and share truthfully",
      "Innovate with conscience",
      "Serve communities selflessly",
      "Detach from excess",
      "Maintain daily discipline",
      "Treat all beings equally",
      "Practice forgiveness",
      "Pursue knowledge humbly",
      "Act with mindfulness"
    ]
  }',
  '[{"date": "2026-07-04", "change": "Initial publication of the Founding Declaration"}]',
  true
)
on conflict (version) do update set is_current = excluded.is_current;

-- Seed profiles (for development/demo)
insert into public.profiles (clerk_user_id, jainz_id, role, display_name, bio, country, city, profession, company, contribution_score, volunteer_hours, navkar_count)
values
  ('seed_admin_001', 'JZB-2026-000001', 'super_admin', 'Acharya Sushil', 'Founding visionary of JainZBharat', 'India', 'Mumbai', 'Spiritual Leader', 'JainZBharat Foundation', 5000, 1200, 50000),
  ('seed_mod_001', 'JZB-2026-000002', 'moderator', 'Priya Jain', 'Community moderator and organizer', 'United States', 'San Jose', 'Software Engineer', 'Tech Corp', 2500, 800, 15000),
  ('seed_member_001', 'JZB-2026-000003', 'member', 'Rajesh Shah', 'Proud Jain community member', 'United Kingdom', 'London', 'Entrepreneur', 'Shah Enterprises', 500, 200, 5000)
on conflict (clerk_user_id) do nothing;

-- Seed badges
insert into public.badges (profile_id, badge_type, name, description)
select p.id, 'declaration_signer', 'Declaration Signatory', 'Signed the JainZBharat Founding Declaration'
from public.profiles p
where p.clerk_user_id = 'seed_admin_001'
on conflict (profile_id, badge_type) do nothing;

-- Seed declaration signatures
insert into public.declaration_signatures (profile_id, declaration_version, country, city, profession, organization)
select p.id, 'v1.0', p.country, p.city, p.profession, p.company
from public.profiles p
where p.clerk_user_id = 'seed_admin_001'
on conflict (profile_id, declaration_version) do nothing;

-- Seed directory entries
insert into public.directory_entries (owner_profile_id, directory_type, name, slug, summary, contact, verification_status)
select p.id, 'sangh', 'Mumbai Jain Sangh', 'mumbai-jain-sangh',
  'The premier Jain spiritual and cultural center serving Mumbai since 1950.',
  '{"email": "contact@mumbaijainsangh.org", "phone": "+91-22-1234-5678"}', 'verified'
from public.profiles p
where p.clerk_user_id = 'seed_admin_001'
on conflict (slug) do nothing;

insert into public.directory_entries (owner_profile_id, directory_type, name, slug, summary, location, verification_status)
select p.id, 'temple', 'Shri Mahavir Temple', 'shri-mahavir-temple',
  'Ancient Jain temple dedicated to Lord Mahavir.',
  '{"country": "India", "city": "Mumbai", "address": "123 Temple Road"}', 'verified'
from public.profiles p
where p.clerk_user_id = 'seed_admin_001'
on conflict (slug) do nothing;

-- Seed organizations
insert into public.organizations (name, slug, description, country, city, website, verification_status)
values
  ('JainZBharat Foundation', 'jainzbharat-foundation', 'Global foundation uniting the Jain diaspora', 'United States', 'San Jose', 'https://jainzbharat.org', 'verified'),
  ('Ahimsa Global Network', 'ahimsa-global-network', 'Promoting non-violence and compassion worldwide', 'India', 'Delhi', 'https://ahimsaglobal.org', 'verified'),
  ('Young Jains of America', 'young-jains-america', 'Connecting young Jains across North America', 'United States', 'New York', 'https://youngjains.org', 'verified')
on conflict (slug) do nothing;

-- Seed sanghs
insert into public.sanghs (name, slug, description, country, city, member_count, verification_status)
values
  ('Silicon Valley Jain Sangh', 'silicon-valley-jain-sangh', 'Active Jain community in the Bay Area', 'United States', 'San Jose', 500, 'verified'),
  ('London Jain Centre', 'london-jain-centre', 'Historic Jain center in the UK capital', 'United Kingdom', 'London', 1200, 'verified'),
  ('Bangalore Jain Samaj', 'bangalore-jain-samaj', 'Vibrant Jain community in India''s tech hub', 'India', 'Bangalore', 3000, 'verified')
on conflict (slug) do nothing;

-- Seed events
insert into public.events (title, slug, description, starts_at, ends_at, location, capacity)
values
  ('Navkar Mahotsav 2026', 'navkar-mahotsav-2026', 'Annual global Navkar chant-a-thon uniting Jains worldwide', '2026-10-01T06:00:00Z', '2026-10-01T18:00:00Z', '{"type": "virtual", "platform": "Zoom"}', 10000),
  ('Jain Philosophy Summit', 'jain-philosophy-summit-2026', 'Three-day conference on Jain philosophy in the modern world', '2026-11-15T09:00:00Z', '2026-11-17T17:00:00Z', '{"country": "India", "city": "Mumbai", "venue": "Convention Centre"}', 500),
  ('Ahimsa Walk 2026', 'ahimsa-walk-2026', 'Community walk promoting non-violence and environmental awareness', '2026-12-05T07:00:00Z', '2026-12-05T12:00:00Z', '{"country": "United States", "city": "San Francisco", "route": "Golden Gate Park"}', 2000)
on conflict (slug) do nothing;

-- Seed projects
insert into public.projects (name, slug, description, status, country, city, volunteers_needed, tags)
values
  ('Digital Jain Library', 'digital-jain-library', 'Building a comprehensive digital archive of Jain scriptures and texts', 'active', 'Global', 'Virtual', 50, array['education', 'technology', 'preservation']),
  ('Jain Youth Mentorship', 'jain-youth-mentorship', 'Connecting Jain youth with mentors across professions', 'active', 'Global', 'Virtual', 100, array['mentorship', 'youth', 'career']),
  ('Eco Ahimsa Initiative', 'eco-ahimsa-initiative', 'Environmental conservation projects inspired by Jain principles', 'planning', 'India', 'Multiple Cities', 200, array['environment', 'community', 'sustainability'])
on conflict (slug) do nothing;

-- Seed founders
insert into public.founders (profile_id, title, bio, contribution, priority)
select p.id, 'Founding Visionary',
  'Creator of the JainZBharat vision — a global platform uniting the Jain diaspora through technology, spirituality, and community action.',
  'Architected the JainZBharat platform, authored the Founding Declaration, and established the initial community framework.',
  1
from public.profiles p
where p.clerk_user_id = 'seed_admin_001'
on conflict (profile_id) do nothing;

-- Seed navkar entries
insert into public.navkar_entries (profile_id, count, city, country, is_anonymous)
select p.id, 108, p.city, p.country, false
from public.profiles p
where p.clerk_user_id = 'seed_admin_001';

-- Seed temples
insert into public.temples (name, slug, description, country, city, deities, traditions, verification_status)
values
  ('Shri Mahavir Mandir', 'shri-mahavir-mandir', 'Historic Mahavir temple in the heart of Patna', 'India', 'Patna', array['Mahavir'], array['Digambara'], 'verified'),
  ('Shri Parshavnath Temple', 'shri-parshavnath-temple', 'Ancient Parshavnath temple with intricate marble carvings', 'India', 'Kolkata', array['Parshavnath'], array['Svetambara'], 'verified'),
  ('Jain Center of Southern California', 'jain-center-socal', 'Modern Jain temple and cultural center', 'United States', 'Los Angeles', array['Mahavir', 'Parshavnath'], array['Svetambara', 'Digambara'], 'verified')
on conflict (slug) do nothing;

-- Seed navkar sessions (for profile navkar tracking)
insert into public.navkar_sessions (profile_id, count, duration_seconds, intention)
select p.id, 108, 600, 'Peace and harmony for all beings'
from public.profiles p
where p.clerk_user_id = 'seed_admin_001';

-- Seed achievements
insert into public.achievements (profile_id, achievement_type, name, description, points)
select p.id, 'badge', 'Founder', 'Recognized as a founding member of JainZBharat', 100
from public.profiles p
where p.clerk_user_id = 'seed_admin_001'
on conflict do nothing;
