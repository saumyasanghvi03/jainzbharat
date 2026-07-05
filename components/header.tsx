'use client';

import Link from 'next/link';
import { UserButton, Show, SignInButton } from '@clerk/nextjs';
import { navigation } from '@/lib/navigation';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-2xl">
      <a className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4" href="#main-content">
        Skip to content
      </a>
      <nav aria-label="Primary" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link aria-label="JainZBharat home" href="/" className="font-heading text-lg font-semibold tracking-tight">
          JainZ<span className="text-primary">Bharat</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Show when="signed-in">
            <Link href="/dashboard" className="hidden text-sm text-muted-foreground transition hover:text-foreground md:block">
              Dashboard
            </Link>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: 'size-8',
                  userButtonPopoverCard: 'border border-border bg-card shadow-lg',
                  userButtonPopoverActionItem: 'text-foreground hover:text-primary',
                },
              }}
            />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button>Sign in</Button>
            </SignInButton>
          </Show>
        </div>
      </nav>
    </header>
  );
}
