import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { COMMUNITY_FORESTS } from "@/lib/tree-data";
import { Users, TreePine } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Carbon Forest Community · Carbon Tree" },
      { name: "description", content: "See the global carbon forest grown together by Carbon Tree guardians worldwide." },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  const total = COMMUNITY_FORESTS.reduce((s, f) => s + f.guardians, 0);
  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-5 py-8 pb-28 md:px-8 lg:pb-12">
        <header className="mb-8 grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/60">Global Forest</p>
            <h1 className="mt-1 font-serif text-4xl text-forest md:text-5xl">A forest you grew together</h1>
            <p className="mt-2 max-w-prose text-stone-500">
              Every leaf you earn joins a global carbon forest. Explore districts, unlock collective milestones,
              and watch how small choices add up.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:flex md:gap-4">
            <StatPill icon={<Users className="size-4" />} label="Guardians" value={total.toLocaleString()} />
            <StatPill icon={<TreePine className="size-4" />} label="Districts" value={COMMUNITY_FORESTS.length} />
          </div>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {COMMUNITY_FORESTS.map((f) => (
            <article
              key={f.name}
              className="relative overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-card"
            >
              <div
                className="relative aspect-[3/4] w-full"
                style={{
                  background: `radial-gradient(120% 80% at 50% 100%, ${f.hue}cc, ${f.hue}33 60%, transparent 100%)`,
                }}
              >
                <div className="absolute inset-0 grid place-items-center">
                  <TreePine className="size-20 text-white/80" strokeWidth={1.2} />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4">
                  <p className="text-sm font-bold text-white">{f.name}</p>
                  <p className="text-[11px] text-white/70">{f.guardians.toLocaleString()} guardians</p>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-stone-500">
                  <span>Collective growth</span>
                  <span>{f.growth}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full rounded-full bg-forest" style={{ width: `${f.growth}%` }} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-3xl bg-forest p-8 text-cream md:p-10">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sage">Collective Milestone</p>
              <h2 className="mt-1 font-serif text-3xl">A million leaves before solstice</h2>
              <p className="mt-2 max-w-prose text-sage-soft/85">
                Together, guardians are 64% of the way to the next milestone. Every check-in counts.
              </p>
            </div>
            <button className="rounded-2xl bg-sage px-6 py-3 text-sm font-bold text-forest">Join the challenge</button>
          </div>
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-sage" style={{ width: "64%" }} />
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-white px-4 py-2.5 shadow-sm">
      <div className="grid size-8 place-items-center rounded-lg bg-sage-soft text-forest">{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{label}</p>
        <p className="font-serif text-lg text-forest">{value}</p>
      </div>
    </div>
  );
}
