import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, getIp } from "@/lib/rateLimit";
import { calculateParcelPrice, calculateTruckPrice } from "@/config/rates";
import { assignRunSlot } from "@/lib/runs";

const querySchema = z.object({
  pickupLat:   z.coerce.number(),
  pickupLng:   z.coerce.number(),
  dropoffLat:  z.coerce.number(),
  dropoffLng:  z.coerce.number(),
  timing:      z.string().optional(),
  vehicleType: z.enum(["boda", "car"]).optional(),
  service:     z.enum(["parcels", "trucks"]),
});

async function getDistanceKm(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
): Promise<number> {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) throw new Error("Maps server key not configured");

  const url =
    `https://maps.googleapis.com/maps/api/distancematrix/json` +
    `?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&units=metric&key=${key}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Distance Matrix request failed");

  const json = await res.json();
  const element = json?.rows?.[0]?.elements?.[0];
  if (element?.status !== "OK") throw new Error("No route found");

  return element.distance.value / 1000;
}

export async function GET(req: NextRequest) {
  const ip = getIp(req);
  if (!rateLimit(ip).allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = querySchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const { pickupLat, pickupLng, dropoffLat, dropoffLng, timing, vehicleType, service } =
    parsed.data;

  try {
    let distanceKm: number;
    let price: number;
    let runMessage: string | null = null;
    let eligible = true;

    if (service === "trucks") {
      distanceKm = await getDistanceKm(0.4614, 34.1117, dropoffLat, dropoffLng);
      price = calculateTruckPrice(distanceKm);
    } else {
      distanceKm = await getDistanceKm(pickupLat, pickupLng, dropoffLat, dropoffLng);
      price = calculateParcelPrice(distanceKm, timing ?? "scheduled", vehicleType ?? "boda");

      if (timing && timing !== "scheduled") {
        const run = assignRunSlot(timing, new Date());
        runMessage = run.message;
        eligible   = run.eligible;
      }
    }

    return NextResponse.json({
      distanceKm: Math.round(distanceKm * 10) / 10,
      price,
      timing:     timing ?? "scheduled",
      runMessage,
      eligible,
    });
  } catch {
    return NextResponse.json({ error: "Unable to calculate quote" }, { status: 500 });
  }
}
