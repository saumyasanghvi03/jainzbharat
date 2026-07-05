import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getLiveCounts } from '@/lib/supabase/repositories/counts';
import {
  ArrowRight, Users, GraduationCap, Briefcase, HeartHandshake, Brain, Building2,
  Calendar, BookOpen, Map, Shield, Activity, Globe, Sparkles, Club, MessageSquare,
  BookMarked, Trophy, Target, Lightbulb, Home as HomeIcon,
} from 'lucide-react';

function TempleSvg({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 6v2h16V6z" /><path d="M8 12v-2" /><path d="M12 12v-2" /><path d="M16 12v-2" /><path d="M6 20h12" /><path d="M8 20V12" /><path d="M16 20V12" /><path d="M4 22h16" />
    </svg>
  );
}

const ecosystemSuites = [
  {
    id: 'connect',
    title: 'Connect',
    tagline: 'Discover people, communities, and organizations.',
    icon: Users,
    color: 'from-blue-500/20 to-blue-600/10',
    borderHover: 'hover:border-blue-500/40',
    cta: 'Explore People',
    href: '/founders',
    links: [
      { label: 'Founders', href: '/founders' },
      { label: 'Students', href: '/students' },
      { label: 'Professionals', href: '/professionals' },
      { label: 'Mentors', href: '/mentors' },
      { label: 'Volunteers', href: '/volunteers' },
    ],
    span: 'md:col-span-2',
  },
  {
    id: 'communities',
    title: 'Communities',
    tagline: 'Build and grow together.',
    icon: Club,
    color: 'from-emerald-500/20 to-emerald-600/10',
    borderHover: 'hover:border-emerald-500/40',
    cta: 'Join a Community',
    href: '/clubs',
    links: [
      { label: 'Clubs & Kalyanmitra', href: '/clubs' },
      { label: 'Organizations', href: '/organizations' },
      { label: 'Discussions', href: '/discussions' },
      { label: 'Community Chat', href: '/chat' },
      { label: 'Community Feed', href: '/feed' },
    ],
    span: 'md:col-span-2',
  },
  {
    id: 'events',
    title: 'Events & Activities',
    tagline: 'Participate, volunteer, and learn together.',
    icon: Calendar,
    color: 'from-purple-500/20 to-purple-600/10',
    borderHover: 'hover:border-purple-500/40',
    cta: 'Discover Events',
    href: '/events',
    links: [
      { label: 'Global Calendar', href: '/events' },
      { label: 'Volunteer', href: '/volunteers' },
    ],
    span: '',
  },
  {
    id: 'growth',
    title: 'Personal Growth',
    tagline: 'Track your journey.',
    icon: Target,
    color: 'from-amber-500/20 to-amber-600/10',
    borderHover: 'hover:border-amber-500/40',
    cta: 'Open My Journey',
    href: '/diary',
    links: [
      { label: 'JainZ Diary', href: '/diary' },
      { label: 'Navkar Tracker', href: '/navkar-heatmap' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
    span: '',
  },
  {
    id: 'learn',
    title: 'Learn',
    tagline: 'Grow through knowledge and wisdom.',
    icon: BookMarked,
    color: 'from-cyan-500/20 to-cyan-600/10',
    borderHover: 'hover:border-cyan-500/40',
    cta: 'Start Learning',
    href: '/learning',
    links: [
      { label: 'Learning Hub', href: '/learning' },
      { label: 'Declaration', href: '/declaration' },
      { label: 'Signing Wall', href: '/signing-wall' },
    ],
    span: '',
  },
  {
    id: 'build',
    title: 'Build & Innovate',
    tagline: 'Turn ideas into impact.',
    icon: Lightbulb,
    color: 'from-rose-500/20 to-rose-600/10',
    borderHover: 'hover:border-rose-500/40',
    cta: 'Start Building',
    href: '/projects',
    links: [
      { label: 'Community Projects', href: '/projects' },
      { label: 'Mentorship', href: '/mentors' },
    ],
    span: 'md:col-span-2',
  },
  {
    id: 'recognition',
    title: 'Recognition',
    tagline: 'Celebrate meaningful contributions.',
    icon: Trophy,
    color: 'from-yellow-500/20 to-yellow-600/10',
    borderHover: 'hover:border-yellow-500/40',
    cta: 'View My Profile',
    href: '/profile',
    links: [
      { label: 'Badges & Certificates', href: '/profile' },
      { label: 'Impact Score', href: '/dashboard' },
    ],
    span: '',
  },
  {
    id: 'platform',
    title: 'Platform',
    tagline: 'Manage your experience.',
    icon: HomeIcon,
    color: 'from-slate-500/20 to-slate-600/10',
    borderHover: 'hover:border-slate-500/40',
    cta: 'Open Dashboard',
    href: '/settings/profile',
    links: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Settings', href: '/settings/profile' },
      { label: 'Admin', href: '/admin' },
    ],
    span: '',
  },
];

const values = ['Ahimsa', 'Satya', 'Aparigraha', 'Anekantavada', 'Tapasya', 'Seva', 'Integrity', 'Innovation', 'Learning', 'Compassion', 'Respect', 'Responsibility'];

export const dynamic = 'force-dynamic';

export default async function Home() {
  const counts = await getLiveCounts();

  const stats = [
    { value: String(counts.totalProfiles), label: 'Signatories' },
    { value: String(counts.totalCountries), label: 'Countries' },
    { value: String(counts.totalClubs + counts.totalOrganizations || '0'), label: 'Communities' },
    { value: String(counts.totalEvents || '0'), label: 'Events' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[819px] items-center justify-center overflow-hidden px-5 py-20 md:px-16">
        <div className="pointer-events-none absolute inset-0 grid-bg" />
        <div className="pointer-events-none absolute top-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="relative z-10 mx-auto w-full max-w-4xl">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center shadow-[0_0_60px_rgba(249,115,22,0.08)] backdrop-blur-xl md:p-16">
            <div className="mb-6 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-2 font-label-md uppercase tracking-[0.1em] text-primary">
              Made in India · Inspired by Jain Wisdom · Open to Everyone · Built for Humanity
            </div>
            <h1 className="font-heading text-[36px] font-bold leading-[1.1] tracking-[-0.04em] text-white md:text-[48px]">
              The open digital civilization platform for values, contribution, and community.
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              A global movement building a conscious digital ecosystem rooted in ancient wisdom and designed for modern humanity.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/declaration">
                <Button size="lg" className="w-full rounded-full bg-white px-8 py-4 text-base text-background shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:bg-white/90 sm:w-auto">
                  Read Declaration
                </Button>
              </Link>
              <Link href="/signing-wall">
                <Button variant="outline" size="lg" className="w-full rounded-full border-white/20 px-8 py-4 text-base sm:w-auto">
                  View Signing Wall
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-16">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Live Counts</p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-white md:text-4xl">Impact by the Numbers</h2>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.06] hover:shadow-[0_0_20px_rgba(249,115,22,0.05)]">
              <div className="mb-2 font-heading text-4xl font-bold text-primary md:text-5xl">{s.value}</div>
              <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ecosystem Bento Grid */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 md:px-16">
        <div className="pointer-events-none absolute left-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-primary/5 blur-[150px]" />
        <div className="relative mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Ecosystem</p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-white md:text-4xl">Explore the JainZBharat Ecosystem</h2>
          <p className="mt-3 text-muted-foreground">Eight integrated suites — one unified platform for community, growth, and impact.</p>
        </div>
        <div className="relative grid grid-cols-1 gap-4 md:grid-cols-4">
          {ecosystemSuites.map((suite) => {
            const Icon = suite.icon;
            return (
              <div
                key={suite.id}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${suite.color} ${suite.borderHover} ${suite.span} p-6 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.08)]`}
              >
                {/* Glow */}
                <div className="pointer-events-none absolute -inset-40 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent blur-[80px]" />
                </div>
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                    <Icon className="size-6 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white">{suite.title}</h3>
                  <p className="mt-1 text-sm text-white/60">{suite.tagline}</p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                    {suite.links.map((link) => (
                      <Link key={link.href} href={link.href} className="text-xs text-white/40 transition hover:text-white">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-auto pt-6">
                    <Link href={suite.href}>
                      <Button variant="ghost" className="group/btn -ml-3 text-white/70 hover:text-white">
                        {suite.cta}
                        <ArrowRight className="ml-1 size-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-5 py-20 text-center md:px-16">
        <div className="mb-12">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary">Values</p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-white md:text-4xl">Our Guiding Principles</h2>
        </div>
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
          {values.map((v) => (
            <div key={v} className="rounded-full border border-primary/30 bg-white/[0.03] px-6 py-2.5 text-sm font-semibold text-primary backdrop-blur-xl transition-all duration-300 hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              {v}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
