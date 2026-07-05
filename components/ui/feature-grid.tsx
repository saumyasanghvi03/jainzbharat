import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureItem {
  title: string;
  description: string;
  icon?: ReactNode;
}

interface FeatureGridProps {
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const colClasses = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4' };

function FeatureCard({ title, description, icon }: FeatureItem) {
  return (
    <div className="glass-card p-6">
      {icon && <div className="mb-4 text-primary">{icon}</div>}
      <h3 className="font-heading text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

export function FeatureGrid({ items, columns = 3, className }: FeatureGridProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2', colClasses[columns], className)}>
      {items.map((item) => <FeatureCard key={item.title} {...item} />)}
    </div>
  );
}
