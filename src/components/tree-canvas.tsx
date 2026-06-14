import { useMemo } from "react";
import { getStage, type Stage } from "@/lib/tree-data";

export function TreeCanvas({ xp, leaves, butterflies }: { xp: number; leaves: number; butterflies: number }) {
  const { current, next, progress } = getStage(xp);

  const particles = useMemo(
    () =>
      Array.from({ length: Math.min(10, Math.max(3, Math.floor(leaves / 18))) }).map((_, i) => ({
        id: i,
        left: 10 + Math.random() * 80,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 6,
        size: 4 + Math.random() * 6,
      })),
    [leaves],
  );

  const flyers = useMemo(
    () =>
      Array.from({ length: Math.min(4, butterflies) }).map((_, i) => ({
        id: i,
        top: 18 + Math.random() * 35,
        left: 15 + Math.random() * 60,
        delay: i * 1.4,
      })),
    [butterflies],
  );

  return (
    <div className="relative aspect-[5/6] w-full overflow-hidden rounded-3xl border border-white bg-gradient-to-b from-sky to-white shadow-eco">
      {/* sky particles (pollen / fireflies) */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="pointer-events-none absolute top-1/2 rounded-full bg-bloom/70 blur-[1px]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animation: `drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* butterflies */}
      {flyers.map((f) => (
        <span
          key={f.id}
          className="pointer-events-none absolute text-2xl"
          style={{
            top: `${f.top}%`,
            left: `${f.left}%`,
            animation: `drift 7s ease-in-out ${f.delay}s infinite`,
          }}
        >
          🦋
        </span>
      ))}

      {/* tree */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-6">
        <img
          src={current.image}
          alt={`${current.label} tree`}
          className="animate-sway h-[78%] w-auto max-w-[85%] object-contain drop-shadow-[0_25px_25px_rgba(15,42,31,0.18)]"
          style={{ maxHeight: "82%" }}
          width={800}
          height={1000}
        />
      </div>

      {/* progress bar */}
      <div className="absolute inset-x-6 bottom-6 z-10">
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-forest/70">
          <span>{current.label}</span>
          <span>{next ? next.label : "Max"}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/70">
          <div
            className="h-full rounded-full bg-gradient-to-r from-forest to-sage transition-all duration-700"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-sage/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-forest">
      <span className="size-1.5 rounded-full bg-sage" />
      {stage}
    </div>
  );
}
