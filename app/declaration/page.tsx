import Link from 'next/link';
import { Section } from '@/components/section';
import { Card } from '@/components/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { declarationVersions } from '@/lib/declaration';

export const metadata = { title: 'Declaration' };

export default function DeclarationPage() {
  const d = declarationVersions[0];

  return (
    <>
      <Section eyebrow="The JainZBharat Declaration" title={d.version}>
        <Card className="p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Current {d.version}</Badge>
            <time className="text-muted-foreground" dateTime={d.publishedAt}>Archived July 4, 2026</time>
          </div>

          <p className="mt-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">{d.tagline}</p>

          {d.preamble.split('\n\n').map((p, i) => (
            <p key={i} className="mt-4 leading-7 text-muted-foreground">{p}</p>
          ))}

          <h2 className="mt-10 font-heading text-2xl font-semibold">Our Vision</h2>
          {d.vision.split('\n\n').map((p, i) => (
            <p key={i} className="mt-3 leading-7 text-muted-foreground">{p}</p>
          ))}

          <h2 className="mt-10 font-heading text-2xl font-semibold">Our Mission</h2>
          <ul className="mt-4 space-y-2">
            {d.mission.split('\n').map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-heading text-2xl font-semibold">Core Principles</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {d.principles.map((p, i) => (
              <Card key={i} className="p-5">
                <h3 className="font-heading font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.description}</p>
              </Card>
            ))}
          </div>

          <h2 className="mt-10 font-heading text-2xl font-semibold">Our Commitments</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {d.commitments.map((c, i) => (
              <li key={i} className="border-l-2 border-primary pl-4 text-sm">{c}</li>
            ))}
          </ul>

          <h2 className="mt-10 font-heading text-2xl font-semibold">What We Reject</h2>
          <ul className="mt-4 grid gap-2 md:grid-cols-3">
            {d.rejections.map((r, i) => (
              <li key={i} className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{r}</li>
            ))}
          </ul>

          <h2 className="mt-10 font-heading text-2xl font-semibold">Innovation Charter</h2>
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {d.innovationCharter.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-heading text-2xl font-semibold">Bharat Charter</h2>
          <p className="mt-2 text-sm text-muted-foreground">We believe Bharat has the opportunity to contribute to humanity through:</p>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {d.bharatCharter.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-medium">Build in India. Build with India. Build for the World.</p>

          <h2 className="mt-10 font-heading text-2xl font-semibold">Community Charter</h2>
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {d.communityCharter.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-heading text-2xl font-semibold">Declaration of Contribution</h2>
          <p className="mt-2 text-sm text-muted-foreground">Every member is encouraged to contribute through:</p>
          <ul className="mt-3 grid gap-2 md:grid-cols-3">
            {d.contributionAreas.map((area, i) => (
              <li key={i} className="rounded-xl bg-muted p-3 text-sm">{area}</li>
            ))}
          </ul>

          <h2 className="mt-10 font-heading text-2xl font-semibold">Digital Ethics</h2>
          <ul className="mt-4 grid gap-2 md:grid-cols-2">
            {d.digitalEthics.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-heading text-2xl font-semibold">The JainZ Pledge</h2>
          <ul className="mt-4 space-y-2">
            {d.pledge.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-heading text-2xl font-semibold">Closing</h2>
          {d.closing.split('\n\n').map((p, i) => (
            <p key={i} className="mt-3 leading-7 text-muted-foreground">{p}</p>
          ))}

          <div className="mt-10 rounded-2xl bg-muted p-6">
            <h2 className="font-heading text-xl font-semibold">Signatory Commitment</h2>
            <blockquote className="mt-3 italic leading-7 text-muted-foreground">{d.signatoryCommitment}</blockquote>
          </div>

          <div className="mt-10">
            <Link href="/sign-declaration">
              <Button>Sign the Declaration</Button>
            </Link>
          </div>
        </Card>
      </Section>

      <Section eyebrow="Version history" title="Every declaration version remains permanently archived and comparable.">
        <div className="space-y-3">
          {declarationVersions.map((v) => (
            <Card key={v.version}>
              <b>{v.version}</b>
              <span className="ml-3 text-muted-foreground">{v.status}</span>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
