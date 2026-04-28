// Spec §4: two avatars to choose from at first launch, two voice
// profiles, one perceived as more masculine, one as more feminine.
// The ElevenLabs voice ID for each avatar is read from env so the
// product team can swap voices without a deploy.
//
// The avatar's voice stays consistent across language switches (§4),
// so the mapping is locale-agnostic — ElevenLabs Multilingual v2
// handles the language-specific output.

import type { AvatarId } from "@/lib/claude/system-prompt";

export const AVATAR_VOICE_TONALITY: Record<AvatarId, "feminine" | "masculine"> = {
  liss: "feminine",
  kena: "feminine",
  anu: "masculine",
  wer: "masculine",
};

export function getElevenLabsVoiceId(avatar: AvatarId): string | null {
  const map: Record<AvatarId, string | undefined> = {
    liss: process.env.ELEVENLABS_VOICE_LISS,
    kena: process.env.ELEVENLABS_VOICE_KENA,
    anu: process.env.ELEVENLABS_VOICE_ANU,
    wer: process.env.ELEVENLABS_VOICE_WER,
  };
  return map[avatar] ?? null;
}
