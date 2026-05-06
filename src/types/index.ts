export type ApiError = {
  error: string;
  details?: unknown;
};

export type HealthResponse = {
  ok: true;
  status: "ok";
  timestamp: string;
};

export type Bike = {
  id: string;
  name: string;
  brand: string;
  year: number;
  imageUrl: string;
  description: string;
};

export type PartCondition = "NEW" | "USED";

export type PartType =
  | "Brake"
  | "Chain"
  | "Derailleur"
  | "Handlebar"
  | "Seat"
  | "Tire"
  | "Wheel";

export type BikePart = {
  id: string;
  bikeId: string;
  partType: PartType;
  condition: PartCondition;
  quantity: number;
  priceCents: number;
};

export type PurchaseRequest = {
  id: string;
  receiptNumber: string;
  bikeId: string;
  bikeName: string;
  partType: PartType;
  condition: PartCondition;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
  customerName: string;
  customerEmail: string;
  paid: boolean;
  proofImageDataUrl?: string;
  createdAt: string;
};
