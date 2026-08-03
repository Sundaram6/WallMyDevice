"use client";

import { useEffect, useRef, useState } from "react";
import { DeviceFrame } from "../Preview/DeviceFrame";
import { PreviewCanvas } from "../Preview/PreviewCanvas";
import { EditingOverlay } from "./EditingOverlay";
import { ContextualToolbar } from "./ContextualToolbar";
import { useStudioCore } from "./useStudioCore";
import { deviceEngine } from "@/lib/engine/DeviceEngine";

export function CenterWorkspace({ isInline = false }: { isInline?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportDims, setViewportDims] = useState({ width: 800, height: 600 });
  const [showTools, setShowTools] = useState(true);

  const {
    deviceType,
    phoneModel,
    aspect,
  } = useStudioCore();

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;
    const el = containerRef.current;

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setViewportDims({
          width: Math.floor(entry.contentRect.width),
          height: Math.floor(entry.contentRect.height),
        });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 1. Resolve Device Metadata (Single Source of Truth)
  // Attempt to match the legacy phoneModel string (e.g. "iphone-16-pro") to the new catalog id (e.g. "apple-iphone-16-pro")
  const catalogList = deviceEngine.listDevices();
  let matchedDevice = catalogList.find(d => 
    (phoneModel && d.id.includes(phoneModel)) || 
    (deviceType === 'desktop' && d.id.includes('desktop')) ||
    (deviceType === 'tablet' && d.id.includes('ipad'))
  );
  
  // Fallbacks
  if (!matchedDevice) {
    if (deviceType === 'tablet') matchedDevice = deviceEngine.getDevice("apple-ipad-pro-13-m4");
    else if (deviceType === 'desktop' || deviceType === 'laptop') matchedDevice = deviceEngine.getDevice("desktop-monitor-4k");
    else matchedDevice = deviceEngine.getDevice("apple-iphone-16-pro"); // Default phone
  }

  // 2. Compute true physical-based layout dimensions
  const orientation = aspect > 1 ? "landscape" : "portrait";
  const metrics = deviceEngine.getLogicalDeviceMetrics(matchedDevice!, orientation);
  
  const layoutWidth = metrics.layoutWidthPx;
  const layoutHeight = metrics.layoutHeightPx;

  // 3. Compute Presentation Scale Factor to fit the viewport
  // Add padding so it doesn't touch the edges
  const paddingPx = isInline ? 24 : 48;
  const availW = Math.max(100, viewportDims.width - paddingPx * 2);
  const availH = Math.max(100, viewportDims.height - paddingPx * 2);

  // We need to fit the *entire frame* into availW/H.
  // The layout width/height is just the screen size. We must account for bezels.
  const totalLayoutW = layoutWidth + (metrics.bezelWidthLayout * 2) + (metrics.frameThicknessLayout * 2);
  const totalLayoutH = layoutHeight + (metrics.bezelWidthLayout * 2) + (metrics.frameThicknessLayout * 2);

  let scaleFactor = availW / totalLayoutW;
  if (totalLayoutH * scaleFactor > availH) {
    scaleFactor = availH / totalLayoutH;
  }

  // Clamp max scale so it doesn't blow up on massive monitors
  scaleFactor = Math.min(scaleFactor, 2.0);

  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    // Subtle 3D tilt max 4 degrees
    setTilt({ rx: -dy * 4, ry: dx * 4 });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <main
      ref={containerRef}
      data-theme="stage"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-1 w-full h-full items-center justify-center overflow-hidden select-none"
      style={{
        backgroundColor: "var(--stage-950)",
        backgroundImage: "radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Contextual Floating Quick Toolbar */}
      {!isInline && showTools && <ContextualToolbar />}

      {/* Centered Non-Scrolling Preview Target Container */}
      {/* Presentation Scale & 3D Parallax Tilt applied via CSS Transform */}
      <div 
        className="relative z-10 flex items-center justify-center origin-center transition-transform duration-[--dur-normal] ease-[--ease-out]"
        style={{
          transform: `scale(${scaleFactor}) perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
      >
        <DeviceFrame
          aspect={aspect}
          deviceType={deviceType}
          phoneModel={phoneModel}
          metrics={metrics}
        >
          <div 
            className="relative" 
            style={{ 
              width: layoutWidth, 
              height: layoutHeight 
            }}
          >
            <PreviewCanvas
              aspect={aspect}
              maxWidth={layoutWidth}
              maxHeight={layoutHeight}
            />
            <EditingOverlay
              width={layoutWidth}
              height={layoutHeight}
            />
          </div>
        </DeviceFrame>
      </div>
    </main>
  );
}
