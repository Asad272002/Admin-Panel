import { NextResponse } from "next/server";

import { getSession, isAdmin } from "@/lib/auth";
import { catalogStore } from "@/lib/catalog-store";

export async function GET() {
  const session = await getSession();
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ requests: catalogStore.listRequests() });
}
