"use client";

import { useEffect, useRef } from "react";

function getCSSVar(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function drawGrid(canvas: HTMLCanvasElement, scrollOffset: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const lineColor = getCSSVar("--grid-line") || "rgba(255,255,255,0.045)";
  const strongColor = getCSSVar("--grid-line-strong") || "rgba(255,255,255,0.09)";

  // Isometric grid: two families of parallel lines at ±30° from horizontal
  const tileW = 80;   // horizontal spacing between rhombus columns
  const tileH = 46;   // vertical spacing (tileW * tan(30°) ≈ 46)
  const parallelShift = scrollOffset * 0.08;

  ctx.lineWidth = 0.6;

  // Family A: lines going from top-left to bottom-right (slope +30°)
  // Family B: lines going from top-right to bottom-left (slope -30°)

  const diagW = W + H * 2;   // wide enough to cover diagonals
  const startX = -diagW / 2;

  for (let i = -40; i < 80; i++) {
    const offsetA = i * tileW + (parallelShift % tileW);
    const isStrongA = i % 4 === 0;

    ctx.beginPath();
    ctx.strokeStyle = isStrongA ? strongColor : lineColor;
    ctx.lineWidth = isStrongA ? 0.9 : 0.5;
    // line slope: dy/dx = tan(30°) = 0.577
    const x0 = startX + offsetA;
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0 + H / 0.577, H);
    ctx.stroke();

    // mirror family
    const offsetB = i * tileW - (parallelShift % tileW);
    const isStrongB = i % 4 === 0;

    ctx.beginPath();
    ctx.strokeStyle = isStrongB ? strongColor : lineColor;
    ctx.lineWidth = isStrongB ? 0.9 : 0.5;
    const x1 = W - startX - offsetB;
    ctx.moveTo(x1, 0);
    ctx.lineTo(x1 - H / 0.577, H);
    ctx.stroke();
  }

  // Horizontal lines (forms rhombus tops/bottoms)
  for (let j = -10; j < 60; j++) {
    const y = j * tileH + (parallelShift * 0.5) % tileH;
    const isStrongH = j % 4 === 0;
    ctx.beginPath();
    ctx.strokeStyle = isStrongH ? strongColor : lineColor;
    ctx.lineWidth = isStrongH ? 0.9 : 0.5;
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
}

export default function IsometricGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const dirtyRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      dirtyRef.current = true;
    }

    function onScroll() {
      scrollRef.current = window.scrollY;
      dirtyRef.current = true;
    }

    function loop() {
      if (dirtyRef.current && canvas) {
        drawGrid(canvas, scrollRef.current);
        dirtyRef.current = false;
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    // Watch data-theme changes to redraw with new colors
    const observer = new MutationObserver(() => {
      dirtyRef.current = true;
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
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
        opacity: 1,
      }}
    />
  );
}
