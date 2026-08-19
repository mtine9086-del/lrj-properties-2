"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export type OrbitGalleryProps = {
  images: string[];
  /** 1 (tight) – 20 (wide). Controls how far images sit from the center. */
  orbitRadius?: number;
  /** 1 (small) – 20 (large). Controls the size of each image tile. */
  imageScale?: number;
  /** 0 (square) – 20 (fully round) corners on each tile. */
  rounded?: number;
  direction?: "clockwise" | "counterclockwise";
  /** Higher = faster rotation. */
  speed?: number;
  /** How much faster the ring spins while a tile is hovered. */
  hoverSpeedMultiplier?: number;
};

/**
 * A circular, auto-rotating image gallery. Pure CSS transforms driven by
 * requestAnimationFrame, so it stays smooth without re-rendering the whole
 * tree every frame. Respects prefers-reduced-motion.
 */
export default function OrbitGallery({
  images,
  orbitRadius = 5,
  imageScale = 3,
  rounded = 20,
  direction = "counterclockwise",
  speed = 2,
  hoverSpeedMultiplier = 4,
}: OrbitGalleryProps) {
  const [rotation, setRotation] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const rotRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const liveSpeedRef = useRef(1);
  const dirMultRef = useRef(direction === "counterclockwise" ? -1 : 1);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    dirMultRef.current = direction === "counterclockwise" ? -1 : 1;
  }, [direction]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mql.matches;
  }, []);

  const n = images.length;
  const radiusPx = orbitRadius * 24;
  const imageSizePx = imageScale * 20;
  const borderRadiusPct = (Math.max(0, Math.min(20, rounded)) / 20) * 50;
  const revDurationMs = (20 / speed) * 1000;

  useEffect(() => {
    if (n === 0 || reducedMotionRef.current) return;

    const tick = (ts: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = ts;
      const dt = Math.min(ts - lastTimeRef.current, 100);
      lastTimeRef.current = ts;
      const degsPerMs = (360 / revDurationMs) * liveSpeedRef.current * dirMultRef.current;
      rotRef.current += dt * degsPerMs;
      setRotation(rotRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    };
  }, [n, revDurationMs]);

  const handleEnter = useCallback(
    (index: number) => {
      liveSpeedRef.current = hoverSpeedMultiplier;
      setHoveredIndex(index);
    },
    [hoverSpeedMultiplier]
  );

  const handleLeave = useCallback(() => {
    liveSpeedRef.current = 1;
    setHoveredIndex(null);
  }, []);

  if (n === 0) return null;

  return (
    <div onMouseLeave={handleLeave} style={{ position: "relative", width: "100%", height: "100%" }}>
      {images.map((src, i) => {
        const baseAngle = (i / n) * 360;
        const angleRad = (baseAngle + rotation) * (Math.PI / 180);
        const x = Math.cos(angleRad) * radiusPx;
        const y = Math.sin(angleRad) * radiusPx;
        const isHovered = hoveredIndex === i;

        return (
          <div
            key={i}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              zIndex: isHovered ? n + 10 : n - i,
              willChange: "transform",
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
            }}
          >
            <motion.div
              animate={{ scale: isHovered ? 1.12 : 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ lineHeight: 0 }}
            >
              <img
                src={src}
                alt=""
                draggable={false}
                style={{
                  width: imageSizePx,
                  height: imageSizePx,
                  objectFit: "cover",
                  display: "block",
                  borderRadius: `${borderRadiusPct}%`,
                  boxShadow: "0 12px 30px rgba(23,63,53,0.28)",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
