import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sheButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-border bg-transparent hover:bg-muted text-foreground",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        accent: "bg-accent text-accent-foreground hover:bg-accent/80",
      },
      size: {
        sm: "text-xs px-3 py-2",
        md: "text-sm px-4 py-2.5",
        lg: "text-base px-6 py-3",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

interface SheButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof sheButtonVariants> {}

export function SheButton({ className, variant, size, ...props }: SheButtonProps) {
  return <button className={cn(sheButtonVariants({ variant, size }), className)} {...props} />;
}
