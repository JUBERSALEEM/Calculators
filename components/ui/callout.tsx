import * as React from "react";
import { cn } from "@/components/lib/cn";

interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "error" | "success";
  title?: string;
}

export function Callout({
  className,
  variant = "info",
  title,
  children,
  ...props
}: CalloutProps) {
  const variants = {
    info: "bg-brand-50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-800 text-brand-900 dark:text-brand-100",
    warning: "bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100",
    error: "bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100",
    success: "bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-100",
  };

  return (
    <div
      role="alert"
      aria-label={title}
      className={cn(
        "rounded-calc p-4 text-sm",
        variants[variant],
        className
      )}
      {...props}
    >
      {title && (
        <h3 className="font-semibold mb-1">{title}</h3>
      )}
      {children}
    </div>
  );
}
