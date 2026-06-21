import treeSeed from "@/assets/tree-seed.png";
import treeSapling from "@/assets/tree-sapling.png";
import treeYoung from "@/assets/tree-young.png";
import treeMature from "@/assets/tree-mature.png";
import treeGuardian from "@/assets/tree-guardian.png";

export type Stage = "seed" | "sapling" | "young" | "mature" | "guardian";

export const STAGES: { id: Stage; label: string; minXp: number; image: string }[] = [
  { id: "seed", label: "Seed", minXp: 0, image: treeSeed },
  { id: "sapling", label: "Sapling", minXp: 50, image: treeSapling },
  { id: "young", label: "Young Tree", minXp: 200, image: treeYoung },
  { id: "mature", label: "Mature Tree", minXp: 500, image: treeMature },
  { id: "guardian", label: "Forest Guardian", minXp: 1200, image: treeGuardian },
];

export function getStage(xp: number) {
  let current = STAGES[0];
  for (const s of STAGES) if (xp >= s.minXp) current = s;
  const idx = STAGES.indexOf(current);
  const next = STAGES[idx + 1];
  const progress = next
    ? Math.min(1, (xp - current.minXp) / (next.minXp - current.minXp))
    : 1;
  return { current, next, progress, level: idx + 1 };
}

export type CheckInAnswers = {
  transport: "walk" | "transit" | "ev" | "car";
  food: "plant" | "mostly-plant" | "mixed" | "meat";
  electricity: "low" | "normal" | "high";
  water: "saver" | "normal" | "wasteful";
  waste: "recycle-all" | "mostly-recycle" | "some-waste" | "high-waste";
  shopping: "nothing" | "sustainable" | "regular" | "fast-fashion";
};

const SCORES = {
  transport: { walk: 12, transit: 8, ev: 5, car: -4 },
  food: { plant: 10, "mostly-plant": 7, mixed: 3, meat: -3 },
  electricity: { low: 8, normal: 3, high: -3 },
  water: { saver: 7, normal: 3, wasteful: -3 },
  waste: { "recycle-all": 8, "mostly-recycle": 5, "some-waste": 0, "high-waste": -4 },
  shopping: { nothing: 8, sustainable: 5, regular: 1, "fast-fashion": -5 },
} as const;

export function scoreCheckIn(a: CheckInAnswers) {
  let xp = 0;
  let leaves = 0;
  let butterflies = 0;
  let birds = 0;
  let co2 = 0;

  for (const key of Object.keys(SCORES) as (keyof typeof SCORES)[]) {
    const v = SCORES[key][a[key] as never] as number;
    xp += v;
    if (v > 0) leaves += Math.max(1, Math.round(v / 3));
  }
  if (xp >= 30) butterflies += 1;
  if (xp >= 40) birds += 1;
  if (xp >= 50) butterflies += 1;
  co2 = Math.max(0, Math.round((xp / 10) * 1.2 * 10) / 10);

  return { xp, leaves, butterflies, birds, co2 };
}

export const QUESTIONS = [
  {
    id: "transport" as const,
    title: "How did you get around?",
    options: [
      { value: "walk", label: "Walked / Cycled", emoji: "🚶" },
      { value: "transit", label: "Public Transit", emoji: "🚌" },
      { value: "ev", label: "Electric Vehicle", emoji: "⚡" },
      { value: "car", label: "Personal Car", emoji: "🚗" },
    ],
  },
  {
    id: "food" as const,
    title: "Today's meals",
    options: [
      { value: "plant", label: "Plant Based", emoji: "🥗" },
      { value: "mostly-plant", label: "Mostly Plant Based", emoji: "🥑" },
      { value: "mixed", label: "Mixed Diet", emoji: "🍱" },
      { value: "meat", label: "Meat Heavy", emoji: "🥩" },
    ],
  },
  {
    id: "electricity" as const,
    title: "Energy usage",
    options: [
      { value: "low", label: "Conserved Energy", emoji: "💡" },
      { value: "normal", label: "Normal Usage", emoji: "🔌" },
      { value: "high", label: "Heavy Usage", emoji: "⚡" },
    ],
  },
  {
    id: "water" as const,
    title: "Water use",
    options: [
      { value: "saver", label: "Saved Water", emoji: "💧" },
      { value: "normal", label: "Average Usage", emoji: "🚿" },
      { value: "wasteful", label: "Long Shower", emoji: "🛁" },
    ],
  },
  {
    id: "waste" as const,
    title: "Waste & recycling",
    options: [
      { value: "recycle-all", label: "Recycled Everything", emoji: "♻️" },
      { value: "mostly-recycle", label: "Mostly Recycled", emoji: "🗑️" },
      { value: "some-waste", label: "Some Waste", emoji: "🛍️" },
      { value: "high-waste", label: "High Waste", emoji: "🚮" },
    ],
  },
  {
    id: "shopping" as const,
    title: "Shopping today",
    options: [
      { value: "nothing", label: "Bought Nothing", emoji: "🧘" },
      { value: "sustainable", label: "Sustainable", emoji: "🌿" },
      { value: "regular", label: "Regular Purchase", emoji: "🛒" },
      { value: "fast-fashion", label: "Fast Fashion", emoji: "👕" },
    ],
  },
];

export const MISSIONS = [
  { id: "plastic-free", title: "Plastic-Free Week", reward: "Unlock Wildflowers", emoji: "🌸", goal: 7, progress: 3 },
  { id: "green-commute", title: "Green Commute Challenge", reward: "Unlock Butterfly Swarm", emoji: "🦋", goal: 5, progress: 4 },
  { id: "water-saver", title: "Water Saver Challenge", reward: "Unlock Bluebird Nest", emoji: "🐦", goal: 7, progress: 5 },
  { id: "plant-meals", title: "Plant-Based Streak", reward: "Unlock Fireflies", emoji: "✨", goal: 5, progress: 2 },
];

export const COMMUNITY_FORESTS = [
  { name: "Amazonia District", guardians: 12402, growth: 84, hue: "#1B4332" },
  { name: "Nordic Pines", guardians: 8911, growth: 71, hue: "#2D6A4F" },
  { name: "Pacific Redwoods", guardians: 15203, growth: 92, hue: "#40916C" },
  { name: "Savanna Acacia", guardians: 4502, growth: 58, hue: "#74C69D" },
];
