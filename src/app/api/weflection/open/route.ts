import { NextResponse } from "next/server";
import { pickOpener } from "@/lib/claude/system-prompt";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const locale = url.searchParams.get("locale") === "de" ? "de" : "en";
  // The richer contextual selection (time of day, prior session energy)
  // belongs in a server action that has access to the user record. The
  // current implementation already avoids same-week repeats.
  const opener = pickOpener(locale, []);
  return NextResponse.json({ opener });
}
