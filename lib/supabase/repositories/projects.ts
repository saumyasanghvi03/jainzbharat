import { getSupabaseServerClient } from '../server';
import type { Project, ProjectInsert, ProjectUpdate, ProjectStatus } from '../types';

export interface ListProjectsOptions {
  limit?: number;
  offset?: number;
  status?: ProjectStatus;
  country?: string;
  ownerId?: string;
  query?: string;
  tags?: string[];
}

export async function listProjects(options: ListProjectsOptions = {}): Promise<{ data: Project[]; total: number }> {
  const supabase = getSupabaseServerClient();
  const limit = options.limit ?? 30;
  const offset = options.offset ?? 0;

  let query = supabase.from('projects').select('*', { count: 'exact' });
  if (options.status) query = query.eq('status', options.status);
  if (options.country) query = query.eq('country', options.country);
  if (options.ownerId) query = query.eq('owner_profile_id', options.ownerId);
  if (options.query) query = query.ilike('name', `%${options.query}%`);
  if (options.tags && options.tags.length > 0) query = query.contains('tags', options.tags);

  const { data, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
  return { data: (data ?? []) as Project[], total: count ?? 0 };
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
  return data as Project | null;
}

export async function createProject(input: ProjectInsert): Promise<Project | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('projects') as any).insert(input).select().maybeSingle();
  return data as Project | null;
}

export async function updateProject(slug: string, updates: ProjectUpdate): Promise<Project | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('projects') as any).update(updates).eq('slug', slug).select().maybeSingle();
  return data as Project | null;
}
