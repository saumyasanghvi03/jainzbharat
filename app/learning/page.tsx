import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';

const courses = [
  { title: 'Introduction to Jain Philosophy', level: 'Beginner', duration: '4 weeks', modules: 6 },
  { title: 'Meditation & Mindfulness', level: 'All Levels', duration: '8 weeks', modules: 12 },
  { title: 'Ahimsa in Daily Life', level: 'Intermediate', duration: '6 weeks', modules: 8 },
  { title: 'Jain Art & Architecture', level: 'Advanced', duration: '10 weeks', modules: 15 },
];

export const metadata = { title: 'Learning Hub' };

export default function LearningPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Learning Hub</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Expand your knowledge.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Courses, reading paths, resources, meditation guides, and values education.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {courses.map((c) => (
          <Card key={c.title}>
            <div className="flex items-center justify-between">
              <Badge variant="accent">{c.level}</Badge>
              <span className="text-xs text-muted-foreground">{c.duration}</span>
            </div>
            <div className="mt-3 font-heading text-xl font-semibold">{c.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{c.modules} modules</div>
          </Card>
        ))}
      </div>
    </section>
  );
}
