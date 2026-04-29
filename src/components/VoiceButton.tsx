"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type State = "idle" | "permission" | "recording" | "transcribing" | "denied" | "consent_needed";

export function VoiceButton({
  locale,
  onTranscript,
  disabled,
}: {
  locale: string;
  onTranscript: (text: string) => void;
  disabled?: boolean;
}) {
  const tConsent = useTranslations("voiceConsent");
  const [state, setState] = useState<State>("idle");
  const [consent, setConsent] = useState<boolean | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setConsent(!!d?.voiceConsent))
      .catch(() => setConsent(false));
    return () => {
      // Always release the mic if the component unmounts mid-record.
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function grantConsent() {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ voiceConsent: true }),
    });
    setConsent(true);
    setState("idle");
  }

  async function start() {
    if (state !== "idle" || disabled) return;
    if (consent === false) {
      setState("consent_needed");
      return;
    }
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
    // Keyboard equivalent: hold space (or enter) while focused.
    onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if ((e.key === " " || e.key === "Enter") && !e.repeat) {
        e.preventDefault();
        void start();
      }
    },
    onKeyUp: (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        stop();
      }
    },
    onBlur: () => {
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

  if (state === "consent_needed") {
    return (
      <div
        role="dialog"
        aria-label={tConsent("title")}
        className="flex flex-col gap-3 rounded-md border border-ground-300 bg-ground-50 p-4 text-sm text-ink"
      >
        <p className="user-words text-[15px]">{tConsent("body")}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={grantConsent}
            className="rounded-md bg-ground-700 px-3 py-1.5 text-xs text-ground-50"
          >
            {tConsent("accept")}
          </button>
          <button
            onClick={() => setState("idle")}
            className="text-xs text-ink-muted hover:text-ink"
          >
            {tConsent("decline")}
          </button>
        </div>
      </div>
    );
  }

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
