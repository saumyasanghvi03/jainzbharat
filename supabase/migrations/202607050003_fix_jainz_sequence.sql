-- Fix JainZ ID: renumber profiles to start from 002 (001 reserved for admin)

-- Move seed demo profiles to high numbers to free 001, 002, 003
update public.profiles set jainz_id = 'JZB-2026-000999' where clerk_user_id = 'seed_admin_001' and jainz_id = 'JZB-2026-000001';
update public.profiles set jainz_id = 'JZB-2026-001000' where clerk_user_id = 'seed_mod_001' and jainz_id = 'JZB-2026-000002';
update public.profiles set jainz_id = 'JZB-2026-001001' where clerk_user_id = 'seed_member_001' and jainz_id = 'JZB-2026-000003';

-- Renumber remaining real profiles sequentially starting from 002
with numbered as (
  select id, row_number() over (order by created_at) + 1 as new_seq
  from public.profiles
  where jainz_id not in ('JZB-2026-000999', 'JZB-2026-001000', 'JZB-2026-001001')
    and clerk_user_id not like 'seed_%'
)
update public.profiles p
set jainz_id = 'JZB-2026-' || lpad(n.new_seq::text, 6, '0')
from numbered n
where p.id = n.id
  and p.jainz_id != 'JZB-2026-' || lpad(n.new_seq::text, 6, '0');

-- Reset the sequence to continue from the max id + 1
select setval('public.jainz_id_sequence', coalesce(
  (select max(regexp_replace(jainz_id, 'JZB-\d+-0*', '')::integer) from public.profiles where jainz_id ~ '^JZB-\d{4}-\d{6}$'),
  1001
));

-- Ensure the JainZBharat founder club exists
insert into public.clubs (name, slug, description, mission, privacy, founder_id, member_count, verification_status)
select
  'JainZBharat',
  'jainzbharat',
  'The official JainZBharat community club. Founded by Saumya Sanghvi to unite the Jain diaspora and friends of Jain values.',
  'Build the world''s largest digital ecosystem inspired by Jain philosophy — open to everyone.',
  'public',
  id,
  1,
  'verified'
from public.profiles
where clerk_user_id in ('seed_admin_001')
  and not exists (select 1 from public.clubs where slug = 'jainzbharat')
on conflict (slug) do nothing;
