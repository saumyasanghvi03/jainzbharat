'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { useEffect, useState, useRef } from 'react';
import { X, Plus, Loader2, Camera, Upload } from 'lucide-react';

interface ProfileData {
  display_name: string;
  bio: string;
  headline: string;
  country: string;
  city: string;
  profession: string;
  company: string;
  website: string;
  linkedin: string;
  github: string;
  twitter: string;
  instagram: string;
  youtube: string;
  portfolio: string;
  languages: string[];
  skills: string[];
  interests: string[];
  education: string;
  experience: string;
  availability: string;
  volunteer_interests: string;
}

const availabilityOptions = [
  { value: '', label: 'Not specified' },
  { value: 'available', label: 'Available' },
  { value: 'limited', label: 'Limited' },
  { value: 'unavailable', label: 'Unavailable' },
  { value: 'open_to_offers', label: 'Open to offers' },
];

export default function SettingsProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'avatar' | 'banner' | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    display_name: '', bio: '', headline: '', country: '', city: '',
    profession: '', company: '', website: '', linkedin: '', github: '',
    twitter: '', instagram: '', youtube: '', portfolio: '', languages: [],
    skills: [], interests: [], education: '', experience: '',
    availability: '', volunteer_interests: '',
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [langInput, setLangInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [loaded, setLoaded] = useState(false);

  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const res = await fetch('/api/profile/data');
        const data = await res.json();
        if (data.profile) {
          const p = data.profile;
          setAvatarUrl(p.avatar_url ?? null);
          setBannerUrl(p.banner_url ?? null);
          setProfile({
            display_name: p.display_name ?? user.fullName ?? '',
            bio: p.bio ?? '',
            headline: p.headline ?? '',
            country: p.country ?? '',
            city: p.city ?? '',
            profession: p.profession ?? '',
            company: p.company ?? '',
            website: p.links?.website ?? '',
            linkedin: p.links?.linkedin ?? '',
            github: p.links?.github ?? '',
            twitter: p.links?.twitter ?? '',
            instagram: p.links?.instagram ?? '',
            youtube: p.links?.youtube ?? '',
            portfolio: p.links?.portfolio ?? '',
            languages: p.languages ?? [],
            skills: p.skills ?? [],
            interests: p.links?.interests ?? [],
            education: p.links?.education ?? '',
            experience: p.links?.experience ?? '',
            availability: p.links?.availability ?? '',
            volunteer_interests: p.links?.volunteer_interests ?? '',
          });
        }
      } catch { /* ignore */ }
      setLoaded(true);
    };
    load();
  }, [user]);

  const addTag = (field: 'skills' | 'languages' | 'interests', value: string) => {
    if (!value.trim()) return;
    setProfile(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
  };

  const removeTag = (field: 'skills' | 'languages' | 'interests', index: number) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleTagKeyDown = (
    field: 'skills' | 'languages' | 'interests',
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget.value;
      if (input.trim()) {
        addTag(field, input);
        if (field === 'skills') setSkillInput('');
        else if (field === 'languages') setLangInput('');
        else setInterestInput('');
      }
    }
  };

  const handleUpload = async (type: 'avatar' | 'banner', file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast('File must be under 5MB', 'error');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast('Only JPEG, PNG, and WebP are allowed', 'error');
      return;
    }
    setUploading(type);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      const res = await fetch('/api/profile/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      if (type === 'avatar') setAvatarUrl(data.url);
      else setBannerUrl(data.url);
      toast(`${type === 'avatar' ? 'Photo' : 'Banner'} uploaded`, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Upload failed', 'error');
    }
    setUploading(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          links: {
            website: profile.website,
            linkedin: profile.linkedin,
            github: profile.github,
            twitter: profile.twitter,
            instagram: profile.instagram,
            youtube: profile.youtube,
            portfolio: profile.portfolio,
            interests: profile.interests,
            education: profile.education,
            experience: profile.experience,
            availability: profile.availability,
            volunteer_interests: profile.volunteer_interests,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Save failed');
      toast('Profile saved', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    }
    setSaving(false);
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const tagInput = (
    field: 'skills' | 'languages' | 'interests',
    value: string,
    setter: (v: string) => void,
    placeholder: string,
  ) => (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {profile[field].map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {tag}
            <button onClick={() => removeTag(field, i)} className="hover:text-destructive" aria-label={`Remove ${tag}`}>
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={e => setter(e.target.value)}
          onKeyDown={e => handleTagKeyDown(field, e)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="icon" onClick={() => { addTag(field, value); setter(''); }} disabled={!value.trim()}>
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Avatar & Banner */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Profile Media</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your avatar and banner appear on your public profile</p>

        <div className="mt-6 space-y-6">
          {/* Banner */}
          <div>
            <label className="mb-2 block text-sm font-medium">Banner</label>
            <div className="relative h-40 overflow-hidden rounded-xl border border-border bg-muted md:h-48">
              {bannerUrl ? (
                <Image src={bannerUrl} alt="Banner" fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <Camera className="size-8" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition hover:opacity-100">
                <Button variant="secondary" size="sm" onClick={() => bannerRef.current?.click()} disabled={uploading !== null}>
                  {uploading === 'banner' ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  Change
                </Button>
              </div>
            </div>
            <input ref={bannerRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload('banner', f); }} />
          </div>

          {/* Avatar */}
          <div>
            <label className="mb-2 block text-sm font-medium">Avatar</label>
            <div className="flex items-center gap-4">
              <div className="relative size-24 overflow-hidden rounded-full border-2 border-border bg-muted">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                ) : user?.imageUrl ? (
                  <Image src={user.imageUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Camera className="size-8" />
                  </div>
                )}
              </div>
              <div>
                <Button variant="outline" size="sm" onClick={() => avatarRef.current?.click()} disabled={uploading !== null}>
                  {uploading === 'avatar' ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  Upload Photo
                </Button>
                <p className="mt-1 text-xs text-muted-foreground">JPEG, PNG, or WebP. Max 5MB.</p>
              </div>
            </div>
            <input ref={avatarRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload('avatar', f); }} />
          </div>
        </div>
      </Card>

      {/* Basic Info */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Basic Information</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Display Name</label>
            <Input value={profile.display_name} onChange={e => setProfile(prev => ({ ...prev, display_name: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Headline</label>
            <Input value={profile.headline} onChange={e => setProfile(prev => ({ ...prev, headline: e.target.value }))} placeholder="e.g. Jain community builder & volunteer" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Profession</label>
            <Input value={profile.profession} onChange={e => setProfile(prev => ({ ...prev, profession: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Organization / Company</label>
            <Input value={profile.company} onChange={e => setProfile(prev => ({ ...prev, company: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Country</label>
            <Input value={profile.country} onChange={e => setProfile(prev => ({ ...prev, country: e.target.value }))} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">City</label>
            <Input value={profile.city} onChange={e => setProfile(prev => ({ ...prev, city: e.target.value }))} />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium">Bio</label>
          <Textarea value={profile.bio} onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))} rows={4} />
        </div>
      </Card>

      {/* Skills & Languages */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Skills & Languages</h2>
        <div className="mt-4 space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Skills</label>
            {tagInput('skills', skillInput, setSkillInput, 'Add a skill and press Enter')}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Languages</label>
            {tagInput('languages', langInput, setLangInput, 'Add a language and press Enter')}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Interests</label>
            {tagInput('interests', interestInput, setInterestInput, 'Add an interest and press Enter')}
          </div>
        </div>
      </Card>

      {/* Social Links */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Social Links</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {([
            { key: 'website', label: 'Website', placeholder: 'https://example.com' },
            { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
            { key: 'github', label: 'GitHub', placeholder: 'https://github.com/...' },
            { key: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/...' },
            { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
            { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@...' },
            { key: 'portfolio', label: 'Portfolio', placeholder: 'https://...' },
          ] as const).map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-medium">{label}</label>
              <Input value={profile[key as keyof ProfileData] as string} onChange={e => setProfile(prev => ({ ...prev, [key]: e.target.value }))} placeholder={placeholder} />
            </div>
          ))}
        </div>
      </Card>

      {/* Professional Details */}
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Professional Details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Education</label>
            <Input value={profile.education} onChange={e => setProfile(prev => ({ ...prev, education: e.target.value }))} placeholder="e.g. B.Tech, IIT Bombay" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Experience</label>
            <Input value={profile.experience} onChange={e => setProfile(prev => ({ ...prev, experience: e.target.value }))} placeholder="e.g. 5 years in software" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Availability</label>
            <select
              value={profile.availability}
              onChange={e => setProfile(prev => ({ ...prev, availability: e.target.value }))}
              className="flex h-12 w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {availabilityOptions.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-card">{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Volunteer Interests</label>
            <Input value={profile.volunteer_interests} onChange={e => setProfile(prev => ({ ...prev, volunteer_interests: e.target.value }))} placeholder="e.g. Teaching, temple service" />
          </div>
        </div>
      </Card>

      {/* Save */}
      <div className="flex justify-end gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
