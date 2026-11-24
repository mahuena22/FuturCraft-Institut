"use client";
import { useEffect } from "react";
import { analytics } from "@/lib/analytics";

export function TrackedLink({ href, className, children, event, location, ...props }: any) {
  return (
    <a href={href} className={className} onClick={() => analytics.trackCtaClick(event, location)} {...props}>{children}</a>
  );
}
