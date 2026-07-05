import Link from 'next/link';
import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Scale, Lock, Cookie, BookOpen, Flag, Copyright, Mail, Heart, ArrowRight, CheckCircle } from 'lucide-react';

export const metadata = { title: 'Trust Center' };

const sections = [
  { href: '/privacy', icon: Shield, title: 'Privacy Policy', desc: 'How we collect, use, and protect your personal data.', color: 'text-blue-400' },
  { href: '/terms', icon: Scale, title: 'Terms of Service', desc: 'The rules and guidelines for using JainZBharat.', color: 'text-purple-400' },
  { href: '/security', icon: Lock, title: 'Security', desc: 'How we protect your data and infrastructure.', color: 'text-green-400' },
  { href: '/cookies', icon: Cookie, title: 'Cookie Policy', desc: 'How we use cookies and similar technologies.', color: 'text-yellow-400' },
  { href: '/community-guidelines', icon: Heart, title: 'Community Guidelines', desc: 'Expected behavior and community standards.', color: 'text-red-400' },
  { href: '/code-of-conduct', icon: BookOpen, title: 'Code of Conduct', desc: 'Our shared values and ethical commitments.', color: 'text-orange-400' },
  { href: '/content-policy', icon: Flag, title: 'Content Policy', desc: 'How content is moderated and reported.', color: 'text-cyan-400' },
  { href: '/copyright', icon: Copyright, title: 'Copyright', desc: 'Intellectual property rights and DMCA notice.', color: 'text-pink-400' },
  { href: '/contact', icon: Mail, title: 'Contact', desc: 'Get in touch with the JainZBharat team.', color: 'text-indigo-400' },
];

const badges = [
  { label: 'HTTPS Encrypted', desc: 'All traffic encrypted in transit' },
  { label: 'Clerk Auth', desc: 'Enterprise-grade authentication' },
  { label: 'Supabase Backend', desc: 'Managed PostgreSQL database' },
  { label: 'Row-Level Security', desc: 'Per-user data access controls' },
  { label: 'RBAC Enabled', desc: 'Role-based access control' },
  { label: 'Privacy First', desc: 'Data minimization by design' },
];

export default function TrustCenterPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Trust Center</Badge>
      <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight md:text-6xl">Trust Center</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Transparency is foundational to JainZBharat. This center outlines our commitments to your privacy, security, and rights.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.href} href={s.href}>
              <Card className="group transition hover:border-primary/30 h-full">
                <Icon className={`size-10 ${s.color}`} />
                <h3 className="mt-4 font-heading text-lg font-semibold group-hover:text-primary">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                <div className="mt-4">
                  <Button variant="ghost" size="sm" className="group-hover:text-primary">
                    Read <ArrowRight className="ml-1 size-4" />
                  </Button>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-12">
        <h2 className="font-heading text-2xl font-semibold">Security & Trust Badges</h2>
        <p className="mt-1 text-sm text-muted-foreground">JainZBharat is built on modern, secure infrastructure.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((b) => (
            <div key={b.label} className="flex items-start gap-3 rounded-xl border border-border bg-muted/50 p-4">
              <CheckCircle className="mt-0.5 size-5 shrink-0 text-green-400" />
              <div>
                <span className="text-sm font-semibold">{b.label}</span>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="font-heading text-lg font-semibold">Questions or Concerns?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          If you have questions about any of our policies or need to exercise your data rights, please contact us.
        </p>
        <Link href="/contact">
          <Button variant="outline" className="mt-4">Contact Us</Button>
        </Link>
      </div>
    </section>
  );
}
