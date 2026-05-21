import { z } from "zod";

function isValidScheduleDate(dateStr: string): boolean {
  const date = new Date(dateStr + "T00:00:00");
  if (date.getDay() === 0) return false; // no Sundays
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const twoWeeks = new Date(today);
  twoWeeks.setDate(today.getDate() + 14);
  return date >= today && date <= twoWeeks;
}

export const parcelSchema = z
  .object({
    sender_name:    z.string().min(1, "Sender name is required"),
    sender_phone:   z.string().min(1, "Sender phone is required"),
    receiver_name:  z.string().min(1, "Receiver name is required"),
    receiver_phone: z.string().min(1, "Receiver phone is required"),

    pickup_address: z.string().min(1, "Pickup address is required"),
    pickup_lat:     z.number(),
    pickup_lng:     z.number(),
    pickup_notes:   z.string().optional(),

    dropoff_address: z.string().min(1, "Drop-off address is required"),
    dropoff_lat:     z.number(),
    dropoff_lng:     z.number(),
    dropoff_notes:   z.string().optional(),

    item_description: z.string().min(1, "Item description is required"),
    fragility: z.enum(["not_fragile", "handle_with_care", "fragile", "very_fragile"]),
    estimated_value: z.number().positive().nullish().transform((v) => v ?? undefined),

    vehicle_type: z.enum(["boda", "car"]),

    timing:         z.enum(["scheduled", "same_day", "urgent"]),
    preferred_date: z.string().optional(),
    preferred_run:  z.enum(["morning", "evening"]).optional(),

    additional_notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.timing === "scheduled") {
      if (!data.preferred_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Preferred date is required for scheduled bookings",
          path: ["preferred_date"],
        });
      } else if (!isValidScheduleDate(data.preferred_date)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please choose a weekday (Mon–Sat) within the next two weeks",
          path: ["preferred_date"],
        });
      }
      if (!data.preferred_run) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a run (Morning or Evening)",
          path: ["preferred_run"],
        });
      }
    }
  });

export type ParcelBookingInput = z.infer<typeof parcelSchema>;
