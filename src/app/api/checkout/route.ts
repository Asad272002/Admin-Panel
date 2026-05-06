import { NextResponse } from "next/server";

import { catalogStore } from "@/lib/catalog-store";
import { checkoutSchema } from "@/lib/validations/catalog.schema";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as unknown;
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const request = catalogStore.purchasePart(parsed.data);
    return NextResponse.json(request, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Checkout failed" },
      { status: 400 },
    );
  }
}

