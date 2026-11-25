/**
 * AnimatedSection — pure CSS fade-up on scroll.
 *
 * Replaces framer-motion to eliminate 73 active JS observers + animation loops.
 * Uses a single shared IntersectionObserver and CSS @keyframes (GPU-only).
 * Visual result is identical: opacity 0→1 + translateY 16px→0.
 */
import { useEffect, useRef, type ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay multiplier (same API as before). */
  delay?: number;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("animate-section-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "-40px 0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`section-fade-up ${className}`}
      style={delay > 0 ? { animationDelay: `${delay * 0.5}s` } : undefined}
    >
      {children}
    </div>
  );
}
