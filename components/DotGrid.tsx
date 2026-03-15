"use client";

import { useEffect, useRef } from "react";

export default function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ctx = canvas.getContext("2d")!;
    const cv: HTMLCanvasElement = canvas;

    const SPACING = 30;
    const DOT_R = 1.4;
    const SCROLL_DRIFT = 0.10;

    function isDark() {
      return document.documentElement.getAttribute("data-theme") === "dark";
    }

    function resize() {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
    }

    function draw() {
      const w = cv.width;
      const h = cv.height;
      const dark = isDark();
      const scrollOffset = scrollRef.current * SCROLL_DRIFT;

      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / SPACING) + 2;
      const rows = Math.ceil(h / SPACING) + 2;

      const alpha = dark ? 0.22 : 0.24;
      const dotColor = dark
        ? `rgba(200,184,154,${alpha})`
        : `rgba(80,60,40,${alpha})`;

      ctx.fillStyle = dotColor;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * SPACING;
          const y = row * SPACING - (scrollOffset % SPACING);
          ctx.beginPath();
          ctx.arc(x, y, DOT_R, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function scheduleFrame() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    }

    function onScroll() {
      scrollRef.current = window.scrollY;
      scheduleFrame();
    }

    function onResize() {
      resize();
      draw();
    }

    resize();
    draw();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new MutationObserver(scheduleFrame);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
