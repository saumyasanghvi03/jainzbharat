import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';

export function ComingSoon({ title, description }: { title: string; description?: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <Card className="mx-auto max-w-2xl p-12 text-center">
        <Badge variant="accent">Coming Soon</Badge>
        <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-4 text-muted-foreground">{description}</p>}
      </Card>
    </section>
  );
}
