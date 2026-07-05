'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useEffect, useState } from 'react';
import { Eye, EyeOff, Users, Globe, Search, Loader2 } from 'lucide-react';

interface VisibilitySettings {
  profile_visibility: 'public' | 'members' | 'private';
  show_email: boolean;
  show_phone: boolean;
  show_location: boolean;
  show_links: boolean;
  searchable: boolean;
}

interface FieldVisibility {
  key: keyof Omit<VisibilitySettings, 'profile_visibility' | 'searchable'>;
  label: string;
  description: string;
}

const fieldVisibilities: FieldVisibility[] = [
  { key: 'show_email', label: 'Email', description: 'Show your email on your public profile' },
  { key: 'show_phone', label: 'Phone', description: 'Show your phone number on your public profile' },
  { key: 'show_location', label: 'Location', description: 'Show your city and country on your public profile' },
  { key: 'show_links', label: 'Social Links', description: 'Show your social media links on your public profile' },
];

export default function SettingsPrivacyPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettings] = useState<VisibilitySettings>({
    profile_visibility: 'public',
    show_email: false,
    show_phone: false,
    show_location: true,
    show_links: true,
    searchable: true,
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const res = await fetch('/api/profile/data');
        const data = await res.json();
        if (data.profile?.links) {
          const pv = data.profile.links.privacy;
          if (pv) {
            setSettings((prev) => ({ ...prev, ...pv }));
          }
        }
      } catch { /* ignore */ }
      setLoaded(true);
    };
    load();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          links: { privacy: settings },
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      toast('Privacy settings saved', 'success');
    } catch {
      toast('Failed to save privacy settings', 'error');
    }
    setSaving(false);
  };

  if (!isLoaded || !isSignedIn || !loaded) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Profile Visibility</h2>
        <p className="mt-1 text-sm text-muted-foreground">Control who can see your profile</p>
        <div className="mt-4 space-y-3">
          {([
            { value: 'public' as const, icon: Globe, label: 'Public', desc: 'Anyone on the internet can see your profile' },
            { value: 'members' as const, icon: Users, label: 'Members Only', desc: 'Only signed-in members can see your profile' },
            { value: 'private' as const, icon: EyeOff, label: 'Private', desc: 'Only you and platform admins can see your profile' },
          ]).map(({ value, icon: Icon, label, desc }) => (
            <label key={value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${settings.profile_visibility === value ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent'}`}>
              <input type="radio" name="visibility" value={value} checked={settings.profile_visibility === value} onChange={() => setSettings(prev => ({ ...prev, profile_visibility: value }))} className="mt-1 accent-primary" />
              <div>
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-primary" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Field Visibility</h2>
        <p className="mt-1 text-sm text-muted-foreground">Control which fields appear on your public profile</p>
        <div className="mt-4 space-y-3">
          {fieldVisibilities.map(({ key, label, description }) => (
            <label key={key} className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 transition hover:bg-accent">
              <div>
                <span className="text-sm font-medium">{label}</span>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <input type="checkbox" checked={settings[key]} onChange={() => setSettings(prev => ({ ...prev, [key]: !prev[key] }))} className="accent-primary size-5" />
            </label>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Search</h2>
        <p className="mt-1 text-sm text-muted-foreground">Control how your profile appears in search</p>
        <div className="mt-4">
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 transition hover:bg-accent">
            <div className="flex items-center gap-3">
              <Search className="size-4 text-primary" />
              <div>
                <span className="text-sm font-medium">Search Engine Indexing</span>
                <p className="text-xs text-muted-foreground">Allow search engines to index your profile</p>
              </div>
            </div>
            <input type="checkbox" checked={settings.searchable} onChange={() => setSettings(prev => ({ ...prev, searchable: !prev.searchable }))} className="accent-primary size-5" />
          </label>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save Privacy Settings
        </Button>
      </div>
    </div>
  );
}
