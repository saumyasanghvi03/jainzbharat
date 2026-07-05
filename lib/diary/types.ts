export type DiaryPrivacy = 'private' | 'friends' | 'community' | 'public';
export type DiaryJournalType = 'personal' | 'learning' | 'reading' | 'meditation' | 'volunteer' | 'gratitude' | 'reflection' | 'travel' | 'startup' | 'idea' | 'dream';

export interface LocalDiaryEntry {
  id: string;
  title: string;
  content: string;
  mood: string | null;
  gratitude: string | null;
  goals: string | null;
  reflections: string | null;
  journal_type: DiaryJournalType;
  privacy: DiaryPrivacy;
  is_highlight: boolean;
  highlight_summary: string | null;
  highlight_media: { url: string; type: string; name: string }[];
  tags: string[];
  entry_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  version: number;
}

export interface LocalDiaryDraft {
  id: string;
  title: string | null;
  content: string | null;
  mood: string | null;
  gratitude: string | null;
  goals: string | null;
  reflections: string | null;
  journal_type: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface LocalDiaryVersion {
  id: string;
  entry_id: string;
  title: string;
  content: string;
  version: number;
  created_at: string;
}

export interface DiarySearchResult {
  entry: LocalDiaryEntry;
  relevance: number;
}

export interface DiaryHeatmapDay {
  date: string;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export const MOOD_OPTIONS = [
  { value: 'peaceful', label: 'Peaceful', emoji: '🕊', color: 'text-purple-400' },
  { value: 'grateful', label: 'Grateful', emoji: '🙏', color: 'text-red-400' },
  { value: 'happy', label: 'Happy', emoji: '😊', color: 'text-green-400' },
  { value: 'reflective', label: 'Reflective', emoji: '🧘', color: 'text-blue-400' },
  { value: 'excited', label: 'Excited', emoji: '✨', color: 'text-orange-400' },
  { value: 'anxious', label: 'Anxious', emoji: '😰', color: 'text-yellow-400' },
  { value: 'sad', label: 'Sad', emoji: '😢', color: 'text-gray-400' },
  { value: 'inspired', label: 'Inspired', emoji: '💡', color: 'text-cyan-400' },
];

export const JOURNAL_TYPES: { value: DiaryJournalType; label: string; icon: string }[] = [
  { value: 'personal', label: 'Personal', icon: '📝' },
  { value: 'learning', label: 'Learning', icon: '📚' },
  { value: 'reading', label: 'Reading', icon: '📖' },
  { value: 'meditation', label: 'Meditation', icon: '🧘' },
  { value: 'volunteer', label: 'Volunteer', icon: '🤝' },
  { value: 'gratitude', label: 'Gratitude', icon: '🙏' },
  { value: 'reflection', label: 'Reflection', icon: '🪞' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'startup', label: 'Startup', icon: '🚀' },
  { value: 'idea', label: 'Idea', icon: '💡' },
  { value: 'dream', label: 'Dream', icon: '🌙' },
];

export const PRIVACY_OPTIONS: { value: DiaryPrivacy; label: string; description: string }[] = [
  { value: 'private', label: 'Private', description: 'Only you can see this entry' },
  { value: 'friends', label: 'Friends', description: 'Only friends can see this entry' },
  { value: 'community', label: 'Community', description: 'Community members can see this entry' },
  { value: 'public', label: 'Public', description: 'Anyone can see this entry' },
];
