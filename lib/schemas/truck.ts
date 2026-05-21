import { z } from "zod";

// Strip whitespace and HTML tags from all user-supplied text fields
const sanitize = (s: string) => s.trim().replace(/<[^>]*>/g, "");
const str = (schema: z.ZodString) => schema.transform(sanitize);

function isValidScheduleDate(dateStr: string): boolean {
  const date = new Date(dateStr + "T00:00:00");
  if (date.getDay() === 0) return false; // no Sundays
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return date >= tomorrow; // minimum tomorrow
}

export const MATERIAL_IDS = [
  // Construction
  "river_sand",
  "plasta_sand",
  "ballast_machine_cut",
  "ballast_manual_cut",
  "murram",
  "hardcore",
  "topsoil",
  "building_stones",
  // Agricultural
  "sugarcane",
  "maize_bulk",
  "other_produce",
  // Waste & Clearance
  "construction_debris",
  "soil_excavation",
  "land_clearing_waste",
  // Other
  "other",
] as const;

export const GOODS_IDS = [
  "sugarcane_factory",
  "maize_produce_market",
  "construction_debris",
  "soil_excavation_waste",
  "sand_ballast_sourced",
  "building_materials_sourced",
  "other",
] as const;

// Shared fields across both service types
const baseFields = {
  contact_name:  str(z.string().min(2, "Full name is required")),
  contact_phone: z.string().min(1, "Phone number is required"),
  contact_email: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() || undefined : v),
    z.string().email("Invalid email address").optional(),
  ),
  quantity_trucks: z.number().int().min(1).max(10),
  preferred_date: z
    .string()
    .min(1, "Preferred date is required")
    .refine(isValidScheduleDate, {
      message: "Please choose a weekday (Mon–Sat) that is at least tomorrow",
    }),
  preferred_time:    z.enum(["morning", "afternoon"]),
  additional_notes:  z.preprocess(
    (v) => (typeof v === "string" ? sanitize(v) || undefined : v),
    z.string().optional(),
  ),
};

const materialDeliverySchema = z
  .object({
    service_type:    z.literal("material_delivery"),
    ...baseFields,
    material:        z.enum(MATERIAL_IDS),
    material_other:  z.preprocess(
      (v) => (typeof v === "string" ? sanitize(v) || undefined : v),
      z.string().optional(),
    ),
    delivery_address: str(z.string().min(1, "Delivery address is required")),
    delivery_lat:     z.number(),
    delivery_lng:     z.number(),
    delivery_notes:   z.preprocess(
      (v) => (typeof v === "string" ? sanitize(v) || undefined : v),
      z.string().optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.material === "other" && !data.material_other?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please describe the material",
        path: ["material_other"],
      });
    }
  });

const moveGoodsSchema = z
  .object({
    service_type: z.literal("move_goods"),
    ...baseFields,
    goods_type:  z.enum(GOODS_IDS),
    goods_other: z.preprocess(
      (v) => (typeof v === "string" ? sanitize(v) || undefined : v),
      z.string().optional(),
    ),
    pickup_address:  str(z.string().min(1, "Pickup address is required")),
    pickup_lat:      z.number(),
    pickup_lng:      z.number(),
    pickup_notes:    z.preprocess(
      (v) => (typeof v === "string" ? sanitize(v) || undefined : v),
      z.string().optional(),
    ),
    dropoff_address: str(z.string().min(1, "Dropoff address is required")),
    dropoff_lat:     z.number(),
    dropoff_lng:     z.number(),
    dropoff_notes:   z.preprocess(
      (v) => (typeof v === "string" ? sanitize(v) || undefined : v),
      z.string().optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.goods_type === "other" && !data.goods_other?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please describe what you are moving",
        path: ["goods_other"],
      });
    }
  });

export const truckSchema = z.discriminatedUnion("service_type", [
  materialDeliverySchema,
  moveGoodsSchema,
]);

export type TruckInquiryInput = z.infer<typeof truckSchema>;
