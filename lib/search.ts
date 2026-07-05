import { platformModules } from '@/lib/site';

export function searchPlatform(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return platformModules;
  return platformModules.filter((item) =>
    `${item.title} ${item.description}`.toLowerCase().includes(normalized),
  );
}
