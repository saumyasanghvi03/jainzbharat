'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Copy, ExternalLink, Code2, Code, Shield, Award, Globe } from 'lucide-react';
import { Card } from '@/components/card';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { site } from '@/lib/site';

interface BadgeData {
  linkedin: string;
  githubMarkdown: string;
  embed: string;
  jainzId: string;
  name: string;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 shrink-0">
      {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
      {copied ? 'Copied!' : label}
    </Button>
  );
}

function BadgePreview({ badge }: { badge: BadgeData }) {
  return (
    <div className="glass-card rounded-3xl p-8 text-center">
      <Award className="mx-auto size-12 text-amber-400" />
      <h3 className="mt-4 font-heading text-xl font-semibold">{badge.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{badge.jainzId}</p>
      <div className="mt-6 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://img.shields.io/badge/JainZBharat-${badge.jainzId}-d7b56d?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNkN2I1NmQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgM2wxLjY2IDQuODlMMTkgOWwtNCAzLjQ2TDE2LjMyIDE4IDEyIDE0LjUgNy42OCAxOGwxLjMyLTUuNTRMNSA5bDUuMzQtMS4xMXoiLz48L3N2Zz4=`}
          alt="JainZBharat badge"
          className="h-8"
        />
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <a href={`https://github.com/${badge.jainzId}`} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Code2 className="size-3.5" />
            GitHub
          </Button>
        </a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${site.domain}/jainz/${badge.jainzId}`)}`} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ExternalLink className="size-3.5" />
            LinkedIn
          </Button>
        </a>
      </div>
    </div>
  );
}

export default function BadgesPage() {
  const searchParams = useSearchParams();
  const [jainzId, setJainzId] = useState(searchParams.get('jainzId') ?? '');
  const [name, setName] = useState(searchParams.get('name') ?? 'JainZBharat Signatory');
  const [badge, setBadge] = useState<BadgeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBadge = useCallback(async () => {
    if (!jainzId.trim()) {
      setError('Please enter a JainZ ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/badges?jainzId=${encodeURIComponent(jainzId.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Failed to fetch badge');
        return;
      }

      setBadge({
        linkedin: data.linkedin,
        githubMarkdown: data.githubMarkdown,
        embed: data.embed,
        jainzId: jainzId.trim(),
        name: name.trim() || 'JainZBharat Signatory',
      });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [jainzId, name]);



  return (
    <main className="mx-auto max-w-7xl px-4 pb-32 pt-24 md:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
          <Award className="size-4" />
          Badges
        </div>
        <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight md:text-5xl">
          Share your <span className="text-primary">JainZBharat</span> badge.
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Show your commitment on LinkedIn, GitHub, or your personal website.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Card className="rounded-3xl p-8">
              <h2 className="font-heading text-2xl font-semibold">Enter your JainZ ID</h2>
              <p className="mt-2 text-sm text-muted-foreground">Enter the JainZ ID you received after signing the declaration.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium">JainZ ID *</label>
                  <Input
                    placeholder="Your JainZ ID (e.g. JZB-2026-000002)"
                    className="mt-1 font-mono"
                    value={jainzId}
                    onChange={(e) => setJainzId(e.target.value.toUpperCase())}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Display Name</label>
                  <Input
                    placeholder="Your name"
                    className="mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button onClick={fetchBadge} disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Badge'}
                </Button>
              </div>
            </Card>

            {badge && (
              <div className="mt-6 space-y-4">
                <Card className="rounded-3xl p-8">
                  <div className="flex items-center gap-3">
                    <Globe className="size-5 text-[#0A66C2]" />
                    <h3 className="font-heading text-lg font-semibold">LinkedIn Headline</h3>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Add this to your LinkedIn headline or about section.</p>
                  <div className="mt-4 flex items-start gap-3">
                    <code className="flex-1 rounded-xl bg-muted p-4 text-xs leading-relaxed break-all">{badge.linkedin}</code>
                    <CopyButton text={badge.linkedin} label="Copy" />
                  </div>
                </Card>

                <Card className="rounded-3xl p-8">
                  <div className="flex items-center gap-3">
                    <Code2 className="size-5" />
                    <h3 className="font-heading text-lg font-semibold">GitHub README Badge</h3>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Add this to your GitHub profile README to show a badge.</p>
                  <div className="mt-4 flex items-start gap-3">
                    <code className="flex-1 rounded-xl bg-muted p-4 text-xs leading-relaxed break-all">{badge.githubMarkdown}</code>
                    <CopyButton text={badge.githubMarkdown} label="Copy" />
                  </div>
                </Card>

                <Card className="rounded-3xl p-8">
                  <div className="flex items-center gap-3">
                    <Code className="size-5 text-emerald-400" />
                    <h3 className="font-heading text-lg font-semibold">HTML Embed</h3>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Use this HTML snippet on any website.</p>
                  <div className="mt-4 flex items-start gap-3">
                    <code className="flex-1 rounded-xl bg-muted p-4 text-xs leading-relaxed break-all">{badge.embed}</code>
                    <CopyButton text={badge.embed} label="Copy" />
                  </div>
                </Card>

                <div className="text-center">
                  <Link href="/sign-declaration" className="text-sm text-primary hover:underline">
                    Haven&apos;t signed yet? Sign the declaration first
                  </Link>
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              {badge && <BadgePreview badge={badge} />}

              <Card className="rounded-3xl p-6">
                <Shield className="size-8 text-primary" />
                <h3 className="mt-3 font-heading text-lg font-semibold">Verified on-chain</h3>
                <p className="mt-2 text-sm text-muted-foreground">Every badge links back to your permanent JainZ ID profile on JainZBharat, verifiable via QR code.</p>
              </Card>

              <Card className="rounded-3xl p-6">
                <h3 className="font-heading text-lg font-semibold">Where to use badges</h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">→</span>
                    LinkedIn headline or about section
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">→</span>
                    GitHub profile README
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">→</span>
                    Personal website or portfolio
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">→</span>
                    Email signature
                  </li>
                </ul>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
