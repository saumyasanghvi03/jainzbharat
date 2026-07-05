'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState, useCallback, FormEvent } from 'react';

interface Cooldown { canEdit: boolean; remainingDays: number; nextEditAt: string | null }
interface ProfileData { display_name: string; bio: string | null; country: string | null; city: string | null; profession: string | null; company: string | null }
interface ProfileDb extends ProfileData { jainz_id: string; contribution_score: number; volunteer_hours: number; profile_edited_at: string | null }

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cooldown, setCooldown] = useState<Cooldown | null>(null);
  const [profile, setProfile] = useState<ProfileData>({ display_name: '', bio: '', country: '', city: '', profession: '', company: '' });
  const [dbProfile, setDbProfile] = useState<ProfileDb | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!user) return;
    setProfile({
      display_name: user.fullName ?? '',
      bio: '',
      country: '',
      city: '',
      profession: '',
      company: '',
    });
    Promise.all([
      fetch('/api/profile').then(r => r.json()),
      fetch('/api/profile/data').then(r => r.json()),
    ]).then(([cd, pd]) => {
      setCooldown(cd);
      if (pd.profile) {
        const p = pd.profile as ProfileDb;
        setDbProfile(p);
        if (p.display_name) setProfile(prev => ({ ...prev, display_name: p.display_name }));
        if (p.bio) setProfile(prev => ({ ...prev, bio: p.bio }));
        if (p.country) setProfile(prev => ({ ...prev, country: p.country }));
        if (p.city) setProfile(prev => ({ ...prev, city: p.city }));
        if (p.profession) setProfile(prev => ({ ...prev, profession: p.profession }));
        if (p.company) setProfile(prev => ({ ...prev, company: p.company }));
      }
    }).catch(() => {});
  }, [user]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile saved — next edit available in 7 days.' });
        setEditing(false);
        const [cd, pd] = await Promise.all([
          fetch('/api/profile').then(r => r.json()),
          fetch('/api/profile/data').then(r => r.json()),
        ]);
        setCooldown(cd);
        if (pd.profile) setDbProfile(pd.profile);
      } else {
        setMessage({ type: 'error', text: data.error ?? 'Failed to save profile' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error saving profile' });
    } finally {
      setSaving(false);
    }
  }, [profile]);

  if (!isLoaded || !user) return null;

  const canEdit = cooldown?.canEdit ?? true;
  const remainingDays = cooldown?.remainingDays ?? 0;
  const jainzId = dbProfile?.jainz_id ?? '';
  const score = dbProfile?.contribution_score ?? 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Your Profile</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Your JainZBharat identity.</h1>

      {message && (
        <div className={`mt-6 rounded-xl border p-4 text-sm ${message.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>
          {message.text}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card className="p-8 text-center">
          <Image src={user.imageUrl} alt="" width={96} height={96} className="mx-auto size-24 rounded-full" />
          <div className="mt-4 font-heading text-xl font-semibold">{user.fullName ?? 'User'}</div>
          <div className="mt-1 text-sm text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</div>
          {jainzId && <div className="mt-4 font-mono text-sm text-primary">{jainzId}</div>}
          {!jainzId && <div className="mt-4 text-xs text-muted-foreground">Sign the declaration to receive your JainZ ID</div>}
        </Card>

        <div className="space-y-4">
          {!editing ? (
            <>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="font-heading text-lg font-semibold">Details</div>
                  {canEdit ? (
                    <Button size="sm" onClick={() => setEditing(true)}>Edit</Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Edits available in {remainingDays}d</span>
                  )}
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  {profile.bio && <p className="text-muted-foreground">{profile.bio}</p>}
                  <div className="grid grid-cols-2 gap-3">
                    {profile.country && <div><span className="text-muted-foreground">Country</span><p>{profile.country}</p></div>}
                    {profile.city && <div><span className="text-muted-foreground">City</span><p>{profile.city}</p></div>}
                    {profile.profession && <div><span className="text-muted-foreground">Profession</span><p>{profile.profession}</p></div>}
                    {profile.company && <div><span className="text-muted-foreground">Company</span><p>{profile.company}</p></div>}
                  </div>
                  {!profile.bio && !profile.country && !profile.city && !profile.profession && !profile.company && (
                    <p className="text-muted-foreground italic">No details added yet.</p>
                  )}
                </div>
              </Card>
              <Card className="p-6">
                <div className="font-heading text-lg font-semibold">Contribution Score</div>
                <div className="mt-2 font-heading text-3xl text-primary">{score}</div>
                <p className="mt-1 text-sm text-muted-foreground">Earn points by signing the declaration and contributing.</p>
              </Card>
            </>
          ) : (
            <Card className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="font-heading text-lg font-semibold">Edit Profile</div>
                <Button size="sm" variant="outline" onClick={() => { setEditing(false); setMessage(null); }}>Cancel</Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Display Name</label>
                  <Input value={profile.display_name} onChange={e => setProfile(p => ({ ...p, display_name: e.target.value }))} required minLength={2} maxLength={120} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bio</label>
                  <Textarea value={profile.bio ?? ''} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Country</label>
                    <Input value={profile.country ?? ''} onChange={e => setProfile(p => ({ ...p, country: e.target.value }))} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">City</label>
                    <Input value={profile.city ?? ''} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profession</label>
                    <Input value={profile.profession ?? ''} onChange={e => setProfile(p => ({ ...p, profession: e.target.value }))} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</label>
                    <Input value={profile.company ?? ''} onChange={e => setProfile(p => ({ ...p, company: e.target.value }))} />
                  </div>
                </div>
                <div className="pt-2">
                  <Button type="submit" disabled={saving} className="w-full">
                    {saving ? 'Saving...' : 'Save Profile'}
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">Profile can be edited once every 7 days.</p>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
