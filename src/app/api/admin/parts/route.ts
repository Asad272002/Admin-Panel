import { NextResponse } from "next/server";

import { getSession, isAdmin } from "@/lib/auth";
import { catalogStore } from "@/lib/catalog-store";
import { partAddSchema } from "@/lib/validations/catalog.schema";

export async function POST(req: Request) {
  const session = await getSession();
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = partAddSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const bike = catalogStore.getBike(parsed.data.bikeId);
  if (!bike) return NextResponse.json({ error: "Bike not found" }, { status: 404 });

  const part = catalogStore.addPart(parsed.data);
  return NextResponse.json(part, { status: 201 });
}
