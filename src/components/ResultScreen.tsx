"use client";

import { useEffect, useState } from "react";
import { getMessage } from "@/types/training";

export default function ResultScreen({
  totalStars,
  rewardMinutes,
  onContinue,
}: {
  totalStars: number;
  rewardMinutes: number;
  onContinue: () => void;
}) {
  const [count, setCount] = useState(0);

  // Anima o número contando de 0 até rewardMinutes
  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const increment = rewardMinutes / steps;
    let current = 0;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current = Math.min(rewardMinutes, Math.round(increment * step));
      setCount(current);
      if (step >= steps || current >= rewardMinutes) {
        clearInterval(interval);
        setCount(rewardMinutes);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [rewardMinutes]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-between py-12 px-6 animate-fade-in">
      {/* Topo - barra de progresso completa */}
      <div className="w-full max-w-sm">
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-leaf rounded-full w-full" />
        </div>
      </div>

      {/* Centro - mascote em spotlight */}
      <div className="relative flex flex-col items-center">
        {/* Raios de luz subindo */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
          <div className="relative w-64 h-64">
            {/* Spotlight base */}
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 70% 60% at center bottom, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.08) 40%, transparent 70%)",
              }}
            />
            {/* Raios verticais */}
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="light-ray animate-ray"
                style={{
                  bottom: "0",
                  left: `${20 + i * 15}%`,
                  height: `${80 + Math.random() * 60}px`,
                  animationDelay: `${i * 0.2}s`,
                  transform: `rotate(${(i - 2) * 8}deg)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Sparkles */}
        <Sparkles />

        {/* Mascote */}
        <div className="relative z-10 text-9xl animate-spotlight">
          🐯
        </div>

        {/* Pedestal */}
        <div className="relative z-10 mt-4 w-32 h-8 rounded-full bg-gradient-to-br from-tangerine to-tangerine/70 shadow-lift" />

        {/* Texto */}
        <div className="relative z-10 mt-10 text-center">
          <h1 className="font-display text-5xl font-semibold text-ink tracking-tight leading-tight">
            Treino<br />completo!
          </h1>

          <div className="mt-8">
            <div className="text-xs font-display font-semibold text-muted uppercase tracking-widest mb-2">
              Minutos de TV
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-7xl font-display font-bold text-ink tabular-nums">
                {count}
              </span>
              <span className="text-leaf text-3xl">✨</span>
            </div>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 bg-leafSoft text-leaf px-4 py-2 rounded-full text-sm font-display font-semibold">
            <span>⭐</span>
            <span>{totalStars}/20 estrelas</span>
          </div>

          <p className="mt-4 text-base text-muted font-display">
            {getMessage(totalStars)}
          </p>
        </div>
      </div>

      {/* Botão Continuar */}
      <button
        onClick={onContinue}
        className="btn-primary w-full max-w-sm text-base animate-slide-up"
        style={{ animationDelay: "0.6s", animationFillMode: "backwards" }}
      >
        Continuar
      </button>
    </div>
  );
}

function Sparkles() {
  const sparkles = [
    { top: "10%", left: "15%", delay: "0s", size: "20px" },
    { top: "15%", left: "80%", delay: "0.3s", size: "16px" },
    { top: "35%", left: "5%", delay: "0.6s", size: "14px" },
    { top: "45%", left: "90%", delay: "0.9s", size: "18px" },
    { top: "5%", left: "50%", delay: "0.4s", size: "12px" },
    { top: "25%", left: "65%", delay: "0.7s", size: "16px" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="absolute text-leaf animate-sparkle"
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size,
            animationDelay: s.delay,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
}
