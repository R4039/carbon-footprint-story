import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles, Bird, Trees, Heart, Leaf, Flower2, Award, Flame, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ForestIsland } from "@/components/forest-island";
import { useTreeState } from "@/lib/use-tree-state";
import { useDailyCheckInState } from "@/lib/use-check-in-state";
import { QUESTIONS, MISSIONS, type CheckInAnswers } from "@/lib/tree-data";
import { getMentorInsight } from "@/lib/ai.functions";

import storyCover from "@/assets/story-cover.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Carbon Forest · Carbon Tree" },
      { name: "description", content: "Watch your living isometric forest evolve with every eco check-in." },
    ],
  }),
  component: Dashboard,
});

const LEVEL_NAMES = ["", "Empty Land", "Seedlings", "Young Forest", "Blooming Forest", "Forest Paradise"] as const;
const SEASONS = ["spring", "summer", "autumn", "winter"] as const;

function Dashboard() {
  const { state, hydrated, submitCheckIn, entriesToday, canCheckIn, dailyLimit } = useTreeState();
  const { history } = useDailyCheckInState();
  const [answers, setAnswers] = useState<Partial<CheckInAnswers>>({});
  const [mentorMsg, setMentorMsg] = useState<string | null>(null);
  const [growKey, setGrowKey] = useState(0);
  const mentorFn = useServerFn(getMentorInsight);

  const mentor = useMutation({
    mutationFn: (vars: { answers: CheckInAnswers; score: NonNullable<ReturnType<typeof submitCheckIn>> }) => {
      // Backend expects original 5-field shape; map gracefully.
      const a = vars.answers;
      const mapped = {
        transport: a.transport,
        electricity: a.electricity,
        food: a.food === "mostly-plant" ? "plant" : a.food,
        plastic: a.waste === "recycle-all" || a.waste === "mostly-recycle" ? "none" : a.waste === "some-waste" ? "some" : "lots",
        water: a.water,
      };
      return mentorFn({ data: { answers: mapped, score: vars.score } });
    },
    onSuccess: (d) => setMentorMsg(d.message),
    onError: (e: Error) => setMentorMsg(`A breeze interrupted the mentor: ${e.message}`),
  });

  const allAnswered = QUESTIONS.every((q) => answers[q.id as keyof CheckInAnswers]);

  // Tree growth scales with every personal log entry — instantly visible.
  const entriesCount = state.logs.length + history.entries.length;

  const { forestLevel, health, biodiversity, season } = useMemo(() => {
    const recent = [...state.logs.slice(0, 7), ...history.entries.slice(0, 7)];
    const scores = recent.map((r) => ("score" in r ? r.score : Math.min(100, 40 + (r.xp ?? 0))));
    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 55;
    // Faster level progression — level boosted by entries as well
    const entryBoost = Math.min(2, Math.floor((state.logs.length + history.entries.length) / 3));
    let lvl: 1 | 2 | 3 | 4 | 5 =
      avg >= 70 ? 5 : avg >= 55 ? 4 : avg >= 40 ? 3 : avg >= 25 ? 2 : 1;
    lvl = Math.min(5, lvl + entryBoost) as 1 | 2 | 3 | 4 | 5;
    const monthIdx = new Date().getMonth();
    const seasonIdx = Math.floor(((monthIdx + 1) % 12) / 3);
    return {
      forestLevel: lvl,
      health: avg,
      biodiversity: Math.min(100, lvl * 18 + state.butterflies + state.birds * 2),
      season: SEASONS[seasonIdx],
    };
  }, [state.logs, history.entries, state.butterflies, state.birds]);

  const treesGrown = [0, 3, 7, 12, 16, 20][forestLevel] + entriesCount * 2;
  const wildlife = state.butterflies + state.birds + (forestLevel >= 3 ? 2 : 0) + (forestLevel >= 4 ? 3 : 0);
  const waterSaved = Math.round(entriesCount * 18 + state.streak * 4);

  const achievements = useMemo(() => [
    { id: "sapling", icon: "🌱", label: "First Sapling", unlocked: entriesCount >= 1 },
    { id: "butterfly", icon: "🦋", label: "Butterfly Magnet", unlocked: state.butterflies >= 5 },
    { id: "builder", icon: "🌳", label: "Forest Builder", unlocked: treesGrown >= 10 },
    { id: "streak", icon: "🔥", label: "7 Day Streak", unlocked: state.streak >= 7 },
    { id: "hero", icon: "🌎", label: "Carbon Hero", unlocked: state.co2 >= 25 },
  ], [entriesCount, state.butterflies, treesGrown, state.streak, state.co2]);

  useEffect(() => {
    if (!mentorMsg && hydrated) {
      setMentorMsg("Welcome to your forest, Elara. Each low-carbon choice today invites more life onto your island.");
    }
  }, [hydrated, mentorMsg]);

  function handleSubmit() {
    if (!allAnswered || !canCheckIn) return;
    const a = answers as CheckInAnswers;
    const score = submitCheckIn(a);
    if (!score) return;
    mentor.mutate({ answers: a, score });
    setAnswers({});
    setGrowKey((k) => k + 1);
  }

  return (
    <AppShell level={`Level ${forestLevel}: ${LEVEL_NAMES[forestLevel]}`}>
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-6 pb-28 md:px-8 md:py-8 lg:grid-cols-12 lg:pb-12">
        {/* LEFT — Forest hero */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          <section
            className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-b from-sky/60 to-cream p-4 shadow-eco md:p-6"
          >
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/60">My Carbon Forest</p>
                <h1 className="mt-1 font-serif text-3xl text-forest md:text-4xl">{LEVEL_NAMES[forestLevel]}</h1>
                <p className="mt-1 text-sm capitalize text-stone-500">
                  Level {forestLevel} of 5 · {state.streak}-day streak · {season}
                </p>
              </div>
              <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-forest">
                <Flame className="size-4 text-bloom" />
                {entriesToday}/{dailyLimit} entries today
              </div>
            </div>

            <div key={growKey} className="animate-grow-pulse">
              <ForestIsland
                level={forestLevel}
                health={health}
                season={season}
                entriesCount={entriesCount}
              />
            </div>

            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                <span>Empty Land</span>
                <span>Forest Paradise</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-bloom via-sage to-forest transition-all duration-700"
                  style={{ width: `${(forestLevel / 5) * 100}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] font-bold text-stone-400">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className={forestLevel >= n ? "text-forest" : ""}>
                    ● L{n}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <StatCard icon={<Heart className="size-4" />} label="Forest Health" value={`${Math.round(health)}%`} trend="up" />
              <StatCard icon={<Flower2 className="size-4" />} label="Bloom Score" value={Math.round(health * 0.85)} trend="up" />
              <StatCard icon={<Sparkles className="size-4" />} label="Species" value={biodiversity} trend={biodiversity > 40 ? "up" : "flat"} />
              <StatCard icon={<Trees className="size-4" />} label="Trees Grown" value={treesGrown} trend="up" />
              <StatCard icon={<Bird className="size-4" />} label="Forest Friends" value={wildlife} trend={wildlife > 6 ? "up" : "flat"} />
            </div>
          </section>

          {/* How Your Forest Grows */}
          <section className="rounded-3xl border border-sage/40 bg-gradient-to-br from-sage-soft/70 via-white to-bloom-soft/40 p-6 shadow-card dark:from-white/[0.04] dark:via-white/[0.02] dark:to-white/[0.04] dark:border-white/10">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-forest text-lg text-white shadow-md shadow-forest/20">🌱</div>
              <div>
                <h3 className="text-lg font-bold text-forest">How Your Forest Grows</h3>
                <p className="text-xs text-stone-600 dark:text-stone-300">A living world that responds to your choices.</p>
              </div>
            </div>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {[
                { e: "📝", t: "Complete 2 eco check-ins daily" },
                { e: "⭐", t: "Earn growth points through sustainable choices" },
                { e: "🌳", t: "Trees grow visibly after each check-in" },
                { e: "🦋", t: "Unlock flowers, butterflies, birds & fireflies" },
                { e: "🌍", t: "Build your own thriving carbon-positive forest" },
              ].map((it, i) => (
                <li key={i} className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/70 p-3 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]">
                  <span className="text-xl leading-none">{it.e}</span>
                  <span className="text-sm font-medium text-forest dark:text-sage">{it.t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Environmental Impact */}
          <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-card dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-forest">
                <Leaf className="size-5 text-sage" /> Environmental Impact
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">All time</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ImpactCard tone="forest" icon="🌳" label="Trees Grown" value={treesGrown} unit="trees" />
              <ImpactCard tone="sky" icon="💧" label="Water Saved" value={waterSaved} unit="liters" />
              <ImpactCard tone="sage" icon="🌫️" label="CO₂ Reduced" value={state.co2} unit="kg" />
              <ImpactCard tone="bloom" icon="❤️" label="Forest Health" value={`${Math.round(health)}%`} />
            </div>
          </section>


          {/* Forest Chronicle — storybook feel, fixed contrast in both themes */}
          <section className="grid grid-cols-1 items-center gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B4332] via-[#143028] to-[#0F2A1F] p-6 shadow-eco md:grid-cols-[1fr_220px] md:p-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#95D5B2]/40 bg-[#95D5B2]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D8F3DC]">
                <BookIcon /> Forest Chronicle · Nature Journal
              </div>
              <h2 className="font-serif text-3xl italic leading-tight text-[#FDFCF8] md:text-4xl drop-shadow-sm">
                "{state.monthlyStory ? state.monthlyStory.month : "The Month of Quiet Roots"}"
              </h2>
              <p className="max-w-prose text-base leading-relaxed text-[#E8F5EC]/95">
                {state.monthlyStory?.story ??
                  "Your forest weathered several challenging commutes but stayed strong. Thanks to your consistent plant-based choices, new flowers bloomed and butterflies returned to the canopy."}
              </p>
              <Link
                to="/story"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#95D5B2] px-5 py-3 text-sm font-bold text-[#0F2A1F] transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#95D5B2]/30"
              >
                Explore My Journey
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <img
              src={storyCover}
              alt="A golden forest illuminated by morning mist"
              className="aspect-[4/5] w-full rounded-2xl object-cover ring-1 ring-white/15 shadow-lg"
              width={512}
              height={640}
              loading="lazy"
            />
          </section>


          {/* Achievements */}
          <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-card dark:border-white/5 dark:bg-white/[0.03]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-forest">
                <Trophy className="size-5 text-bloom" /> Achievements
              </h3>
              <span className="text-xs font-semibold text-stone-400">
                {achievements.filter((a) => a.unlocked).length} / {achievements.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-all ${
                    a.unlocked
                      ? "animate-pop-in border-sage/40 bg-sage-soft/40 text-forest shadow-sm"
                      : "border-stone-100 bg-stone-50/50 text-stone-300 grayscale dark:border-white/5 dark:bg-white/[0.02]"
                  }`}
                >
                  <span className="text-3xl" aria-hidden>{a.icon}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider">{a.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          <section className="rounded-3xl border border-bloom/30 bg-bloom-soft/60 p-6 dark:border-white/5">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-bloom text-sm font-bold text-white shadow-md shadow-bloom/40">G</div>
              <div>
                <p className="font-bold text-forest leading-tight">Gemini Mentor</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">Personalized for you</p>
              </div>
            </div>
            <div className="relative rounded-2xl border border-bloom/20 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
              {mentor.isPending ? (
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <span className="size-2 animate-pulse rounded-full bg-bloom" />
                  Thinking under the canopy…
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-200">{mentorMsg}</p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-card dark:border-white/5 dark:bg-white/[0.03]">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-lg font-bold text-forest">Daily Eco Check-In</h3>
              {state.lastCheckIn === new Date().toISOString().slice(0, 10) && (
                <span className="rounded-full bg-sage-soft px-2 py-0.5 text-[10px] font-bold uppercase text-forest">
                  Done today
                </span>
              )}
            </div>
            <p className="mb-5 text-xs text-stone-500 dark:text-stone-400">6 quick choices grow your forest instantly.</p>

            <div className="space-y-5">
              {QUESTIONS.map((q) => (
                <div key={q.id}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">{q.title}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((o) => {
                      const sel = answers[q.id as keyof CheckInAnswers] === o.value;
                      return (
                        <button
                          key={o.value}
                          onClick={() => setAnswers((p) => ({ ...p, [q.id]: o.value as never }))}
                          className={`group flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-medium transition-all ${
                            sel
                              ? "border-forest bg-forest text-white shadow-md shadow-forest/20"
                              : "border-stone-100 text-stone-700 hover:-translate-y-px hover:border-forest/40 hover:bg-sage-soft/40 dark:border-white/5 dark:text-stone-200 dark:hover:bg-white/5"
                          }`}
                        >
                          <span className="text-base">{o.emoji}</span>
                          <span className="truncate">{o.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || mentor.isPending || !canCheckIn}
                className="mt-2 w-full rounded-2xl bg-gradient-to-r from-forest to-forest-deep py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.01] hover:shadow-lg hover:shadow-forest/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                {!canCheckIn
                  ? "Daily limit reached · come back tomorrow"
                  : mentor.isPending
                    ? "Growing your forest…"
                    : `Complete Entry 🌱 (${entriesToday}/${dailyLimit})`}
              </button>

            </div>
          </section>

          <section className="rounded-3xl border border-stone-100 bg-gradient-to-br from-white to-sage-soft/30 p-6 shadow-card dark:border-white/10 dark:bg-white/[0.04] dark:from-white/[0.04] dark:to-white/[0.02]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-forest">Active Missions</h3>
              <Link to="/missions" className="text-xs font-bold text-forest underline-offset-4 hover:underline dark:text-sage">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {MISSIONS.slice(0, 3).map((m) => {
                const pct = Math.round((m.progress / m.goal) * 100);
                return (
                  <div key={m.id} className="group flex items-center gap-3 rounded-2xl border border-stone-200/70 bg-white p-3 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/[0.05]">
                    <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sage-soft to-bloom-soft text-2xl shadow-inner dark:from-white/10 dark:to-white/[0.04]">
                      {m.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-forest dark:text-sage">{m.title}</p>
                      <p className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-bloom-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest dark:bg-white/10 dark:text-sage">
                        🎁 {m.reward}
                      </p>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-sage via-emerald-400 to-forest transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-stone-600 dark:text-stone-300">{m.progress}/{m.goal}</span>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </main>
    </AppShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend = "flat",
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  trend?: "up" | "down" | "flat";
}) {
  return (
    <div className="glass group flex flex-col gap-1 rounded-2xl p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-1.5 text-forest/70">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        {trend === "up" && <span className="text-[10px] font-bold text-emerald-500">▲</span>}
        {trend === "down" && <span className="text-[10px] font-bold text-bloom">▼</span>}
      </div>
      <span className="font-serif text-2xl text-forest">{value}</span>
    </div>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Re-export Award to keep import tree-shake friendly (unused in current layout).
void Award; void Leaf;
