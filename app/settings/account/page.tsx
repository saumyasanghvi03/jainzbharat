'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useEffect, useState } from 'react';
import { Mail, Key, LogOut, Trash2, ExternalLink, Smartphone } from 'lucide-react';

export default function SettingsAccountPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  const handleSignOutAll = async () => {
    try {
      await signOut();
      router.push('/');
    } catch {
      toast('Failed to sign out', 'error');
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <Mail className="size-5 text-primary" />
          <div>
            <h2 className="font-heading text-lg font-semibold">Email Address</h2>
            <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress ?? 'No email'}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Email is managed through Clerk. To change your email, use the account management below.</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <Key className="size-5 text-primary" />
          <div>
            <h2 className="font-heading text-lg font-semibold">Account Security</h2>
            <p className="text-sm text-muted-foreground">Manage your password, two-factor authentication, and connected accounts</p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" onClick={() => openUserProfile()}>
            <ExternalLink className="size-4" />
            Open Account Settings
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Account management (password, 2FA, sessions, connected accounts) is handled by Clerk's secure interface.</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3">
          <Smartphone className="size-5 text-primary" />
          <div>
            <h2 className="font-heading text-lg font-semibold">Sessions</h2>
            <p className="text-sm text-muted-foreground">Sign out of all active sessions</p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" onClick={handleSignOutAll}>
            <LogOut className="size-4" />
            Sign Out All Devices
          </Button>
        </div>
      </Card>

      <Card className="border-destructive/30 p-6">
        <div className="flex items-center gap-3">
          <Trash2 className="size-5 text-destructive" />
          <div>
            <h2 className="font-heading text-lg font-semibold text-destructive">Delete Account</h2>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="danger" onClick={async () => {
            if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
            if (!window.confirm('This will permanently delete your profile, messages, and all data. Continue?')) return;
            try {
              const res = await fetch('/api/profile/delete', { method: 'DELETE' });
              if (!res.ok) throw new Error('Delete failed');
              await signOut();
              router.push('/');
            } catch {
              toast('Failed to delete account', 'error');
            }
          }}>
            <Trash2 className="size-4" />
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
