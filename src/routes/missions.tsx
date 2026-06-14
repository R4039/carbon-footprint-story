import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { MISSIONS } from "@/lib/tree-data";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/missions")({
  head: () => ({
    meta: [
      { title: "Eco Missions · Carbon Tree" },
      { name: "description", content: "Take on weekly eco challenges and earn rare ecosystem rewards for your tree." },
    ],
  }),
  component: MissionsPage,
});

function MissionsPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-5 py-8 pb-28 md:px-8 lg:pb-12">
        <header className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/60">This Week</p>
          <h1 className="mt-1 font-serif text-4xl text-forest md:text-5xl">Eco Missions</h1>
          <p className="mt-2 max-w-prose text-stone-500">
            Complete missions to earn rare flowers, birds, and forest animals that decorate your tree's ecosystem.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2">
          {MISSIONS.map((m) => {
            const pct = (m.progress / m.goal) * 100;
            const done = m.progress >= m.goal;
            return (
              <article
                key={m.id}
                className="group relative overflow-hidden rounded-3xl border border-stone-100 bg-white p-6 shadow-card transition-transform hover:-translate-y-1"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="grid size-14 place-items-center rounded-2xl bg-sage-soft text-3xl">{m.emoji}</div>
                  {done && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-forest px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cream">
                      <Sparkles className="size-3" /> Complete
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-forest">{m.title}</h2>
                <p className="mt-1 text-sm text-stone-500">Reward: <span className="font-semibold text-forest">{m.reward}</span></p>

                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-stone-500">
                    <span>{m.progress} of {m.goal} days</span>
                    <span>{Math.round(pct)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-forest to-sage" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <button className="mt-5 w-full rounded-2xl bg-stone-900 py-3 text-sm font-bold text-white transition-colors hover:bg-forest">
                  {done ? "Claim Reward" : "Log Today's Progress"}
                </button>
              </article>
            );
          })}
        </div>
      </main>
    </AppShell>
  );
}
