import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn('text-center py-12 px-4', className)}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted text-muted-foreground mb-4">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground max-w-md mx-auto mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
};

// Alert component for inline messages
interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  className?: string;
}

const alertIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const alertClasses = {
  info: 'bg-info/10 backdrop-blur-sm text-info border-info/20 shadow-sm',
  success: 'bg-success/10 backdrop-blur-sm text-success border-success/20 shadow-sm',
  warning: 'bg-warning/10 backdrop-blur-sm text-warning border-warning/20 shadow-sm',
  error: 'bg-destructive/10 backdrop-blur-sm text-destructive border-destructive/20 shadow-sm',
};

export const Alert = ({ variant = 'info', title, children, className }: AlertProps) => {
  const Icon = alertIcons[variant];

  return (
    <div className={cn('p-4 rounded-2xl border transition-all duration-300', alertClasses[variant], className)}>
      <div className="flex gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-bold text-sm mb-0.5">{title}</h4>}
          <div className="text-sm font-medium leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
