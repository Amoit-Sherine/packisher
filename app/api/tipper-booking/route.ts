import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";

const MATERIALS = ["Ballast", "River Sand", "Plasta Sand", "Murram", "Hardcore", "Topsoil"] as const;
const QUANTITIES = ["1 Truck", "2 Trucks", "3 Trucks", "4+ Trucks"] as const;
const TIME_WINDOWS = ["Morning 7am to 11am", "Afternoon 12pm to 4pm"] as const;

const schema = z.object({
  material: z.enum(MATERIALS),
  quantity: z.enum(QUANTITIES),
  deliveryLocation: z.string().min(5),
  deliveryLat: z.number().optional(),
  deliveryLng: z.number().optional(),
  preferredDate: z.string().min(1),
  timeWindow: z.enum(TIME_WINDOWS),
  fullName: z.string().min(2),
  phone: z.string().min(9),
  notes: z.string().optional(),
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

async function sendWhatsAppConfirmation(phone: string, data: z.infer<typeof schema>) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !from) return;

  const to = `whatsapp:${phone.startsWith("+") ? phone : `+254${phone.replace(/^0/, "")}`}`;
  const body = `Hi ${data.fullName}, your Packisher Tipper booking for ${data.quantity} of ${data.material} to ${data.deliveryLocation} on ${data.preferredDate} has been received. Check your phone for the Mpesa payment prompt to confirm. Questions? Reply here.`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  await fetch(url, {
    method: "POST",
    headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ From: from, To: to, Body: body }).toString(),
  }).catch((err) => console.error("Twilio WhatsApp error:", err));
}

async function triggerIntaSendStk(phone: string, amount: number, reference: string) {
  const publicKey = process.env.INTASEND_PUBLIC_KEY;
  const secretKey = process.env.INTASEND_SECRET_KEY;
  if (!publicKey || !secretKey) return;

  const normalizedPhone = phone.replace(/^\+?254/, "").replace(/^0/, "");
  const msisdn = `254${normalizedPhone}`;

  await fetch("https://payment.intasend.com/api/v1/payment/mpesa/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-IntaSend-Public-API-Key": publicKey,
      "Authorization": `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      currency: "KES",
      amount,
      phone_number: msisdn,
      narrative: `Packisher Haul — ${reference}`,
    }),
  }).catch((err) => console.error("IntaSend STK Push error:", err));
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

    let bookingId: string | undefined;
    if (supabase) {
      const { data: inserted, error: dbError } = await supabase
        .from("haul_bookings")
        .insert({
          material: data.material,
          quantity: data.quantity,
          delivery_location: data.deliveryLocation,
          delivery_lat: data.deliveryLat ?? null,
          delivery_lng: data.deliveryLng ?? null,
          preferred_date: data.preferredDate,
          time_window: data.timeWindow,
          full_name: data.fullName,
          phone: data.phone,
          notes: data.notes || null,
          status: "pending",
        })
        .select("id")
        .single();

      if (dbError) {
        console.error("Supabase haul_bookings error:", dbError);
      } else if (inserted) {
        bookingId = inserted.id as string;
      }
    }

    await Promise.allSettled([
      sendWhatsAppConfirmation(data.phone, data),
      triggerIntaSendStk(data.phone, 500, bookingId ?? data.deliveryLocation),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
