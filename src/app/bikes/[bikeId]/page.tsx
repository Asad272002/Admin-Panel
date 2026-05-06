"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import Navbar from "@/components/layout/navbar";
import EmptyState from "@/components/shared/empty-state";
import LoadingSpinner from "@/components/shared/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBikeDetails, useCheckout } from "@/hooks/use-bikes";
import { downloadReceiptPdf } from "@/lib/receipt";
import type { BikePart, PurchaseRequest } from "@/types";

const formSchema = z.object({
  partId: z.string().min(1, "Select a part"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100),
  customerName: z.string().trim().min(2, "Name is too short").max(80),
  customerEmail: z.string().trim().email("Enter a valid email").max(120),
});

type FormValues = z.infer<typeof formSchema>;

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function BikeDetailsPage({ params }: { params: { bikeId: string } }) {
  const { data, isLoading, error } = useBikeDetails(params.bikeId);
  const checkout = useCheckout();
  const [receipt, setReceipt] = useState<PurchaseRequest | null>(null);

  const partsById = useMemo(() => {
    const map = new Map<string, BikePart>();
    for (const p of data?.parts ?? []) map.set(p.id, p);
    return map;
  }, [data?.parts]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partId: "",
      quantity: 1,
      customerName: "",
      customerEmail: "",
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-col">
        <Navbar />
        <div className="mx-auto flex max-w-6xl flex-1 items-center justify-center px-4 py-16">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!data || error) {
    return (
      <div className="flex min-h-full flex-col">
        <Navbar />
        <div className="mx-auto max-w-6xl flex-1 px-4 py-16">
          <EmptyState
            title="Bike not found"
            description="Return to the catalogue and pick a different bike."
            action={
              <Button asChild>
                <Link href="/">Back to catalogue</Link>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const selectedPart = partsById.get(form.watch("partId") || "");

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Catalogue
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="overflow-hidden">
            <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
              <img src={data.bike.imageUrl} alt={data.bike.name} className="h-full w-full object-cover" />
            </div>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-baseline justify-between gap-3">
                <span>{data.bike.name}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {data.bike.brand} · {data.bike.year}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">{data.bike.description}</div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium">Parts availability</div>
                {data.parts.length === 0 ? (
                  <EmptyState
                    title="No parts listed"
                    description="This bike has no parts available yet."
                  />
                ) : (
                  <div className="divide-y divide-border/40 rounded-[var(--radius-lg)] border border-border/60">
                    {data.parts.map((p) => (
                      <div key={p.id} className="flex items-center justify-between gap-4 p-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="truncate text-sm font-medium">{p.partType}</div>
                            <Badge variant={p.condition === "NEW" ? "success" : "neutral"}>{p.condition}</Badge>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {p.quantity} available · {money(p.priceCents)} each
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => form.setValue("partId", p.id, { shouldValidate: true })}
                        >
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Buy a part</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-3"
                onSubmit={form.handleSubmit(async (values) => {
                  const part = partsById.get(values.partId);
                  if (!part) {
                    toast.error("Select a part");
                    return;
                  }
                  if (values.quantity > part.quantity) {
                    toast.error("Not enough stock");
                    return;
                  }

                  try {
                    const req = await checkout.mutateAsync({
                      bikeId: data.bike.id,
                      partId: values.partId,
                      quantity: values.quantity,
                      customerName: values.customerName,
                      customerEmail: values.customerEmail,
                    });
                    setReceipt(req);
                    toast.success("Order created");
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Checkout failed");
                  }
                })}
              >
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="partId">
                    Part
                  </label>
                  <select
                    id="partId"
                    className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    {...form.register("partId")}
                  >
                    <option value="">Select a part</option>
                    {data.parts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.partType} ({p.condition}) · {p.quantity} in stock
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.partId ? (
                    <div className="text-xs text-red-500">{form.formState.errors.partId.message}</div>
                  ) : null}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="quantity">
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    inputMode="numeric"
                    className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    {...form.register("quantity", { valueAsNumber: true })}
                  />
                  {form.formState.errors.quantity ? (
                    <div className="text-xs text-red-500">{form.formState.errors.quantity.message}</div>
                  ) : null}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="customerName">
                    Name
                  </label>
                  <input
                    id="customerName"
                    className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Your name"
                    {...form.register("customerName")}
                  />
                  {form.formState.errors.customerName ? (
                    <div className="text-xs text-red-500">
                      {form.formState.errors.customerName.message}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="customerEmail">
                    Email
                  </label>
                  <input
                    id="customerEmail"
                    type="email"
                    className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="you@example.com"
                    {...form.register("customerEmail")}
                  />
                  {form.formState.errors.customerEmail ? (
                    <div className="text-xs text-red-500">
                      {form.formState.errors.customerEmail.message}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-[var(--radius-lg)] border border-border/60 bg-muted/40 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Selected</span>
                    <span className="font-medium">
                      {selectedPart ? `${selectedPart.partType} (${selectedPart.condition})` : "—"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">
                      {selectedPart ? money(selectedPart.priceCents * (form.watch("quantity") || 0)) : "—"}
                    </span>
                  </div>
                </div>

                <Button type="submit" disabled={checkout.isPending} className="w-full">
                  {checkout.isPending ? "Processing..." : "Buy"}
                </Button>
              </form>

              {receipt ? (
                <div className="mt-6 rounded-[var(--radius-lg)] border border-border/60 bg-card/50 p-4">
                  <div className="text-sm font-medium">Receipt ready</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {receipt.receiptNumber} · {money(receipt.totalCents)}
                  </div>
                  <Button
                    className="mt-3 w-full gap-2"
                    variant="outline"
                    onClick={() => downloadReceiptPdf(receipt)}
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

