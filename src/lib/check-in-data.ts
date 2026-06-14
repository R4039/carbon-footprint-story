export type DailyCheckInAnswers = {
  transport: "walk" | "bicycle" | "public_transport" | "car";
  acHours: "none" | "low" | "moderate" | "high";
  reusableBottle: boolean;
  reducedPlastic: boolean;
  savedElectricity: boolean;
};

export type DailyCheckInResult = {
  date: string;
  answers: DailyCheckInAnswers;
  score: number;
  positiveHabits: string[];
  improvements: string[];
};

const TRANSPORT_SCORES = {
  walk: 25,
  bicycle: 25,
  public_transport: 20,
  car: 5,
} as const;

const AC_SCORES = {
  none: 20,
  low: 15,
  moderate: 8,
  high: 0,
} as const;

export function scoreDailyCheckIn(answers: DailyCheckInAnswers): {
  score: number;
  positiveHabits: string[];
  improvements: string[];
} {
  let score = 0;
  const positiveHabits: string[] = [];
  const improvements: string[] = [];

  // Transportation
  const transportScore = TRANSPORT_SCORES[answers.transport];
  score += transportScore;
  if (answers.transport === "walk" || answers.transport === "bicycle") {
    positiveHabits.push("Zero-emission transportation today");
  } else if (answers.transport === "public_transport") {
    positiveHabits.push("Used public transport to reduce emissions");
  } else {
    improvements.push("Try walking, cycling, or public transport next time");
  }

  // AC Hours
  const acScore = AC_SCORES[answers.acHours];
  score += acScore;
  if (answers.acHours === "none") {
    positiveHabits.push("No AC usage today — great energy saver");
  } else if (answers.acHours === "low") {
    positiveHabits.push("Minimal AC usage");
  } else if (answers.acHours === "moderate") {
    improvements.push("Try reducing AC usage with fans or natural ventilation");
  } else {
    improvements.push("High AC usage — consider energy-saving cooling alternatives");
  }

  // Reusable Bottle
  if (answers.reusableBottle) {
    score += 20;
    positiveHabits.push("Carried a reusable water bottle");
  } else {
    score += 5;
    improvements.push("Carry a reusable bottle to cut single-use plastic");
  }

  // Reduced Plastic
  if (answers.reducedPlastic) {
    score += 20;
    positiveHabits.push("Actively reduced plastic usage today");
  } else {
    score += 5;
    improvements.push("Look for plastic-free alternatives for everyday items");
  }

  // Saved Electricity
  if (answers.savedElectricity) {
    score += 15;
    positiveHabits.push("Switched off unused devices to save electricity");
  } else {
    improvements.push("Remember to switch off unused lights and devices");
  }

  return { score, positiveHabits, improvements };
}

export const DAILY_QUESTIONS = [
  {
    id: "transport" as const,
    title: "What transportation did you use today?",
    type: "choice" as const,
    options: [
      { value: "walk", label: "Walk", emoji: "🚶" },
      { value: "bicycle", label: "Bicycle", emoji: "🚲" },
      { value: "public_transport", label: "Public Transport", emoji: "🚌" },
      { value: "car", label: "Car", emoji: "🚗" },
    ],
  },
  {
    id: "acHours" as const,
    title: "How many hours did you use AC?",
    type: "choice" as const,
    options: [
      { value: "none", label: "None", emoji: "❄️" },
      { value: "low", label: "1 – 3 hours", emoji: "🌬️" },
      { value: "moderate", label: "4 – 6 hours", emoji: "💨" },
      { value: "high", label: "7+ hours", emoji: "🔥" },
    ],
  },
  {
    id: "reusableBottle" as const,
    title: "Did you carry a reusable water bottle?",
    type: "boolean" as const,
    options: [
      { value: true, label: "Yes", emoji: "✅" },
      { value: false, label: "No", emoji: "❌" },
    ],
  },
  {
    id: "reducedPlastic" as const,
    title: "Did you reduce plastic usage today?",
    type: "boolean" as const,
    options: [
      { value: true, label: "Yes", emoji: "✅" },
      { value: false, label: "No", emoji: "❌" },
    ],
  },
  {
    id: "savedElectricity" as const,
    title: "Did you save electricity by switching off unused devices?",
    type: "boolean" as const,
    options: [
      { value: true, label: "Yes", emoji: "✅" },
      { value: false, label: "No", emoji: "❌" },
    ],
  },
];
