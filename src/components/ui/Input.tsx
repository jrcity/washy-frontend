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
            className="block text-sm font-semibold text-neutral-700 mb-2 ml-1"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            'flex items-center w-full px-4 py-3.5 bg-white border rounded-2xl transition-all duration-300',
            'focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:border-primary-500',
            'hover:border-neutral-300 hover:shadow-sm',
            'shadow-sm shadow-neutral-100/50',
            error
              ? 'border-error-300 focus-within:border-error-500 focus-within:ring-error-500/10'
              : 'border-neutral-200',
            props.disabled && 'bg-neutral-50/50 cursor-not-allowed opacity-60',
            className
          )}
        >
          {leftIcon && (
            <div className="mr-3 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'flex-1 w-full bg-transparent border-none outline-none p-0 text-base text-neutral-900 placeholder:text-neutral-400',
              'focus:ring-0 focus:border-0',
              props.disabled && 'cursor-not-allowed'
            )}
            {...props}
          />

          {rightIcon && (
            <div className="ml-3 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-2 text-sm text-error-600 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-2 text-sm text-neutral-500 ml-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Checkbox Component
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, ...props }, ref) => {
    const checkboxId = useId();

    return (
      <div className={cn("flex items-start gap-3 group", className)}>
        <div className="relative flex items-center justify-center mt-1">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              'peer w-6 h-6 rounded-lg border-2 border-neutral-300 bg-white transition-all duration-300',
              'checked:bg-primary-600 checked:border-primary-600',
              'focus:ring-4 focus:ring-primary-500/20 focus:outline-none focus:border-primary-500',
              'hover:border-primary-400 cursor-pointer',
              'active:scale-95',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-100'
            )}
            style={{ appearance: 'none' }}
            {...props}
          />
          {/* Custom checkmark */}
          <svg
            className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-all duration-300 scale-50 peer-checked:scale-100"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {(label || description) && (
          <div className="flex flex-col py-0.5">
            {label && (
              <label
                htmlFor={checkboxId}
                className="text-sm font-semibold text-neutral-700 cursor-pointer select-none group-hover:text-neutral-900 transition-colors peer-checked:text-primary-700"
              >
                {label}
              </label>
            )}
            {description && (
              <span className="text-xs text-neutral-500 mt-1">{description}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Radio Component
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className, ...props }, ref) => {
    const radioId = useId();

    return (
      <div className={cn("flex items-start gap-3 group", className)}>
        <div className="relative flex items-center justify-center mt-1">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            className={cn(
              'peer w-6 h-6 rounded-full border-2 border-neutral-300 bg-white transition-all duration-300',
              'checked:border-primary-600',
              'focus:ring-4 focus:ring-primary-500/20 focus:outline-none focus:border-primary-500',
              'hover:border-primary-400 cursor-pointer',
              'active:scale-95',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-100'
            )}
            style={{ appearance: 'none' }}
            {...props}
          />
          {/* Custom radio dot */}
          <div className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 pointer-events-none opacity-0 peer-checked:opacity-100 transition-all duration-300 scale-50 peer-checked:scale-100 shadow-sm shadow-primary-500/20" />
        </div>
        {(label || description) && (
          <div className="flex flex-col py-0.5">
            {label && (
              <label
                htmlFor={radioId}
                className="text-sm font-semibold text-neutral-700 cursor-pointer select-none group-hover:text-neutral-900 transition-colors peer-checked:text-primary-700"
              >
                {label}
              </label>
            )}
            {description && (
              <span className="text-xs text-neutral-500 mt-1">{description}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

// Radio Group Component
export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; description?: string; disabled?: boolean }>;
  label?: string;
  error?: string;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export const RadioGroup = ({
  name,
  value,
  onChange,
  options,
  label,
  error,
  direction = 'vertical',
  className
}: RadioGroupProps) => {
  const groupId = useId();

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 mb-3">
          {label}
        </label>
      )}
      <div
        role="radiogroup"
        aria-labelledby={groupId}
        className={cn(
          direction === 'horizontal' ? 'flex flex-wrap gap-6' : 'flex flex-col gap-3'
        )}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-error-600 font-medium">{error}</p>
      )}
    </div>
  );
};

