import type { Bike, BikePart, PartCondition, PartType, PurchaseRequest } from "@/types";

type CatalogState = {
  bikes: Bike[];
  parts: BikePart[];
  requests: PurchaseRequest[];
};

const partTypes: PartType[] = ["Brake", "Chain", "Derailleur", "Handlebar", "Seat", "Tire", "Wheel"];
const conditions: PartCondition[] = ["NEW", "USED"];

function cents(amount: number) {
  return Math.max(0, Math.round(amount * 100));
}

function formatReceiptNumber(n: number) {
  return `RCPT-${String(n).padStart(6, "0")}`;
}

function createInitialState(): CatalogState {
  const bikes: Bike[] = [
    {
      id: "bike_aurora",
      name: "Aurora Roadster",
      brand: "Aurum",
      year: 2024,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/20/BMX_bicycle.JPG",
      description:
        "A fast, lightweight road bike tuned for smooth handling and long rides. Premium components, clean geometry.",
    },
    {
      id: "bike_noir",
      name: "Noir City",
      brand: "Monochrome",
      year: 2023,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/Bike.jpg",
      description:
        "A comfortable commuter with a silent ride and confident braking. Built for daily urban travel.",
    },
    {
      id: "bike_glacier",
      name: "Glacier Trail",
      brand: "Northline",
      year: 2025,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Mountain_biking.JPG",
      description:
        "A capable trail bike with responsive suspension and durable wheels. Perfect for mixed terrain adventures.",
    },
  ];

  const parts: BikePart[] = [
    { id: "part_1", bikeId: "bike_aurora", partType: "Brake", condition: "NEW", quantity: 12, priceCents: cents(39.99) },
    { id: "part_2", bikeId: "bike_aurora", partType: "Chain", condition: "NEW", quantity: 8, priceCents: cents(24.5) },
    { id: "part_3", bikeId: "bike_aurora", partType: "Wheel", condition: "USED", quantity: 2, priceCents: cents(89.0) },
    { id: "part_4", bikeId: "bike_noir", partType: "Tire", condition: "NEW", quantity: 18, priceCents: cents(29.0) },
    { id: "part_5", bikeId: "bike_noir", partType: "Seat", condition: "USED", quantity: 4, priceCents: cents(14.5) },
    { id: "part_6", bikeId: "bike_glacier", partType: "Handlebar", condition: "NEW", quantity: 5, priceCents: cents(44.99) },
    { id: "part_7", bikeId: "bike_glacier", partType: "Derailleur", condition: "NEW", quantity: 3, priceCents: cents(119.0) },
  ];

  return { bikes, parts, requests: [] };
}

const globalForCatalog = globalThis as unknown as {
  catalog: CatalogState | undefined;
  receiptSeq: number | undefined;
};

function getState(): CatalogState {
  if (!globalForCatalog.catalog) globalForCatalog.catalog = createInitialState();
  const state = globalForCatalog.catalog;

  const seedImages: Record<string, string> = {
    bike_aurora: "https://upload.wikimedia.org/wikipedia/commons/2/20/BMX_bicycle.JPG",
    bike_noir: "https://upload.wikimedia.org/wikipedia/commons/0/01/Bike.jpg",
    bike_glacier: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Mountain_biking.JPG",
  };

  for (const bike of state.bikes) {
    const seeded = seedImages[bike.id];
    if (seeded && bike.imageUrl !== seeded) bike.imageUrl = seeded;
  }
  return state;
}

function nextReceiptNumber() {
  globalForCatalog.receiptSeq = (globalForCatalog.receiptSeq ?? 0) + 1;
  return formatReceiptNumber(globalForCatalog.receiptSeq);
}

function nowIso() {
  return new Date().toISOString();
}

export const catalogStore = {
  partTypes,
  conditions,

  listBikes(): Bike[] {
    return getState().bikes;
  },

  getBike(bikeId: string): Bike | null {
    return getState().bikes.find((b) => b.id === bikeId) ?? null;
  },

  listParts(bikeId: string): BikePart[] {
    return getState().parts
      .filter((p) => p.bikeId === bikeId)
      .sort((a, b) => a.partType.localeCompare(b.partType));
  },

  addBike(input: Omit<Bike, "id"> & { id?: string }): Bike {
    const state = getState();
    const id = input.id ?? `bike_${crypto.randomUUID()}`;
    const bike: Bike = { ...input, id };
    state.bikes.unshift(bike);
    return bike;
  },

  addPart(input: Omit<BikePart, "id"> & { id?: string }): BikePart {
    const state = getState();
    const id = input.id ?? `part_${crypto.randomUUID()}`;
    const part: BikePart = { ...input, id };
    state.parts.unshift(part);
    return part;
  },

  purchasePart(input: {
    bikeId: string;
    partId: string;
    quantity: number;
    customerName: string;
    customerEmail: string;
  }): PurchaseRequest {
    const state = getState();
    const bike = state.bikes.find((b) => b.id === input.bikeId);
    if (!bike) throw new Error("Bike not found");

    const part = state.parts.find((p) => p.id === input.partId && p.bikeId === input.bikeId);
    if (!part) throw new Error("Part not found");
    if (input.quantity <= 0) throw new Error("Quantity must be at least 1");
    if (part.quantity < input.quantity) throw new Error("Not enough stock");

    part.quantity -= input.quantity;

    const totalCents = part.priceCents * input.quantity;
    const request: PurchaseRequest = {
      id: `req_${crypto.randomUUID()}`,
      receiptNumber: nextReceiptNumber(),
      bikeId: bike.id,
      bikeName: bike.name,
      partType: part.partType,
      condition: part.condition,
      quantity: input.quantity,
      unitPriceCents: part.priceCents,
      totalCents,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      paid: false,
      createdAt: nowIso(),
    };

    state.requests.unshift(request);
    return request;
  },

  listRequests(): PurchaseRequest[] {
    return getState().requests;
  },

  updateRequest(requestId: string, patch: { paid?: boolean; proofImageDataUrl?: string }) {
    const state = getState();
    const req = state.requests.find((r) => r.id === requestId);
    if (!req) return null;
    if (typeof patch.paid === "boolean") req.paid = patch.paid;
    if (typeof patch.proofImageDataUrl === "string") req.proofImageDataUrl = patch.proofImageDataUrl;
    return req;
  },
};

