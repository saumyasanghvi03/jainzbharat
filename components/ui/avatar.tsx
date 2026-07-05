import { forwardRef, type HTMLAttributes } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

const sizeClasses = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-14 text-lg', xl: 'size-24 text-3xl' };

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({ className, src, alt = '', size = 'md', fallback, ...props }, ref) => (
  <div ref={ref} className={cn('relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted', sizeClasses[size], className)} {...props}>
    {src ? (
          <Image src={src} alt={alt} fill className="object-cover" />
        ) : fallback ? (
      <span className="font-semibold text-muted-foreground">{fallback}</span>
    ) : null}
  </div>
));
Avatar.displayName = 'Avatar';

export { Avatar };
