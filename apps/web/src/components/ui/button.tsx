/**
 * @file button.tsx
 * @description A versatile button component with multiple variants and sizes.
 * Built with accessibility and customization in mind.
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Button variants configuration using class-variance-authority
 * Defines different visual styles and sizes for the button
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Props interface for the Button component
 * Combines HTML button attributes with variant props
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, the component will render its children as the root element
   * Useful for creating button-like behaviors on other elements
   */
  asChild?: boolean;
}

/**
 * Button component with multiple variants and sizes
 * 
 * @component
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 * ```
 * 
 * Features:
 * - Multiple visual variants (default, destructive, outline, etc.)
 * - Different sizes (sm, default, lg, icon)
 * - Keyboard navigation support
 * - Focus and hover states
 * - Disabled state handling
 * - Custom className support
 * - asChild prop for polymorphic behavior
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants }; 