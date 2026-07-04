import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children?: ReactNode; className?: string; key?: unknown }) {
  return <div className={`glass rounded-3xl p-6 ${className}`}>{children}</div>;
}
