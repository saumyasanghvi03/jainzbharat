'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/card';
import { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface ConnectedAccount {
  name: string;
  icon: string;
  connected: boolean;
  provider: string;
}

export default function SettingsConnectionsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { openUserProfile } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  const accounts = (user?.externalAccounts ?? []).map(acc => ({
    name: acc.provider ?? acc.provider,
    icon: `https://img.icons8.com/color/48/${acc.provider?.toLowerCase() ?? 'google'}-logo.png`,
    connected: true,
    provider: acc.provider ?? 'unknown',
  }));

  const availableProviders = ['google', 'github', 'apple', 'discord', 'twitter', 'linkedin'];
  const connectedProviders = new Set(accounts.map(a => a.provider.toLowerCase()));

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Connected Accounts</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your connected OAuth providers</p>
        <div className="mt-4 space-y-3">
          {availableProviders.map(provider => {
            const connected = connectedProviders.has(provider);
            return (
              <div key={provider} className="flex items-center justify-between rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <span className="text-lg font-bold uppercase text-muted-foreground">{provider[0]}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium capitalize">{provider}</span>
                    <p className="text-xs text-muted-foreground">
                      {connected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${connected ? 'bg-green-500/10 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                  {connected ? 'Active' : 'Inactive'}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <button onClick={() => openUserProfile()} className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ExternalLink className="size-4" />
            Manage connected accounts in Clerk
          </button>
        </div>
      </Card>
    </div>
  );
}
