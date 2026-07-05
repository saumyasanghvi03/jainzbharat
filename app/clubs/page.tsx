'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog } from '@/components/ui/dialog';
import { Avatar } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/toast';
import { Users, Search, Plus, Heart, Globe, MapPin, Shield } from 'lucide-react';

type TabType = 'clubs' | 'kalyanmitra';
type GroupItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  member_count: number;
  city: string | null;
  country: string | null;
  verification_status: string;
  category?: string | null;
  mission?: string | null;
  privacy?: string;
  founder_id?: string | null;
};

export default function ClubsPage() {
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  const [tab, setTab] = useState<TabType>('clubs');
  const [clubs, setClubs] = useState<GroupItem[]>([]);
  const [kmGroups, setKmGroups] = useState<GroupItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', mission: '', city: '', country: '', category: 'community_service' });

  useEffect(() => {
    async function fetchData() {
      try {
        const [clubsRes, kmRes] = await Promise.all([
          fetch('/api/community/groups?type=clubs'),
          fetch('/api/community/groups?type=kalyanmitra'),
        ]);
        if (clubsRes.ok) { const d = await clubsRes.json(); setClubs(d.data ?? []); }
        if (kmRes.ok) { const d = await kmRes.json(); setKmGroups(d.data ?? []); }
      } catch { /* ignore */ } finally { setLoading(false); }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/community/can-create').then(r => r.json()).then(d => setCanCreate(d.canCreate)).catch(() => {});
    }
  }, [isSignedIn]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      const res = await fetch('/api/community/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: tab, ...form }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast(err.error ?? 'Failed to create', 'error');
        return;
      }
      toast(`${tab === 'clubs' ? 'Club' : 'Kalyanmitra group'} created!`, 'success');
      setCreateOpen(false);
      setForm({ name: '', description: '', mission: '', city: '', country: '', category: 'community_service' });
      const [clubsRes, kmRes] = await Promise.all([
        fetch('/api/community/groups?type=clubs'),
        fetch('/api/community/groups?type=kalyanmitra'),
      ]);
      if (clubsRes.ok) { const d = await clubsRes.json(); setClubs(d.data ?? []); }
      if (kmRes.ok) { const d = await kmRes.json(); setKmGroups(d.data ?? []); }
    } catch { toast('Something went wrong', 'error'); }
  };

  const handleJoin = async (id: string, type: TabType) => {
    if (!isSignedIn) { toast('Sign in to join', 'warning'); return; }
    try {
      const res = await fetch('/api/community/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type }),
      });
      if (!res.ok) { const err = await res.json(); toast(err.error ?? 'Failed to join', 'error'); return; }
      toast('Join request sent!', 'success');
    } catch { toast('Something went wrong', 'error'); }
  };

  const items = tab === 'clubs' ? clubs : kmGroups;
  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="default">{tab === 'clubs' ? 'Clubs' : 'Kalyanmitra Seva'}</Badge>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-6xl">
            {tab === 'clubs' ? 'Community Clubs' : 'Kalyanmitra Seva Groups'}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {tab === 'clubs'
              ? 'Connect with like-minded members, start a club, or join an existing one.'
              : 'Serve your community through organized Kalyanmitra seva groups.'}
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> New {tab === 'clubs' ? 'Club' : 'Group'}
          </Button>
        )}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex rounded-full border border-border bg-muted p-1">
          <button onClick={() => setTab('clubs')} className={`rounded-full px-5 py-2 text-sm font-medium transition ${tab === 'clubs' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            <Users className="mr-1.5 inline size-4" /> Clubs
          </button>
          <button onClick={() => setTab('kalyanmitra')} className={`rounded-full px-5 py-2 text-sm font-medium transition ${tab === 'kalyanmitra' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            <Heart className="mr-1.5 inline size-4" /> Kalyanmitra
          </button>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5,6].map(i => <Card key={i}><div className="h-32 animate-pulse rounded-lg bg-muted" /></Card>)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="mt-8 text-center">
          <p className="text-muted-foreground">
            {search ? 'No results found.' : `No ${tab === 'clubs' ? 'clubs' : 'Kalyanmitra groups'} yet. Be the first to create one!`}
          </p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(item => (
            <Card key={item.id} className="relative flex flex-col">
              <div className="flex items-start gap-3">
                <Avatar fallback={item.name.slice(0, 2).toUpperCase()} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-heading text-lg font-semibold">{item.name}</h3>
                    {item.verification_status === 'verified' && <Shield className="size-4 shrink-0 text-primary" />}
                  </div>
                  {item.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="size-3.5" />{item.member_count}</span>
                {(item.city || item.country) && <span className="flex items-center gap-1"><MapPin className="size-3.5" />{[item.city, item.country].filter(Boolean).join(', ')}</span>}
                {item.category && <Badge variant="outline">{item.category.replace(/_/g, ' ')}</Badge>}
              </div>
              {isSignedIn && (
                <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => handleJoin(item.id, tab)}>
                  Request to Join
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
        <p className="font-heading text-lg font-semibold">JainZBharat Official Club</p>
        <p className="mt-1 text-sm text-muted-foreground">The flagship community club founded by Saumya Sanghvi. Connect with the core team, get updates, and shape the platform.</p>
          {isSignedIn && (
          <Button className="mt-4" variant="outline" onClick={() => handleJoin('jainzbharat', 'clubs')}>
            Request to Join JainZBharat Club
          </Button>
        )}
      </div>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} title={`Create ${tab === 'clubs' ? 'Club' : 'Kalyanmitra Group'}`}>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          {tab === 'clubs' && <Input placeholder="Mission" value={form.mission} onChange={e => setForm(f => ({ ...f, mission: e.target.value }))} />}
          {tab === 'kalyanmitra' && (
            <select className="flex h-12 w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="community_service">Community Service</option>
              <option value="blood_donation">Blood Donation</option>
              <option value="education">Education</option>
              <option value="animal_welfare">Animal Welfare</option>
              <option value="healthcare">Healthcare</option>
              <option value="temple_service">Temple Service</option>
              <option value="disaster_relief">Disaster Relief</option>
              <option value="environment">Environment</option>
              <option value="food_distribution">Food Distribution</option>
            </select>
          )}
          <Input placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
          <Input placeholder="Country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
          <Button type="submit">Create</Button>
        </form>
      </Dialog>
    </section>
  );
}
