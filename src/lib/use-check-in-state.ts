import { useEffect, useState, useCallback } from "react";
import type { DailyCheckInAnswers, DailyCheckInResult } from "./check-in-data";
import { scoreDailyCheckIn } from "./check-in-data";

const KEY = "carbon-tree-daily-checkins-v1";

export type CheckInHistory = {
  entries: DailyCheckInResult[];
};

const initial: CheckInHistory = {
  entries: [],
};

function load(): CheckInHistory {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) } as CheckInHistory;
  } catch {
    return initial;
  }
}

export function useDailyCheckInState() {
  const [history, setHistory] = useState<CheckInHistory>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHistory(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && typeof window !== "undefined") {
      localStorage.setItem(KEY, JSON.stringify(history));
    }
  }, [history, hydrated]);

  const todayStr = () => new Date().toISOString().slice(0, 10);

  const hasCheckedInToday = useCallback(() => {
    return history.entries.some((e) => e.date === todayStr());
  }, [history]);

  const submitCheckIn = useCallback((answers: DailyCheckInAnswers) => {
    const { score, positiveHabits, improvements } = scoreDailyCheckIn(answers);
    const entry: DailyCheckInResult = {
      date: todayStr(),
      answers,
      score,
      positiveHabits,
      improvements,
    };

    setHistory((prev) => {
      const filtered = prev.entries.filter((e) => e.date !== entry.date);
      return {
        entries: [entry, ...filtered].slice(0, 90),
      };
    });

    return entry;
  }, []);

  const todayEntry = history.entries.find((e) => e.date === todayStr()) ?? null;

  return { history, hydrated, submitCheckIn, hasCheckedInToday, todayEntry };
}
