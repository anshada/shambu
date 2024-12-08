/**
 * @file label.tsx
 * @description An accessible label component built with Radix UI primitives.
 * Provides consistent styling and accessibility features for form labels.
 */

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

/**
 * Label component with consistent styling and accessibility features
 * 
 * @component
 * @example
 * ```tsx
 * <Label htmlFor="email">Email address</Label>
 * <Input id="email" type="email" />
 * ```
 * 
 * Features:
 * - Consistent styling with design system
 * - Proper HTML association with form controls
 * - Disabled state styling
 * - Custom className support
 * - Screen reader friendly
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label }; 