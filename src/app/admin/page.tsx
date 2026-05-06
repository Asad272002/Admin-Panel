"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AppShell from "@/components/layout/app-shell";
import Navbar from "@/components/layout/navbar";
import LoadingSpinner from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminBikes, useAdminRequests } from "@/hooks/use-admin";

export default function AdminHomePage() {
  const router = useRouter();
  const bikes = useAdminBikes();
  const requests = useAdminRequests();

  const totalRequests = requests.data?.requests.length ?? 0;
  const paid = requests.data?.requests.filter((r) => r.paid).length ?? 0;
  const unpaid = totalRequests - paid;

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />

      <AppShell
        title="Admin overview"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              toast.success("Signed out");
              router.push("/admin/login");
            }}
          >
            Logout
          </Button>
        }
      >
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Bikes", value: String(bikes.data?.bikes.length ?? 0) },
            { label: "Requests", value: String(totalRequests) },
            { label: "Paid", value: String(paid) },
            { label: "Unpaid", value: String(unpaid) },
          ].map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold tracking-tight">{kpi.value}</CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/admin/bikes">Manage bikes & parts</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/requests">Review customer requests</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent requests</CardTitle>
            </CardHeader>
            <CardContent>
              {requests.isLoading ? (
                <div className="flex justify-center py-10">
                  <LoadingSpinner />
                </div>
              ) : requests.data && requests.data.requests.length > 0 ? (
                <div className="space-y-3">
                  {requests.data.requests.slice(0, 5).map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-[var(--radius-lg)] border border-border/60 bg-card/40 px-4 py-3 text-sm"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">{r.bikeName}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {r.partType} ({r.condition}) · {r.quantity} · {r.receiptNumber}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{r.paid ? "Paid" : "Unpaid"}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No requests yet.</div>
              )}
            </CardContent>
          </Card>
        </section>
      </AppShell>
    </div>
  );
}

