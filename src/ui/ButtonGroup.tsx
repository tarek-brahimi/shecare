import React from "react";
import { cn } from "@/lib/utils";

export function InlineButton({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn("text-primary hover:underline text-sm font-medium transition-all", className)} {...props}>
      {children}
    </button>
  );
}

export function TextButton({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn("text-muted-foreground hover:text-foreground text-sm transition-all", className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center gap-2 flex-wrap", className)}>{children}</div>;
}
