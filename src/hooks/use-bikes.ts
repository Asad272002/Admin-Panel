"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Bike, BikePart, PurchaseRequest } from "@/types";

function errorMessage(json: unknown, fallback: string) {
  return typeof json === "object" && json && "error" in json
    ? String((json as { error: unknown }).error)
    : fallback;
}

export function useBikes() {
  return useQuery({
    queryKey: ["bikes"],
    queryFn: async () => {
      const res = await fetch("/api/bikes");
      if (!res.ok) throw new Error("Failed to load bikes");
      return (await res.json()) as Bike[];
    },
  });
}

export function useBikeDetails(bikeId: string) {
  return useQuery({
    queryKey: ["bike", bikeId],
    queryFn: async () => {
      const res = await fetch(`/api/bikes/${bikeId}`);
      if (!res.ok) throw new Error("Failed to load bike");
      return (await res.json()) as { bike: Bike; parts: BikePart[] };
    },
    enabled: Boolean(bikeId),
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      bikeId: string;
      partId: string;
      quantity: number;
      customerName: string;
      customerEmail: string;
    }) => {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = (await res.json().catch(() => null)) as unknown;
      if (!res.ok) throw new Error(errorMessage(json, "Checkout failed"));
      return json as PurchaseRequest;
    },
    onSuccess: async (_req, vars) => {
      await queryClient.invalidateQueries({ queryKey: ["bike", vars.bikeId] });
    },
  });
}
