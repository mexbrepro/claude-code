import Anthropic from "@anthropic-ai/sdk";

declare global {
  // eslint-disable-next-line no-var
  var __dc_anthropic: Anthropic | undefined;
}

// One process-wide client. The SDK pools connections internally.
export const anthropic =
  globalThis.__dc_anthropic ??
  new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });

if (process.env.NODE_ENV !== "production") {
  globalThis.__dc_anthropic = anthropic;
}

export const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-7";
