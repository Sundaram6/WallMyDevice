"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
};

export function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
  direction = "up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Fallback timer ensures elements always become visible even if IntersectionObserver is delayed
    const timer = setTimeout(() => setIsVisible(true), 500);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
          clearTimeout(timer);
        }
      },
      { threshold: 0.01, rootMargin: "100px 0px 100px 0px" }
    );

    observer.observe(node);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const getInitialTransform = () => {
    switch (direction) {
      case "up":
        return "translateY(24px)";
      case "down":
        return "translateY(-24px)";
      case "left":
        return "translateX(24px)";
      case "right":
        return "translateX(-24px)";
      default:
        return "none";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : getInitialTransform(),
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
