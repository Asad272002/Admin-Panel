import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export const bikeCreateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  brand: z.string().trim().min(2).max(60),
  year: z.number().int().min(1970).max(2100),
  imageUrl: z.string().url(),
  description: z.string().trim().min(10).max(500),
});

export const partTypeSchema = z.enum([
  "Brake",
  "Chain",
  "Derailleur",
  "Handlebar",
  "Seat",
  "Tire",
  "Wheel",
]);

export const partConditionSchema = z.enum(["NEW", "USED"]);

export const partAddSchema = z.object({
  bikeId: z.string().min(1),
  partType: partTypeSchema,
  condition: partConditionSchema,
  quantity: z.number().int().min(1).max(10_000),
  priceCents: z.number().int().min(0).max(10_000_000),
});

export const checkoutSchema = z.object({
  bikeId: z.string().min(1),
  partId: z.string().min(1),
  quantity: z.number().int().min(1).max(100),
  customerName: z.string().trim().min(2).max(80),
  customerEmail: z.string().trim().email().max(120),
});

export const requestUpdateSchema = z.object({
  paid: z.boolean().optional(),
  proofImageDataUrl: z.string().min(1).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type BikeCreateInput = z.infer<typeof bikeCreateSchema>;
export type PartAddInput = z.infer<typeof partAddSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type RequestUpdateInput = z.infer<typeof requestUpdateSchema>;

