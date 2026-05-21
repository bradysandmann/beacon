import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  to: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

/**
 * Counts a number from 0 to `to` once the element scrolls into view.
 * Uses framer-motion's `animate` for a smooth ease-out curve and respects
 * prefers-reduced-motion by snapping immediately to the final value.
 */
export function CountUp({
  to,
  durationMs = 1600,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;

    if (prefersReduced) {
      setValue(to);
      return;
    }

    const controls = animate(0, to, {
      duration: durationMs / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, prefersReduced, to, durationMs]);

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix && <span className="stat-suffix">{suffix}</span>}
    </span>
  );
}
