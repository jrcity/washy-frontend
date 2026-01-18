import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const Spinner = ({ size = 'md', className }: SpinnerProps) => {
  return (
    <Loader2
      className={cn(
        'animate-spin text-primary-600',
        sizeClasses[size],
        className
      )}
    />
  );
};

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = 'Loading...' }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
      <Spinner size="lg" />
      <p className="mt-4 text-neutral-600">{message}</p>
    </div>
  );
};

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay = ({ message }: LoadingOverlayProps) => {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <Spinner size="lg" />
      {message && <p className="mt-4 text-neutral-600">{message}</p>}
    </div>
  );
};

export default Spinner;
