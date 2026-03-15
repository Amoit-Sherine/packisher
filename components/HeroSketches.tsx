"use client";

import { useEffect, useRef } from "react";

const SKETCHES = {
  house: [
    "M 0,60 L 60,0 L 120,60",
    "M 0,60 L 0,130",
    "M 120,60 L 120,130",
    "M 0,130 L 120,130",
    "M 45,130 L 45,95 L 75,95 L 75,130",
    "M 15,80 L 35,80 L 35,100 L 15,100 L 15,80",
    "M 85,80 L 105,80 L 105,100 L 85,100 L 85,80",
    "M 10,60 L 110,60",
  ],
  laptop: [
    "M 0,0 L 120,0 L 120,80 L 0,80 Z",
    "M 8,8 L 112,8 L 112,72 L 8,72 Z",
    "M -20,82 L 140,82 L 130,100 L -10,100 Z",
    "M 10,88 L 110,88",
    "M 10,94 L 110,94",
    "M 45,86 L 75,86 L 75,96 L 45,96 Z",
    "M 15,18 L 60,18",
    "M 15,28 L 80,28",
    "M 15,38 L 70,38",
    "M 15,48 L 55,48",
  ],
  server: [
    "M 0,0 L 80,0 L 80,140 L 0,140 Z",
    "M 5,10 L 75,10 L 75,30 L 5,30 Z",
    "M 5,35 L 75,35 L 75,55 L 5,55 Z",
    "M 5,60 L 75,60 L 75,80 L 5,80 Z",
    "M 65,20 L 70,20",
    "M 65,45 L 70,45",
    "M 65,70 L 70,70",
    "M 10,90 Q 10,120 40,130",
    "M 40,90 Q 40,115 60,125",
  ],
  truck: [
    "M 60,30 L 120,30 L 120,90 L 60,90 Z",
    "M 0,50 L 60,50 L 60,90 L 0,90 Z",
    "M 65,35 L 115,35 L 115,55 L 65,55 Z",
    "M 85,90 A 15,15 0 1,0 85,90.01",
    "M 20,90 A 15,15 0 1,0 20,90.01",
    "M 85,55 L 85,88",
    "M 20,50 L 20,88",
    "M 40,50 L 40,88",
    "M 120,70 L 135,70 L 135,85 L 120,85",
    "M 125,30 L 125,50",
  ],
  warehouse: [
    "M 0,40 L 0,120 L 160,120 L 160,40",
    "M 0,40 L 80,0 L 160,40",
    "M 55,120 L 55,70 L 105,70 L 105,120",
    "M 15,60 L 40,60 L 40,85 L 15,85 Z",
    "M 120,60 L 145,60 L 145,85 L 120,85 Z",
    "M 20,40 L 140,40",
  ],
  phone: [
    "M 15,0 L 65,0 Q 80,0 80,15 L 80,125 Q 80,140 65,140 L 15,140 Q 0,140 0,125 L 0,15 Q 0,0 15,0 Z",
    "M 8,20 L 72,20",
    "M 8,115 L 72,115",
    "M 28,8 L 52,8",
    "M 38,5 L 42,5",
    "M 15,30 L 65,30 L 65,108 L 15,108 Z",
    "M 30,122 Q 40,119 50,122",
  ],
  satellite: [
    "M 38,40 L 38,90 L 78,90 L 78,40 Z",
    "M 0,50 L 38,50 L 38,80 L 0,80 Z",
    "M 78,50 L 116,50 L 116,80 L 78,80 Z",
    "M 58,0 L 58,40",
    "M 38,14 Q 58,2 78,14",
    "M 0,62 L 116,62",
    "M 12,50 L 12,80",
    "M 104,50 L 104,80",
    "M 48,40 L 48,90",
    "M 68,40 L 68,90",
  ],
  keyboard: [
    "M 0,10 L 0,80 L 150,80 L 150,10 Z",
    "M 6,18 L 24,18 L 24,32 L 6,32 Z",
    "M 28,18 L 46,18 L 46,32 L 28,32 Z",
    "M 50,18 L 68,18 L 68,32 L 50,32 Z",
    "M 72,18 L 90,18 L 90,32 L 72,32 Z",
    "M 94,18 L 112,18 L 112,32 L 94,32 Z",
    "M 116,18 L 144,18 L 144,32 L 116,32 Z",
    "M 6,36 L 30,36 L 30,50 L 6,50 Z",
    "M 34,36 L 58,36 L 58,50 L 34,50 Z",
    "M 62,36 L 86,36 L 86,50 L 62,50 Z",
    "M 90,36 L 114,36 L 114,50 L 90,50 Z",
    "M 118,36 L 144,36 L 144,50 L 118,50 Z",
    "M 40,56 L 110,56 L 110,68 L 40,68 Z",
  ],
};

