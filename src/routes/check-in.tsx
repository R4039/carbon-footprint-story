import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowLeft, Leaf, TrendingUp, AlertCircle, CheckCircle2, Droplets, Wind, Recycle, Zap, Bike } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useDailyCheckInState } from "@/lib/use-check-in-state";
import { DAILY_QUESTIONS, scoreDailyCheckIn } from "@/lib/check-in-data";
import type { DailyCheckInAnswers } from "@/lib/check-in-data";

export const Route = createFileRoute("/check-in")({
  head: () => ({
    meta: [
      { title: "Daily Eco Check-In · Carbon Tree" },
      { name: "description", content: "Log your daily eco habits and watch your score grow." },
    ],
  }),
  component: CheckInPage,
});

function CheckInPage() {
  const { submitCheckIn, todayEntry } = useDailyCheckInState();
  const [answers, setAnswers] = useState<Partial<DailyCheckInAnswers>>({});
  const [submitted, setSubmitted] = useState(!!todayEntry);
  const [result, setResult] = useState(todayEntry);

  const allAnswered = DAILY_QUESTIONS.every((q) => answers[q.id] !== undefined);

  function handleSelect(qid: keyof DailyCheckInAnswers, value: unknown) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  function handleSubmit() {
    if (!allAnswered) return;
    const a = answers as DailyCheckInAnswers;
    const entry = submitCheckIn(a);
    setResult(entry);
    setSubmitted(true);
  }

  function handleReset() {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-2xl px-5 py-6 pb-28 md:px-8 md:py-10">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            to="/"
            className="grid size-10 place-items-center rounded-xl border border-stone-200 text-stone-500 transition-colors hover:border-forest hover:text-forest"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl text-forest md:text-3xl">Daily Eco Check-In</h1>
            <p className="text-xs text-stone-500">Answer 5 quick questions to grow your tree.</p>
          </div>
        </div>

        {!submitted ? (
          <div className="space-y-6">
            {DAILY_QUESTIONS.map((q, idx) => (
              <QuestionCard
                key={q.id}
                index={idx + 1}
                title={q.title}
                options={q.options as { value: string | boolean; label: string; emoji: string }[]}
                selected={answers[q.id]}
                onSelect={(val) => handleSelect(q.id, val)}
                icon={questionIcon(q.id)}
              />
            ))}

            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="w-full rounded-2xl bg-forest py-4 text-sm font-bold text-white shadow-eco transition-all hover:bg-forest-deep disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
            >
              Calculate My Eco Score
            </button>
          </div>
        ) : (
          result && <SummaryCard result={result} onReset={handleReset} />
        )}
      </main>
    </AppShell>
  );
}

function questionIcon(id: string) {
  switch (id) {
    case "transport":
      return <Bike className="size-5" />;
    case "acHours":
      return <Wind className="size-5" />;
    case "reusableBottle":
      return <Droplets className="size-5" />;
    case "reducedPlastic":
      return <Recycle className="size-5" />;
    case "savedElectricity":
      return <Zap className="size-5" />;
    default:
      return <Leaf className="size-5" />;
  }
}

function QuestionCard({
  index,
  title,
  options,
  selected,
  onSelect,
  icon,
}: {
  index: number;
  title: string;
  options: { value: string | boolean; label: string; emoji: string }[];
  selected: unknown;
  onSelect: (val: unknown) => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid size-8 place-items-center rounded-lg bg-sage-soft text-forest">
          {icon}
        </div>
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-full bg-forest text-[10px] font-bold text-white">
            {index}
          </span>
          <h3 className="text-sm font-semibold text-forest">{title}</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((o) => {
          const isSelected = selected === o.value;
          return (
            <button
              key={String(o.value)}
              onClick={() => onSelect(o.value)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center text-xs font-medium transition-all ${
                isSelected
                  ? "border-forest bg-forest text-white shadow-sm"
                  : "border-stone-100 text-stone-600 hover:border-forest/30 hover:bg-sage-soft/30"
              }`}
            >
              <span className="text-lg">{o.emoji}</span>
              <span>{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SummaryCard({
  result,
  onReset,
}: {
  result: NonNullable<ReturnType<typeof scoreDailyCheckIn> & { date: string; answers: DailyCheckInAnswers }>;
  onReset: () => void;
}) {
  const scoreColor = useMemo(() => {
    if (result.score >= 80) return "text-emerald-600";
    if (result.score >= 50) return "text-amber-600";
    return "text-rose-500";
  }, [result.score]);

  const scoreBg = useMemo(() => {
    if (result.score >= 80) return "bg-emerald-50 border-emerald-100";
    if (result.score >= 50) return "bg-amber-50 border-amber-100";
    return "bg-rose-50 border-rose-100";
  }, [result.score]);

  const scoreLabel = useMemo(() => {
    if (result.score >= 80) return "Forest Guardian";
    if (result.score >= 50) return "Eco Sprout";
    return "Seedling";
  }, [result.score]);

  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (result.score / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className={`rounded-3xl border p-6 ${scoreBg}`}>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          {/* Circular Score */}
          <div className="relative">
            <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/60" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className={scoreColor}
                style={{ transition: "stroke-dashoffset 1s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-serif text-3xl font-bold ${scoreColor}`}>{result.score}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Score</span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Today's Rating</p>
            <h2 className={`mt-1 font-serif text-2xl font-bold ${scoreColor}`}>{scoreLabel}</h2>
            <p className="mt-1 text-sm text-stone-600">
              {result.score >= 80
                ? "Outstanding! Your choices today are helping the planet breathe."
                : result.score >= 50
                  ? "Good progress! A few small tweaks will push you even higher."
                  : "Every seed starts small. Tomorrow is a fresh chance to grow."}
            </p>
          </div>
        </div>
      </div>

      {/* Positive Habits */}
      {result.positiveHabits.length > 0 && (
        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="size-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-forest">Positive Habits</h3>
          </div>
          <ul className="space-y-2">
            {result.positiveHabits.map((habit, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                <Leaf className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                {habit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Areas for Improvement */}
      {result.improvements.length > 0 && (
        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="size-5 text-amber-500" />
            <h3 className="text-sm font-bold text-forest">Areas for Improvement</h3>
          </div>
          <ul className="space-y-2">
            {result.improvements.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full rounded-2xl border border-stone-200 bg-white py-3.5 text-sm font-bold text-forest transition-colors hover:bg-stone-50"
      >
        Check In Again
      </button>
    </div>
  );
}
