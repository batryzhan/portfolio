import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { /** Grow-in underline for inline text links (default). */ underline?: boolean };

export function ExternalLink({ className, underline = true, ...props }: Props) {
  return <a target="_blank" rel="noopener noreferrer" className={cn(underline && "link-underline", className)} {...props} />;
}
