"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type State = "idle" | "permission" | "recording" | "transcribing" | "denied";

export function VoiceButton({
  locale,
  onTranscript,
  disabled,
}: {
  locale: string;
  onTranscript: (text: string) => void;
  disabled?: boolean;
}) {
  const [state, setState] = useState<State>("idle");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Always release the mic if the component unmounts mid-record.
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function start() {
    if (state !== "idle" || disabled) return;
    setState("permission");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickMime();
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = handleStop;
      recorder.start(250);
      recorderRef.current = recorder;
      setState("recording");
    } catch {
      setState("denied");
      // Reset back to idle after a short pause so the user can try again.
      setTimeout(() => setState("idle"), 1500);
    }
  }

  function stop() {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      releaseStream();
      return;
    }
    recorder.stop();
  }

  async function handleStop() {
    setState("transcribing");
    try {
      const blob = new Blob(chunksRef.current, {
        type: recorderRef.current?.mimeType || "audio/webm",
      });
      const form = new FormData();
      form.append("audio", blob, fileName(blob.type));
      form.append("language", locale);
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const data: { text?: string; error?: string } = res.ok ? await res.json() : {};
      if (data.text) onTranscript(data.text);
    } catch {
      /* swallow — user can retry */
    } finally {
      releaseStream();
      setState("idle");
    }
  }

  function releaseStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
  }

  // Hold to speak, release to send (spec §10).
  // Pointer events cover mouse, touch, and pen with a single handler set.
  const handlers = {
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      void start();
    },
    onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      stop();
    },
    onPointerLeave: () => {
      if (state === "recording") stop();
    },
    onPointerCancel: () => {
      if (state === "recording") stop();
    },
  };

  const label =
    state === "recording"
      ? "●"
      : state === "permission"
      ? "…"
      : state === "transcribing"
      ? "·"
      : state === "denied"
      ? "✕"
      : "◯";

  return (
    <button
      type="button"
      aria-label="hold to speak"
      aria-pressed={state === "recording"}
      disabled={disabled || state === "denied"}
      {...handlers}
      className={cn(
        "h-9 w-9 rounded-full border border-ground-300 text-ink transition-all",
        "select-none touch-none disabled:opacity-40",
        state === "recording" && "border-signal bg-signal/10 text-signal",
        state === "transcribing" && "animate-breath",
      )}
    >
      <span className="text-sm">{label}</span>
    </button>
  );
}

function pickMime(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  for (const m of [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ]) {
    if (MediaRecorder.isTypeSupported(m)) return m;
  }
  return null;
}

function fileName(mime: string) {
  if (mime.includes("ogg")) return "audio.ogg";
  if (mime.includes("mp4")) return "audio.m4a";
  return "audio.webm";
}
