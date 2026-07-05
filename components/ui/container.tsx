import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[90rem]',
  full: 'max-w-full',
};

const Container = forwardRef<HTMLDivElement, ContainerProps>(({ className, as: Tag = 'div', size = 'lg', children, ...props }, ref) => (
  <Tag ref={ref} className={cn('mx-auto w-full px-4 md:px-6', sizeClasses[size], className)} {...props}>
    {children}
  </Tag>
));
Container.displayName = 'Container';

export { Container };
