import { NextResponse } from "next/server";

// Whisper STT (spec §8). Two paths:
// - WHISPER_ENDPOINT set: forwards multipart audio to a self-hosted
//   faster-whisper endpoint that exposes the OpenAI-compatible
//   /audio/transcriptions shape. Preferred for EU data residency.
// - WHISPER_ENDPOINT unset: falls back to OpenAI's hosted Whisper.
//
// The user must consent before any voice capture; that gate lives on
// the client (VoiceButton requests microphone permission before it
// records). The server simply accepts the resulting blob.

export const runtime = "nodejs";
// 30s for a held-thought; the spec's "voice-in is one tap" gestures
// usually finish well below that. Longer takes will be rejected.
export const maxDuration = 60;

const MAX_AUDIO_BYTES = 25 * 1024 * 1024; // OpenAI hard limit; mirror it everywhere.

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") ?? "";
  if (!ct.startsWith("multipart/form-data")) {
    return NextResponse.json(
      { error: "expected multipart/form-data" },
      { status: 400 },
    );
  }

  const form = await req.formData();
  const file = form.get("audio");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing audio file" }, { status: 400 });
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: "audio too large" }, { status: 413 });
  }
  const language = (form.get("language") as string | null) ?? undefined;

  const endpoint =
    process.env.WHISPER_ENDPOINT ??
    "https://api.openai.com/v1/audio/transcriptions";
  const apiKey = process.env.WHISPER_ENDPOINT
    ? process.env.WHISPER_API_KEY ?? ""
    : process.env.OPENAI_API_KEY ?? "";

  if (!apiKey && !process.env.WHISPER_ENDPOINT) {
    return NextResponse.json(
      { error: "no Whisper endpoint configured" },
      { status: 503 },
    );
  }

  // Re-build a clean multipart body. We don't pass through the user's
  // entire FormData verbatim because we only want the audio + the
  // explicit fields the API supports.
  const upstream = new FormData();
  upstream.append("file", file, file.name || "audio.webm");
  upstream.append("model", "whisper-1");
  if (language) upstream.append("language", language);
  upstream.append("response_format", "json");

  const res = await fetch(endpoint, {
    method: "POST",
    headers: apiKey ? { authorization: `Bearer ${apiKey}` } : undefined,
    body: upstream,
  });
  if (!res.ok) {
    return NextResponse.json(
      { error: "transcription failed", status: res.status },
      { status: 502 },
    );
  }
  const data = (await res.json()) as { text?: string };
  return NextResponse.json({ text: data.text ?? "" });
}
