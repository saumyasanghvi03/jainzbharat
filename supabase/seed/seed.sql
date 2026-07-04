insert into public.declaration_versions (version, published_at, body, changelog, is_current)
values ('v1.0', '2026-07-04T00:00:00Z', '{"title":"Founding Declaration","principles":["Compassion without exclusion","Truth with humility","Responsible innovation","Service before status"]}', '[]', true)
on conflict (version) do update set is_current = excluded.is_current;
