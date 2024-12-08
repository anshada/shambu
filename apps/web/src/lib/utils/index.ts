/**
 * @file index.ts
 * @description Utility functions for the web application
 */

export * from './mappers';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names using clsx and tailwind-merge
 * This utility helps combine Tailwind CSS classes and handles conflicts
 * 
 * @param inputs - Class names to merge
 * @returns Merged class names string
 * 
 * @example
 * ```tsx
 * const className = cn(
 *   'text-red-500',
 *   isActive && 'bg-blue-500',
 *   'hover:bg-gray-100'
 * );
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 