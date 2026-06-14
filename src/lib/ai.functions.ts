import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

async function callGemini(system: string, user: string) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Mentor is resting — please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in your workspace.");
    throw new Error(`AI error ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return json.choices?.[0]?.message?.content?.trim() ?? "";
}

const MentorInput = z.object({
  answers: z.object({
    transport: z.string(),
    electricity: z.string(),
    food: z.string(),
    plastic: z.string(),
    water: z.string(),
  }),
  score: z.object({
    xp: z.number(),
    leaves: z.number(),
    butterflies: z.number(),
    birds: z.number(),
    co2: z.number(),
  }),
});

export const getMentorInsight = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MentorInput.parse(input))
  .handler(async ({ data }) => {
    const system =
      "You are a warm, encouraging AI sustainability mentor for an app called Carbon Tree, where users grow a digital tree based on their daily eco choices. Speak in 2-3 short, vivid sentences. Connect their choices to what happens to their tree (leaves bloom, butterflies arrive, branches strengthen). Always end with one specific, doable suggestion for tomorrow. Avoid lecturing.";
    const user = `Today's choices:
- Transport: ${data.answers.transport}
- Electricity: ${data.answers.electricity}
- Food: ${data.answers.food}
- Plastic: ${data.answers.plastic}
- Water: ${data.answers.water}

Result: ${data.score.xp >= 0 ? "+" : ""}${data.score.xp} growth points, ${data.score.leaves} new leaves, ${data.score.butterflies} butterflies, ${data.score.birds} birds, ${data.score.co2}kg CO2 offset.`;
    const message = await callGemini(system, user);
    return { message };
  });

const StoryInput = z.object({
  month: z.string(),
  stats: z.object({
    leaves: z.number(),
    butterflies: z.number(),
    birds: z.number(),
    co2: z.number(),
    streak: z.number(),
    stage: z.string(),
  }),
});

export const getMonthlyStory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => StoryInput.parse(input))
  .handler(async ({ data }) => {
    const system =
      "You write short, illustrated story-card narratives for Carbon Tree users. Tone: poetic, hopeful, cinematic — like a Studio Ghibli voiceover. 4-6 sentences. Use the metaphor of their tree weathering days, gaining leaves, attracting wildlife. Always title the story with a poetic name like 'The Month of Quiet Roots'.";
    const user = `Write a personal monthly story for ${data.month}.
The user's tree is now a ${data.stats.stage}. They earned ${data.stats.leaves} new leaves, attracted ${data.stats.butterflies} butterflies and ${data.stats.birds} birds, offset ${data.stats.co2}kg of CO2, with a ${data.stats.streak}-day streak.

Return format:
TITLE: <poetic title>
STORY: <4-6 sentence narrative>`;
    const message = await callGemini(system, user);
    return { message };
  });
