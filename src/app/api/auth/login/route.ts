import { NextResponse } from "next/server";

import { encodeSession, SESSION_COOKIE } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/catalog.schema";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { username, password } = parsed.data;
  if (username !== "Asad" || password !== "admin") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const sessionValue = encodeSession({ username: "Asad", role: "admin" });
  const res = NextResponse.json({ ok: true, role: "admin" });
  res.cookies.set(SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return res;
}
