"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const visibleClass = "opacity-100 translate-y-0";
const hiddenClass = "opacity-0 translate-y-6";

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  const Comp = Tag as any;

  return (
    <Comp
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : undefined }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? visibleClass : hiddenClass
      } ${className}`}
    >
      {children}
    </Comp>
  );
}
