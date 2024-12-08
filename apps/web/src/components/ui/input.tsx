/**
 * @file input.tsx
 * @description A reusable input component with consistent styling and accessibility features.
 * This component extends the native HTML input element with custom styling and behavior.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props interface for the Input component
 * Extends all native HTML input attributes
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Input component with consistent styling and accessibility features
 * 
 * @component
 * @example
 * ```tsx
 * <Input
 *   type="text"
 *   placeholder="Enter your name"
 *   onChange={(e) => console.log(e.target.value)}
 * />
 * ```
 * 
 * Features:
 * - Consistent styling with design system
 * - Full keyboard navigation support
 * - Focus and hover states
 * - Disabled state handling
 * - File input styling
 * - Custom className support
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input }; 