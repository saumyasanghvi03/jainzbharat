import { Section } from '@/components/section';
import { site } from '@/lib/site';
export const metadata = { title: 'About' };
export default function AboutPage() { return <Section eyebrow="About" title="JainZBharat is not a religious site or social network; it is open civic infrastructure for values-led contribution."><p className="max-w-3xl text-lg leading-8 text-slate-300">{site.description}</p></Section>; }
