import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function ExternalLink({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a target="_blank" rel="noopener noreferrer" className={cn("link-underline", className)} {...props} />;
}
