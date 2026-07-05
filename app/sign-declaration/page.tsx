'use client';

import { useState, useCallback, useRef } from 'react';
import { useUser, useClerk, useAuth } from '@clerk/nextjs';
import QRCode from 'qrcode';
import Link from 'next/link';
import { ArrowRight, Check, Download, Award, Users, BookOpen, PenLine, Shield, Globe, Diamond, ExternalLink, Copy, Heart, Lightbulb, Leaf, Handshake, Target, Eye, FileText } from 'lucide-react';
import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { declarationVersions } from '@/lib/declaration';
import { site } from '@/lib/site';

type Step = 'read' | 'sign' | 'done';

interface SuccessData {
  jainzId: string;
  displayName: string;
  declarationVersion: string;
  signedAt: string;
}

const steps = [
  { key: 'read', icon: BookOpen, label: 'Read' },
  { key: 'sign', icon: PenLine, label: 'Sign' },
  { key: 'done', icon: Check, label: 'Done' },
] as const;

export default function SignDeclarationPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { openSignIn } = useClerk();
  const [step, setStep] = useState<Step>('read');
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [profession, setProfession] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<SuccessData | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [alreadySigned, setAlreadySigned] = useState(false);
  const qrRef = useRef<HTMLImageElement>(null);

  const d = declarationVersions[0];

  const stepIndex = steps.findIndex((s) => s.key === step);

  const handleSign = useCallback(async () => {
    if (!country.trim() || !city.trim() || !profession.trim()) {
      setError('Country, city, and profession are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = await getToken();
      const res = await fetch('/api/declaration/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          country: country.trim(),
          city: city.trim(),
          profession: profession.trim(),
          organization: organization.trim() || undefined,
          declarationVersion: 'v1.0',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Failed to sign declaration');
        return;
      }

      const sig = data.signature;
      setSuccess({
        jainzId: sig.jainz_id,
        displayName: sig.display_name ?? user?.fullName ?? 'Member',
        declarationVersion: sig.declaration_version,
        signedAt: sig.signed_at,
      });
      setAlreadySigned(data.alreadySigned ?? false);

      const verificationUrl = `${site.domain}/jainz/${sig.jainz_id}`;
      const qr = await QRCode.toDataURL(verificationUrl, { width: 200, margin: 2, color: { dark: '#f97316', light: '#080b12' } });
      setQrDataUrl(qr);

      setStep('done');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [country, city, profession, organization, user, getToken]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="mx-auto max-w-7xl px-4 pb-32 pt-24 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Shield className="size-4" />
            Sign Declaration
          </div>
          <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight md:text-5xl">
            Sign in to add your <span className="text-primary">signature</span>.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            You need to be signed in to sign the JainZBharat Declaration. Your signature will be permanently recorded with your JainZ ID.
          </p>
          <div className="mt-8">
            <Button size="lg" onClick={() => openSignIn()}>Sign In</Button>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'done' && success) {
    return (
      <main className="mx-auto max-w-7xl px-4 pb-32 pt-24 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="flex flex-col items-center text-center lg:col-span-8">
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-3xl" />
                <div className="relative flex size-24 items-center justify-center rounded-full bg-emerald-500/10">
                  <Check className="size-12 text-emerald-400" />
                </div>
              </div>

              <h1 className="font-heading text-4xl font-bold md:text-5xl">
                {alreadySigned ? 'Already Signed' : 'Declaration Signed'}
              </h1>
              <p className="mt-3 max-w-lg text-lg text-muted-foreground">
                {alreadySigned
                  ? 'You have already signed this version of the declaration.'
                  : 'Your signature is permanently recorded on the JainZBharat ledger.'}
              </p>

              <div className="glass-card mt-10 w-full max-w-lg rounded-3xl border-emerald-500/20 p-8">
                <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                  <div className="text-left">
                    <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">JainZ Identity</span>
                    <div className="mt-2 font-mono text-2xl tracking-wider text-primary">
                      {success.jainzId}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Verified via Supabase PostgreSQL</p>
                  </div>
                  {qrDataUrl && (
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img ref={qrRef} src={qrDataUrl} alt="Verification QR" className="relative size-28 rounded-2xl" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href={`/api/certificates?jainzId=${success.jainzId}&name=${encodeURIComponent(success.displayName)}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    <Download className="size-4" />
                    Certificate
                  </Button>
                </a>
                <a href={`/badges?jainzId=${success.jainzId}`}>
                  <Button variant="outline" className="gap-2">
                    <Award className="size-4" />
                    Badge
                  </Button>
                </a>
                <Link href="/signing-wall">
                  <Button variant="outline" className="gap-2">
                    <Users className="size-4" />
                    Signing Wall
                  </Button>
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-4 text-sm">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I signed the JainZBharat Declaration ${site.domain}/jainz/${success.jainzId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-primary hover:underline"
                >
                  <ExternalLink className="size-3.5" />
                  Share on X
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(`${site.domain}/jainz/${success.jainzId}`)}
                  className="flex items-center gap-1.5 text-primary hover:underline"
                >
                  <Copy className="size-3.5" />
                  Copy Link
                </button>
              </div>
            </div>

            <aside className="space-y-6 lg:col-span-4">
              <div className="glass-card relative overflow-hidden rounded-3xl p-8">
                <div className="absolute -right-12 -top-12 size-32 rounded-full bg-primary/10 blur-3xl" />
                <Diamond className="relative mb-4 size-10 text-amber-400" />
                <h3 className="relative font-heading text-xl font-semibold">Welcome to the Community</h3>
                <p className="relative mt-2 text-sm text-muted-foreground">
                  You have taken the first step. Explore the directory, attend events, and connect with like-minded individuals.
                </p>
              </div>

              <div className="glass-card rounded-3xl p-6">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-amber-500 text-xl font-bold text-white">
                    {(user.fullName ?? user.username ?? '?')[0]}
                  </div>
                  <div>
                    <div className="font-heading text-lg font-semibold leading-none">{user.fullName ?? 'Member'}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-surface/80 px-4 py-4 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-xl items-center justify-between">
            <div className="absolute left-0 top-1/2 -z-10 h-0.5 w-full -translate-y-1/2 bg-white/10" />
            <div className="absolute left-0 top-1/2 -z-10 h-0.5 w-full -translate-y-1/2 bg-primary" />
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === stepIndex;
              const isPast = i < stepIndex;
              return (
                <div key={s.key} className="flex flex-col items-center gap-2">
                  <div className={`flex size-10 items-center justify-center rounded-full ring-8 ring-background ${
                    isPast ? 'bg-primary text-white' : isActive ? 'border-2 border-primary bg-primary/10 text-primary' : 'border-2 border-white/20 bg-surface-high text-muted-foreground'
                  }`}>
                    <Icon className="size-5" />
                  </div>
                  <span className={`text-xs font-semibold ${isPast || isActive ? 'text-primary' : 'text-muted-foreground/50'}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-32 pt-24 md:px-6">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Shield className="size-4" />
            Sign Declaration
          </div>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight md:text-5xl">
            Add your signature to the <span className="text-primary">JainZBharat</span> Declaration.
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Your signature creates a permanent record linked to your unique JainZ ID.
          </p>

          {step === 'read' && (
            <>
              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                  <div className="text-2xl font-bold text-primary">10</div>
                  <div className="text-xs text-muted-foreground">Principles</div>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <div className="text-2xl font-bold text-emerald-400">17</div>
                  <div className="text-xs text-muted-foreground">Commitments</div>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                  <div className="text-2xl font-bold text-amber-400">v1.0</div>
                  <div className="text-xs text-muted-foreground">July 4, 2026</div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent p-6">
                <div className="flex items-center gap-2 text-primary">
                  <FileText className="size-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">In Short</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  JainZBharat is a voluntary community built on ancient wisdom and modern innovation — open to everyone. We choose character over comfort, compassion over violence, and innovation guided by ethics.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-primary/10 bg-primary/[0.02] p-4">
                  <Heart className="size-5 text-primary" />
                  <h4 className="mt-2 font-heading text-sm font-semibold text-white">Core Values</h4>
                  <p className="mt-1 text-xs text-muted-foreground">Compassion, Truth, Discipline, Service, Responsibility</p>
                </div>
                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] p-4">
                  <Lightbulb className="size-5 text-emerald-400" />
                  <h4 className="mt-2 font-heading text-sm font-semibold text-white">Innovation</h4>
                  <p className="mt-1 text-xs text-muted-foreground">Technology must serve humanity, protect privacy, and strengthen communities</p>
                </div>
                <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.02] p-4">
                  <Leaf className="size-5 text-amber-400" />
                  <h4 className="mt-2 font-heading text-sm font-semibold text-white">Environment</h4>
                  <p className="mt-1 text-xs text-muted-foreground">Protect nature, reduce waste, respect all living beings & future generations</p>
                </div>
                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] p-4">
                  <Handshake className="size-5 text-emerald-400" />
                  <h4 className="mt-2 font-heading text-sm font-semibold text-white">Community</h4>
                  <p className="mt-1 text-xs text-muted-foreground">Open to all — regardless of religion, nationality, or background</p>
                </div>
                <div className="rounded-xl border border-primary/10 bg-primary/[0.02] p-4">
                  <Target className="size-5 text-primary" />
                  <h4 className="mt-2 font-heading text-sm font-semibold text-white">Reject</h4>
                  <p className="mt-1 text-xs text-muted-foreground">Violence, hatred, corruption, discrimination, extremism, greed</p>
                </div>
                <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.02] p-4">
                  <Eye className="size-5 text-amber-400" />
                  <h4 className="mt-2 font-heading text-sm font-semibold text-white">Digital Ethics</h4>
                  <p className="mt-1 text-xs text-muted-foreground">Privacy, verify before sharing, responsible AI, respectful dialogue</p>
                </div>
              </div>

              <div className="mt-6 border-l-4 border-primary pl-5 py-3">
                <p className="text-sm italic leading-relaxed text-white/70">
                  &ldquo;I choose character over comfort, integrity over convenience, service over ego, and innovation guided by ethics.&rdquo;
                </p>
                <p className="mt-1 text-xs text-muted-foreground">— The JainZ Pledge</p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button size="lg" onClick={() => setStep('sign')} className="gap-2 shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)]">
                  Sign the Declaration
                  <ArrowRight className="size-5" />
                </Button>
                <Link href="/declaration">
                  <Button variant="ghost" size="sm" className="gap-2 text-xs">
                    <FileText className="size-3.5" />
                    Read full declaration
                  </Button>
                </Link>
              </div>
            </>
          )}

          {step === 'sign' && (
            <div className="glass-card mt-8 rounded-3xl p-8">
              <h2 className="font-heading text-2xl font-semibold">Your Details</h2>
              <p className="mt-2 text-sm text-muted-foreground">Fill in your details to sign the declaration. These will be displayed publicly on the signing wall.</p>

              <div className="mt-6 space-y-5">
                <div className="rounded-xl bg-white/[0.03] p-4">
                  <p className="text-xs text-muted-foreground">Signed in as</p>
                  <p className="mt-1 font-medium">{user.fullName ?? user.username ?? user.primaryEmailAddress?.emailAddress}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Country *</label>
                  <Input placeholder="Your country" className="mt-1" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">City *</label>
                  <Input placeholder="Your city" className="mt-1" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Profession *</label>
                  <Input placeholder="Your profession" className="mt-1" value={profession} onChange={(e) => setProfession(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Organization</label>
                  <Input placeholder="Your organization (optional)" className="mt-1" value={organization} onChange={(e) => setOrganization(e.target.value)} />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex gap-3">
                  <Button onClick={handleSign} disabled={loading}>
                    {loading ? 'Signing...' : 'Sign Declaration'}
                  </Button>
                  <Button variant="ghost" onClick={() => setStep('read')}>Back</Button>
                </div>

                <p className="text-xs text-muted-foreground">By signing, you agree to the principles and commitments of the JainZBharat Declaration.</p>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="glass-card relative overflow-hidden rounded-3xl p-8">
              <div className="absolute -right-12 -top-12 size-32 rounded-full bg-primary/10 blur-3xl" />
              <h3 className="relative font-heading text-xl font-semibold">What happens when you sign?</h3>
              <ul className="relative mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Check className="size-4 text-primary" />
                  </div>
                  <span className="text-sm leading-tight text-muted-foreground">A permanent record with your unique JainZ ID</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Check className="size-4 text-primary" />
                  </div>
                  <span className="text-sm leading-tight text-muted-foreground">Your name appears on the public signing wall</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Check className="size-4 text-primary" />
                  </div>
                  <span className="text-sm leading-tight text-muted-foreground">Certificate with QR and badge for LinkedIn/GitHub</span>
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-amber-500 text-xl font-bold text-white">
                  {(user.fullName ?? user.username ?? '?')[0]}
                </div>
                <div>
                  <div className="font-heading text-lg font-semibold leading-none">{user.fullName ?? 'Member'}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</div>
                </div>
              </div>
            </div>

            <div className="glass-card flex items-center justify-center rounded-3xl p-8">
              <div className="text-center">
                <Globe className="mx-auto size-12 text-primary/50" />
                <p className="mt-3 text-xs italic text-muted-foreground/60">&ldquo;Built for Humanity&rdquo;</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-surface/80 px-4 py-4 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <div className="absolute left-0 top-1/2 -z-10 h-0.5 w-full -translate-y-1/2 bg-white/10" />
          <div className="absolute left-0 top-1/2 -z-10 h-0.5 w-1/3 -translate-y-1/2 bg-primary" style={{ width: `${((stepIndex) / (steps.length - 1)) * 100}%` }} />
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === stepIndex;
            const isPast = i < stepIndex;
            return (
              <div key={s.key} className="flex flex-col items-center gap-2">
                <div className={`flex size-10 items-center justify-center rounded-full ring-8 ring-background ${
                  isPast ? 'bg-primary text-white' : isActive ? 'border-2 border-primary bg-primary/10 text-primary' : 'border-2 border-white/20 bg-surface-high text-muted-foreground'
                }`}>
                  <Icon className="size-5" />
                </div>
                <span className={`text-xs font-semibold ${isPast || isActive ? 'text-primary' : 'text-muted-foreground/50'}`}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
