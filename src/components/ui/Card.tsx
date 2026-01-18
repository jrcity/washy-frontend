import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: ReactNode;
}

const variantClasses = {
  default: 'bg-white border border-neutral-100/80 shadow-sm hover:shadow-md transition-shadow',
  bordered: 'bg-white border border-neutral-200 shadow-none',
  elevated: 'bg-white border border-neutral-100/50 shadow-xl',
};

const paddingClasses = {
  none: 'p-0',
  sm: 'p-4 sm:p-5',
  md: 'p-5 sm:p-6 lg:p-7',
  lg: 'p-6 sm:p-8 lg:p-10',
};

export const Card = ({
  variant = 'default',
  padding = 'lg',
  hover = false,
  children,
  className,
  ...props
}: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-2xl',
        variantClasses[variant],
        paddingClasses[padding],
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Card sub-components
export const CardHeader = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-lg font-semibold text-neutral-900', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-neutral-500 mt-1', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-4 pt-4 border-t border-neutral-100', className)} {...props}>
    {children}
  </div>
);

export default Card;
