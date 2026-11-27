import type { ReactNode } from "react";
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}
/** Content stays visible on slow devices, without scroll-triggered entrances. */
export default function AnimatedSection({
  children,
  className = "",
}: AnimatedSectionProps) {
  return <div className={className}>{children}</div>;
}
