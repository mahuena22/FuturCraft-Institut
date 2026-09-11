"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { useToast } from "./Toast";
import { openWhatsAppChat, whatsappTemplates } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
  variant?: "default" | "floating" | "inline";
  className?: string;
  children?: React.ReactNode;
}

export function WhatsAppButton({
  phoneNumber = "22943327832",
  defaultMessage,
  variant = "default",
  className = "",
  children,
}: WhatsAppButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const message = defaultMessage || whatsappTemplates.orientation();
    
    // Small delay for UX feedback
    setTimeout(() => {
      openWhatsAppChat(phoneNumber, message);
      showToast({
        type: "success",
        title: "WhatsApp ouvert",
        message: "La conversation a été ouverte dans WhatsApp.",
        duration: 3000,
      });
      setIsLoading(false);
    }, 300);
  };

  const baseStyles = `
    inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200
    bg-[var(--color-fc-cyan)] text-[var(--color-fc-bg)] hover:bg-[var(--color-fc-primary)]
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fc-cyan)] focus-visible:ring-offset-2
  `;

  const variants = {
    default: "px-5 py-3 text-sm shadow-lg shadow-[var(--color-fc-cyan)]/25",
    floating: "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-xl shadow-[var(--color-fc-cyan)]/30",
    inline: "px-4 py-2 text-sm",
  };

  const icon = (
    <MessageCircle className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
  );

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      aria-label="Ouvrir WhatsApp"
    >
      {children || (
        <>
          {icon}
          <span className="hidden sm:inline">WhatsApp</span>
        </>
      )}
    </button>
  );
}

export function WhatsAppFloatButton({
  phoneNumber = "22943327832",
  defaultMessage,
  showAfterScroll = 300,
}: {
  phoneNumber?: string;
  defaultMessage?: string;
  showAfterScroll?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfterScroll]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const message = defaultMessage || whatsappTemplates.orientation();
    
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.open(
          `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
          "_blank",
          "noopener,noreferrer"
        );
      }
      setIsLoading(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center gap-2 p-4 rounded-full bg-[var(--color-fc-cyan)] text-[var(--color-fc-bg)] hover:bg-[var(--color-fc-primary)] shadow-xl shadow-[var(--color-fc-cyan)]/30 transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-fc-cyan)] focus-visible:ring-offset-2"
      aria-label="Discuter sur WhatsApp"
    >
      <svg className={`w-6 h-6 ${isLoading ? "animate-spin" : ""}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.52 3.48A11.914 11.914 0 0012 0C5.373 0 0 5.373 0 12c0 1.654.376 3.244 1.054 4.723L0 24l6.278-1.667c1.271.62 2.665.954 4.106.954 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
        <path fill="none" d="M0 0h24v24H0z" />
      </svg>
      <span className="sr-only">WhatsApp</span>
    </button>
  );
}