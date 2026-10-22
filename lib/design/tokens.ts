/**
 * Design tokens — single source of truth for spacing, color, typography, and
 * motion. Tailwind consumes these via tailwind.config.ts; components should
 * prefer token classes over arbitrary values so the visual system stays
 * coherent and overridable.
 */

export const tokens = {
  // Color roles (semantic, works in both light and dark via Tailwind darkMode: class)
  color: {
    background: "bg-neutral-50 dark:bg-neutral-950",
    backgroundInverse: "bg-neutral-950 dark:bg-neutral-50",
    surface: "bg-white dark:bg-neutral-900",
    surfaceElevated: "bg-white dark:bg-neutral-900 shadow-calc",
    text: "text-neutral-900 dark:text-neutral-50",
    textMuted: "text-neutral-600 dark:text-neutral-400",
    textInverse: "text-white",
    brand: "text-brand-600 dark:text-brand-400",
    brandBg: "bg-brand-50 dark:bg-brand-900/20",
    border: "border-neutral-200 dark:border-neutral-800",
    success: "text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    warning: "text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    error: "text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  },
  // Spacing scale used by layout components
  space: {
    xs: "space-x-1 space-y-1",
    sm: "space-x-2 space-y-2",
    md: "space-x-4 space-y-4",
    lg: "space-x-6 space-y-6",
    xl: "space-x-8 space-y-8",
  },
  // Border radius
  radius: {
    calc: "rounded-calc",
  },
  // Max-width containers
  container: {
    narrow: "max-w-2xl",
    wide: "max-w-5xl",
  },
  // Reduced motion: respect prefers-reduced-motion; disable transitions when set
  motion: {
    reduce: "@media (prefers-reduced-motion: reduce)",
  },
} as const;
