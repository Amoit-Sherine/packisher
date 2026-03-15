"use client";

import { useEffect, useRef } from "react";

// Lens radius in px — change here to resize
const LENS_R = 130;
const D = LENS_R * 2;

export default function BackgroundLens() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Lerped state
    let cx = -9999, cy = -9999;   // current centre (smoothed)
    let tx = -9999, ty = -9999;   // target centre (raw cursor)
    let curOp = 0, tgtOp = 0;    // opacity
    let raf = 0;

    function tick() {
      // Smooth-follow cursor
      cx += (tx - cx) * 0.13;
      cy += (ty - cy) * 0.13;
      curOp += (tgtOp - curOp) * 0.09;

      const op = Math.max(0, Math.min(1, curOp));
      el!.style.transform = `translate(${cx - LENS_R}px, ${cy - LENS_R}px)`;
      el!.style.opacity = op.toFixed(3);

      raf = requestAnimationFrame(tick);
    }

    function onMouseMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;

      const t = e.target as Element | null;

      // Only show in the left/right side margins — hide in the centre content area
      const sideMargin = 200; // px from each viewport edge
      const inSideMargin = tx < sideMargin || tx > window.innerWidth - sideMargin;

      const inProtected = !!(
        t?.closest(".hero-glass") ||
        t?.closest("nav") ||
        t?.closest("footer") ||
        t?.closest(".mobile-menu-overlay")
      );

      const shouldHide = !inSideMargin || inProtected;
      tgtOp = shouldHide ? 0 : 1;

      // Snap instantly when entering protected or centre zones
      if (shouldHide) {
        curOp = 0;
        el!.style.opacity = "0";
      }
    }

    function onMouseLeave() {
      tgtOp = 0;
    }

    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={ref}
        aria-hidden
        className="bg-lens"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: `${D}px`,
          height: `${D}px`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0,
          willChange: "transform, opacity",
          // Completely clear inside — only the very edge ring is painted
          background: [
            "radial-gradient(",
            "  circle,",
            "  transparent 0%,",
            "  transparent 76%,",
            "  rgba(180,160,130,0.14) 84%,",
            "  rgba(180,160,130,0.07) 94%,",
            "  transparent 100%",
            ")",
          ].join(""),
          border: "none",
          boxShadow: "none",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
        }}
      />

      {/* Hide on touch devices where hover doesn't apply */}
      <style>{`
        @media (hover: none) {
          .bg-lens { display: none !important; }
        }
      `}</style>
    </>
  );
}
