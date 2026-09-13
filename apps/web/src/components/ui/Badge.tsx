import * as React from "react"
import { cn } from "@/utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline" | "error" | "neutral";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-surface-secondary text-content-secondary border border-border",
    neutral: "bg-surface-secondary text-content-secondary border border-border",
    success: "bg-success-subtle text-success-text border border-success-subtle",
    warning: "bg-warning-subtle text-warning-text border border-warning-subtle",
    danger: "bg-danger-subtle text-danger-text border border-danger-subtle",
    error: "bg-danger-subtle text-danger-text border border-danger-subtle",
    info: "bg-brand-50 text-brand-600 border border-brand-100",
    outline: "border border-border text-content-secondary bg-transparent",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
