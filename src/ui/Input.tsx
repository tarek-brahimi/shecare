import React from "react";
import { cn } from "@/lib/utils";

type SheInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function SheInput({ className, ...props }: SheInputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all",
        className
      )}
      {...props}
    />
  );
}
