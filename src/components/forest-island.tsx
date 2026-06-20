import { useMemo } from "react";

export type ForestProps = {
  level: 1 | 2 | 3 | 4 | 5;
  health: number; // 0..100
  isNight?: boolean;
  season?: "spring" | "summer" | "autumn" | "winter";
  /** Total check-ins so far — each entry plants an extra tree. */
  entriesCount?: number;
};

/**
 * Vibrant isometric forest island. Grows with every check-in entry.
 */
export function ForestIsland({
  level,
  health,
  isNight = false,
  season = "spring",
  entriesCount = 0,
}: ForestProps) {
  const trees = useMemo(() => buildTrees(level, entriesCount), [level, entriesCount]);
  const flowers = useMemo(() => buildFlowers(level, entriesCount), [level, entriesCount]);
  const animals = useMemo(() => buildAnimals(level), [level]);
  const butterflies = useMemo(() => buildButterflies(level), [level]);
  const birds = useMemo(() => buildBirds(level), [level]);
  const debris = useMemo(() => buildDebris(level), [level]);
  const mushrooms = useMemo(() => buildMushrooms(entriesCount), [entriesCount]);

  const dry = level <= 1;
  const grassA = isNight ? "#16513a" : dry ? "#e8c878" : seasonColor(season, "grassA");
  const grassB = isNight ? "#0d3a28" : dry ? "#c4a258" : seasonColor(season, "grassB");
  const grassHi = isNight ? "#1f6a4a" : dry ? "#f3d995" : seasonColor(season, "grassHi");
  const riverA = isNight ? "#2554a8" : dry ? "#8aa05a" : "#7be0ff";
  const riverB = isNight ? "#14306b" : dry ? "#6a7d3d" : "#22a7e8";
  const earth = isNight ? "#3a2a4a" : "#a76a3a";
  const earthShade = isNight ? "#22182f" : "#7a4624";

  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl ring-1 ring-white/40">
      {/* Sunrise / Sunset sky */}
      <div
        className="absolute inset-0"
        style={{
          background: dry
            ? "linear-gradient(180deg,#ffd28a 0%, #ff9a6b 40%, #ff7a8a 70%, #b06bb8 100%)"
            : "linear-gradient(180deg,#9be0ff 0%, #ffcfb0 35%, #ff9eb8 60%, #ffd47a 85%, #ffe9b8 100%)",
        }}
      />
      {/* Soft sun glow band */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[28%] h-[40%]"
        style={{
          background:
            "radial-gradient(ellipse at 78% 30%, rgba(255,210,140,0.55) 0%, rgba(255,170,120,0.15) 40%, transparent 70%)",
        }}
      />

      {/* Sun */}
      <div
        className="absolute right-[10%] top-[14%] size-24 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, #fff7d6 0%, #ffd07a 55%, rgba(255,184,77,0) 72%)",
          boxShadow: "0 0 120px rgba(255,184,107,0.7), 0 0 60px rgba(255,210,140,0.8)",
        }}
        aria-hidden
      />


      {/* Distant clouds */}
      {!isNight && (
        <>
          <Cloud className="left-[5%] top-[14%] opacity-95" style={{ animation: "drift 22s ease-in-out infinite" }} />
          <Cloud className="left-[55%] top-[8%] scale-75 opacity-80" style={{ animation: "drift 28s ease-in-out infinite reverse" }} />
          <Cloud className="left-[28%] top-[24%] scale-50 opacity-70" style={{ animation: "drift 35s ease-in-out infinite" }} />
        </>
      )}
      {isNight && (
        <div className="absolute inset-0">
          {Array.from({ length: 32 }).map((_, i) => (
            <span
              key={i}
              className="absolute size-[2px] rounded-full bg-white"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 55}%`,
                opacity: 0.5 + ((i * 7) % 6) / 10,
                animation: `pulse-soft ${2 + (i % 5)}s ease-in-out infinite`,
                boxShadow: "0 0 4px rgba(255,255,255,0.8)",
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
          className="absolute h-3 w-6"
          style={{
            top: `${b.top}%`,
            left: "-10%",
            animation: `bird-fly ${18 + b.delay}s linear infinite`,
            animationDelay: `${b.delay}s`,
            color: isNight ? "#2a1f4a" : "#2a2a2a",
          }}
        >
          <path d="M2 8 Q6 2 12 7 Q18 2 22 8" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
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
            <stop offset="0%" stopColor={grassHi} />
            <stop offset="50%" stopColor={grassA} />
            <stop offset="100%" stopColor={grassB} />
          </linearGradient>
          <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={riverA} />
            <stop offset="100%" stopColor={riverB} />
          </linearGradient>
          <radialGradient id="islandShade" cx="50%" cy="60%" r="60%">
            <stop offset="55%" stopColor="rgba(255,255,200,0.18)" />
            <stop offset="100%" stopColor="rgba(20,40,20,0.28)" />
          </radialGradient>
          {/* Vibrant checkered grass pattern (Stardew-style floor) */}
          <pattern id="grassTile" x="0" y="0" width="48" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
            <rect width="48" height="24" fill="url(#grass)" />
            <path d="M0 12 L24 0 L48 12 L24 24 Z" fill={grassHi} opacity="0.35" />
            <circle cx="12" cy="12" r="0.9" fill={grassHi} opacity="0.7" />
            <circle cx="36" cy="12" r="0.9" fill={grassHi} opacity="0.7" />
          </pattern>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft shadow */}
        <ellipse cx="400" cy="500" rx="340" ry="42" fill="rgba(0,0,0,0.22)" />

        {/* Island */}
        <g>
          <path d="M400 130 L720 310 L400 490 L80 310 Z" fill="url(#grassTile)" />
          {/* depth */}
          <path d="M400 490 L720 310 L720 340 L400 520 Z" fill={earthShade} />
          <path d="M400 490 L80 310 L80 340 L400 520 Z" fill={earth} />
          {/* warm rim light */}
          <path
            d="M400 130 L720 310 L400 490 L80 310 Z"
            fill="none"
            stroke={isNight ? "rgba(180,220,255,0.45)" : "rgba(255,240,180,0.55)"}
            strokeWidth="2"
          />
          {/* shading */}
          <path d="M400 130 L720 310 L400 490 L80 310 Z" fill="url(#islandShade)" />
        </g>

        {/* Stone path winding through the field */}
        {level >= 2 && (
          <g opacity="0.85">
            {Array.from({ length: 7 }).map((_, i) => {
              const t = i / 6;
              const cx = 200 + t * 380 + Math.sin(t * 4) * 16;
              const cy = 410 - t * 90;
              return <ellipse key={i} cx={cx} cy={cy} rx="11" ry="5" fill={isNight ? "#5a6b88" : "#e9d9b4"} />;
            })}
          </g>
        )}

        {/* River */}
        {level >= 2 && (
          <g opacity={dry ? 0.75 : 1}>
            <path
              d="M180 360 Q300 320 400 360 T620 360 L600 380 Q500 360 400 380 T200 380 Z"
              fill="url(#river)"
            />
            <path
              d="M220 358 Q320 340 400 358 T580 358"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="1.6"
              fill="none"
            />
            <path
              d="M240 372 Q330 358 410 372 T560 372"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
              fill="none"
            />
          </g>
        )}

        {/* Debris (only dry/empty) */}
        {debris.map((d, i) => (
          <g key={`d${i}`} transform={`translate(${d.x},${d.y}) rotate(${d.r})`}>
            <rect width="22" height="4" rx="2" fill="#7a5230" />
            <rect x="5" y="-3" width="10" height="4" rx="2" fill="#5a3d22" />
          </g>
        ))}

        {/* Mushrooms — appear with check-ins */}
        {mushrooms.map((m, i) => (
          <g key={`m${i}`} transform={`translate(${m.x},${m.y})`}>
            <rect x="-1.5" y="-2" width="3" height="5" rx="1" fill="#fff5e0" />
            <ellipse cx="0" cy="-3" rx="5" ry="3.5" fill={m.color} />
            <circle cx="-2" cy="-3.5" r="0.8" fill="#fff" />
            <circle cx="1.5" cy="-2.5" r="0.6" fill="#fff" />
          </g>
        ))}

        {/* Flowers / grass tufts */}
        {flowers.map((f, i) => (
          <g key={`f${i}`} transform={`translate(${f.x},${f.y})`}>
            {f.type === "flower" ? (
              <g filter="url(#glow)">
                <circle r="2.4" cx="-2.6" cy="0" fill={f.color} />
                <circle r="2.4" cx="2.6" cy="0" fill={f.color} />
                <circle r="2.4" cx="0" cy="-2.6" fill={f.color} />
                <circle r="2.4" cx="0" cy="2.6" fill={f.color} />
                <circle r="1.6" fill="#fff7c2" />
              </g>
            ) : (
              <path d={`M-3 0 Q0 -7 3 0`} stroke={dry ? "#b89a4d" : "#5fc97a"} strokeWidth="1.6" fill="none" />
            )}
          </g>
        ))}

        {/* Animals */}
        {animals.map((a, i) => (
          <g key={`a${i}`} transform={`translate(${a.x},${a.y}) scale(${a.scale})`}>
            {a.kind === "rabbit" ? <Rabbit /> : <Deer />}
          </g>
        ))}

        {/* Trees - back to front. Last planted gets a celebratory burst. */}
        {trees
          .slice()
          .sort((a, b) => a.y - b.y)
          .map((t, i) => {
            const isNewest = t.idx === trees.length - 1 && trees.length > 0;
            return (
              <g
                key={`t${t.idx}`}
                transform={`translate(${t.x},${t.y}) scale(${t.scale})`}
                style={{
                  transformOrigin: `${t.x}px ${t.y}px`,
                  animation: isNewest
                    ? `sway ${5 + (i % 4)}s ease-in-out infinite, tree-burst 1.1s cubic-bezier(.34,1.56,.64,1) both`
                    : `sway ${5 + (i % 4)}s ease-in-out infinite, fade-in-up 0.7s ease-out both`,
                  animationDelay: `${(i % 6) * 0.3}s, ${i * 0.04}s`,
                  filter: isNewest ? "drop-shadow(0 0 14px rgba(255,240,170,0.85))" : undefined,
                }}
              >
                <Tree variant={t.variant} palette={t.palette} isNight={isNight} season={season} />
              </g>
            );
          })}

      </svg>

      {/* Butterflies */}
      {butterflies.map((b, i) => (
        <span
          key={`b${i}`}
          className="pointer-events-none absolute"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            animation: `drift ${7 + (i % 5)}s ease-in-out infinite`,
            animationDelay: `${b.delay}s`,
            filter: isNight ? "brightness(0.75) drop-shadow(0 0 6px rgba(255,200,255,0.6))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
          }}
          aria-hidden
        >
          <Butterfly color={b.color} accent={b.accent} />
        </span>
      ))}

      {/* Fireflies at night */}
      {isNight && level >= 2 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="absolute size-1.5 rounded-full"
              style={{
                left: `${10 + ((i * 17) % 80)}%`,
                top: `${40 + ((i * 23) % 45)}%`,
                background: "#fff0a8",
                boxShadow: "0 0 10px #ffd966, 0 0 18px #ffd966",
                animation: `firefly ${4 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Wind leaves */}
      {!isNight && level >= 3 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="absolute size-2 rounded-[2px]"
              style={{
                background:
                  season === "autumn"
                    ? ["#ff7a3d", "#ffb142", "#e0533d"][i % 3]
                    : ["#7ce39a", "#ffd166", "#ffa3c1"][i % 3],
                left: `-5%`,
                top: `${15 + ((i * 11) % 60)}%`,
                animation: `leaf-blow ${10 + (i % 5)}s linear infinite`,
                animationDelay: `${i * 1.2}s`,
                opacity: 0.95,
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
            ? "radial-gradient(ellipse at center, rgba(60,40,120,0) 35%, rgba(8,12,30,0.6) 100%)"
            : "radial-gradient(ellipse at center, rgba(255,240,180,0.08) 55%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      {/* Health badge */}
      <div className="absolute bottom-3 left-3 rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-forest backdrop-blur-md shadow-sm">
        Forest Health {Math.round(health)}% · {trees.length} 🌳
      </div>

      <style>{`
        @keyframes bird-fly {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(60vw) translateY(-12px); }
          100% { transform: translateX(120vw) translateY(0); }
        }
        @keyframes leaf-blow {
          0% { transform: translate(0,0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.95; }
          100% { transform: translate(110vw, 40px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ---------- helpers ---------- */

function seasonColor(season: string, slot: "grassA" | "grassB" | "grassHi") {
  switch (season) {
    case "autumn":
      return slot === "grassA" ? "#e8a35a" : slot === "grassB" ? "#b87436" : "#ffc97a";
    case "winter":
      return slot === "grassA" ? "#eaf6fb" : slot === "grassB" ? "#a8c8d4" : "#ffffff";
    case "summer":
      return slot === "grassA" ? "#7be38a" : slot === "grassB" ? "#2fa84c" : "#a9f0b4";
    default: // spring — vibrant
      return slot === "grassA" ? "#86e89b" : slot === "grassB" ? "#3fb867" : "#b5f5c3";
  }
}

function Cloud({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`absolute ${className}`} style={style}>
      <svg viewBox="0 0 100 40" className="h-10 w-28">
        <g fill="white" opacity="0.95">
          <ellipse cx="25" cy="25" rx="20" ry="12" />
          <ellipse cx="50" cy="20" rx="22" ry="14" />
          <ellipse cx="75" cy="26" rx="18" ry="11" />
        </g>
      </svg>
    </div>
  );
}

function Butterfly({ color, accent }: { color: string; accent: string }) {
  return (
    <svg viewBox="0 0 32 24" className="size-7 overflow-visible">
      {/* Left wing pair */}
      <g style={{ transformOrigin: "16px 12px", animation: "wing-flap 0.32s ease-in-out infinite" }}>
        <path d="M16 12 C 6 2, 0 4, 2 12 C 0 18, 8 22, 16 14 Z" fill={color} />
        <path d="M16 12 C 8 8, 4 8, 4 12 C 4 16, 10 18, 16 13 Z" fill={accent} opacity="0.85" />
        <circle cx="6" cy="10" r="1.6" fill="#fff" opacity="0.9" />
        <circle cx="6" cy="10" r="0.7" fill="#1a1a2e" />
        <circle cx="10" cy="15" r="1" fill="#fff" opacity="0.7" />
      </g>
      {/* Right wing pair (mirrored) */}
      <g style={{ transformOrigin: "16px 12px", animation: "wing-flap 0.32s ease-in-out infinite", transform: "scaleX(-1)", transformBox: "fill-box" }}>
        <path d="M16 12 C 6 2, 0 4, 2 12 C 0 18, 8 22, 16 14 Z" fill={color} />
        <path d="M16 12 C 8 8, 4 8, 4 12 C 4 16, 10 18, 16 13 Z" fill={accent} opacity="0.85" />
        <circle cx="6" cy="10" r="1.6" fill="#fff" opacity="0.9" />
        <circle cx="6" cy="10" r="0.7" fill="#1a1a2e" />
        <circle cx="10" cy="15" r="1" fill="#fff" opacity="0.7" />
      </g>
      {/* Body + antennae */}
      <ellipse cx="16" cy="12" rx="0.9" ry="6" fill="#2a1a0a" />
      <circle cx="16" cy="6.5" r="1" fill="#2a1a0a" />
      <path d="M16 6 Q 14 3 12 2" stroke="#2a1a0a" strokeWidth="0.5" fill="none" strokeLinecap="round" />
      <path d="M16 6 Q 18 3 20 2" stroke="#2a1a0a" strokeWidth="0.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Rabbit() {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="9" ry="6" fill="#fffaf0" />
      <circle cx="-7" cy="-2" r="4" fill="#fffaf0" />
      <rect x="-10" y="-9" width="2" height="6" rx="1" fill="#ffd8e6" />
      <rect x="-6" y="-9" width="2" height="6" rx="1" fill="#ffd8e6" />
      <circle cx="-9" cy="-2" r="0.8" fill="#222" />
    </g>
  );
}

function Deer() {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="14" ry="7" fill="#e29257" />
      <circle cx="-12" cy="-4" r="5" fill="#e29257" />
      <path d="M-15 -9 l-2 -5 M-12 -9 l1 -6 M-10 -9 l3 -5" stroke="#7a4a23" strokeWidth="1.2" fill="none" />
      <rect x="-8" y="5" width="2" height="6" fill="#7a4a23" />
      <rect x="6" y="5" width="2" height="6" fill="#7a4a23" />
      <circle cx="-14" cy="-4" r="0.8" fill="#222" />
      <circle cx="2" cy="-2" r="1.2" fill="#fff5e0" />
      <circle cx="-3" cy="3" r="1.2" fill="#fff5e0" />
    </g>
  );
}

type TreePalette = {
  trunk: string;
  leaf: string;
  leafHi: string;
  accent?: string;
};

const VIBRANT_PALETTES: TreePalette[] = [
  { trunk: "#7a4a23", leaf: "#34d17a", leafHi: "#7ff0a8", accent: "#fff58a" }, // lime
  { trunk: "#7a4a23", leaf: "#ff7ab0", leafHi: "#ffc0d9", accent: "#fff" },     // cherry blossom
  { trunk: "#7a4a23", leaf: "#ffb347", leafHi: "#ffe08a", accent: "#ff7a3d" },  // golden
  { trunk: "#5a3a1c", leaf: "#5ac8ff", leafHi: "#b3eaff", accent: "#fff" },     // dream blue
  { trunk: "#7a4a23", leaf: "#c084fc", leafHi: "#e5c6ff", accent: "#fff58a" },  // violet
  { trunk: "#7a4a23", leaf: "#22c073", leafHi: "#7ce39a", accent: "#fff58a" },  // emerald
];

function Tree({
  variant,
  palette,
  isNight,
  season,
}: {
  variant: "pine" | "oak" | "blossom" | "sapling" | "stump";
  palette: TreePalette;
  isNight: boolean;
  season: string;
}) {
  const dim = (hex: string) => (isNight ? shade(hex, -0.35) : hex);
  const trunk = dim(palette.trunk);
  const leaf = dim(palette.leaf);
  const leafHi = dim(palette.leafHi);
  const accent = palette.accent ? dim(palette.accent) : leafHi;

  if (variant === "sapling") {
    return (
      <g>
        <rect x="-1" y="-7" width="2" height="7" fill={trunk} rx="1" />
        <circle cx="0" cy="-11" r="7" fill={leaf} />
        <circle cx="-2" cy="-13" r="3" fill={leafHi} opacity="0.9" />
      </g>
    );
  }
  if (variant === "stump") {
    return (
      <g>
        <ellipse cx="0" cy="0" rx="6" ry="2" fill="#3a2614" />
        <ellipse cx="0" cy="-2" rx="6" ry="2.4" fill="#8a5430" />
        <path d="M-4 -2 Q0 -4 4 -2" stroke="#3a2614" strokeWidth="0.6" fill="none" />
      </g>
    );
  }
  if (variant === "pine") {
    return (
      <g>
        <rect x="-2.5" y="-8" width="5" height="11" fill={trunk} rx="1" />
        <polygon points="0,-48 -16,-14 16,-14" fill={leaf} />
        <polygon points="0,-38 -20,-4 20,-4" fill={leaf} opacity="0.95" />
        <polygon points="0,-46 -10,-22 10,-22" fill={leafHi} opacity="0.6" />
      </g>
    );
  }
  if (variant === "blossom") {
    const blossom = season === "autumn" && !isNight ? "#ff7a3d" : leaf;
    const blossomHi = season === "autumn" && !isNight ? "#ffd07a" : leafHi;
    return (
      <g>
        <rect x="-3" y="-10" width="6" height="14" fill={trunk} rx="1" />
        <circle cx="0" cy="-26" r="22" fill={blossom} />
        <circle cx="-14" cy="-20" r="13" fill={blossom} opacity="0.95" />
        <circle cx="14" cy="-20" r="13" fill={blossom} opacity="0.95" />
        <circle cx="0" cy="-40" r="11" fill={blossom} opacity="0.95" />
        <circle cx="-6" cy="-32" r="6" fill={blossomHi} opacity="0.85" />
        <circle cx="9" cy="-30" r="5" fill={blossomHi} opacity="0.85" />
        <circle cx="0" cy="-24" r="1.6" fill={accent} />
        <circle cx="-10" cy="-18" r="1.4" fill={accent} />
        <circle cx="10" cy="-22" r="1.4" fill={accent} />
      </g>
    );
  }
  // oak
  return (
    <g>
      <rect x="-3" y="-10" width="6" height="14" fill={trunk} rx="1" />
      <circle cx="0" cy="-26" r="20" fill={leaf} />
      <circle cx="-13" cy="-20" r="12" fill={leaf} opacity="0.95" />
      <circle cx="13" cy="-20" r="12" fill={leaf} opacity="0.95" />
      <circle cx="-4" cy="-30" r="7" fill={leafHi} opacity="0.85" />
      <circle cx="8" cy="-26" r="5" fill={leafHi} opacity="0.8" />
      <circle cx="0" cy="-22" r="1.6" fill={accent} />
      <circle cx="-9" cy="-18" r="1.4" fill={accent} />
    </g>
  );
}

function shade(hex: string, amt: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 0xff) + Math.round(255 * amt)));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + Math.round(255 * amt)));
  const b = Math.max(0, Math.min(255, (n & 0xff) + Math.round(255 * amt)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/* ---------- builders ---------- */

type TreeVariant = "pine" | "oak" | "blossom" | "sapling" | "stump";

const TREE_SLOTS: Array<{ x: number; y: number }> = [
  { x: 250, y: 320 }, { x: 330, y: 290 }, { x: 420, y: 300 },
  { x: 520, y: 320 }, { x: 580, y: 360 }, { x: 220, y: 380 },
  { x: 300, y: 410 }, { x: 470, y: 420 }, { x: 560, y: 410 },
  { x: 380, y: 250 }, { x: 470, y: 260 }, { x: 200, y: 340 },
  { x: 620, y: 340 }, { x: 350, y: 440 }, { x: 500, y: 450 },
  { x: 270, y: 260 }, { x: 540, y: 280 }, { x: 410, y: 460 },
  { x: 180, y: 400 }, { x: 640, y: 400 }, { x: 320, y: 340 },
  { x: 490, y: 350 }, { x: 380, y: 390 }, { x: 600, y: 300 },
  { x: 240, y: 440 }, { x: 600, y: 440 }, { x: 360, y: 220 },
  { x: 500, y: 230 },
];

function buildTrees(level: number, entriesCount: number) {
  // Base trees by ecosystem level + one extra per check-in entry.
  const base = [0, 2, 5, 9, 13, 15][level];
  const total = Math.min(TREE_SLOTS.length, base + entriesCount);
  return TREE_SLOTS.slice(0, total).map((s, i) => {
    let variant: TreeVariant = "oak";
    if (i < base) {
      if (level === 1) variant = "stump";
      else if (level === 2) variant = i < 2 ? "sapling" : "stump";
      else if (level === 3) variant = i % 4 === 0 ? "blossom" : i % 3 === 0 ? "pine" : "oak";
      else if (level === 4) variant = i % 3 === 0 ? "blossom" : i % 2 === 0 ? "oak" : "pine";
      else variant = i % 2 === 0 ? "blossom" : i % 3 === 0 ? "pine" : "oak";
    } else {
      const order: TreeVariant[] = ["sapling", "blossom", "oak", "pine", "blossom", "oak"];
      variant = order[(i - base) % order.length];
    }
    return {
      ...s,
      idx: i,
      variant,
      palette: VIBRANT_PALETTES[i % VIBRANT_PALETTES.length],
      scale: 0.7 + (level / 5) * 0.5 + (i % 3) * 0.06,
    };
  });
}


function buildFlowers(level: number, entriesCount: number) {
  const colors = ["#ff5e8a", "#ffd166", "#c084fc", "#ff9f6b", "#5ac8ff", "#ff8ad2"];
  const base = [0, 2, 10, 22, 36, 56][level];
  const n = Math.min(80, base + entriesCount * 3);
  return Array.from({ length: n }).map((_, i) => ({
    x: 180 + ((i * 53) % 460),
    y: 280 + ((i * 31) % 200),
    color: colors[i % colors.length],
    type: (i % 4 === 0 ? "grass" : "flower") as "flower" | "grass",
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
  const n = [0, 2, 4, 6, 9, 13][level];
  const colors = ["#ff5e8a", "#ffd166", "#a78bfa", "#fb923c", "#34d399", "#5ac8ff", "#f472b6"];
  const accents = ["#ffd166", "#ff5e8a", "#5ac8ff", "#fff58a", "#a78bfa", "#34d399", "#fff"];
  return Array.from({ length: n }).map((_, i) => ({
    left: 10 + ((i * 17) % 75),
    top: 30 + ((i * 13) % 45),
    delay: (i % 5) * 0.6,
    color: colors[i % colors.length],
    accent: accents[i % accents.length],
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
  if (level > 1) return [];
  const n = 5;
  return Array.from({ length: n }).map((_, i) => ({
    x: 220 + ((i * 71) % 360),
    y: 330 + ((i * 47) % 130),
    r: (i * 37) % 180,
  }));
}

function buildMushrooms(entriesCount: number) {
  const n = Math.min(12, Math.floor(entriesCount / 2));
  const colors = ["#ff5e5e", "#ff9f6b", "#c084fc", "#ffd166"];
  return Array.from({ length: n }).map((_, i) => ({
    x: 210 + ((i * 67) % 380),
    y: 360 + ((i * 41) % 110),
    color: colors[i % colors.length],
  }));
}
