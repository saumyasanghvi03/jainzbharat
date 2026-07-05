'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useEffect, useState } from 'react';
import {
  Bell, Mail, MessageSquare, Calendar, Users, Award, Megaphone, AtSign, CheckCircle, Loader2,
} from 'lucide-react';

interface NotificationPrefs {
  email: {
    community: boolean;
    events: boolean;
    mentions: boolean;
    messages: boolean;
    approvals: boolean;
    certificates: boolean;
  };
  push: {
    community: boolean;
    events: boolean;
    mentions: boolean;
    messages: boolean;
    approvals: boolean;
    certificates: boolean;
  };
}

interface NotificationGroup {
  key: string;
  label: string;
  icon: typeof Bell;
  description: string;
}

const notificationGroups: NotificationGroup[] = [
  { key: 'community', label: 'Community', icon: Users, description: 'New members, club activity, discussion replies' },
  { key: 'events', label: 'Events', icon: Calendar, description: 'Event reminders, updates, and invitations' },
  { key: 'mentions', label: 'Mentions', icon: AtSign, description: 'When someone mentions you' },
  { key: 'messages', label: 'Messages', icon: MessageSquare, description: 'Direct messages and chat notifications' },
  { key: 'approvals', label: 'Approvals', icon: CheckCircle, description: 'Profile, event, and content approval updates' },
  { key: 'certificates', label: 'Certificates', icon: Award, description: 'New certificates and achievements' },
];

const defaultPrefs: NotificationPrefs = {
  email: { community: true, events: true, mentions: true, messages: true, approvals: true, certificates: true },
  push: { community: true, events: true, mentions: true, messages: true, approvals: true, certificates: false },
};

export default function SettingsNotificationsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultPrefs);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const res = await fetch('/api/profile/data');
        const data = await res.json();
        if (data.profile?.links?.notifications) {
          setPrefs((prev) => {
            const saved = data.profile.links.notifications;
            return {
              email: { ...prev.email, ...saved.email },
              push: { ...prev.push, ...saved.push },
            };
          });
        }
      } catch { /* ignore */ }
      setLoaded(true);
    };
    load();
  }, [user]);

  const toggle = (channel: 'email' | 'push', key: string) => {
    setPrefs(prev => ({
      ...prev,
      [channel]: { ...prev[channel], [key]: !prev[channel][key as keyof typeof prev.email] },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: { notifications: prefs } }),
      });
      if (!res.ok) throw new Error('Save failed');
      toast('Notification preferences saved', 'success');
    } catch {
      toast('Failed to save notification preferences', 'error');
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
        <h2 className="font-heading text-lg font-semibold">Notification Preferences</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose how and when to receive notifications</p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="pb-3 text-center font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1.5">
                    <Mail className="size-4" /> Email
                  </div>
                </th>
                <th className="pb-3 text-center font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1.5">
                    <Bell className="size-4" /> Push
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {notificationGroups.map(({ key, label, icon: Icon, description }) => (
                <tr key={key} className="border-b border-border last:border-0">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 shrink-0 text-primary" />
                      <div>
                        <span className="font-medium">{label}</span>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <input type="checkbox" checked={prefs.email[key as keyof typeof prefs.email]} onChange={() => toggle('email', key)} className="accent-primary size-5" />
                  </td>
                  <td className="py-3 text-center">
                    <input type="checkbox" checked={prefs.push[key as keyof typeof prefs.push]} onChange={() => toggle('push', key)} className="accent-primary size-5" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
