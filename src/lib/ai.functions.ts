import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MentorInput = z.object({
  answers: z.any(),
  score: z.any(),
});

export const getMentorInsight = createServerFn({ method: "POST" })
  .validator(MentorInput)
  .handler(async () => {
    return {
      message:
        "🌱 Great work today! Your sustainable choices helped your forest grow stronger. Keep making eco-friendly decisions and watch your forest thrive.",
    };
  });

const StoryInput = z.object({
  month: z.string(),
  stats: z.any(),
});

export const getMonthlyStory = createServerFn({ method: "POST" })
  .validator(StoryInput)
  .handler(async ({ data }) => {
    return {
      message: `TITLE: The Month of Growing Roots

STORY: During ${data.month}, your forest continued to flourish through your sustainable actions. New leaves appeared, wildlife found shelter among the trees, and your impact on the environment became stronger. Every eco-friendly decision helped create a healthier ecosystem. Your forest stands as a reflection of your commitment to a greener future.`,
    };
  });