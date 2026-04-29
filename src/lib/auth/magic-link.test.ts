import { describe, expect, it } from "vitest";
import { buildVerifyUrl, hashToken, newToken } from "./magic-link";

describe("magic-link tokens", () => {
  it("produces URL-safe tokens that round-trip via SHA-256 hashing", () => {
    const { token, tokenHash } = newToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(tokenHash).toBe(hashToken(token));
  });

  it("expires roughly 15 minutes from now", () => {
    const before = Date.now();
    const { expiresAt } = newToken();
    const ms = expiresAt.getTime() - before;
    // Allow a generous window so the test is robust to slow runners.
    expect(ms).toBeGreaterThanOrEqual(14 * 60 * 1000);
    expect(ms).toBeLessThanOrEqual(16 * 60 * 1000);
  });

  it("emits unique tokens per call", () => {
    const a = newToken();
    const b = newToken();
    expect(a.token).not.toBe(b.token);
    expect(a.tokenHash).not.toBe(b.tokenHash);
  });

  it("buildVerifyUrl preserves locale + token", () => {
    const url = buildVerifyUrl("abc.def", "de");
    expect(url).toMatch(/\/api\/auth\/verify/);
    expect(url).toMatch(/locale=de/);
    expect(url).toMatch(/token=abc\.def|token=abc%2Edef/);
  });
});
