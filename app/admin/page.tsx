'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { Shield, CheckCircle, XCircle, RefreshCw, Users, Building2, Calendar, Flag, Bell, Hash, Send } from 'lucide-react';

type TabType = 'overview' | 'clubs' | 'kalyanmitra' | 'organizations' | 'events' | 'users' | 'notifications';
type EntityItem = { id: string; slug: string; name: string; verification_status: string; description?: string | null; title?: string };
type ProfileBrief = { id: string; display_name: string; jainz_id: string; role: string };

export default function AdminPage() {
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();
  const [tab, setTab] = useState<TabType>('overview');
  const [profile, setProfile] = useState<{ role: string; display_name: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [clubs, setClubs] = useState<EntityItem[]>([]);
  const [kmGroups, setKmGroups] = useState<EntityItem[]>([]);
  const [orgs, setOrgs] = useState<EntityItem[]>([]);
  const [events, setEvents] = useState<EntityItem[]>([]);
  const [profiles, setProfiles] = useState<ProfileBrief[]>([]);
  const [loading, setLoading] = useState(false);

  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [notifAll, setNotifAll] = useState(true);
  const [notifTargets, setNotifTargets] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const [reassignProfile, setReassignProfile] = useState('');
  const [reassignId, setReassignId] = useState('');
  const [reassignMsg, setReassignMsg] = useState('');
  const [reassigning, setReassigning] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      if (!isSignedIn || !user) { setChecking(false); return; }
      try {
        const res = await fetch('/api/admin/check');
        if (res.ok) {
          const d = await res.json();
          setProfile(d.profile);
          setIsAdmin(d.isAdmin);
        }
      } catch { /* ignore */ } finally { setChecking(false); }
    }
    checkAuth();
  }, [isSignedIn, user]);

  const fetchData = async (entity: TabType) => {
    setLoading(true);
    try {
      const endpoint = entity === 'clubs' ? '/api/community/groups?type=clubs'
        : entity === 'kalyanmitra' ? '/api/community/groups?type=kalyanmitra'
        : entity === 'organizations' ? '/api/organizations/list'
        : entity === 'events' ? '/api/events/list'
        : entity === 'users' ? '/api/admin/notify'
        : null;
      if (!endpoint) { setLoading(false); return; }
      const res = await fetch(endpoint);
      if (res.ok) {
        const d = await res.json();
        if (entity === 'clubs') setClubs(d.data ?? []);
        else if (entity === 'kalyanmitra') setKmGroups(d.data ?? []);
        else if (entity === 'organizations') setOrgs(d.data ?? []);
        else if (entity === 'events') setEvents(d.data ?? []);
        else if (entity === 'users') setProfiles(d.profiles ?? []);
      }
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { if (isAdmin && tab !== 'overview' && tab !== 'notifications') fetchData(tab); }, [tab, isAdmin]);

  const handleVerify = async (entity: string, slug: string, action: 'verify' | 'reject') => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity, slug, action }),
      });
      if (!res.ok) { const err = await res.json(); toast(err.error ?? 'Failed', 'error'); return; }
      toast(`${action === 'verify' ? 'Verified' : 'Rejected'} successfully`, 'success');
      fetchData(tab as TabType);
    } catch { toast('Something went wrong', 'error'); }
  };

  const handlePushNotification = async () => {
    if (!notifTitle.trim()) { toast('Title is required', 'error'); return; }
    setSending(true);
    try {
      const targetProfiles = notifAll ? profiles.map(p => p.id) : notifTargets;
      if (targetProfiles.length === 0) { toast('No targets selected', 'warning'); setSending(false); return; }

      let sent = 0;
      for (const pid of targetProfiles) {
        const res = await fetch('/api/admin/notify/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId: pid, title: notifTitle, body: notifBody }),
        });
        if (res.ok) sent++;
      }
      toast(`Notification sent to ${sent}/${targetProfiles.length} users`, 'success');
      setNotifTitle('');
      setNotifBody('');
      setNotifTargets([]);
    } catch { toast('Failed to send notifications', 'error'); } finally { setSending(false); }
  };

  const handleReassign = async () => {
    if (!reassignProfile || !reassignId.trim()) { toast('Select a profile and enter a new JainZ ID', 'error'); return; }
    setReassigning(true);
    try {
      const res = await fetch('/api/admin/reassign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetProfileId: reassignProfile,
          newJainzId: reassignId.trim(),
          message: reassignMsg.trim() || undefined,
          notifyOthers: profiles.filter(p => p.id !== reassignProfile).map(p => p.id),
        }),
      });
      if (!res.ok) { const err = await res.json(); toast(err.error ?? 'Reassignment failed', 'error'); setReassigning(false); return; }
      toast('JainZ ID reassigned & notifications sent', 'success');
      setReassignProfile('');
      setReassignId('');
      setReassignMsg('');
      fetchData('users');
    } catch { toast('Something went wrong', 'error'); } finally { setReassigning(false); }
  };

  if (checking) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="size-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (!isSignedIn) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Shield className="size-16 text-muted-foreground/40" />
          <h1 className="mt-4 font-heading text-2xl font-semibold">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">Sign in to access the admin panel.</p>
        </div>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Shield className="size-16 text-destructive/40" />
          <h1 className="mt-4 font-heading text-2xl font-semibold">Forbidden</h1>
          <p className="mt-2 text-muted-foreground">You do not have admin access.</p>
        </div>
      </section>
    );
  }

  const tabs: { key: TabType; label: string; icon: typeof Shield }[] = [
    { key: 'overview', label: 'Overview', icon: Shield },
    { key: 'clubs', label: 'Clubs', icon: Users },
    { key: 'kalyanmitra', label: 'Kalyanmitra', icon: Flag },
    { key: 'organizations', label: 'Organizations', icon: Building2 },
    { key: 'events', label: 'Events', icon: Calendar },
    { key: 'users', label: 'Profiles', icon: Hash },
    { key: 'notifications', label: 'Notify', icon: Bell },
  ];

  const renderEntityList = (items: EntityItem[], entity: string) => (
    <div className="space-y-3">
      {items.length === 0 ? (
        <Card className="text-center"><p className="text-muted-foreground">No items found.</p></Card>
      ) : items.map(item => (
        <Card key={item.id} className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-heading text-base font-semibold">{item.name || item.title}</span>
              <Badge variant={item.verification_status === 'verified' ? 'accent' : item.verification_status === 'rejected' ? 'default' : 'outline'}>
                {item.verification_status}
              </Badge>
            </div>
            {item.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{item.description}</p>}
          </div>
          <div className="flex shrink-0 gap-2">
            {item.verification_status !== 'verified' && (
              <Button size="sm" variant="default" onClick={() => handleVerify(entity, item.slug, 'verify')}>
                <CheckCircle className="mr-1 size-4" /> Verify
              </Button>
            )}
            {item.verification_status !== 'rejected' && (
              <Button size="sm" variant="danger" onClick={() => handleVerify(entity, item.slug, 'reject')}>
                <XCircle className="mr-1 size-4" /> Reject
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="default">Admin Dashboard</Badge>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-6xl">Platform Control</h1>
          <p className="mt-2 text-muted-foreground">Welcome, {profile?.display_name ?? user?.fullName ?? 'Admin'}.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${tab === t.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              <Icon className="size-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'overview' && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card><div className="font-heading text-3xl font-semibold text-primary">{clubs.length + kmGroups.length}</div><div className="mt-1 text-sm text-muted-foreground">Community Groups</div></Card>
            <Card><div className="font-heading text-3xl font-semibold text-primary">{orgs.length}</div><div className="mt-1 text-sm text-muted-foreground">Organizations</div></Card>
            <Card><div className="font-heading text-3xl font-semibold text-primary">{events.length}</div><div className="mt-1 text-sm text-muted-foreground">Events</div></Card>
            <Card><div className="font-heading text-3xl font-semibold text-primary">{profiles.length}</div><div className="mt-1 text-sm text-muted-foreground">Profiles</div></Card>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card className="border-primary/20 bg-primary/5">
              <Bell className="size-6 text-primary" />
              <h2 className="mt-3 font-heading text-lg font-semibold">Push Notification</h2>
              <p className="mt-1 text-sm text-muted-foreground">Send a broadcast notification to all platform users.</p>
              <form className="mt-4 flex flex-col gap-3" onSubmit={e => { e.preventDefault(); handlePushNotification(); }}>
                <Input placeholder="Notification title" value={notifTitle} onChange={e => setNotifTitle(e.target.value)} required />
                <Textarea placeholder="Body (optional)" value={notifBody} onChange={e => setNotifBody(e.target.value)} />
                <Button type="submit" disabled={sending}>
                  <Send className="mr-2 size-4" /> {sending ? 'Sending...' : 'Push to All Users'}
                </Button>
              </form>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <Hash className="size-6 text-primary" />
              <h2 className="mt-3 font-heading text-lg font-semibold">Reassign JainZ ID</h2>
              <p className="mt-1 text-sm text-muted-foreground">Reassign a profile&apos;s JainZ ID. Affected users get notified.</p>
              <div className="mt-4 flex flex-col gap-3">
                <select className="flex h-12 w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm" value={reassignProfile} onChange={e => setReassignProfile(e.target.value)}>
                  <option value="">Select profile...</option>
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.display_name} ({p.jainz_id})</option>
                  ))}
                </select>
                <Input placeholder="New JainZ ID (e.g. JZB-2026-000001)" value={reassignId} onChange={e => setReassignId(e.target.value)} />
                <Textarea placeholder="Custom notification message (optional)" value={reassignMsg} onChange={e => setReassignMsg(e.target.value)} />
                <Button onClick={handleReassign} disabled={reassigning}>
                  {reassigning ? 'Reassigning...' : 'Reassign ID & Notify All'}
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === 'clubs' && <div className="mt-8">{loading ? <p className="text-muted-foreground">Loading...</p> : renderEntityList(clubs, 'club')}</div>}
      {tab === 'kalyanmitra' && <div className="mt-8">{loading ? <p className="text-muted-foreground">Loading...</p> : renderEntityList(kmGroups, 'kalyanmitra')}</div>}
      {tab === 'organizations' && <div className="mt-8">{loading ? <p className="text-muted-foreground">Loading...</p> : renderEntityList(orgs, 'organization')}</div>}
      {tab === 'events' && <div className="mt-8">{loading ? <p className="text-muted-foreground">Loading...</p> : renderEntityList(events, 'event')}</div>}

      {tab === 'users' && (
        <div className="mt-8 space-y-3">
          <Button variant="outline" size="sm" onClick={() => fetchData('users')}><RefreshCw className="mr-2 size-4" /> Refresh</Button>
          {loading ? <p className="text-muted-foreground">Loading...</p> : profiles.length === 0 ? (
            <Card className="text-center"><p className="text-muted-foreground">No profiles found.</p></Card>
          ) : profiles.map(p => (
            <Card key={p.id} className="flex items-center justify-between">
              <div>
                <span className="font-heading text-base font-semibold">{p.display_name}</span>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{p.jainz_id}</Badge>
                  <Badge variant={p.role === 'super_admin' || p.role === 'admin' ? 'accent' : 'default'}>{p.role}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'notifications' && (
        <div className="mt-8 space-y-6">
          <Card className="border-primary/20 bg-primary/5 p-6">
            <Bell className="size-6 text-primary" />
            <h2 className="mt-3 font-heading text-lg font-semibold">Push Notification</h2>
            <p className="mt-1 text-sm text-muted-foreground">Send a notification to all platform users. Everyone will see it in their notification inbox.</p>
            <form className="mt-4 flex flex-col gap-3" onSubmit={e => { e.preventDefault(); handlePushNotification(); }}>
              <Input placeholder="Title" value={notifTitle} onChange={e => setNotifTitle(e.target.value)} required />
              <Textarea placeholder="Body (optional)" value={notifBody} onChange={e => setNotifBody(e.target.value)} />
              <Button type="submit" disabled={sending}>
                <Send className="mr-2 size-4" /> {sending ? 'Sending...' : 'Push Notification to All'}
              </Button>
            </form>
          </Card>

          <Card className="border-primary/20 bg-primary/5 p-6">
            <Hash className="size-6 text-primary" />
            <h2 className="mt-3 font-heading text-lg font-semibold">Reassign JainZ ID</h2>
            <p className="mt-1 text-sm text-muted-foreground">Reassign a profile&apos;s JainZ ID. The previous holder will be swapped and both parties receive a notification.</p>
            <div className="mt-4 flex flex-col gap-3">
              <select className="flex h-12 w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm" value={reassignProfile} onChange={e => setReassignProfile(e.target.value)}>
                <option value="">Select profile...</option>
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>{p.display_name} ({p.jainz_id})</option>
                ))}
              </select>
              <Input placeholder="New JainZ ID (e.g. JZB-2026-000001)" value={reassignId} onChange={e => setReassignId(e.target.value)} />
              <Textarea placeholder="Custom message included in notification (optional)" value={reassignMsg} onChange={e => setReassignMsg(e.target.value)} />
              <Button onClick={handleReassign} disabled={reassigning || profiles.length === 0}>
                {reassigning ? 'Reassigning...' : 'Reassign ID & Notify Everyone'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </section>
  );
}
