// Email delivery for magic links. Spec §8 lists Resend or Postmark.
// We pick whichever provider has credentials in env. If neither is
// configured, the function logs the magic link (dev mode) and returns
// success so local development works without an email account.

type SendArgs = {
  to: string;
  locale: "en" | "de";
  verifyUrl: string;
};

export async function sendMagicLink({ to, locale, verifyUrl }: SendArgs): Promise<void> {
  const subject =
    locale === "de"
      ? "Dynamic Companion — Anmeldelink"
      : "Dynamic Companion — sign-in link";
  const body = composeBody(locale, verifyUrl);

  if (process.env.RESEND_API_KEY) {
    await sendViaResend(to, subject, body);
    return;
  }
  if (process.env.POSTMARK_API_KEY) {
    await sendViaPostmark(to, subject, body);
    return;
  }
  // Dev fallback. The spec asks for restraint, not silence — surfacing
  // the link in the server log is the most useful behavior here.
  console.log(`[dev magic-link] to=${to} link=${verifyUrl}`);
}

function composeBody(locale: "en" | "de", verifyUrl: string): { text: string; html: string } {
  if (locale === "de") {
    const text = `Dieser Link öffnet Dynamic Companion. Er funktioniert einmal und 15 Minuten lang.\n\n${verifyUrl}\n\nWenn du das nicht angefordert hast, ignoriere diese E-Mail.`;
    const html = `<p>Dieser Link öffnet Dynamic Companion. Er funktioniert einmal und 15 Minuten lang.</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p style="color:#6b6357;font-size:12px">Wenn du das nicht angefordert hast, ignoriere diese E-Mail.</p>`;
    return { text, html };
  }
  const text = `This link opens Dynamic Companion. It works once and for 15 minutes.\n\n${verifyUrl}\n\nIf you didn't request this, ignore the email.`;
  const html = `<p>This link opens Dynamic Companion. It works once and for 15 minutes.</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p style="color:#6b6357;font-size:12px">If you didn't request this, ignore the email.</p>`;
  return { text, html };
}

async function sendViaResend(to: string, subject: string, body: { text: string; html: string }) {
  const from =
    process.env.EMAIL_FROM ?? "Dynamic Companion <hello@dynamic-companion.app>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text: body.text, html: body.html }),
  });
  if (!res.ok) {
    const err = await safeText(res);
    throw new Error(`resend failed: ${res.status} ${err}`);
  }
}

async function sendViaPostmark(to: string, subject: string, body: { text: string; html: string }) {
  const from =
    process.env.EMAIL_FROM ?? "hello@dynamic-companion.app";
  const res = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      "x-postmark-server-token": process.env.POSTMARK_API_KEY ?? "",
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      From: from,
      To: to,
      Subject: subject,
      TextBody: body.text,
      HtmlBody: body.html,
      MessageStream: process.env.POSTMARK_STREAM ?? "outbound",
    }),
  });
  if (!res.ok) {
    const err = await safeText(res);
    throw new Error(`postmark failed: ${res.status} ${err}`);
  }
}

async function safeText(r: Response): Promise<string> {
  try {
    return (await r.text()).slice(0, 200);
  } catch {
    return "";
  }
}
