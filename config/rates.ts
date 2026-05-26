// PRIVATE — server-side only. Never import in client components.

export const PARCEL_RATES = {
  boda: {
    baseFare: 150,
    perKm: [
      { upToKm: 10, rate: 32 },
      { upToKm: 30, rate: 22 },
      { upToKm: Infinity, rate: 15 },
    ],
    minimum: 250,
  },
  car: {
    baseFare: 300,
    perKm: [
      { upToKm: 10, rate: 50 },
      { upToKm: 30, rate: 35 },
      { upToKm: Infinity, rate: 25 },
    ],
    minimum: 500,
  },
  timing: {
    scheduled: { multiplier: 0.85 },
    same_day:  { multiplier: 1.0  },
    urgent:    { multiplier: 1.8  },
  },
};

export const TRUCK_RATES = {
  baseFare: 1500,
  perKm: 80,
  minimum: 1500,
};

export function calculateParcelPrice(
  distanceKm: number,
  timing: string,
  vehicleType: "boda" | "car" = "boda",
): number {
  const rates = PARCEL_RATES[vehicleType];
  let cost = rates.baseFare;
  let remaining = distanceKm;
  let prev = 0;
  for (const tier of rates.perKm) {
    const segment = Math.min(remaining, tier.upToKm - prev);
    if (segment <= 0) break;
    cost += segment * tier.rate;
    remaining -= segment;
    prev = tier.upToKm;
    if (remaining <= 0) break;
  }
  const multiplier =
    PARCEL_RATES.timing[timing as keyof typeof PARCEL_RATES.timing]?.multiplier ?? 1.0;
  const price = Math.max(cost * multiplier, rates.minimum);
  return Math.round(price / 10) * 10;
}

export function calculateTruckPrice(distanceKm: number): number {
  const extra = Math.max(0, distanceKm - 5) * TRUCK_RATES.perKm;
  const price = Math.max(TRUCK_RATES.baseFare + extra, TRUCK_RATES.minimum);
  return Math.round(price / 100) * 100;
}
