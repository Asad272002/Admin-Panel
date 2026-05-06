import { NextResponse } from "next/server";

import { getSession, isAdmin } from "@/lib/auth";
import { catalogStore } from "@/lib/catalog-store";
import { bikeCreateSchema } from "@/lib/validations/catalog.schema";

export async function GET() {
  const session = await getSession();
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ bikes: catalogStore.listBikes() });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = bikeCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const bike = catalogStore.addBike(parsed.data);
  return NextResponse.json(bike, { status: 201 });
}
