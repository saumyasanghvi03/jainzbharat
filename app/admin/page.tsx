import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';

const stats = [
  { label: 'Total Users', value: '1,247' },
  { label: 'Signatures', value: '892' },
  { label: 'Founders', value: '156' },
  { label: 'Events', value: '23' },
];

export const metadata = { title: 'Admin' };

export default function AdminPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Admin Dashboard</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Platform moderation and analytics.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Verification, moderation, reports, audit logs, and role-based controls.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="font-heading text-3xl font-semibold text-primary">{s.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}
