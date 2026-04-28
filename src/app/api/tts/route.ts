import { NextResponse } from "next/server";
import { z } from "zod";
import { getAvatarChoice } from "@/lib/auth/user";
import { getElevenLabsVoiceId } from "@/lib/voice/avatar-voices";

// ElevenLabs streaming TTS for the avatar voice (spec §8).
// The route streams audio bytes directly to the client; the player
// component pipes them into a MediaSource so playback starts before
// generation finishes.
//
// Slow tempo, natural pauses, breath (§8). Settings are tuned for the
// generative-trance tonality — center, connection, creative acceptance
// (§4) — without being hypnotic.

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({
  text: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  const body = Body.parse(await req.json());
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "tts not configured" }, { status: 503 });
  }
  const avatar = await getAvatarChoice();
  if (!avatar) {
    return NextResponse.json({ error: "no avatar selected" }, { status: 412 });
  }
  const voiceId = getElevenLabsVoiceId(avatar);
  if (!voiceId) {
    return NextResponse.json(
      { error: `no voice configured for ${avatar}` },
      { status: 503 },
    );
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/stream?optimize_streaming_latency=2`;
  const upstream = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "content-type": "application/json",
      accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: body.text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        // Restrained settings — calm presence, not performative warmth.
        stability: 0.55,
        similarity_boost: 0.7,
        style: 0.15,
        use_speaker_boost: true,
      },
    }),
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "tts upstream failed", status: upstream.status },
      { status: 502 },
    );
  }
  return new Response(upstream.body, {
    headers: {
      "content-type": "audio/mpeg",
      "cache-control": "no-store",
    },
  });
}
