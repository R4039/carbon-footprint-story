import { useMemo } from "react";

export type ForestProps = {
  level: 1 | 2 | 3 | 4 | 5;
  health: number; // 0..100
  isNight?: boolean;
  season?: "spring" | "summer" | "autumn" | "winter";
};

/**
 * Isometric forest island that morphs with carbon footprint health.
 * Built entirely as inline SVG so it remains crisp and animates smoothly.
 */
export function ForestIsland({ level, health, isNight = false, season = "spring" }: ForestProps) {
  // deterministic-ish positions
  const trees = useMemo(() => buildTrees(level), [level]);
  const flowers = useMemo(() => buildFlowers(level), [level]);
  const animals = useMemo(() => buildAnimals(level), [level]);
  const butterflies = useMemo(() => buildButterflies(level), [level]);
  const birds = useMemo(() => buildBirds(level), [level]);
  const debris = useMemo(() => buildDebris(level), [level]);

  const dry = level <= 2;
  const grassA = isNight ? "#0e3a2a" : dry ? "#c9b46b" : seasonColor(season, "grassA");
  const grassB = isNight ? "#0a2a1f" : dry ? "#a89352" : seasonColor(season, "grassB");
  const riverA = isNight ? "#1d3a6b" : dry ? "#7a8a5b" : "#8ed7f5";
  const riverB = isNight ? "#0f2347" : dry ? "#5e6f3d" : "#3aa6d8";
  const earth = "#7a5236";
  const earthShade = "#5b3b25";

  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl">
      {/* Sky */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: isNight
            ? "linear-gradient(180deg,#0b1d3b 0%, #1d3a6b 55%, #2b5572 100%)"
            : dry
              ? "linear-gradient(180deg,#f4dba8 0%, #f0c98a 55%, #ead0a6 100%)"
              : "linear-gradient(180deg,#bde9f7 0%, #e8f7ff 55%, #fff6e0 100%)",
        }}
      />

      {/* Sun / Moon */}
      <div
        className="absolute right-[8%] top-[8%] grid size-16 place-items-center rounded-full transition-all duration-700"
        style={{
          background: isNight
            ? "radial-gradient(circle at 35% 35%, #fdf6c8, #d8d8b8 70%, transparent 71%)"
            : "radial-gradient(circle, #fff2a8 0%, #ffd35a 60%, rgba(255,200,80,0) 70%)",
          boxShadow: isNight
            ? "0 0 60px rgba(253,246,200,0.4)"
            : "0 0 80px rgba(255,200,80,0.55)",
        }}
        aria-hidden
      />

      {/* Distant clouds */}
      {!isNight && (
        <>
          <Cloud className="left-[5%] top-[18%] opacity-80" style={{ animation: "drift 22s ease-in-out infinite" }} />
          <Cloud className="left-[60%] top-[10%] scale-75 opacity-70" style={{ animation: "drift 28s ease-in-out infinite reverse" }} />
        </>
      )}
      {isNight && (
        <div className="absolute inset-0">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="absolute size-[2px] rounded-full bg-white"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 55}%`,
                opacity: 0.4 + ((i * 7) % 6) / 10,
                animation: `pulse-soft ${2 + (i % 5)}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Birds */}
      {birds.map((b, i) => (
        <svg
          key={i}
          viewBox="0 0 24 12"
          className="absolute h-3 w-6 text-stone-700"
          style={{
            top: `${b.top}%`,
            left: "-10%",
            animation: `bird-fly ${18 + b.delay}s linear infinite`,
            animationDelay: `${b.delay}s`,
            color: isNight ? "#1a1a2e" : "#3b3b3b",
          }}
        >
          <path d="M2 8 Q6 2 12 7 Q18 2 22 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      ))}

      {/* Isometric island */}
      <svg
        viewBox="0 0 800 550"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={grassA} />
            <stop offset="100%" stopColor={grassB} />
          </linearGradient>
          <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={riverA} />
            <stop offset="100%" stopColor={riverB} />
          </linearGradient>
          <radialGradient id="islandShade" cx="50%" cy="60%" r="60%">
            <stop offset="60%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
          </radialGradient>
          <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>

        {/* Soft shadow */}
        <ellipse cx="400" cy="500" rx="340" ry="42" fill="rgba(0,0,0,0.18)" />

        {/* Island earth (isometric diamond with depth) */}
        <g>
          <path
            d="M400 130 L720 310 L400 490 L80 310 Z"
            fill={isNight ? "#243d2f" : "url(#grass)"}
          />
          {/* depth */}
          <path d="M400 490 L720 310 L720 340 L400 520 Z" fill={earthShade} />
          <path d="M400 490 L80 310 L80 340 L400 520 Z" fill={earth} />
          {/* shading overlay */}
          <path d="M400 130 L720 310 L400 490 L80 310 Z" fill="url(#islandShade)" />
        </g>

        {/* River */}
        {level >= 2 && (
          <g opacity={dry ? 0.7 : 1}>
            <path
              d="M180 360 Q300 320 400 360 T620 360 L600 380 Q500 360 400 380 T200 380 Z"
              fill="url(#river)"
            />
            <path
              d="M220 358 Q320 340 400 358 T580 358"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.5"
              fill="none"
            />
          </g>
        )}

        {/* Debris (high carbon) */}
        {debris.map((d, i) => (
          <g key={`d${i}`} transform={`translate(${d.x},${d.y}) rotate(${d.r})`}>
            <rect width="22" height="4" rx="2" fill="#6b4a2b" />
            <rect x="5" y="-3" width="10" height="4" rx="2" fill="#5a3d22" />
          </g>
        ))}

        {/* Flowers / grass tufts */}
        {flowers.map((f, i) => (
          <g key={`f${i}`} transform={`translate(${f.x},${f.y})`}>
            {f.type === "flower" ? (
              <>
                <circle r="3" fill={f.color} />
                <circle r="1.2" fill="#fff7c2" />
              </>
            ) : (
              <path d={`M-3 0 Q0 -6 3 0`} stroke={dry ? "#9a8a4d" : "#3f7a4e"} strokeWidth="1.4" fill="none" />
            )}
          </g>
        ))}

        {/* Animals */}
        {animals.map((a, i) => (
          <g key={`a${i}`} transform={`translate(${a.x},${a.y}) scale(${a.scale})`}>
            {a.kind === "rabbit" ? <Rabbit /> : <Deer />}
          </g>
        ))}

        {/* Trees - drawn back to front by y */}
        {trees
          .slice()
          .sort((a, b) => a.y - b.y)
          .map((t, i) => (
            <g
              key={`t${i}`}
              transform={`translate(${t.x},${t.y}) scale(${t.scale})`}
              style={{
                transformOrigin: `${t.x}px ${t.y}px`,
                animation: `sway ${5 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${(i % 6) * 0.3}s`,
              }}
            >
              <Tree variant={t.variant} dry={dry} isNight={isNight} season={season} />
            </g>
          ))}
      </svg>

      {/* Butterflies (HTML overlay so they can drift across) */}
      {butterflies.map((b, i) => (
        <span
          key={`b${i}`}
          className="pointer-events-none absolute"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            animation: `drift ${7 + (i % 5)}s ease-in-out infinite`,
            animationDelay: `${b.delay}s`,
            filter: isNight ? "brightness(0.6)" : "none",
          }}
          aria-hidden
        >
          <Butterfly color={b.color} />
        </span>
      ))}

      {/* Wind leaves */}
      {!isNight && level >= 3 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="absolute size-2 rounded-[2px]"
              style={{
                background: season === "autumn" ? "#d97742" : "#9bd6a3",
                left: `-5%`,
                top: `${15 + ((i * 11) % 60)}%`,
                animation: `leaf-blow ${10 + (i % 5)}s linear infinite`,
                animationDelay: `${i * 1.4}s`,
                opacity: 0.85,
              }}
            />
          ))}
        </div>
      )}

      {/* Vignette + night overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isNight
            ? "radial-gradient(ellipse at center, rgba(20,30,60,0) 30%, rgba(8,12,30,0.55) 100%)"
            : "radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      {/* Health label badge — bottom corner */}
      <div className="absolute bottom-3 left-3 rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-forest backdrop-blur-md">
        Forest Health {Math.round(health)}%
      </div>

      <style>{`
        @keyframes bird-fly {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(60vw) translateY(-12px); }
          100% { transform: translateX(120vw) translateY(0); }
        }
        @keyframes leaf-blow {
          0% { transform: translate(0,0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.9; }
          100% { transform: translate(110vw, 40px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ---------- helpers / sub components ---------- */

function seasonColor(season: string, slot: "grassA" | "grassB") {
  switch (season) {
    case "autumn":
      return slot === "grassA" ? "#c8a86b" : "#8a6a3a";
    case "winter":
      return slot === "grassA" ? "#eaf2f5" : "#bcd0d6";
    case "summer":
      return slot === "grassA" ? "#7fc785" : "#3b8c4d";
    default:
      return slot === "grassA" ? "#a5dba6" : "#4d9d62";
  }
}

function Cloud({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`absolute ${className}`} style={style}>
      <svg viewBox="0 0 100 40" className="h-10 w-28">
        <g fill="white" opacity="0.92">
          <ellipse cx="25" cy="25" rx="20" ry="12" />
          <ellipse cx="50" cy="20" rx="22" ry="14" />
          <ellipse cx="75" cy="26" rx="18" ry="11" />
        </g>
      </svg>
    </div>
  );
}

function Butterfly({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 18" className="size-5">
      <g>
        <ellipse cx="8" cy="9" rx="6" ry="7" fill={color} opacity="0.95" />
        <ellipse cx="16" cy="9" rx="6" ry="7" fill={color} opacity="0.95" />
        <circle cx="8" cy="6" r="1.4" fill="rgba(255,255,255,0.7)" />
        <circle cx="16" cy="6" r="1.4" fill="rgba(255,255,255,0.7)" />
        <rect x="11.5" y="3" width="1" height="12" rx="0.5" fill="#3b2a1a" />
      </g>
    </svg>
  );
}

function Rabbit() {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="9" ry="6" fill="#f5efe0" />
      <circle cx="-7" cy="-2" r="4" fill="#f5efe0" />
      <rect x="-10" y="-9" width="2" height="6" rx="1" fill="#f5efe0" />
      <rect x="-6" y="-9" width="2" height="6" rx="1" fill="#f5efe0" />
      <circle cx="-9" cy="-2" r="0.8" fill="#222" />
    </g>
  );
}

function Deer() {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="14" ry="7" fill="#b07a3f" />
      <circle cx="-12" cy="-4" r="5" fill="#b07a3f" />
      <path d="M-15 -9 l-2 -5 M-12 -9 l1 -6 M-10 -9 l3 -5" stroke="#5a3a1c" strokeWidth="1.2" fill="none" />
      <rect x="-8" y="5" width="2" height="6" fill="#7a4a23" />
      <rect x="6" y="5" width="2" height="6" fill="#7a4a23" />
      <circle cx="-14" cy="-4" r="0.8" fill="#222" />
    </g>
  );
}

function Tree({
  variant,
  dry,
  isNight,
  season,
}: {
  variant: "pine" | "oak" | "blossom" | "sapling" | "stump";
  dry: boolean;
  isNight: boolean;
  season: string;
}) {
  const trunk = "#5a3a1c";
  if (variant === "sapling") {
    return (
      <g>
        <rect x="-1" y="-6" width="2" height="6" fill={trunk} />
        <circle cx="0" cy="-10" r="6" fill={dry ? "#a3a05a" : "#5fb371"} />
      </g>
    );
  }
  if (variant === "stump") {
    return (
      <g>
        <ellipse cx="0" cy="0" rx="6" ry="2" fill="#3a2614" />
        <ellipse cx="0" cy="-2" rx="6" ry="2.4" fill="#6a4424" />
      </g>
    );
  }
  if (variant === "pine") {
    const green = isNight ? "#1d3a2a" : dry ? "#7e8a4a" : "#2f7a4d";
    return (
      <g>
        <rect x="-2" y="-8" width="4" height="10" fill={trunk} />
        <polygon points="0,-46 -16,-12 16,-12" fill={green} />
        <polygon points="0,-36 -20,-2 20,-2" fill={green} opacity="0.92" />
      </g>
    );
  }
  if (variant === "blossom") {
    const blossom = season === "autumn" ? "#e8854a" : isNight ? "#a675a8" : "#f7b4cf";
    return (
      <g>
        <rect x="-3" y="-10" width="6" height="14" fill={trunk} />
        <circle cx="0" cy="-26" r="22" fill={blossom} />
        <circle cx="-14" cy="-20" r="13" fill={blossom} opacity="0.9" />
        <circle cx="14" cy="-20" r="13" fill={blossom} opacity="0.9" />
        <circle cx="0" cy="-40" r="11" fill={blossom} opacity="0.95" />
      </g>
    );
  }
  // oak
  const leaves = isNight ? "#1f4030" : dry ? "#9aa45a" : "#3a8d54";
  return (
    <g>
      <rect x="-3" y="-10" width="6" height="14" fill={trunk} />
      <circle cx="0" cy="-26" r="20" fill={leaves} />
      <circle cx="-13" cy="-20" r="12" fill={leaves} opacity="0.95" />
      <circle cx="13" cy="-20" r="12" fill={leaves} opacity="0.95" />
    </g>
  );
}

/* ---------- procedural element builders ---------- */

type TreeVariant = "pine" | "oak" | "blossom" | "sapling" | "stump";

function buildTrees(level: number) {
  // Distribute trees on the iso island. Higher level → more, bigger, more blossoms.
  const slots: Array<{ x: number; y: number }> = [
    { x: 250, y: 320 }, { x: 330, y: 290 }, { x: 420, y: 300 },
    { x: 520, y: 320 }, { x: 580, y: 360 }, { x: 220, y: 380 },
    { x: 300, y: 410 }, { x: 470, y: 420 }, { x: 560, y: 410 },
    { x: 380, y: 250 }, { x: 470, y: 260 }, { x: 200, y: 340 },
    { x: 620, y: 340 }, { x: 350, y: 440 }, { x: 500, y: 450 },
  ];
  const count = [0, 2, 5, 9, 13, 15][level];
  return slots.slice(0, count).map((s, i) => {
    let variant: TreeVariant = "oak";
    if (level === 1) variant = "stump";
    else if (level === 2) variant = i < 2 ? "sapling" : "stump";
    else if (level === 3) variant = i % 4 === 0 ? "blossom" : i % 3 === 0 ? "pine" : "oak";
    else if (level === 4) variant = i % 3 === 0 ? "blossom" : i % 2 === 0 ? "oak" : "pine";
    else variant = i % 2 === 0 ? "blossom" : i % 3 === 0 ? "pine" : "oak";
    return {
      ...s,
      variant,
      scale: 0.7 + (level / 5) * 0.6 + (i % 3) * 0.05,
    };
  });
}

function buildFlowers(level: number) {
  if (level <= 1) return [];
  const colors = ["#ff7a9a", "#ffd166", "#c084fc", "#ff9f6b"];
  const n = [0, 0, 8, 18, 30, 50][level];
  return Array.from({ length: n }).map((_, i) => ({
    x: 180 + ((i * 53) % 460),
    y: 280 + ((i * 31) % 200),
    color: colors[i % colors.length],
    type: (i % 3 === 0 ? "grass" : "flower") as "flower" | "grass",
  }));
}

function buildAnimals(level: number) {
  if (level < 3) return [];
  const kinds: Array<"rabbit" | "deer"> = [];
  if (level >= 3) kinds.push("rabbit");
  if (level >= 4) kinds.push("rabbit", "deer");
  if (level >= 5) kinds.push("deer", "rabbit");
  return kinds.map((kind, i) => ({
    kind,
    x: 230 + i * 110,
    y: 410 + (i % 2) * 15,
    scale: kind === "deer" ? 0.85 : 0.7,
  }));
}

function buildButterflies(level: number) {
  const n = [0, 1, 2, 4, 6, 9][level];
  const colors = ["#ff8fb1", "#ffd166", "#a78bfa", "#fb923c", "#34d399"];
  return Array.from({ length: n }).map((_, i) => ({
    left: 10 + ((i * 17) % 75),
    top: 30 + ((i * 13) % 45),
    delay: (i % 5) * 0.6,
    color: colors[i % colors.length],
  }));
}

function buildBirds(level: number) {
  const n = [0, 0, 1, 2, 3, 4][level];
  return Array.from({ length: n }).map((_, i) => ({
    top: 10 + i * 8,
    delay: i * 4,
  }));
}

function buildDebris(level: number) {
  if (level > 2) return [];
  const n = level === 1 ? 6 : 3;
  return Array.from({ length: n }).map((_, i) => ({
    x: 220 + ((i * 71) % 360),
    y: 330 + ((i * 47) % 130),
    r: (i * 37) % 180,
  }));
}
