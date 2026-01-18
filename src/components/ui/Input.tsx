import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, ...props }, ref) => {
    const inputId = useId();

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-semibold text-neutral-700 mb-2"
          >
            {label}
          </label>
        )}
        
        <div className="relative group p-3">
          <div
            className={cn(
              'flex items-center w-full px-4 py-3 bg-white border rounded-xl transition-all duration-200',
              'focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:border-primary-500',
              'hover:border-neutral-300',
              error
                ? 'border-error-300 focus-within:border-error-500 focus-within:ring-error-500/10'
                : 'border-neutral-200',
              props.disabled && 'bg-neutral-50 cursor-not-allowed opacity-60',
              className
            )}
          >
            {leftIcon && (
              <div className="mr-3 text-neutral-400">
                {leftIcon}
              </div>
            )}
            
            <input
              ref={ref}
              id={inputId}
              className={cn(
                'flex-1 w-full bg-transparent border-none outline-none p-0 text-base text-neutral-900 placeholder:text-neutral-400',
                'focus:ring-0 focus:border-0 focus-within:border-0 focus-within:ring-0',
                props.disabled && 'cursor-not-allowed text-neutral-400'
              )}
              {...props}
            />

            {rightIcon && (
              <div className="ml-3 text-neutral-400">
                {rightIcon}
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-error-600 font-medium">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Checkbox Component
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    const checkboxId = useId();

    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={cn(
            'w-5 h-5 rounded-md border-2 border-neutral-300 text-primary-600 transition-colors',
            'focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2',
            'hover:border-primary-400 cursor-pointer',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className="ml-3 text-sm text-neutral-700 cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
