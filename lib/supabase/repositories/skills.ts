import { getSupabaseServerClient } from '../server';
import type { Skill, SkillInsert, SkillUpdate } from '../types';

export async function listSkills(profileId: string): Promise<Skill[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('skills').select('*').eq('profile_id', profileId).order('proficiency', { ascending: false });
  return (data ?? []) as Skill[];
}

export async function addSkill(input: SkillInsert): Promise<Skill | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('skills') as any).insert(input).select().maybeSingle();
  return data as Skill | null;
}

export async function updateSkill(id: string, updates: SkillUpdate): Promise<Skill | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('skills') as any).update(updates).eq('id', id).select().maybeSingle();
  return data as Skill | null;
}

export async function removeSkill(id: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  await (supabase.from('skills') as any).delete().eq('id', id);
}
