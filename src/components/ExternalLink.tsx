import type { AnchorHTMLAttributes } from "react";

export function ExternalLink({ className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a target="_blank" rel="noopener noreferrer" className={`trace-link ${className}`} {...props} />;
}
