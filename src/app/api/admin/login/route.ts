import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSessionToken, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const hashB64 = process.env.ADMIN_PASSWORD_HASH_B64;

  if (!hashB64) {
    return NextResponse.json(
      { error: "Admin login is not configured (ADMIN_PASSWORD_HASH_B64 missing)." },
      { status: 500 },
    );
  }

  const hash = Buffer.from(hashB64, "base64").toString("utf-8");
  const valid = password.length > 0 && (await bcrypt.compare(password, hash));
  if (!valid) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return res;
}
