import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';

export const metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Your Profile</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Your JainZBharat identity.</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card className="p-8 text-center">
          <Image src={user.imageUrl} alt="" width={96} height={96} className="mx-auto size-24 rounded-full" />
          <div className="mt-4 font-heading text-xl font-semibold">{user.fullName ?? 'User'}</div>
          <div className="mt-1 text-sm text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</div>
          <div className="mt-4 font-mono text-sm text-primary">JZB-2026-000001</div>
          <Badge variant="accent" className="mt-3">Pledge Signed</Badge>
        </Card>
        <div className="space-y-4">
          <Card>
            <div className="font-heading text-lg font-semibold">Contribution Score</div>
            <div className="mt-2 font-heading text-3xl text-primary">100</div>
            <p className="mt-1 text-sm text-muted-foreground">Declaration signed · Badge earned</p>
          </Card>
          <Card>
            <div className="font-heading text-lg font-semibold">Badges</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="default">Early Adopter</Badge>
              <Badge variant="secondary">Pledge Signer</Badge>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
