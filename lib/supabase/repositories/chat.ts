import { getSupabaseServerClient } from '../server';
import type { ChatConversation, ChatConversationInsert, ChatConversationUpdate, ChatParticipant, ChatParticipantInsert, ChatParticipantUpdate, ChatMessage, ChatMessageInsert, ChatMessageUpdate, ChatReaction, ChatReactionInsert } from '../types';

export async function listUserConversations(profileId: string): Promise<ChatConversation[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from('chat_conversations')
    .select('*, chat_participants!inner(*)')
    .eq('chat_participants.profile_id', profileId)
    .order('created_at', { ascending: false });
  return (data ?? []) as ChatConversation[];
}

export async function getConversation(id: string): Promise<ChatConversation | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('chat_conversations').select('*').eq('id', id).maybeSingle();
  return data as ChatConversation | null;
}

export async function createConversation(input: ChatConversationInsert): Promise<ChatConversation | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('chat_conversations') as any).insert(input).select().maybeSingle();
  return data as ChatConversation | null;
}

export async function updateConversation(id: string, updates: ChatConversationUpdate): Promise<ChatConversation | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('chat_conversations') as any).update(updates).eq('id', id).select().maybeSingle();
  return data as ChatConversation | null;
}

export async function getConversationParticipants(conversationId: string): Promise<ChatParticipant[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('chat_participants').select('*').eq('conversation_id', conversationId);
  return (data ?? []) as ChatParticipant[];
}

export async function addParticipant(input: ChatParticipantInsert): Promise<ChatParticipant | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('chat_participants') as any).insert(input).select().maybeSingle();
  return data as ChatParticipant | null;
}

export async function updateParticipant(conversationId: string, profileId: string, updates: ChatParticipantUpdate): Promise<ChatParticipant | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('chat_participants') as any).update(updates).eq('conversation_id', conversationId).eq('profile_id', profileId).select().maybeSingle();
  return data as ChatParticipant | null;
}

export async function removeParticipant(conversationId: string, profileId: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase.from('chat_participants').delete().eq('conversation_id', conversationId).eq('profile_id', profileId);
}

export async function listMessages(conversationId: string, options: { limit?: number; before?: string } = {}): Promise<ChatMessage[]> {
  const supabase = getSupabaseServerClient();
  const limit = options.limit ?? 50;

  let query = supabase.from('chat_messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: false }).limit(limit);

  if (options.before) query = query.lt('created_at', options.before);

  const { data } = await query;
  return ((data ?? []) as ChatMessage[]).reverse();
}

export async function sendMessage(input: ChatMessageInsert): Promise<ChatMessage | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('chat_messages') as any).insert(input).select().maybeSingle();
  return data as ChatMessage | null;
}

export async function updateMessage(id: string, updates: ChatMessageUpdate): Promise<ChatMessage | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('chat_messages') as any).update(updates).eq('id', id).select().maybeSingle();
  return data as ChatMessage | null;
}

export async function getMessageReactions(messageId: string): Promise<ChatReaction[]> {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.from('chat_reactions').select('*').eq('message_id', messageId);
  return (data ?? []) as ChatReaction[];
}

export async function addReaction(input: ChatReactionInsert): Promise<ChatReaction | null> {
  const supabase = getSupabaseServerClient();
  const { data } = await (supabase.from('chat_reactions') as any).insert(input).select().maybeSingle();
  return data as ChatReaction | null;
}

export async function removeReaction(messageId: string, profileId: string, emoji: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  await supabase.from('chat_reactions').delete().eq('message_id', messageId).eq('profile_id', profileId).eq('emoji', emoji);
}
