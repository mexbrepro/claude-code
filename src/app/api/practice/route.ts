import { NextResponse } from "next/server";
import { z } from "zod";
import { dailyPracticeMirror } from "@/lib/claude/orchestrator";
import { detectStage3, safetyResources } from "@/lib/safety/detect";
import { getOrCreateUser } from "@/lib/auth/user";
import { db, schema } from "@/lib/db/client";

const Body = z.object({
  locale: z.enum(["en", "de"]),
  questionType: z.enum(["body", "dream", "edge", "flirt"]),
  questionText: z.string().min(1).max(2000),
  answer: z.string().min(1).max(4000),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());
  const { userId } = await getOrCreateUser();

  // Always log the entry first, then run the safety check + mirror in
  // parallel where possible. Persistence is best-effort.
  if (db && userId) {
    await db.insert(schema.practiceEntries).values({
      userId,
      questionType: body.questionType,
      contentText: body.answer,
    });
  }

  const stage3 = detectStage3(body.answer);
  if (stage3.length) {
    if (db && userId) {
      // Spec §6 calls for SafetyEvent logging.
      await db.insert(schema.safetyEvents).values({
        userId,
        triggerType: stage3[0].trigger,
        actionTaken: "presence_mode_with_resources",
        resourcesOffered: stage3.map((h) => h.trigger),
      });
    }
    return NextResponse.json({
      mirror: "",
      followup: null,
      safety: {
        triggers: stage3,
        resources: safetyResources(body.locale),
      },
    });
  }

  const mirror = await dailyPracticeMirror({
    questionType: body.questionType,
    questionText: body.questionText,
    userAnswer: body.answer,
    locale: body.locale,
  });
  return NextResponse.json(mirror);
}
