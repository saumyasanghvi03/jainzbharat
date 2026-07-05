import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/card';

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="flex items-center gap-4">
        <Image src={user.imageUrl} alt="" width={56} height={56} className="size-14 rounded-full" />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome, {user.firstName ?? 'User'}
          </h1>
          <p className="mt-1 text-slate-400">JainZBharat community dashboard</p>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Card>
          <h2 className="text-lg font-semibold text-gold">Your JainZ ID</h2>
          <p className="mt-2 text-3xl font-mono tracking-tight">—</p>
          <p className="mt-1 text-sm text-slate-400">Sign the declaration to claim your ID</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-gold">Contribution Score</h2>
          <p className="mt-2 text-3xl font-semibold">0</p>
          <p className="mt-1 text-sm text-slate-400">Start contributing to earn your score</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-gold">Badges</h2>
          <p className="mt-2 text-3xl font-semibold">0</p>
          <p className="mt-1 text-sm text-slate-400">Badges earned from contributions</p>
        </Card>
      </div>
    </section>
  );
}
