import React from "react";
import { cn } from "@/lib/utils";

type SheTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function SheTextArea({ className, ...props }: SheTextAreaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none",
        className
      )}
      {...props}
    />
  );
}
