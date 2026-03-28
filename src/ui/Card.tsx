import React from "react";
import { cn } from "@/lib/utils";

interface SheCardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export function SheCard({ className, noPadding, children, ...props }: SheCardProps) {
  return (
    <div className={cn("shecare-card", !noPadding && "p-5", className)} {...props}>
      {children}
    </div>
  );
}
