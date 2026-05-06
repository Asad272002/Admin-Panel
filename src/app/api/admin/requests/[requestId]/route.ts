import { NextResponse, type NextRequest } from "next/server";

import { getSession, isAdmin } from "@/lib/auth";
import { catalogStore } from "@/lib/catalog-store";
import { requestUpdateSchema } from "@/lib/validations/catalog.schema";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ requestId: string }> }) {
  const session = await getSession();
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = requestUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const { requestId } = await ctx.params;
  const updated = catalogStore.updateRequest(requestId, parsed.data);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
