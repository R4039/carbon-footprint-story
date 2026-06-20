import { useId, useMemo } from "react";

export type ShinyForestProps = {
  level: 1 | 2 | 3 | 4 | 5;
  health: number;
  isNight?: boolean;
  season?: "spring" | "summer" | "autumn" | "winter";
  entriesCount?: number;
};

type TreeVariant = "oak" | "pine" | "blossom" | "sapling" | "stump";

type TreePalette = {
  trunk: string;
  leaf: string;
  leafHi: string;
  pearl: string;
};

type TreeData = {
  x: number;
  y: number;
  idx: number;
  variant: TreeVariant;
  palette: TreePalette;
  scale: number;
};

const TREE_SLOTS: Array<{ x: number; y: number }> = [
  { x: 255, y: 325 }, { x: 335, y: 295 }, { x: 420, y: 305 }, { x: 515, y: 325 }, { x: 570, y: 360 },
  { x: 235, y: 380 }, { x: 310, y: 410 }, { x: 460, y: 415 }, { x: 545, y: 405 }, { x: 385, y: 255 },
  { x: 470, y: 265 }, { x: 225, y: 345 }, { x: 600, y: 340 }, { x: 355, y: 440 }, { x: 485, y: 445 },
  { x: 285, y: 270 }, { x: 520, y: 285 }, { x: 410, y: 455 }, { x: 210, y: 395 }, { x: 615, y: 395 },
  { x: 330, y: 345 }, { x: 485, y: 355 }, { x: 385, y: 390 }, { x: 585, y: 305 }, { x: 265, y: 435 },
  { x: 575, y: 435 }, { x: 365, y: 230 }, { x: 495, y: 240 }, { x: 250, y: 255 }, { x: 560, y: 250 },
  { x: 180, y: 300 }, { x: 640, y: 320 }, { x: 300, y: 465 }, { x: 520, y: 470 },
];

const PALETTES: TreePalette[] = [
  { trunk: "#7a4a23", leaf: "#33b86c", leafHi: "#7bf0a5", pearl: "#fffdf2" },
  { trunk: "#6a4120", leaf: "#2aa85f", leafHi: "#89f0b2", pearl: "#ffffff" },
  { trunk: "#7b4b24", leaf: "#3bc46f", leafHi: "#9bf2bf", pearl: "#fff8d9" },
  { trunk: "#5f3a1d", leaf: "#27a85b", leafHi: "#72e09a", pearl: "#fffaf6" },
  { trunk: "#744721", leaf: "#31b76a", leafHi: "#86e7ab", pearl: "#f3fff2" },
  { trunk: "#633b1d", leaf: "#24945a", leafHi: "#6ed38f", pearl: "#fff7ea" },
];

