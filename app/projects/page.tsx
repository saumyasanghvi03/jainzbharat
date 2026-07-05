'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ArrowRight } from 'lucide-react';

export default function ProjectsPage() {
  const { isSignedIn } = useUser();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Lightbulb className="size-7 text-primary" />
            <h1 className="font-heading text-3xl font-bold">Community Projects</h1>
          </div>
          <p className="mt-1 text-muted-foreground">Collaborate, build, and innovate together</p>
        </div>
        {isSignedIn && <Button disabled>Start a Project</Button>}
      </div>
      <Card className="p-12 text-center">
        <Lightbulb className="mx-auto size-12 text-muted-foreground" />
        <h3 className="mt-4 font-heading text-lg font-semibold">Coming Soon</h3>
        <p className="mt-1 text-sm text-muted-foreground">Community projects are being built. Soon you&apos;ll be able to create and collaborate on projects here.</p>
        <Link href="/diary">
          <Button variant="outline" className="mt-4">
            <ArrowRight className="size-4" />
            Try the JainZ Diary
          </Button>
        </Link>
      </Card>
    </div>
  );
}
