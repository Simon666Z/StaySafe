import { NextResponse } from "next/server";
import { AnalysisResult } from "@/library/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = body?.url;

    if (!url) {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    // Simulate some server-side processing / AI check. Replace this with
    // real backend logic or calls to an AI service.
    await new Promise((res) => setTimeout(res, 5000));

    // Very small heuristic for demo purposes
    const lower = String(url).toLowerCase();
    let status: AnalysisResult["status"] = "uncertain";
    if (lower.includes("banned") || lower.includes("prohibited"))
      status = "prohibited";
    else if (
      lower.includes("official") ||
      lower.includes("compliance") ||
      lower.includes("trusted")
    )
      status = "legal";

    const result: AnalysisResult = {
      status,
      reason: "Server-checked (simulated): result produced by backend logic.",
      product: { name: String(url) },
    };

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message =
      typeof err === "string"
        ? err
        : err instanceof Error
        ? err.message
        : "An unknown error occurred";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
