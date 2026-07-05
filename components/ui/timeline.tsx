import { cn } from '@/lib/utils';

interface TimelineItem {
  title: string;
  description: string;
  date?: string;
  status?: 'completed' | 'current' | 'upcoming';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {items.map((item, idx) => (
        <div key={idx} className="relative flex gap-6 pb-8 last:pb-0">
          <div className="flex flex-col items-center">
            <div className={cn(
              'relative z-10 size-4 rounded-full border-2',
              item.status === 'completed' ? 'border-primary bg-primary' :
              item.status === 'current' ? 'border-primary bg-primary/20' :
              'border-border bg-card'
            )} />
            {idx < items.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
          </div>
          <div className="flex-1 pt-0.5">
            <div className="flex items-center gap-3">
              <h3 className="font-heading text-base font-semibold">{item.title}</h3>
              {item.date && <span className="text-xs text-muted-foreground">{item.date}</span>}
            </div>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
