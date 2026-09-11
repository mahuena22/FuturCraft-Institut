"use client";

import { useEffect, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    plausible: (eventName: string, options?: { props?: Record<string, unknown> }) => void;
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const ANALYTICS_ID = process.env.NEXT_PUBLIC_GA_ID || "";
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "";

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    // Page view for GA4
    if (ANALYTICS_ID && typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""),
      });
    }

    // Page view for Plausible
    if (PLAUSIBLE_DOMAIN && typeof window.plausible === "function") {
      window.plausible("pageview");
    }
  }, [pathname, searchParams]);

  const trackEvent = useCallback(
    (eventName: string, params?: Record<string, unknown>) => {
      // GA4
      if (ANALYTICS_ID && typeof window.gtag === "function") {
        window.gtag("event", eventName, params);
      }
      // Plausible
      if (PLAUSIBLE_DOMAIN && typeof window.plausible === "function") {
        window.plausible(eventName, { props: params });
      }
    },
    []
  );

  return { trackEvent };
}

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    if (ANALYTICS_ID && typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""),
      });
    }

    if (PLAUSIBLE_DOMAIN && typeof window.plausible === "function") {
      window.plausible("pageview");
    }
  }, [pathname, searchParams]);

  return null;
}

// Custom event helpers
function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window.plausible === "function") {
    window.plausible(eventName, { props: params });
  }
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

export const analytics = {
  trackInscriptionClick: (formationId?: string, formationTitle?: string) =>
    trackEvent("inscription_click", { formationId, formationTitle }),

  trackContactSubmit: (subject: string) =>
    trackEvent("contact_submit", { subject }),

  trackWhatsAppClick: (source: string) =>
    trackEvent("whatsapp_click", { source }),

  trackDownloadBrochure: (formationId?: string) =>
    trackEvent("download_brochure", { formationId }),

  trackVideoPlay: (videoId: string, videoTitle: string) =>
    trackEvent("video_play", { videoId, videoTitle }),

  trackFilterChange: (filterType: string, filterValue: string) =>
    trackEvent("filter_change", { filterType, filterValue }),

  trackSearch: (query: string, resultsCount: number) =>
    trackEvent("search", { query, resultsCount }),
};