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
  electricity: "low" | "normal" | "high";
  food: "plant" | "mixed" | "meat";
  plastic: "none" | "some" | "lots";
  water: "saver" | "normal" | "wasteful";
};

const SCORES = {
  transport: { walk: 12, transit: 8, ev: 5, car: -4 },
  electricity: { low: 8, normal: 3, high: -3 },
  food: { plant: 10, mixed: 4, meat: -3 },
  plastic: { none: 8, some: 2, lots: -4 },
  water: { saver: 7, normal: 3, wasteful: -3 },
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
  co2 = Math.max(0, Math.round((xp / 10) * 1.2 * 10) / 10);

  return { xp, leaves, butterflies, birds, co2 };
}

export const QUESTIONS = [
  {
    id: "transport" as const,
    title: "How did you get around today?",
    options: [
      { value: "walk", label: "Bicycle or Walk", emoji: "🚶" },
      { value: "transit", label: "Public Transit", emoji: "🚌" },
      { value: "ev", label: "Electric Vehicle", emoji: "⚡" },
      { value: "car", label: "Personal Car", emoji: "🚗" },
    ],
  },
  {
    id: "electricity" as const,
    title: "Your electricity use today",
    options: [
      { value: "low", label: "Mindful & Low", emoji: "💡" },
      { value: "normal", label: "Average", emoji: "🔌" },
      { value: "high", label: "Heavy Usage", emoji: "⚡" },
    ],
  },
  {
    id: "food" as const,
    title: "Your meals today",
    options: [
      { value: "plant", label: "Plant-Based", emoji: "🥗" },
      { value: "mixed", label: "Mixed", emoji: "🍱" },
      { value: "meat", label: "Meat-Heavy", emoji: "🥩" },
    ],
  },
  {
    id: "plastic" as const,
    title: "Single-use plastic today",
    options: [
      { value: "none", label: "None", emoji: "♻️" },
      { value: "some", label: "A Few Items", emoji: "🛍️" },
      { value: "lots", label: "Several Items", emoji: "🥤" },
    ],
  },
  {
    id: "water" as const,
    title: "Water conservation",
    options: [
      { value: "saver", label: "Saved Water", emoji: "💧" },
      { value: "normal", label: "Normal Use", emoji: "🚿" },
      { value: "wasteful", label: "Long Showers", emoji: "🛁" },
    ],
  },
];

export const MISSIONS = [
  { id: "plastic-free", title: "Plastic-Free Week", reward: "Rare Fox", emoji: "🦊", goal: 7, progress: 3 },
  { id: "green-commute", title: "Green Commute Challenge", reward: "Bluebird", emoji: "🚲", goal: 5, progress: 4 },
  { id: "water-saver", title: "Water Saver Challenge", reward: "Morning Dew", emoji: "💧", goal: 7, progress: 5 },
  { id: "plant-meals", title: "Plant-Based Streak", reward: "Cherry Blossom", emoji: "🌸", goal: 5, progress: 2 },
];

export const COMMUNITY_FORESTS = [
  { name: "Amazonia District", guardians: 12402, growth: 84, hue: "#1B4332" },
  { name: "Nordic Pines", guardians: 8911, growth: 71, hue: "#2D6A4F" },
  { name: "Pacific Redwoods", guardians: 15203, growth: 92, hue: "#40916C" },
  { name: "Savanna Acacia", guardians: 4502, growth: 58, hue: "#74C69D" },
];
