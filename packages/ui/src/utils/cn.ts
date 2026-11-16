import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Builds a class string from conditional values and resolves Tailwind conflicts,
 * so a consumer's `class="px-8"` wins over a component's `px-4`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
