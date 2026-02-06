import * as React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <label className="inline-flex items-center gap-3 cursor-pointer group">
                <div className="relative inline-flex items-center">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        ref={ref}
                        {...props}
                    />
                    <div className={cn(
                        "w-12 h-6.5 bg-muted rounded-full peer transition-all duration-300",
                        "peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20",
                        "peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-primary/80",
                        "after:content-[''] after:absolute after:top-[3px] after:left-[3px]",
                        "after:bg-background after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300",
                        "after:shadow-sm peer-checked:after:translate-x-5.5",
                        className
                    )}></div>
                </div>
                {label && (
                    <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                        {label}
                    </span>
                )}
            </label>
        );
    }
);

Switch.displayName = 'Switch';
