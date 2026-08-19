"use client";

import { useEffect, useRef } from "react";

export type KineticGridProps = {
  dotColor?: string;
  lineColor?: string;
  trailColor?: string;
  spacing?: number;
  radius?: number;
  strength?: number;
  trail?: boolean;
};

type Dot = { hx: number; hy: number; x: number; y: number; vx: number; vy: number };

/**
 * A reactive dot grid that's pulled toward the cursor within a chosen
 * radius, with a soft trail line following the mouse. Renders a static
 * mesh (no animation loop) when the visitor prefers reduced motion.
 */
export default function KineticGrid({
  dotColor = "#f5f2eb",
  lineColor = "#e1c47d",
  trailColor = "#e1c47d",
  spacing = 34,
  radius = 190,
  strength = 4,
  trail = true,
}: KineticGridProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const GAP = Math.max(8, spacing);
    const R = Math.max(1, radius);
    const PULL = (Math.max(1, Math.min(10, strength)) / 10) * 4;

    let W = 1;
    let H = 1;
    let cols: Dot[][] = [];
    let dots: Dot[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    const trailPoints: { x: number; y: number; t: number }[] = [];

    const build = (mw?: number, mh?: number) => {
      const r = host.getBoundingClientRect();
      W = Math.max(1, Math.floor(mw ?? r.width));
      H = Math.max(1, Math.floor(mh ?? r.height));
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = [];
      dots = [];
      const nCols = Math.floor(W / GAP) + 2;
      const nRows = Math.floor(H / GAP) + 2;
      for (let c = 0; c < nCols; c++) {
        const col: Dot[] = [];
        for (let rIdx = 0; rIdx < nRows; rIdx++) {
          const hx = c * GAP;
          const hy = rIdx * GAP;
          const d = { hx, hy, x: hx, y: hy, vx: 0, vy: 0 };
          col.push(d);
          dots.push(d);
        }
        cols.push(col);
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.75;
      for (let c = 0; c < cols.length; c++) {
        for (let rIdx = 0; rIdx < cols[c].length; rIdx++) {
          const d = cols[c][rIdx];
          const right = cols[c + 1]?.[rIdx];
          const down = cols[c]?.[rIdx + 1];
          if (right) {
            ctx.beginPath();
            ctx.moveTo(d.hx, d.hy);
            ctx.lineTo(right.hx, right.hy);
            ctx.stroke();
          }
          if (down) {
            ctx.beginPath();
            ctx.moveTo(d.hx, d.hy);
            ctx.lineTo(down.hx, down.hy);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = dotColor;
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.hx, d.hy, 1.2, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    build();

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      build(cr?.width, cr?.height);
      if (reducedMotion) drawStatic();
    });
    ro.observe(host);

    if (reducedMotion) {
      drawStatic();
      return () => ro.disconnect();
    }

    let pointerLastMove = -Infinity;
    const POINTER_TIMEOUT = 1400;
    const setMouse = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect();
      const mx = clientX - r.left;
      const my = clientY - r.top;
      const inside = mx >= 0 && my >= 0 && mx <= r.width && my <= r.height;
      if (inside) {
        mouse.x = mx;
        mouse.y = my;
        pointerLastMove = performance.now();
        const now = performance.now();
        trailPoints.push({ x: mx, y: my, t: now });
        if (trailPoints.length > 80) trailPoints.shift();
      }
    };
    const onMove = (e: MouseEvent) => setMouse(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setMouse(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    let raf = 0;
    const startTime = performance.now();
    const frame = (ts: number) => {
      ctx.clearRect(0, 0, W, H);

      const pointerRecent = ts - pointerLastMove < POINTER_TIMEOUT;
      if (pointerRecent) {
        mouse.active = true;
      } else {
        // Ambient drift: a slow figure-eight path keeps the grid visibly
        // alive when nobody is actively hovering (always true on touch
        // devices unless mid-drag) so the effect never reads as "broken".
        const t = (ts - startTime) / 1000;
        const ax = 0.28;
        const ay = 0.22;
        mouse.x = W / 2 + Math.sin(t * 0.35) * W * ax;
        mouse.y = H / 2 + Math.sin(t * 0.7) * H * ay;
        mouse.active = true;
      }

      for (const d of dots) {
        let ax = (d.hx - d.x) * 0.08;
        let ay = (d.hy - d.y) * 0.08;
        if (mouse.active) {
          const dx = mouse.x - d.x;
          const dy = mouse.y - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < R && dist > 0.001) {
            const f = (1 - dist / R) * PULL;
            ax += (dx / dist) * f;
            ay += (dy / dist) * f;
          }
        }
        d.vx = (d.vx + ax) * 0.82;
        d.vy = (d.vy + ay) * 0.82;
        d.x += d.vx;
        d.y += d.vy;
      }

      for (let c = 0; c < cols.length; c++) {
        for (let rIdx = 0; rIdx < cols[c].length; rIdx++) {
          const d = cols[c][rIdx];
          const right = cols[c + 1]?.[rIdx];
          const down = cols[c]?.[rIdx + 1];
          const prox = mouse.active
            ? Math.max(0, 1 - Math.sqrt((mouse.x - d.x) ** 2 + (mouse.y - d.y) ** 2) / R)
            : 0;
          if (right) {
            ctx.globalAlpha = 0.08 + prox * 0.6;
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.6 + prox * 1.6;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(right.x, right.y);
            ctx.stroke();
          }
          if (down) {
            ctx.globalAlpha = 0.08 + prox * 0.6;
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.6 + prox * 1.6;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(down.x, down.y);
            ctx.stroke();
          }
        }
      }

      for (const d of dots) {
        const prox = mouse.active
          ? Math.max(0, 1 - Math.sqrt((mouse.x - d.x) ** 2 + (mouse.y - d.y) ** 2) / R)
          : 0;
        ctx.globalAlpha = 0.22 + prox * 0.65;
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 0.8 + prox * 2.2, 0, 2 * Math.PI);
        ctx.fill();
      }

      if (trail) {
        const now = performance.now();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (let i = 1; i < trailPoints.length; i++) {
          const a = trailPoints[i - 1];
          const b = trailPoints[i];
          const age = now - b.t;
          if (age > 260) continue;
          ctx.globalAlpha = Math.max(0, 1 - age / 260) * 0.7;
          ctx.strokeStyle = trailColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [dotColor, lineColor, trailColor, spacing, radius, strength, trail]);

  return (
    <div ref={hostRef} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </div>
  );
}
