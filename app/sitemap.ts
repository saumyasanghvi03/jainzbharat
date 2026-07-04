import type { MetadataRoute } from 'next';
import { platformModules, site } from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap { const now = new Date(); return ['','about','declaration','signing-wall', ...platformModules.map((m) => m.slug)].map((path) => ({ url: `${site.domain}/${path}`, lastModified: now, changeFrequency: 'weekly', priority: path === '' ? 1 : 0.8 })); }
