import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles, Bird, Trees, Heart, Leaf, Sun, Moon } from "lucide-react";
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
  const { state, hydrated, submitCheckIn } = useTreeState();
  const { history } = useDailyCheckInState();
  const [answers, setAnswers] = useState<Partial<CheckInAnswers>>({});
  const [mentorMsg, setMentorMsg] = useState<string | null>(null);
  const [isNight, setIsNight] = useState(false);
  const mentorFn = useServerFn(getMentorInsight);

  const mentor = useMutation({
    mutationFn: (vars: { answers: CheckInAnswers; score: ReturnType<typeof submitCheckIn> }) =>
      mentorFn({ data: { answers: vars.answers, score: vars.score } }),
    onSuccess: (d) => setMentorMsg(d.message),
    onError: (e: Error) => setMentorMsg(`A breeze interrupted the mentor: ${e.message}`),
  });

  const allAnswered = QUESTIONS.every((q) => answers[q.id]);

  const { forestLevel, health, biodiversity, season } = useMemo(() => {
    const recent = history.entries.slice(0, 7);
    const avg = recent.length ? recent.reduce((a, e) => a + e.score, 0) / recent.length : 55;
    const lvl: 1 | 2 | 3 | 4 | 5 =
      avg >= 80 ? 5 : avg >= 65 ? 4 : avg >= 50 ? 3 : avg >= 30 ? 2 : 1;
    const monthIdx = new Date().getMonth();
    const seasonIdx = Math.floor(((monthIdx + 1) % 12) / 3);
    return {
      forestLevel: lvl,
      health: avg,
      biodiversity: Math.min(100, lvl * 18 + state.butterflies + state.birds * 2),
      season: SEASONS[seasonIdx],
    };
  }, [history.entries, state.butterflies, state.birds]);

  const treesGrown = [0, 2, 5, 9, 13, 15][forestLevel];
  const wildlife = state.butterflies + state.birds + (forestLevel >= 3 ? 2 : 0) + (forestLevel >= 4 ? 3 : 0);

  useEffect(() => {
    if (!mentorMsg && hydrated) {
      setMentorMsg("Welcome to your forest, Elara. Each low-carbon choice today invites more life onto your island.");
    }
  }, [hydrated, mentorMsg]);

  function handleSubmit() {
    if (!allAnswered) return;
    const a = answers as CheckInAnswers;
    const score = submitCheckIn(a);
    mentor.mutate({ answers: a, score });
    setAnswers({});
  }

  return (
    <AppShell level={`Level ${forestLevel}: ${LEVEL_NAMES[forestLevel]}`}>
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-6 pb-28 md:px-8 md:py-8 lg:grid-cols-12 lg:pb-12">
        {/* LEFT — Forest hero */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-b from-sky/60 to-cream p-4 shadow-eco md:p-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/60">My Carbon Forest</p>
                <h1 className="mt-1 font-serif text-3xl text-forest md:text-4xl">{LEVEL_NAMES[forestLevel]}</h1>
                <p className="mt-1 text-sm capitalize text-stone-500">
                  Level {forestLevel} of 5 · {state.streak}-day streak · {season}
                </p>
              </div>
              <button
                onClick={() => setIsNight((v) => !v)}
                className="glass inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-forest transition-transform hover:scale-105"
                aria-label="Toggle day and night"
              >
                {isNight ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {isNight ? "Day" : "Night"}
              </button>
            </div>

            <ForestIsland level={forestLevel} health={health} isNight={isNight} season={season} />

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                <span>Empty Land</span>
                <span>Forest Paradise</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
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
              <StatCard icon={<Leaf className="size-4" />} label="Carbon" value={Math.round(health)} />
              <StatCard icon={<Heart className="size-4" />} label="Health" value={`${Math.round(health)}%`} />
              <StatCard icon={<Sparkles className="size-4" />} label="Biodiversity" value={biodiversity} />
              <StatCard icon={<Trees className="size-4" />} label="Trees" value={treesGrown} />
              <StatCard icon={<Bird className="size-4" />} label="Wildlife" value={wildlife} />
            </div>
          </section>

          {/* Monthly story card */}
          <section className="grid grid-cols-1 items-center gap-6 rounded-3xl bg-forest p-6 text-cream md:grid-cols-[1fr_220px] md:p-8">
            <div className="space-y-4">
              <div className="inline-block rounded-full border border-sage/30 bg-sage/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                Monthly Story
              </div>
              <h2 className="font-serif text-2xl italic leading-tight md:text-3xl">
                "{state.monthlyStory ? state.monthlyStory.month : "The Month of Quiet Roots"}"
              </h2>
              <p className="max-w-prose text-sage-soft/85 leading-relaxed">
                {state.monthlyStory?.story ??
                  "Your forest weathered several challenging commutes but stayed strong. Thanks to your consistent plant-based choices, new flowers bloomed and butterflies returned to the canopy."}
              </p>
              <Link
                to="/story"
                className="inline-flex items-center gap-2 rounded-xl bg-sage px-5 py-3 text-sm font-bold text-forest transition-transform hover:scale-[1.02]"
              >
                Read your story <ArrowRight className="size-4" />
              </Link>
            </div>
            <img
              src={storyCover}
              alt="A golden forest illuminated by morning mist"
              className="aspect-[4/5] w-full rounded-2xl object-cover ring-1 ring-white/10"
              width={512}
              height={640}
              loading="lazy"
            />
          </section>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          <section className="rounded-3xl border border-bloom/30 bg-bloom-soft/60 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-bloom text-sm font-bold text-white">G</div>
              <div>
                <p className="font-bold text-forest leading-tight">Gemini Mentor</p>
                <p className="text-[11px] text-stone-500">Personalized for you</p>
              </div>
            </div>
            <div className="relative rounded-2xl border border-bloom/20 bg-white p-4 shadow-sm">
              <p className="text-sm leading-relaxed text-stone-700">
                {mentor.isPending ? "Thinking under the canopy…" : mentorMsg}
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-card">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-lg font-bold text-forest">Daily Eco Check-In</h3>
              {state.lastCheckIn === new Date().toISOString().slice(0, 10) && (
                <span className="rounded-full bg-sage-soft px-2 py-0.5 text-[10px] font-bold uppercase text-forest">
                  Done today
                </span>
              )}
            </div>
            <p className="mb-5 text-xs text-stone-500">5 quick choices grow your forest.</p>

            <div className="space-y-5">
              {QUESTIONS.map((q) => (
                <div key={q.id}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">{q.title}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((o) => {
                      const sel = answers[q.id] === o.value;
                      return (
                        <button
                          key={o.value}
                          onClick={() => setAnswers((p) => ({ ...p, [q.id]: o.value as never }))}
                          className={`rounded-xl border p-2.5 text-left text-xs font-medium transition-all ${
                            sel
                              ? "border-forest bg-forest text-white"
                              : "border-stone-100 text-stone-700 hover:border-forest/40 hover:bg-sage-soft/40"
                          }`}
                        >
                          <span className="mr-1.5">{o.emoji}</span>
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || mentor.isPending}
                className="mt-2 w-full rounded-2xl bg-stone-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-forest disabled:cursor-not-allowed disabled:opacity-40"
              >
                {mentor.isPending ? "Growing…" : "Complete Daily Log"}
              </button>
            </div>
          </section>

          <section className="rounded-3xl bg-stone-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-forest">Active Missions</h3>
              <Link to="/missions" className="text-xs font-bold text-forest underline-offset-4 hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {MISSIONS.slice(0, 3).map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-2xl border border-stone-200/60 bg-white p-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-sage-soft text-xl">{m.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{m.title}</p>
                    <p className="text-[11px] text-stone-400">Reward: {m.reward}</p>
                    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-stone-100">
                      <div className="h-full rounded-full bg-forest" style={{ width: `${(m.progress / m.goal) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-stone-500">{m.progress}/{m.goal}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="glass flex flex-col gap-1 rounded-2xl p-3 shadow-sm">
      <div className="flex items-center gap-1.5 text-forest/70">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <span className="font-serif text-2xl text-forest">{value}</span>
    </div>
  );
}
