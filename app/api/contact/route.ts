import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const SERVICE_IDS = [
  "website-standard",
  "website-ecommerce",
  "google-workspace",
  "square-pos",
  "mpesa-integration",
  "business-digitization",
  "automation",
  "seo-setup",
  "social-setup",
  "custom-app",
  "whatsapp-setup",
  "booking-system",
  "domain-email-hosting",
  "digital-catalogue",
  "retainer",
  "land-listing",
  "other",
] as const;

const SERVICE_LABELS: Record<string, string> = {
  "website-standard": "Business Website",
  "website-ecommerce": "Business Website (E-Commerce)",
  "google-workspace": "Google Workspace Setup & Migration",
  "square-pos": "Square POS Setup",
  "mpesa-integration": "M-Pesa Business Integration",
  "business-digitization": "Business Digitization",
  "automation": "App & Tool Integration (Automation)",
  "seo-setup": "SEO and Google Business Setup",
  "social-setup": "Social Media Business Setup",
  "custom-app": "Custom App or Internal Tool",
  "whatsapp-setup": "WhatsApp Business Setup",
  "booking-system": "Booking and Appointment System",
  "domain-email-hosting": "Domain, Email and Hosting Setup",
  "digital-catalogue": "Online Menu or Digital Catalogue",
  "retainer": "Monthly Tech Support Retainer",
  "land-listing": "Land or Property Enquiry",
  "other": "Not sure yet",
};

const schema = z.object({
  fullName: z.string().min(2),
  businessName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  serviceInterested: z.enum(SERVICE_IDS),
  message: z.string().min(20),
  referralSource: z.enum(["Referral", "Google", "LinkedIn", "Social Media", "Other"]),
  ref: z.string().optional(),
  plot: z.string().optional(),
});

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
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

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function buildNotificationHtml(data: z.infer<typeof schema>): string {
  const serviceLabel = SERVICE_LABELS[data.serviceInterested] ?? data.serviceInterested;
  const propertyRow = data.ref
    ? `<tr><td colspan="2" style="padding: 12px 0 4px 0;">
        <div style="background: rgba(200,184,154,0.12); border-left: 3px solid #c8b89a; padding: 10px 14px; border-radius: 4px;">
          <span style="color: #c8b89a; font-weight: 600;">Property enquiry:</span>
          <span style="color: #f0ede8;"> ${data.plot || data.ref} — Ref ${data.ref}</span>
        </div>
       </td></tr>`
    : "";

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f0ede8; padding: 32px; border-radius: 12px;">
      <h2 style="color: #c8b89a; margin-bottom: 24px;">New Inquiry — ${serviceLabel}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${propertyRow}
        <tr><td style="padding: 8px 0; color: #6b6b7b; width: 160px;">Name</td><td style="padding: 8px 0;">${data.fullName}</td></tr>
        ${data.businessName ? `<tr><td style="padding: 8px 0; color: #6b6b7b;">Business</td><td style="padding: 8px 0;">${data.businessName}</td></tr>` : ""}
        <tr><td style="padding: 8px 0; color: #6b6b7b;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #c8b89a;">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td style="padding: 8px 0; color: #6b6b7b;">Phone/WhatsApp</td><td style="padding: 8px 0;">${data.phone}</td></tr>` : ""}
        <tr><td style="padding: 8px 0; color: #6b6b7b;">Service</td><td style="padding: 8px 0;">${serviceLabel}</td></tr>
        <tr><td style="padding: 8px 0; color: #6b6b7b;">Found us via</td><td style="padding: 8px 0;">${data.referralSource}</td></tr>
      </table>
      <div style="margin-top: 24px; padding: 16px; background: rgba(255,255,255,0.04); border-radius: 8px; border-left: 3px solid #c8b89a;">
        <p style="color: #6b6b7b; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.06em;">Message</p>
        <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
      </div>
    </div>
  `;
}

function buildConfirmationHtml(name: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f0ede8; padding: 32px; border-radius: 12px;">
      <h2 style="color: #c8b89a; margin-bottom: 16px;">Thanks for reaching out, ${name.split(" ")[0]}.</h2>
      <p style="color: #6b6b7b; line-height: 1.7; margin-bottom: 16px;">
        We received your message and will respond within <strong style="color: #f0ede8;">1 business day</strong> (Monday–Friday).
      </p>
      <p style="color: #6b6b7b; line-height: 1.7; margin-bottom: 32px;">
        In the meantime, feel free to reply to this email or reach us on WhatsApp.
      </p>
      <p style="color: #6b6b7b; font-size: 14px;">— Packisher Technology Services<br/>support@packisher.com · packisher.com</p>
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
    // Reject oversized request bodies (20 KB limit)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 20 * 1024) {
      return NextResponse.json({ error: "Request body too large." }, { status: 413 });
    }

    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait before trying again." },
        { status: 429 }
      );
    }

    const rawText = await req.text().catch(() => null);
    if (!rawText) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    // Double-check body size after reading (catches requests without content-length)
    if (rawText.length > 20 * 1024) {
      return NextResponse.json({ error: "Request body too large." }, { status: 413 });
    }

    let body: unknown;
    try {
      body = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (!body) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const data = parsed.data;

    const resend = getResend();
    if (!resend) {
      return NextResponse.json(
        { error: "Email service is currently unavailable. Please try again later." },
        { status: 500 }
      );
    }

    const serviceLabel = SERVICE_LABELS[data.serviceInterested] ?? data.serviceInterested;
    const isPropertyEnquiry = data.serviceInterested === "land-listing" || !!data.ref;
    const subject = isPropertyEnquiry && data.plot
      ? `New Enquiry: Land or Property — ${data.plot} from ${data.fullName}`
      : `New Inquiry: ${serviceLabel} from ${data.fullName}`;

    await Promise.all([
      resend.emails.send({
        from: "Packisher <support@packisher.com>",
        to: ["support@packisher.com"],
        replyTo: data.email,
        subject,
        html: buildNotificationHtml(data),
      }),
      resend.emails.send({
        from: "Packisher Technology Services <support@packisher.com>",
        to: [data.email],
        subject: "We received your message | Packisher Technology Services",
        html: buildConfirmationHtml(data.fullName),
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
