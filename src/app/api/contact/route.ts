import { NextResponse } from "next/server";

/**
 * Handles the public contact form. This does not send email yet — see
 * README.md "Contact form" for how to wire it to a real email service
 * (e.g. Resend) before launch. For now it validates input and logs the
 * submission server-side so it's visible during local development.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.message !== "string" ||
    !body.name.trim() ||
    !body.email.trim() ||
    !body.message.trim()
  ) {
    return NextResponse.json({ error: "Please fill in all fields." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  console.log("[contact form submission]", {
    name: body.name,
    email: body.email,
    message: body.message,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