export function ShinyForest({
  level,
  health,
  isNight = false,
  season = "spring",
  entriesCount = 0,
}: ShinyForestProps) {
  const clipId = useId();
  const glowId = useId();
  const pearlId = useId();

  const trees = useMemo(() => buildTrees(level, entriesCount), [level, entriesCount]);

  const badEntries = Math.max(0, entriesCount - 10);
  const pollutionPenalty = badEntries * 4;
  const forestHealth = Math.max(0, health - pollutionPenalty);
  const wither = forestHealth < 40;
  const collapse = forestHealth < 15;

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
      <div
        className="absolute inset-0"
        style={{
          background: dry
            ? "linear-gradient(180deg,#ffd28a 0%, #ff9a6b 40%, #ff7a8a 70%, #b06bb8 100%)"
            : "linear-gradient(180deg,#9be0ff 0%, #ffcfb0 35%, #ff9eb8 60%, #ffd47a 85%, #ffe9b8 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-[28%] h-[40%]"
        style={{
          background:
            "radial-gradient(ellipse at 78% 30%, rgba(255,210,140,0.55) 0%, rgba(255,170,120,0.15) 40%, transparent 70%)",
        }}
      />

      <div
        className="absolute right-[10%] top-[14%] size-24 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, #fff7d6 0%, #ffd07a 55%, rgba(255,184,77,0) 72%)",
          boxShadow: "0 0 120px rgba(255,184,107,0.7), 0 0 60px rgba(255,210,140,0.8)",
        }}
        aria-hidden
      />

      <svg viewBox="0 0 800 550" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <clipPath id={clipId}>
            <path d="M400 130 L720 310 L400 490 L80 310 Z" />
          </clipPath>
          <linearGradient id={`${glowId}-grass`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={grassHi} />
            <stop offset="50%" stopColor={grassA} />
            <stop offset="100%" stopColor={grassB} />
          </linearGradient>
          <linearGradient id={`${glowId}-river`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={riverA} />
            <stop offset="100%" stopColor={riverB} />
          </linearGradient>
          <pattern id={`${glowId}-grassTile`} x="0" y="0" width="48" height="24" patternUnits="userSpaceOnUse">
            <rect width="48" height="24" fill={`url(#${glowId}-grass)`} />
            <path d="M0 12 L24 0 L48 12 L24 24 Z" fill={grassHi} opacity="0.35" />
          </pattern>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={pearlId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse cx="400" cy="500" rx="340" ry="42" fill="rgba(0,0,0,0.22)" />

        <g>
          <path d="M400 130 L720 310 L400 490 L80 310 Z" fill={`url(#${glowId}-grassTile)`} />
          <path d="M400 490 L720 310 L720 340 L400 520 Z" fill={earthShade} />
          <path d="M400 490 L80 310 L80 340 L400 520 Z" fill={earth} />
          <path d="M400 130 L720 310 L400 490 L80 310 Z" fill="rgba(0,0,0,0.08)" />
        </g>

        <g clipPath={`url(#${clipId})`}>
          {level >= 2 && (
            <g opacity="0.85">
              {Array.from({ length: 7 }).map((_, i) => {
                const t = i / 6;
                const cx = 225 + t * 350 + Math.sin(t * 4) * 10;
                const cy = 405 - t * 85;
                return <ellipse key={i} cx={cx} cy={cy} rx="11" ry="5" fill={isNight ? "#5a6b88" : "#e9d9b4"} />;
              })}
            </g>
          )}

          {level >= 2 && (
            <g opacity={dry ? 0.75 : 1}>
              <path d="M180 360 Q300 320 400 360 T620 360 L600 380 Q500 360 400 380 T200 380 Z" fill={`url(#${glowId}-river)`} />
            </g>
          )}

          {trees
            .slice()
            .sort((a, b) => a.y - b.y)
            .map((t, i) => {
              const isNewest = t.idx === trees.length - 1 && trees.length > 0;
              return (
                <g key={`t${t.idx}`} transform={`translate(${t.x},${t.y})`}>
                  <g
                    style={{
                      transformOrigin: "center",
                      transformBox: "fill-box",
                      animation: isNewest
                        ? "tree-pop 1.1s cubic-bezier(.34,1.56,.64,1) both"
                        : "tree-grow 0.8s ease-out both",
                      animationDelay: `${i * 0.05}s`,
                      filter: isNewest ? "drop-shadow(0 0 18px rgba(255,240,170,0.9))" : undefined,
                    }}
                  >
                    <g transform={`scale(${t.scale})`}>
                      <Tree variant={t.variant} palette={t.palette} isNight={isNight} wither={wither} collapse={collapse} pearlFilterId={pearlId} />
                    </g>
                  </g>
                </g>
              );
            })}
        </g>
      </svg>

      <div className="absolute bottom-3 left-3 rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-forest backdrop-blur-md shadow-sm">
        Forest Health {Math.round(forestHealth)}% · {trees.length} 🌳
      </div>

      <style>{`
        @keyframes tree-grow {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes tree-pop {
          0% { transform: scale(0); opacity: 0; }
          55% { transform: scale(1.28); opacity: 1; }
          80% { transform: scale(0.94); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function Tree({
  variant,
  palette,
  isNight,
  wither,
  collapse,
  pearlFilterId,
}: {
  variant: TreeVariant;
  palette: TreePalette;
  isNight: boolean;
  wither: boolean;
  collapse: boolean;
  pearlFilterId: string;
}) {
  const dim = (hex: string) => (isNight || wither ? shade(hex, -0.28) : hex);
  const trunk = dim(palette.trunk);
  const leaf = dim(palette.leaf);
  const leafHi = dim(palette.leafHi);
  const pearl = dim(palette.pearl);

  if (collapse || variant === "stump") {
    return (
      <g>
        <ellipse cx="0" cy="0" rx="6" ry="2" fill="#3a2614" />
        <ellipse cx="0" cy="-2" rx="6" ry="2.4" fill="#8a5430" />
      </g>
    );
  }

  if (variant === "sapling") {
    return (
      <g>
        <rect x="-1" y="-7" width="2" height="7" fill={trunk} rx="1" />
        <circle cx="0" cy="-11" r="6" fill={leaf} />
        <circle cx="-2" cy="-13" r="1.2" fill={pearl} filter={`url(#${pearlFilterId})`} />
        <circle cx="3" cy="-10" r="1" fill={pearl} filter={`url(#${pearlFilterId})`} />
      </g>
    );
  }

  if (variant === "pine") {
    return (
      <g>
        <rect x="-2.5" y="-9" width="5" height="12" fill={trunk} rx="1" />
        <polygon points="0,-50 -15,-20 15,-20" fill={leaf} />
        <polygon points="0,-40 -19,-10 19,-10" fill={leaf} opacity="0.95" />
        <polygon points="0,-30 -14,-2 14,-2" fill={leafHi} opacity="0.8" />
        <circle cx="-4" cy="-30" r="1.4" fill={pearl} filter={`url(#${pearlFilterId})`} />
        <circle cx="5" cy="-35" r="1.2" fill={pearl} filter={`url(#${pearlFilterId})`} />
        <circle cx="0" cy="-18" r="1.1" fill={pearl} filter={`url(#${pearlFilterId})`} />
      </g>
    );
  }

  if (variant === "blossom") {
    return (
      <g>
        <rect x="-3" y="-10" width="6" height="14" fill={trunk} rx="1" />
        <circle cx="0" cy="-26" r="22" fill={leaf} />
        <circle cx="-14" cy="-20" r="13" fill={leaf} opacity="0.95" />
        <circle cx="14" cy="-20" r="13" fill={leaf} opacity="0.95" />
        <circle cx="0" cy="-24" r="2" fill={pearl} filter={`url(#${pearlFilterId})`} />
        <circle cx="-10" cy="-18" r="1.8" fill={pearl} filter={`url(#${pearlFilterId})`} />
        <circle cx="10" cy="-22" r="1.8" fill={pearl} filter={`url(#${pearlFilterId})`} />
      </g>
    );
  }

  return (
    <g>
      <rect x="-3" y="-10" width="6" height="14" fill={trunk} rx="1" />
      <ellipse cx="0" cy="-28" rx="23" ry="19" fill={leaf} />
      <ellipse cx="-15" cy="-22" rx="12" ry="11" fill={leaf} opacity="0.95" />
      <ellipse cx="15" cy="-22" rx="12" ry="11" fill={leaf} opacity="0.95" />
      <circle cx="0" cy="-24" r="2.1" fill={pearl} filter={`url(#${pearlFilterId})`} />
      <circle cx="-9" cy="-17" r="1.6" fill={pearl} filter={`url(#${pearlFilterId})`} />
      <circle cx="11" cy="-20" r="1.5" fill={pearl} filter={`url(#${pearlFilterId})`} />
    </g>
  );
}

function buildTrees(level: number, entriesCount: number): TreeData[] {
  const base = [0, 2, 5, 9, 13, 15][level];
  const total = Math.min(TREE_SLOTS.length, base + entriesCount * 2);
  return TREE_SLOTS.slice(0, total).map((s, i) => {
    let variant: TreeVariant = "oak";
    if (i < base) {
      if (level === 1) variant = "stump";
      else if (level === 2) variant = i < 2 ? "sapling" : "stump";
      else if (level === 3) variant = i % 4 === 0 ? "blossom" : i % 3 === 0 ? "pine" : "oak";
      else if (level === 4) variant = i % 3 === 0 ? "blossom" : i % 2 === 0 ? "oak" : "pine";
      else variant = i % 2 === 0 ? "blossom" : i % 3 === 0 ? "pine" : "oak";
    } else {
      const order: TreeVariant[] = ["sapling", "oak", "pine", "blossom", "oak", "pine"];
      variant = order[(i - base) % order.length];
    }
    return {
      ...s,
      idx: i,
      variant,
      palette: PALETTES[i % PALETTES.length],
      scale: 0.68 + (level / 5) * 0.48 + (i % 3) * 0.05,
    };
  });
}

function seasonColor(season: string, slot: "grassA" | "grassB" | "grassHi") {
  switch (season) {
    case "autumn":
      return slot === "grassA" ? "#e8a35a" : slot === "grassB" ? "#b87436" : "#ffc97a";
    case "winter":
      return slot === "grassA" ? "#eaf6fb" : slot === "grassB" ? "#a8c8d4" : "#ffffff";
    case "summer":
      return slot === "grassA" ? "#7be38a" : slot === "grassB" ? "#2fa84c" : "#a9f0b4";
    default:
      return slot === "grassA" ? "#86e89b" : slot === "grassB" ? "#3fb867" : "#b5f5c3";
  }
}

function shade(hex: string, amt: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 0xff) + Math.round(255 * amt)));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + Math.round(255 * amt)));
  const b = Math.max(0, Math.min(255, (n & 0xff) + Math.round(255 * amt)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}