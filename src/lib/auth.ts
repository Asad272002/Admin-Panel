import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export type Role = "admin" | "worker";

export type Session = {
  username: string;
  role: Role;
};

export const SESSION_COOKIE = "ap_session";

export function encodeSession(session: Session) {
  return `${session.username}.${session.role}`;
}

export function decodeSession(value: string | undefined): Session | null {
  if (!value) return null;
  try {
    const [username, role] = value.split(".");
    if (!username) return null;
    if (role !== "admin" && role !== "worker") return null;
    if (role === "admin" && username !== "Asad") return null;
    return { username, role };
  } catch {
    return null;
  }
}

export async function getSession() {
  const jar = await cookies();
  return decodeSession(jar.get(SESSION_COOKIE)?.value);
}

export function getSessionFromRequest(req: NextRequest) {
  return decodeSession(req.cookies.get(SESSION_COOKIE)?.value);
}

export function isAdmin(session: Session | null) {
  return session?.role === "admin";
}
