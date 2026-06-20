import { useEffect, useState, useCallback } from "react";
import type { CheckInAnswers } from "./tree-data";
import { scoreCheckIn } from "./tree-data";

export type CheckInLog = {
  date: string; // ISO date
  answers: CheckInAnswers;
  xp: number;
  leaves: number;
  butterflies: number;
  birds: number;
  co2: number;
};

export type TreeState = {
  xp: number;
  leaves: number;
  butterflies: number;
  birds: number;
  co2: number;
  streak: number;
  lastCheckIn: string | null;
  logs: CheckInLog[];
  monthlyStory: { month: string; story: string } | null;
};

const KEY = "carbon-tree-state-v1";
const DAILY_LIMIT = 2;

const initial: TreeState = {
  xp: 240,
  leaves: 142,
  butterflies: 12,
  birds: 4,
  co2: 12.4,
  streak: 7,
  lastCheckIn: null,
  logs: [],
  monthlyStory: null,
};

function load(): TreeState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) } as TreeState;
  } catch {
    return initial;
  }
}

export function useTreeState() {
  const [state, setState] = useState<TreeState>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && typeof window !== "undefined") {
      localStorage.setItem(KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  const today = new Date().toISOString().slice(0, 10);
  const entriesToday = state.logs.filter((l) => l.date === today).length;
  const canCheckIn = entriesToday < DAILY_LIMIT;

  const submitCheckIn = useCallback((answers: CheckInAnswers) => {
    const score = scoreCheckIn(answers);
    const todayStr = new Date().toISOString().slice(0, 10);
    let didSubmit = false;
    setState((prev) => {
      const todayCount = prev.logs.filter((l) => l.date === todayStr).length;
      if (todayCount >= DAILY_LIMIT) return prev;
      didSubmit = true;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const newStreak =
        prev.lastCheckIn === todayStr
          ? prev.streak
          : prev.lastCheckIn === yesterday
            ? prev.streak + 1
            : 1;
      const log: CheckInLog = { date: todayStr, answers, ...score };
      return {
        ...prev,
        xp: Math.max(0, prev.xp + score.xp),
        leaves: Math.max(0, prev.leaves + score.leaves),
        butterflies: prev.butterflies + score.butterflies,
        birds: prev.birds + score.birds,
        co2: Math.round((prev.co2 + score.co2) * 10) / 10,
        streak: newStreak,
        lastCheckIn: todayStr,
        logs: [log, ...prev.logs].slice(0, 60),
      };
    });
    return didSubmit ? score : null;
  }, []);

  const setMonthlyStory = useCallback((story: string) => {
    const month = new Date().toLocaleString("en", { month: "long", year: "numeric" });
    setState((p) => ({ ...p, monthlyStory: { month, story } }));
  }, []);

  return { state, hydrated, submitCheckIn, setMonthlyStory, entriesToday, canCheckIn, dailyLimit: DAILY_LIMIT };
}

