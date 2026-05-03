import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const ENQUIRY_TYPES = [
  "Packisher Parcels",
  "Packisher Tipper",
  "Business Account",
  "Partnership",
  "Other",
] as const;

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  enquiryType: z.enum(ENQUIRY_TYPES),
  message: z.string().min(10),
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

function buildNotificationHtml(data: z.infer<typeof schema>): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #F5F2EC; color: #1A1814; padding: 32px; border-radius: 12px;">
      <h2 style="color: #7A5C38; margin-bottom: 24px;">New Enquiry — ${data.enquiryType}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #6B6358; width: 140px;">Name</td><td style="padding: 8px 0;">${data.fullName}</td></tr>
        <tr><td style="padding: 8px 0; color: #6B6358;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #7A5C38;">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td style="padding: 8px 0; color: #6B6358;">Phone/WhatsApp</td><td style="padding: 8px 0;">${data.phone}</td></tr>` : ""}
        <tr><td style="padding: 8px 0; color: #6B6358;">Enquiry</td><td style="padding: 8px 0;">${data.enquiryType}</td></tr>
      </table>
      <div style="margin-top: 24px; padding: 16px; background: rgba(0,0,0,0.04); border-radius: 8px; border-left: 3px solid #7A5C38;">
        <p style="color: #6B6358; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.06em;">Message</p>
        <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
      </div>
    </div>
  `;
}

function buildConfirmationHtml(name: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #F5F2EC; color: #1A1814; padding: 32px; border-radius: 12px;">
      <h2 style="color: #7A5C38; margin-bottom: 16px;">Thanks for reaching out, ${name.split(" ")[0]}.</h2>
      <p style="color: #6B6358; line-height: 1.7; margin-bottom: 16px;">
        We received your message and will respond within <strong style="color: #1A1814;">1 business day</strong>.
      </p>
      <p style="color: #6B6358; font-size: 14px;">— Packisher<br/>support@packisher.com · packisher.com</p>
    </div>
  `;
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(req: NextRequest) {
  try {
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 20 * 1024) {
      return NextResponse.json({ error: "Request body too large." }, { status: 413 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many submissions. Please wait before trying again." }, { status: 429 });
    }

    const rawText = await req.text().catch(() => null);
    if (!rawText) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    if (rawText.length > 20 * 1024) return NextResponse.json({ error: "Request body too large." }, { status: 413 });

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
      const { error: dbError } = await supabase.from("contact_submissions").insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        enquiry_type: data.enquiryType,
        message: data.message,
      });
      if (dbError) console.error("Supabase contact_submissions error:", dbError);
    }

    const resend = getResend();
    if (resend) {
      await Promise.allSettled([
        resend.emails.send({
          from: "Packisher <support@packisher.com>",
          to: ["support@packisher.com"],
          replyTo: data.email,
          subject: `New Enquiry: ${data.enquiryType} from ${data.fullName}`,
          html: buildNotificationHtml(data),
        }),
        resend.emails.send({
          from: "Packisher <support@packisher.com>",
          to: [data.email],
          subject: "We received your message | Packisher",
          html: buildConfirmationHtml(data.fullName),
        }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
