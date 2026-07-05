'use client';

import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  side?: 'left' | 'right';
}

export function Drawer({ open, onClose, children, title, side = 'right' }: DrawerProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'fixed top-0 bottom-0 z-10 flex w-full max-w-md flex-col border-border bg-card p-6 shadow-glass',
        side === 'right' ? 'right-0 border-l animate-in slide-in-from-right' : 'left-0 border-r animate-in slide-in-from-left',
      )}>
        <div className="mb-6 flex items-center justify-between">
          {title && <h2 className="font-heading text-lg font-semibold">{title}</h2>}
          <button onClick={onClose} className="ml-auto rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground" aria-label="Close drawer">
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
