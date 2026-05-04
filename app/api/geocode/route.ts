import { NextRequest, NextResponse } from "next/server";

const WK_BOUNDS = { minLat: 0.0, maxLat: 1.8, minLng: 33.5, maxLng: 35.5 };

const ipHits = new Map<string, { count: number; resetAt: number }>();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const limit = 60;
  const e = ipHits.get(ip);
  if (!e || now > e.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (e.count >= limit) return false;
  e.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: { lat?: unknown; lng?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const lat = Number(body.lat);
  const lng = Number(body.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }
  if (lat < WK_BOUNDS.minLat || lat > WK_BOUNDS.maxLat || lng < WK_BOUNDS.minLng || lng > WK_BOUNDS.maxLng) {
    return NextResponse.json({ error: "Outside service area" }, { status: 400 });
  }

  const key = process.env.GOOGLE_MAPS_SERVER_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Geocoding unavailable" }, { status: 503 });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    const address = data?.results?.[0]?.formatted_address;
    if (!address) {
      return NextResponse.json({ address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
    }
    return NextResponse.json({ address });
  } catch (err) {
    console.error("Geocode error:", err);
    return NextResponse.json({ error: "Geocoding failed" }, { status: 500 });
  }
}
