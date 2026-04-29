"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Optional read-aloud. Spec §8: "Streaming TTS during active We-Flection
// sessions; daily-practice mirroring text-only by default with optional
// read-aloud." We default to text — the user taps when they want to hear,
// or opts into auto-speak via Settings.
//
// Uses a streamed audio response from /api/tts so the avatar's voice
// starts before generation finishes.

export function SpeakButton({
  text,
  className,
  autoplay,
}: {
  text: string;
  className?: string;
  autoplay?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (autoplay && !triggeredRef.current && text.trim()) {
      triggeredRef.current = true;
      void play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, text]);

  async function play() {
    if (state !== "idle" || !text.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok || !res.body) {
        setState("idle");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setState("idle");
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setState("idle");
      };
      setState("playing");
      await audio.play();
    } catch {
      setState("idle");
    }
  }

  function stop() {
    audioRef.current?.pause();
    setState("idle");
  }

  return (
    <button
      type="button"
      aria-label={state === "playing" ? "stop" : "speak"}
      onClick={state === "playing" ? stop : play}
      className={cn(
        "text-xs text-ink-muted transition-colors hover:text-ink",
        state === "playing" && "text-signal",
        state === "loading" && "animate-breath",
        className,
      )}
    >
      {state === "playing" ? "⏸" : "♪"}
    </button>
  );
}
