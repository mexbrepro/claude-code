import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Clear the session cookie. The user can sign in again or use the
// app anonymously (a fresh dc_anon_id will be issued on next API hit).
export async function POST() {
  const jar = await cookies();
  jar.delete("dc_anon_id");
  return NextResponse.json({ ok: true });
}
