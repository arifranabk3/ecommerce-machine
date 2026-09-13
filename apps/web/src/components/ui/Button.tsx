import * as React from "react"
import { cn } from "@/utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "danger" | "nav";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      default: "bg-surface border border-border text-content-primary hover:bg-surface-hover hover:border-content-muted shadow-sm",
      primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-500/20 border border-brand-700",
      secondary: "bg-surface-secondary text-content-primary hover:bg-border border border-transparent",
      outline: "border border-border text-content-secondary hover:bg-surface-secondary hover:text-content-primary",
      ghost: "text-content-secondary hover:bg-surface-secondary hover:text-content-primary",
      danger: "bg-danger text-white hover:bg-danger-text shadow-sm border border-danger-text",
      nav: "text-content-secondary hover:text-content-primary hover:bg-surface-secondary font-medium",
    };

    const sizes = {
      default: "h-10 py-2 px-4",
      sm: "h-8 px-3 text-xs rounded-md",
      lg: "h-12 px-8 rounded-xl text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && "opacity-70 pointer-events-none",
          className
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
