import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles, Wind, Bird, Flower2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { TreeCanvas } from "@/components/tree-canvas";
import { useTreeState } from "@/lib/use-tree-state";
import { QUESTIONS, MISSIONS, getStage, type CheckInAnswers } from "@/lib/tree-data";
import { getMentorInsight } from "@/lib/ai.functions";
import storyCover from "@/assets/story-cover.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your Living Tree · Carbon Tree" },
      { name: "description", content: "Your personal dashboard: see your living tree, do today's check-in, and read your AI mentor's insight." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { state, hydrated, submitCheckIn } = useTreeState();
  const [answers, setAnswers] = useState<Partial<CheckInAnswers>>({});
  const [mentorMsg, setMentorMsg] = useState<string | null>(null);
  const mentorFn = useServerFn(getMentorInsight);

  const mentor = useMutation({
    mutationFn: (vars: { answers: CheckInAnswers; score: ReturnType<typeof submitCheckIn> }) =>
      mentorFn({ data: { answers: vars.answers, score: vars.score } }),
    onSuccess: (d) => setMentorMsg(d.message),
    onError: (e: Error) => setMentorMsg(`A breeze interrupted the mentor: ${e.message}`),
  });

  const { current, level } = useMemo(() => getStage(state.xp), [state.xp]);
  const allAnswered = QUESTIONS.every((q) => answers[q.id]);

  useEffect(() => {
    if (!mentorMsg && hydrated) {
      setMentorMsg(
        "Welcome back, Elara. Your tree is alive with morning light. Try walking or cycling for one trip today — your canopy will thank you.",
      );
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
    <AppShell level={`Level ${level}: ${current.label}`}>
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-6 pb-28 md:px-8 md:py-8 lg:grid-cols-12 lg:pb-12">
        {/* LEFT */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          {/* Hero tree */}
          <section className="relative overflow-hidden rounded-3xl border border-white bg-gradient-to-b from-sky to-white p-5 shadow-eco md:p-8">
            <div className="relative z-10 mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/60">Good morning, Elara</p>
                <h1 className="mt-1 truncate font-serif text-3xl text-forest md:text-4xl">Your Living Tree</h1>
                <p className="mt-1 text-sm text-stone-500">
                  Healthy & thriving · {state.leaves} leaves · {state.streak}-day streak
                </p>
              </div>
              <div className="hidden flex-col gap-2 sm:flex">
                <FloatStat label="CO₂ Offset" value={`${state.co2}kg`} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto] md:items-end">
              <TreeCanvas xp={state.xp} leaves={state.leaves} butterflies={state.butterflies} />
              <div className="flex flex-col gap-3 md:w-44">
                <EcoStat icon={<Wind className="size-4" />} label="Leaves" value={state.leaves} />
                <EcoStat icon={<Flower2 className="size-4" />} label="Flowers" value={Math.floor(state.butterflies / 2) + 3} />
                <EcoStat icon={<Bird className="size-4" />} label="Birds" value={state.birds} />
                <EcoStat icon={<Sparkles className="size-4" />} label="Butterflies" value={state.butterflies} />
              </div>
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
                  "Your tree weathered several challenging commutes but stayed strong. Thanks to your consistent plant-based choices, new flowers bloomed and butterflies returned to the canopy."}
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
              alt="A golden tree illuminated by morning mist"
              className="aspect-[4/5] w-full rounded-2xl object-cover ring-1 ring-white/10"
              width={512}
              height={640}
              loading="lazy"
            />
          </section>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          {/* AI Mentor */}
          <section className="rounded-3xl border border-bloom/30 bg-bloom-soft/60 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-bloom text-sm font-bold text-white">
                G
              </div>
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

          {/* Daily Check-In */}
          <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-card">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-lg font-bold text-forest">Daily Eco Check-In</h3>
              {state.lastCheckIn === new Date().toISOString().slice(0, 10) && (
                <span className="rounded-full bg-sage-soft px-2 py-0.5 text-[10px] font-bold uppercase text-forest">
                  Done today
                </span>
              )}
            </div>
            <p className="mb-5 text-xs text-stone-500">5 quick choices grow your tree.</p>

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

          {/* Active Missions */}
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
                      <div
                        className="h-full rounded-full bg-forest"
                        style={{ width: `${(m.progress / m.goal) * 100}%` }}
                      />
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

function FloatStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-3 text-right shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{label}</p>
      <p className="font-serif text-2xl text-forest">{value}</p>
    </div>
  );
}

function EcoStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-stone-100 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2 text-forest">
        {icon}
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <span className="font-serif text-xl text-forest">{value}</span>
    </div>
  );
}
