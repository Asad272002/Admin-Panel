"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Bike, BikePart, PurchaseRequest } from "@/types";

function errorMessage(json: unknown, fallback: string) {
  return typeof json === "object" && json && "error" in json
    ? String((json as { error: unknown }).error)
    : fallback;
}

export function useAdminBikes() {
  return useQuery({
    queryKey: ["admin", "bikes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/bikes");
      const json = (await res.json().catch(() => null)) as unknown;
      if (!res.ok) throw new Error(errorMessage(json, "Failed to load bikes"));
      return json as { bikes: Bike[] };
    },
  });
}

export function useAdminAddBike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Omit<Bike, "id">) => {
      const res = await fetch("/api/admin/bikes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = (await res.json().catch(() => null)) as unknown;
      if (!res.ok) throw new Error(errorMessage(json, "Failed to add bike"));
      return json as Bike;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "bikes"] });
    },
  });
}

export function useAdminAddPart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Omit<BikePart, "id">) => {
      const res = await fetch("/api/admin/parts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = (await res.json().catch(() => null)) as unknown;
      if (!res.ok) throw new Error(errorMessage(json, "Failed to add part"));
      return json as BikePart;
    },
    onSuccess: async (_part, vars) => {
      await queryClient.invalidateQueries({ queryKey: ["bike", vars.bikeId] });
    },
  });
}

export function useAdminRequests() {
  return useQuery({
    queryKey: ["admin", "requests"],
    queryFn: async () => {
      const res = await fetch("/api/admin/requests");
      const json = (await res.json().catch(() => null)) as unknown;
      if (!res.ok) throw new Error(errorMessage(json, "Failed to load requests"));
      return json as { requests: PurchaseRequest[] };
    },
  });
}

export function useAdminUpdateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { requestId: string; paid?: boolean; proofImageDataUrl?: string }) => {
      const res = await fetch(`/api/admin/requests/${input.requestId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ paid: input.paid, proofImageDataUrl: input.proofImageDataUrl }),
      });
      const json = (await res.json().catch(() => null)) as unknown;
      if (!res.ok) throw new Error(errorMessage(json, "Failed to update request"));
      return json as PurchaseRequest;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "requests"] });
    },
  });
}
