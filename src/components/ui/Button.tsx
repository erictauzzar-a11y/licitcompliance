import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", loading = false, disabled, icon, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none rounded-xl";

    const variantStyles = {
      primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-sm active:scale-[0.98]",
      secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 shadow-sm border border-slate-700 active:scale-[0.98]",
      outline: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs active:scale-[0.98]",
      danger: "bg-red-600 hover:bg-red-500 text-white shadow-sm active:scale-[0.98]",
      ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900 active:scale-[0.98]",
      link: "text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline p-0 h-auto font-semibold",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 min-h-[32px]",
      md: "text-xs sm:text-sm px-4 py-2.5 gap-2 min-h-[40px]",
      lg: "text-sm sm:text-base px-6 py-3.5 gap-2.5 min-h-[48px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles[variant]} ${variant !== "link" ? sizeStyles[size] : ""} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          icon && <span className="shrink-0" aria-hidden="true">{icon}</span>
        )}
        <span>{children}</span>
      </button>
    );
  }
);
Button.displayName = "Button";
