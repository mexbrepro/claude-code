import { afterEach, describe, expect, it, vi } from "vitest";
import { track } from "./telemetry";

describe("track()", () => {
  const spy = vi.spyOn(console, "info").mockImplementation(() => {});

  afterEach(() => {
    spy.mockClear();
  });

  it("emits a JSON line with event name and timestamp", () => {
    track("safety.stage3", {}, { trigger: "dissociation" });
    expect(spy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(spy.mock.calls[0][0] as string);
    expect(payload.e).toBe("safety.stage3");
    expect(payload.trigger).toBe("dissociation");
    expect(typeof payload.t).toBe("string");
  });

  it("preserves anonymous user reference + locale", () => {
    track("auth.signed_in", { userRef: "abc-123", locale: "de" });
    const payload = JSON.parse(spy.mock.calls[0][0] as string);
    expect(payload.userRef).toBe("abc-123");
    expect(payload.locale).toBe("de");
  });

  it("strips fields whose names look identifying", () => {
    track(
      "auth.magic_link_requested",
      {},
      // @ts-expect-error — intentional misuse to verify the guard.
      { email: "leak@example.com", phone: "+1", okField: "kept" },
    );
    const payload = JSON.parse(spy.mock.calls[0][0] as string);
    expect(payload).not.toHaveProperty("email");
    expect(payload).not.toHaveProperty("phone");
    expect(payload.okField).toBe("kept");
  });
});
