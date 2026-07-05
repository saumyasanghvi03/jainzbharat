import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { platformModules, site } from '@/lib/site';
import { ArrowRight, type LucideIcon, type LucideProps, LayoutDashboard, Users, GraduationCap, Briefcase, HeartHandshake, Brain, Building2, Calendar, BookOpen, Map, Shield, Activity, Globe, Sparkles } from 'lucide-react';

const stats = [
  { value: '12', label: 'Core Values' },
  { value: '25+', label: 'Production Modules' },
  { value: '195+', label: 'Countries Ready' },
  { value: '100%', label: 'Open to Everyone' },
];

function TempleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 6v2h16V6z" />
      <path d="M8 12v-2" />
      <path d="M12 12v-2" />
      <path d="M16 12v-2" />
      <path d="M6 20h12" />
      <path d="M8 20V12" />
      <path d="M16 20V12" />
      <path d="M4 22h16" />
    </svg>
  );
}

const moduleIcons: Record<string, LucideIcon | ((props: { className?: string }) => React.ReactNode)> = {
  dashboard: LayoutDashboard,
  founders: Users,
  students: GraduationCap,
  professionals: Briefcase,
  volunteers: HeartHandshake,
  mentors: Brain,
  sanghs: Building2,
  temples: TempleIcon,
  ngos: Building2,
  events: Calendar,
  learning: BookOpen,
  navkar: Activity,
  map: Map,
  admin: Shield,
};

const values = ['Ahimsa', 'Satya', 'Aparigraha', 'Anekantavada', 'Tapasya', 'Seva', 'Integrity', 'Innovation', 'Learning', 'Compassion', 'Respect', 'Responsibility'];

export default function Home() {
  return (
    <div>
      <section className="relative min-h-[819px] flex items-center justify-center px-5 md:px-16 py-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-16 text-center shadow-[0_0_60px_rgba(249,115,22,0.08)]">
            <div className="text-primary font-label-md uppercase tracking-[0.1em] mb-6 inline-block bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              Made in India · Inspired by Jain Wisdom · Open to Everyone · Built for Humanity
            </div>
            <h1 className="font-heading text-[36px] leading-[1.1] tracking-[-0.04em] md:text-[48px] font-bold text-white mb-6">
              The open digital civilization platform for values, contribution, and community.
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground mb-10 max-w-2xl mx-auto">
              A global movement building a conscious digital ecosystem rooted in ancient wisdom and designed for modern humanity. Join us in creating a values-driven digital future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/declaration">
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-base bg-white text-background hover:bg-white/90 rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                  Read Declaration
                </Button>
              </Link>
              <Link href="/signing-wall">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-base border-white/20 rounded-full">
                  View Signing Wall
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-5 md:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary mb-2">Global Movement</p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl text-white">Impact by the Numbers</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 text-center transition-all duration-300 hover:bg-white/[0.06] hover:border-primary/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.05)]">
              <div className="font-heading text-4xl font-bold text-primary mb-2 md:text-5xl">{s.value}</div>
              <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-5 md:px-16 max-w-7xl mx-auto relative">
        <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-primary/5 blur-[150px] rounded-full" />
        <div className="text-center mb-12 relative z-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary mb-2">Ecosystem</p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl text-white">A Comprehensive Digital Hub</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {platformModules.map((mod) => {
            const Icon = moduleIcons[mod.slug] ?? Globe;
            return (
              <Link key={mod.slug} href={`/${mod.slug}`} className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 transition-all duration-300 hover:bg-white/[0.06] hover:border-primary/30 flex items-center gap-4 group">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-5" />
                </div>
                <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{mod.title}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="py-20 px-5 md:px-16 max-w-7xl mx-auto text-center">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary mb-2">Values</p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl text-white">Our Guiding Principles</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {values.map((v) => (
            <div key={v} className="rounded-full border border-primary/30 bg-white/[0.03] backdrop-blur-xl px-6 py-2.5 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              {v}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
