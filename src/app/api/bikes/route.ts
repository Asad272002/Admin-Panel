import { NextResponse } from "next/server";

import { catalogStore } from "@/lib/catalog-store";

export function GET() {
  return NextResponse.json(catalogStore.listBikes());
}

