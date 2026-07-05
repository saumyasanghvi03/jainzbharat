import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children?: ReactNode; className?: string; key?: unknown }) {
  return <div className={`glass-card p-6 ${className}`}>{children}</div>;
}
