import { Card } from '@/components/card';
import { Badge } from '@/components/ui/badge';

const students = [
  { name: 'Rohan Jain', course: 'B.Tech CS', university: 'IIT Bombay', interests: ['AI/ML', 'Open Source', 'Meditation'] },
  { name: 'Priya Shah', course: 'M.Des', university: 'NID Ahmedabad', interests: ['Design', 'Sustainability', 'Community'] },
  { name: 'Arjun Mehta', course: 'MBA', university: 'Harvard Business School', interests: ['Entrepreneurship', 'Finance', 'Social Impact'] },
];

export const metadata = { title: 'Student Directory' };

export default function StudentsPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Badge variant="default">Student Directory</Badge>
      <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">Connect with fellow students worldwide.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">Learning paths, projects, chapters, scholarships, and mentorship opportunities.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {students.map((s) => (
          <Card key={s.name}>
            <div className="font-heading text-xl font-semibold">{s.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.course} · {s.university}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {s.interests.map((i) => <Badge key={i} variant="secondary">{i}</Badge>)}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
