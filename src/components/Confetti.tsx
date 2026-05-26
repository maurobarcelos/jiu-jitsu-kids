"use client";

import { useEffect, useRef } from "react";

export default function Confetti({ trigger }: { trigger: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger === 0 || !containerRef.current) return;

    const colors = [
      "#FFD93D",
      "#FF8C42",
      "#58CC02",
      "#1CB0F6",
      "#CE82FF",
      "#FF4B4B",
    ];
    const container = containerRef.current;

    for (let i = 0; i < 40; i++) {
      const c = document.createElement("div");
      c.style.position = "absolute";
      c.style.width = "10px";
      c.style.height = "10px";
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.left = Math.random() * 100 + "%";
      c.style.top = "-20px";
      c.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      c.style.pointerEvents = "none";
      container.appendChild(c);

      const dur = 1500 + Math.random() * 1500;
      const xMove = (Math.random() - 0.5) * 300;

      c.animate(
        [
          { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(${xMove}px, 500px) rotate(${Math.random() * 720}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: dur,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }
      );

      setTimeout(() => c.remove(), dur);
    }
  }, [trigger]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-50"
    />
  );
}
