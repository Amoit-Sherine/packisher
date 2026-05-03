import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(9),
  email: z.string().email().optional().or(z.literal("")),
  type: z.enum(["individual", "business"]),
  businessName: z.string().optional(),
});

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const limit = 5;
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many submissions. Please wait before trying again." }, { status: 429 });
    }

    const rawText = await req.text().catch(() => null);
    if (!rawText) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

    let body: unknown;
    try { body = JSON.parse(rawText); } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed.", details: parsed.error.flatten() }, { status: 422 });
    }

    const data = parsed.data;
    const supabase = getSupabase();

    if (supabase) {
      const { error: dbError } = await supabase.from("run_waitlist").insert({
        full_name: data.fullName,
        phone: data.phone,
        email: data.email || null,
        type: data.type,
        business_name: data.businessName || null,
      });
      if (dbError) {
        console.error("Supabase run_waitlist error:", dbError);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
