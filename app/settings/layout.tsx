'use client';

import { useUser } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import {
  User, Shield, Lock, Bell, Plug, Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const settingsNav = [
  { href: '/settings/profile', label: 'Profile', icon: User },
  { href: '/settings/account', label: 'Account', icon: Shield },
  { href: '/settings/privacy', label: 'Privacy', icon: Lock },
  { href: '/settings/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings/connections', label: 'Connections', icon: Plug },
  { href: '/settings/data', label: 'Data', icon: Database },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <h1 className="font-heading text-3xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1 text-muted-foreground">Manage your profile, account, and preferences</p>
      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        <nav className="flex shrink-0 flex-col gap-1 md:w-56" aria-label="Settings">
          {settingsNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
