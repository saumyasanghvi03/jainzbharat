import { type ReactNode } from 'react';
import { Container } from './container';
import { Badge } from './badge';

interface HeroProps {
  badge?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function Hero({ badge, title, description, children }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 grid-bg" />
      <Container className="relative">
        <div className="glass-card p-8 md:p-14">
          {badge && <Badge variant="default">{badge}</Badge>}
          <h1 className="mt-6 max-w-5xl font-heading text-4xl font-semibold tracking-tight md:text-6xl">{title}</h1>
          {description && <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{description}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
