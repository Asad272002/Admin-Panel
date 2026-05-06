import { NextResponse, type NextRequest } from "next/server";

import { catalogStore } from "@/lib/catalog-store";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ bikeId: string }> }) {
  const { bikeId } = await ctx.params;
  const bike = catalogStore.getBike(bikeId);
  if (!bike) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parts = catalogStore.listParts(bikeId);
  return NextResponse.json({ bike, parts });
}
