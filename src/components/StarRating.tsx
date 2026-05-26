"use client";

import { playSound } from "@/lib/sounds";

export default function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  function handleClick(v: number) {
    onChange(v);
    playSound("star");
  }

  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            onClick={() => handleClick(n)}
            className="text-5xl select-none touch-manipulation transition-transform active:scale-90"
            style={{
              filter: active ? "none" : "grayscale(100%) opacity(0.3)",
              animation: active ? "starPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
            }}
            aria-label={`${n} estrelas`}
          >
            ⭐
          </button>
        );
      })}
    </div>
  );
}
