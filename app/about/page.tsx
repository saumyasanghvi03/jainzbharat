import { Section } from '@/components/section';
import { Card } from '@/components/card';
import { site } from '@/lib/site';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <Section eyebrow="About" title="JainZBharat is not a religious site or social network; it is open civic infrastructure for values-led contribution.">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <p className="leading-7 text-muted-foreground">{site.description}</p>
        </Card>
        <Card>
          <p className="font-heading text-lg font-semibold">Our Mission</p>
          <p className="mt-2 leading-7 text-muted-foreground">{site.mission}</p>
        </Card>
      </div>
    </Section>
  );
}
