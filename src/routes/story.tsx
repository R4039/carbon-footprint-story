import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Share2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useTreeState } from "@/lib/use-tree-state";
import { getMonthlyStory } from "@/lib/ai.functions";
import { getStage } from "@/lib/tree-data";
import storyCover from "@/assets/story-cover.jpg";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Monthly Story · Carbon Tree" },
      { name: "description", content: "Gemini-generated personal story of your month's eco journey, ready to share." },
    ],
  }),
  component: StoryPage,
});

function parseStory(raw: string): { title: string; body: string } {
  const titleMatch = raw.match(/TITLE:\s*(.+)/i);
  const storyMatch = raw.match(/STORY:\s*([\s\S]+)/i);
  if (titleMatch && storyMatch) {
    return { title: titleMatch[1].trim().replace(/^"|"$/g, ""), body: storyMatch[1].trim() };
  }
  return { title: "Your Monthly Story", body: raw };
}

function StoryPage() {
  const { state, setMonthlyStory } = useTreeState();
  const [parsed, setParsed] = useState<{ title: string; body: string } | null>(null);
  const storyFn = useServerFn(getMonthlyStory);
  const month = new Date().toLocaleString("en", { month: "long", year: "numeric" });
  const stage = getStage(state.xp).current.label;

  const gen = useMutation({
    mutationFn: () =>
      storyFn({
        data: {
          month,
          stats: {
            leaves: state.leaves,
            butterflies: state.butterflies,
            birds: state.birds,
            co2: state.co2,
            streak: state.streak,
            stage,
          },
        },
      }),
    onSuccess: (d) => {
      const p = parseStory(d.message);
      setParsed(p);
      setMonthlyStory(p.body);
    },
  });

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-5 py-8 pb-28 md:px-8 lg:pb-12">
        <header className="mb-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/60">{month} Chapter</p>
          <h1 className="mt-1 font-serif text-4xl text-forest md:text-5xl">Your Monthly Story</h1>
          <p className="mt-2 text-stone-500">A poetic snapshot of your tree's journey, written by Gemini.</p>
        </header>

        <article className="overflow-hidden rounded-3xl bg-forest text-cream shadow-eco">
          <div className="relative aspect-[16/9] w-full">
            <img src={storyCover} alt="Story cover" className="absolute inset-0 size-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <div className="inline-block rounded-full border border-sage/30 bg-sage/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                {month}
              </div>
              <h2 className="mt-3 font-serif text-3xl italic md:text-5xl">
                "{parsed?.title ?? state.monthlyStory?.month ?? "The Month of Quiet Roots"}"
              </h2>
            </div>
          </div>

          <div className="space-y-6 p-6 md:p-10">
            <p className="font-serif text-xl italic leading-relaxed text-sage-soft md:text-2xl">
              {gen.isPending
                ? "Gathering this month's leaves and weaving them into words…"
                : (parsed?.body ?? state.monthlyStory?.story ??
                  "Press the button below to let Gemini weave the story of your month into a shareable card.")}
            </p>

            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4">
              <StoryStat label="Leaves" value={state.leaves} />
              <StoryStat label="Butterflies" value={state.butterflies} />
              <StoryStat label="Birds" value={state.birds} />
              <StoryStat label="CO₂ Saved" value={`${state.co2}kg`} />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => gen.mutate()}
                disabled={gen.isPending}
                className="inline-flex items-center gap-2 rounded-2xl bg-sage px-6 py-3 text-sm font-bold text-forest transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                <Sparkles className="size-4" />
                {gen.isPending ? "Composing…" : parsed ? "Regenerate" : "Generate this month's story"}
              </button>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-sage/30 px-6 py-3 text-sm font-bold text-cream">
                <Share2 className="size-4" /> Share story card
              </button>
            </div>

            {gen.isError && (
              <p className="text-sm text-bloom">{(gen.error as Error).message}</p>
            )}
          </div>
        </article>
      </main>
    </AppShell>
  );
}

function StoryStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-sage">{label}</p>
      <p className="mt-1 font-serif text-2xl">{value}</p>
    </div>
  );
}
