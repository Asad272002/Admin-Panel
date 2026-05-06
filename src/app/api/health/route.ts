import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}

