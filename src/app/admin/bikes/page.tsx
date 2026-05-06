"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import AppShell from "@/components/layout/app-shell";
import Navbar from "@/components/layout/navbar";
import EmptyState from "@/components/shared/empty-state";
import LoadingSpinner from "@/components/shared/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAddBike, useAdminAddPart, useAdminBikes } from "@/hooks/use-admin";
import { useBikeDetails } from "@/hooks/use-bikes";
import { bikeCreateSchema, partAddSchema } from "@/lib/validations/catalog.schema";
import type { PartCondition, PartType } from "@/types";

const partTypes: PartType[] = ["Brake", "Chain", "Derailleur", "Handlebar", "Seat", "Tire", "Wheel"];
const conditions: PartCondition[] = ["NEW", "USED"];

type BikeForm = z.infer<typeof bikeCreateSchema>;

const partFormSchema = partAddSchema.extend({
  priceDollars: z.number().min(0).max(100_000),
});
type PartForm = z.infer<typeof partFormSchema>;

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function AdminBikesPage() {
  const bikes = useAdminBikes();
  const addBike = useAdminAddBike();
  const addPart = useAdminAddPart();

  const [selectedBikeId, setSelectedBikeId] = useState<string>("");
  const details = useBikeDetails(selectedBikeId);

  const bikeOptions = bikes.data?.bikes ?? [];

  const selectedBike = useMemo(() => {
    return bikeOptions.find((b) => b.id === selectedBikeId) ?? null;
  }, [bikeOptions, selectedBikeId]);

  const bikeForm = useForm<BikeForm>({
    resolver: zodResolver(bikeCreateSchema),
    defaultValues: {
      name: "",
      brand: "",
      year: new Date().getFullYear(),
      imageUrl: "",
      description: "",
    },
  });

  const partForm = useForm<PartForm>({
    resolver: zodResolver(partFormSchema),
    defaultValues: {
      bikeId: "",
      partType: "Brake",
      condition: "NEW",
      quantity: 1,
      priceCents: 0,
      priceDollars: 0,
    },
  });

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />

      <AppShell title="Bikes & parts">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              {bikes.isLoading ? (
                <div className="flex justify-center py-10">
                  <LoadingSpinner />
                </div>
              ) : bikeOptions.length === 0 ? (
                <EmptyState title="No bikes" description="Add a bike to start building your catalogue." />
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground" htmlFor="bikeSelect">
                        Select bike
                      </label>
                      <select
                        id="bikeSelect"
                        className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        value={selectedBikeId}
                        onChange={(e) => {
                          setSelectedBikeId(e.target.value);
                          partForm.setValue("bikeId", e.target.value);
                        }}
                      >
                        <option value="">Choose...</option>
                        {bikeOptions.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.year})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedBike ? (
                    <div className="rounded-[var(--radius-lg)] border border-border/60 bg-card/40 p-4">
                      <div className="text-sm font-medium">{selectedBike.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {selectedBike.brand} · {selectedBike.year}
                      </div>
                    </div>
                  ) : null}

                  {selectedBikeId ? (
                    details.isLoading ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner />
                      </div>
                    ) : details.data ? (
                      details.data.parts.length === 0 ? (
                        <EmptyState
                          title="No parts yet"
                          description="Add a part availability record using the form on the right."
                        />
                      ) : (
                        <div className="divide-y divide-border/40 rounded-[var(--radius-lg)] border border-border/60">
                          {details.data.parts.map((p) => (
                            <div key={p.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <div className="truncate font-medium">{p.partType}</div>
                                  <Badge variant={p.condition === "NEW" ? "success" : "neutral"}>{p.condition}</Badge>
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  {p.quantity} in stock · {money(p.priceCents)}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">{p.id}</div>
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      <EmptyState title="Select a bike" description="Pick a bike to view and manage its parts." />
                    )
                  ) : (
                    <EmptyState title="Select a bike" description="Pick a bike to view and manage its parts." />
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add bike</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-3"
                  onSubmit={bikeForm.handleSubmit(async (values) => {
                    try {
                      await addBike.mutateAsync(values);
                      toast.success("Bike added");
                      bikeForm.reset({
                        name: "",
                        brand: "",
                        year: new Date().getFullYear(),
                        imageUrl: "",
                        description: "",
                      });
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Failed to add bike");
                    }
                  })}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground" htmlFor="name">
                        Name
                      </label>
                      <input
                        id="name"
                        className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        {...bikeForm.register("name")}
                      />
                      {bikeForm.formState.errors.name ? (
                        <div className="text-xs text-red-500">{bikeForm.formState.errors.name.message}</div>
                      ) : null}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground" htmlFor="brand">
                        Brand
                      </label>
                      <input
                        id="brand"
                        className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        {...bikeForm.register("brand")}
                      />
                      {bikeForm.formState.errors.brand ? (
                        <div className="text-xs text-red-500">{bikeForm.formState.errors.brand.message}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground" htmlFor="year">
                        Year
                      </label>
                      <input
                        id="year"
                        type="number"
                        inputMode="numeric"
                        className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        {...bikeForm.register("year", { valueAsNumber: true })}
                      />
                      {bikeForm.formState.errors.year ? (
                        <div className="text-xs text-red-500">{bikeForm.formState.errors.year.message}</div>
                      ) : null}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground" htmlFor="imageUrl">
                        Image URL
                      </label>
                      <input
                        id="imageUrl"
                        className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        {...bikeForm.register("imageUrl")}
                      />
                      {bikeForm.formState.errors.imageUrl ? (
                        <div className="text-xs text-red-500">{bikeForm.formState.errors.imageUrl.message}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      className="min-h-[96px] w-full resize-none rounded-xl border border-border bg-background/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      {...bikeForm.register("description")}
                    />
                    {bikeForm.formState.errors.description ? (
                      <div className="text-xs text-red-500">
                        {bikeForm.formState.errors.description.message}
                      </div>
                    ) : null}
                  </div>

                  <Button type="submit" disabled={addBike.isPending} className="w-full">
                    {addBike.isPending ? "Adding..." : "Add bike"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add part availability</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-3"
                  onSubmit={partForm.handleSubmit(async (values) => {
                    if (!values.bikeId) {
                      toast.error("Select a bike first");
                      return;
                    }
                    try {
                      const priceCents = Math.round(values.priceDollars * 100);
                      await addPart.mutateAsync({
                        bikeId: values.bikeId,
                        partType: values.partType,
                        condition: values.condition,
                        quantity: values.quantity,
                        priceCents,
                      });
                      toast.success("Part added");
                      partForm.reset({
                        bikeId: values.bikeId,
                        partType: "Brake",
                        condition: "NEW",
                        quantity: 1,
                        priceCents: 0,
                        priceDollars: 0,
                      });
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Failed to add part");
                    }
                  })}
                >
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground" htmlFor="bikeId">
                      Bike
                    </label>
                    <select
                      id="bikeId"
                      className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      value={partForm.watch("bikeId") || ""}
                      onChange={(e) => partForm.setValue("bikeId", e.target.value)}
                    >
                      <option value="">Choose...</option>
                      {bikeOptions.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground" htmlFor="partType">
                        Part type
                      </label>
                      <select
                        id="partType"
                        className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        {...partForm.register("partType")}
                      >
                        {partTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground" htmlFor="condition">
                        Condition
                      </label>
                      <select
                        id="condition"
                        className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        {...partForm.register("condition")}
                      >
                        {conditions.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground" htmlFor="quantity">
                        Quantity
                      </label>
                      <input
                        id="quantity"
                        type="number"
                        inputMode="numeric"
                        className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        {...partForm.register("quantity", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground" htmlFor="priceDollars">
                        Unit price ($)
                      </label>
                      <input
                        id="priceDollars"
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        {...partForm.register("priceDollars", { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={addPart.isPending} className="w-full">
                    {addPart.isPending ? "Adding..." : "Add part"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </AppShell>
    </div>
  );
}

