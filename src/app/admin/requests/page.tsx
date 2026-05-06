"use client";

import { Download, ImageUp, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import AppShell from "@/components/layout/app-shell";
import Navbar from "@/components/layout/navbar";
import EmptyState from "@/components/shared/empty-state";
import LoadingSpinner from "@/components/shared/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminRequests, useAdminUpdateRequest } from "@/hooks/use-admin";
import { downloadReceiptPdf } from "@/lib/receipt";

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function AdminRequestsPage() {
  const requests = useAdminRequests();
  const updateRequest = useAdminUpdateRequest();
  const [busyId, setBusyId] = useState<string | null>(null);

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />

      <AppShell
        title="Requests"
        actions={
          <Button variant="outline" size="icon" onClick={() => requests.refetch()} aria-label="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
        }
      >
        <Card>
          <CardHeader>
            <CardTitle>Customer purchases</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.isLoading ? (
              <div className="flex justify-center py-10">
                <LoadingSpinner />
              </div>
            ) : requests.data && requests.data.requests.length > 0 ? (
              <div className="space-y-3">
                {requests.data.requests.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-[var(--radius-lg)] border border-border/60 bg-card/40 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="truncate text-sm font-semibold">{r.bikeName}</div>
                          <Badge variant={r.paid ? "success" : "warning"}>{r.paid ? "PAID" : "UNPAID"}</Badge>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {r.partType} ({r.condition}) · Qty {r.quantity} · {money(r.totalCents)} ·{" "}
                          {r.receiptNumber}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {r.customerName} · {r.customerEmail} ·{" "}
                          {new Date(r.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          onClick={() => downloadReceiptPdf(r)}
                        >
                          <Download className="h-4 w-4" />
                          Receipt
                        </Button>

                        <Button
                          size="sm"
                          variant={r.paid ? "secondary" : "default"}
                          disabled={busyId === r.id || updateRequest.isPending}
                          onClick={async () => {
                            try {
                              setBusyId(r.id);
                              await updateRequest.mutateAsync({ requestId: r.id, paid: !r.paid });
                              toast.success(r.paid ? "Marked unpaid" : "Marked paid");
                            } catch (e) {
                              toast.error(e instanceof Error ? e.message : "Update failed");
                            } finally {
                              setBusyId(null);
                            }
                          }}
                        >
                          Toggle paid
                        </Button>

                        <label className="inline-flex">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = async () => {
                                try {
                                  setBusyId(r.id);
                                  await updateRequest.mutateAsync({
                                    requestId: r.id,
                                    proofImageDataUrl: String(reader.result),
                                  });
                                  toast.success("Proof attached");
                                } catch (err) {
                                  toast.error(err instanceof Error ? err.message : "Upload failed");
                                } finally {
                                  setBusyId(null);
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                          <Button size="sm" variant="outline" className="gap-2" asChild>
                            <span>
                              <ImageUp className="h-4 w-4" />
                              Proof
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>

                    {r.proofImageDataUrl ? (
                      <div className="mt-4">
                        <div className="mb-2 text-xs font-medium text-muted-foreground">Proof</div>
                        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border/60 bg-muted">
                          <img
                            src={r.proofImageDataUrl}
                            alt="Proof"
                            className="max-h-[240px] w-full object-contain"
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No requests yet"
                description="Requests appear here after customers buy a part from the catalogue."
              />
            )}
          </CardContent>
        </Card>
      </AppShell>
    </div>
  );
}

