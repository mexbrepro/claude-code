import { NextResponse } from "next/server";
import { z } from "zod";
import { dailyPracticeMirror } from "@/lib/claude/orchestrator";
import { detectStage3, safetyResources } from "@/lib/safety/detect";

const Body = z.object({
  locale: z.enum(["en", "de"]),
  questionType: z.enum(["body", "dream", "edge", "flirt"]),
  questionText: z.string().min(1).max(2000),
  answer: z.string().min(1).max(4000),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());

  const stage3 = detectStage3(body.answer);
  if (stage3.length) {
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
