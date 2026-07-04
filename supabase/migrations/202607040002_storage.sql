insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 2097152, array['image/jpeg','image/png','image/webp']),
  ('certificates', 'certificates', false, 5242880, array['application/pdf']),
  ('event-galleries', 'event-galleries', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
