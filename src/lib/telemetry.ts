// Structured telemetry. Spec §8: "Plausible or none." Until a sink is
// wired, events flow to console.log as JSON lines so they're greppable
// in dev and pickable up by any log shipper later.
//
// The spec is restrained on tracking by design — these events are
// product-calibration signals, never per-user behavior surveillance.
// User-identifiable fields stay out; only the anonymous user id is
// permitted, and only when explicitly passed by the caller.

type EventName =
  | "safety.stage3"
  | "weflection.opener_picked"
  | "pattern.surfaced"
  | "pattern.acknowledged"
  | "voice.consent_granted"
  | "voice.transcribe_request"
  | "auth.magic_link_requested"
  | "auth.signed_in";

type BaseFields = {
  // Anonymous-only. Never send email or any identifying value here.
  userRef?: string;
  locale?: "en" | "de";
};

type EventFields = Record<string, string | number | boolean | null>;

export function track(name: EventName, base: BaseFields = {}, extra: EventFields = {}) {
  // Strip any accidentally-passed identifying field. The list below is
  // a defensive guard, not a complete PII filter.
  for (const k of Object.keys(extra)) {
    if (/email|phone|name|address/i.test(k)) {
      delete extra[k];
    }
  }
  const event = {
    t: new Date().toISOString(),
    e: name,
    ...base,
    ...extra,
  };
  // Two output paths: structured JSON for log shippers, and a tagged
  // console.info for human reading. Both can be redirected.
  console.info(JSON.stringify(event));
}
