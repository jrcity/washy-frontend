import React, { forwardRef, useId, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (event: any) => void; // Using any for compatibility with event-based and value-based handlers
  onBlur?: (event: any) => void;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  name?: string;
  disabled?: boolean;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({
    label,
    error,
    helperText,
    options,
    value,
    onChange,
    onBlur,
    placeholder = 'Select an option',
    className,
    containerClassName,
    name,
    disabled = false
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectId = useId();
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;

      if (onChange) {
        // Create a pseudo-event for compatibility with (e) => e.target.value
        const event = {
          target: {
            value: option.value,
            name: name,
          },
          persist: () => { },
          preventDefault: () => { },
          stopPropagation: () => { },
        };
        onChange(event as any);
      }

      setIsOpen(false);
    };

    const handleToggle = () => {
      if (disabled) return;
      if (isOpen && onBlur) {
        onBlur({ target: { name, value } } as any);
      }
      setIsOpen(!isOpen);
    };

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          if (isOpen && onBlur) {
            onBlur({ target: { name, value } } as any);
          }
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, onBlur, name, value]);

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)} ref={containerRef}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-semibold text-foreground ml-1"
          >
            {label}
          </label>
        )}

        <div className="relative" ref={ref}>
          <button
            id={selectId}
            type="button"
            disabled={disabled}
            onClick={handleToggle}
            className={cn(
              'flex items-center justify-between w-full px-4 py-3.5 bg-background border rounded-2xl transition-all duration-300',
              'text-base text-left min-h-[52px]',
              isOpen
                ? 'ring-4 ring-primary/10 border-primary shadow-sm'
                : 'hover:border-border/80 hover:shadow-sm shadow-sm shadow-muted/50',
              error
                ? 'border-destructive/30 focus:ring-destructive/10'
                : 'border-border',
              disabled && 'bg-muted/50 cursor-not-allowed opacity-60 text-muted-foreground',
              className
            )}
          >
            <span className={cn(
              'truncate',
              !selectedOption && 'text-muted-foreground'
            )}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0',
                isOpen && 'rotate-180 text-primary',
                error && 'text-destructive'
              )}
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <>
                <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 4, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute z-[100] w-full mt-1 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto"
                >
                  <div className="p-1.5">
                    {options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        disabled={option.disabled}
                        onClick={() => handleSelect(option)}
                        className={cn(
                          'flex items-center justify-between w-full px-4 py-3 text-sm rounded-xl transition-all duration-200',
                          'hover:bg-primary/10 hover:text-primary',
                          value === option.value
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-foreground',
                          option.disabled && 'opacity-40 cursor-not-allowed grayscale'
                        )}
                      >
                        <span className="truncate">{option.label}</span>
                        {value === option.value && (
                          <Check className="w-4 h-4 text-primary animate-in zoom-in-50" />
                        )}
                      </button>
                    ))}
                    {options.length === 0 && (
                      <div className="px-4 py-3 text-sm text-muted-foreground text-center italic">
                        No options available
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <input type="hidden" name={name} value={value || ''} />
        </div>

        {error && (
          <p className="text-xs text-destructive font-medium ml-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-xs text-muted-foreground ml-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