type SketchName = keyof typeof SKETCHES;

const PAGE_SKETCHES: Record<string, SketchName[]> = {
  home:       ["house", "laptop", "phone", "satellite", "keyboard"],
  technology: ["laptop", "keyboard", "server", "satellite", "phone"],
  logistics:  ["truck", "warehouse", "truck", "house"],
  ventures:   ["house", "warehouse", "house", "server"],
  about:      ["laptop", "house", "keyboard", "satellite"],
  default:    ["laptop", "house", "phone", "keyboard"],
};

interface Placement {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  side: "left" | "right";
}

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function getRandomPlacement(
  side: "left" | "right",
  canvasW: number,
  canvasH: number,
  sizeMultiplier: number
): Placement {
  return {
    x:
      side === "left"
        ? randomBetween(16, 160)
        : randomBetween(canvasW - 300, canvasW - 16),
    // Both sides sit at vertical centre of the viewport
    y: randomBetween(canvasH * 0.28, canvasH * 0.66),
    scale: randomBetween(1.6, 2.0) * sizeMultiplier,
    rotation: randomBetween(-8, 8),
    side,
  };
}

export default function HeroSketches({
  page = "default",
  sizeMultiplier = 1,
  leftOnly = false,
}: {
  page?: string;
  sizeMultiplier?: number;
  leftOnly?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Non-null alias so closures don't re-trigger TypeScript narrowing
    const cv: HTMLCanvasElement = canvas;
    const ctx = cv.getContext("2d")!;

    function resize() {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    function isDark() {
      return document.documentElement.getAttribute("data-theme") === "dark";
    }

    function getStrokeColor() {
      const isTablet = cv.width >= 641 && cv.width <= 1024;
      if (isDark()) return isTablet ? "rgba(240, 237, 232, 0.07)" : "rgba(240, 237, 232, 0.16)";
      return isTablet ? "rgba(100, 100, 100, 0.08)" : "rgba(100, 100, 100, 0.16)";
    }

    // ── SVG path parser ──
    type Cmd = { type: string; args: number[] };

    function parsePath(d: string): Cmd[] {
      const result: Cmd[] = [];
      const tokens = d.trim().split(/(?=[MLQAZmlqaz])/);
      for (const token of tokens) {
        const type = token[0];
        const args = (token.slice(1).match(/-?[\d.]+/g) || []).map(Number);
        result.push({ type, args });
      }
      return result;
    }

    function applyCmd(c: CanvasRenderingContext2D, cmd: Cmd) {
      const a = cmd.args;
      switch (cmd.type.toUpperCase()) {
        case "M": c.moveTo(a[0], a[1]); break;
        case "L": c.lineTo(a[0], a[1]); break;
        case "Q": c.quadraticCurveTo(a[0], a[1], a[2], a[3]); break;
        case "A": c.lineTo(a[5], a[6]); break; // arc approx
        case "Z": c.closePath(); break;
      }
    }

    function applyPartialCmd(
      c: CanvasRenderingContext2D,
      cmd: Cmd,
      cx: number,
      cy: number,
      t: number
    ) {
      const a = cmd.args;
      switch (cmd.type.toUpperCase()) {
        case "L": {
          c.moveTo(cx, cy);
          c.lineTo(cx + (a[0] - cx) * t, cy + (a[1] - cy) * t);
          break;
        }
        case "Q": {
          const x1 = cx + (a[0] - cx) * t;
          const y1 = cy + (a[1] - cy) * t;
          const x2 = a[0] + (a[2] - a[0]) * t;
          const y2 = a[1] + (a[3] - a[1]) * t;
          c.moveTo(cx, cy);
          c.quadraticCurveTo(x1, y1, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
          break;
        }
      }
    }

    function getEndPoint(cmd: Cmd, cx: number, cy: number): [number, number] {
      const a = cmd.args;
      switch (cmd.type.toUpperCase()) {
        case "M": return [a[0], a[1]];
        case "L": return [a[0], a[1]];
        case "Q": return [a[2], a[3]];
        case "A": return [a[5], a[6]];
        default:  return [cx, cy];
      }
    }

    function drawPath(d: string, progress: number) {
      const cmds = parsePath(d);
      if (!cmds.length) return;
      const total = cmds.length;
      const drawUpTo = Math.floor(progress * total);
      const partial = (progress * total) % 1;

      ctx.beginPath();
      let cx = 0, cy = 0;
      for (let i = 0; i < drawUpTo; i++) {
        applyCmd(ctx, cmds[i]);
        [cx, cy] = getEndPoint(cmds[i], cx, cy);
      }
      if (drawUpTo < total && partial > 0) {
        applyPartialCmd(ctx, cmds[drawUpTo], cx, cy, partial);
      }
      ctx.stroke();
    }

    // ── State machine ──
    type Phase = "drawing" | "holding" | "erasing" | "done";
    type ActiveSketch = {
      name: SketchName;
      placement: Placement;
      phase: Phase;
      progress: number;
      pathIndex: number;
    };

    const sketchPool = PAGE_SKETCHES[page] ?? PAGE_SKETCHES.default;
    const active: ActiveSketch[] = [];
    let frameId = 0;
    let lastTime = 0;
    const holdTimers = new Map<ActiveSketch, number>();
    const pendingTimeouts: ReturnType<typeof setTimeout>[] = [];

    const DRAW_SPEED  = 0.003;   // slower draw
    const ERASE_SPEED = 0.003;   // slower erase
    const HOLD_TIME   = 6000;    // hold 6 s before erasing

    function spawnSketch(side: "left" | "right") {
      const name = sketchPool[Math.floor(Math.random() * sketchPool.length)];
      let placement: Placement;
      if (leftOnly) {
        // Both sides sit at vertical centre, left/right edges
        placement = {
          x: side === "left"
            ? randomBetween(12, 100)
            : randomBetween(cv.width - 220, cv.width - 80),
          y: randomBetween(cv.height * 0.28, cv.height * 0.66),
          scale: randomBetween(1.6, 2.0) * sizeMultiplier,
          rotation: randomBetween(-6, 6),
          side,
        };
      } else {
        placement = getRandomPlacement(side, cv.width, cv.height, sizeMultiplier);
      }
      active.push({
        name,
        placement,
        phase: "drawing",
        progress: 0,
        pathIndex: 0,
      });
    }

    spawnSketch("left");
    pendingTimeouts.push(setTimeout(() => spawnSketch("right"), leftOnly ? 3000 : 4000));

    function tick(time: number) {
      const dt = Math.min(time - lastTime, 50);
      lastTime = time;

      ctx.clearRect(0, 0, cv.width, cv.height);

      const toRemove: ActiveSketch[] = [];

      for (const sketch of active) {
        const paths = SKETCHES[sketch.name];
        if (!paths) continue;

        ctx.save();
        // Subtle hand-drawn jitter via setTransform skew oscillation
        ctx.setTransform(
          sketch.placement.scale,
          Math.sin(time * 0.001) * 0.003,
          Math.cos(time * 0.0013) * 0.003,
          sketch.placement.scale,
          sketch.placement.x,
          sketch.placement.y
        );
        ctx.rotate((sketch.placement.rotation * Math.PI) / 180);

        ctx.strokeStyle = getStrokeColor();
        ctx.lineWidth = 0.9;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (sketch.phase === "drawing") {
          for (let i = 0; i < sketch.pathIndex; i++) drawPath(paths[i], 1);
          if (sketch.pathIndex < paths.length) {
            drawPath(paths[sketch.pathIndex], sketch.progress);
            sketch.progress += DRAW_SPEED * dt;
            if (sketch.progress >= 1) {
              sketch.progress = 0;
              sketch.pathIndex++;
              if (sketch.pathIndex >= paths.length) {
                sketch.phase = "holding";
                sketch.pathIndex = paths.length;
                holdTimers.set(sketch, time + HOLD_TIME);
              }
            }
          }
        } else if (sketch.phase === "holding") {
          for (const path of paths) drawPath(path, 1);
          if ((holdTimers.get(sketch) ?? 0) < time) {
            sketch.phase = "erasing";
            sketch.progress = 1;
            sketch.pathIndex = paths.length - 1;
          }
        } else if (sketch.phase === "erasing") {
          for (let i = 0; i < sketch.pathIndex; i++) drawPath(paths[i], 1);
          if (sketch.pathIndex >= 0) {
            drawPath(paths[sketch.pathIndex], sketch.progress);
            sketch.progress -= ERASE_SPEED * dt;
            if (sketch.progress <= 0) {
              sketch.progress = 1;
              sketch.pathIndex--;
              if (sketch.pathIndex < 0) sketch.phase = "done";
            }
          }
        } else {
          toRemove.push(sketch);
        }

        ctx.restore();
      }

      for (const s of toRemove) {
        const idx = active.indexOf(s);
        if (idx !== -1) active.splice(idx, 1);
        holdTimers.delete(s);
        const side = s.placement.side;
        const id = setTimeout(
          () => spawnSketch(side),
          randomBetween(800, 2400)
        );
        pendingTimeouts.push(id);
      }

      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      pendingTimeouts.forEach(clearTimeout);
    };
  }, [page, sizeMultiplier, leftOnly]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="hero-sketches-canvas"
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
      <style>{`
        @media (max-width: 640px) {
          .hero-sketches-canvas { display: none !important; }
        }
      `}</style>
    </>
  );
}
