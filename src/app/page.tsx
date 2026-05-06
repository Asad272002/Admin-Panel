import Link from "next/link";

import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { catalogStore } from "@/lib/catalog-store";

export default function Home() {
  const bikes = catalogStore.listBikes();

  return (
    <div className="flex flex-1 flex-col">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(0,0,0,0.08),transparent_55%),radial-gradient(1000px_circle_at_80%_30%,rgba(0,0,0,0.06),transparent_55%),radial-gradient(900px_circle_at_60%_90%,rgba(0,0,0,0.04),transparent_55%)] dark:bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(255,255,255,0.10),transparent_55%),radial-gradient(1000px_circle_at_80%_30%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(900px_circle_at_60%_90%,rgba(255,255,255,0.06),transparent_55%)]" />

      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Find parts for your bike in seconds.
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
                Browse the catalogue, check real-time availability, and generate a downloadable PDF
                receipt at checkout. Admins manage inventory and requests from a secure panel.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href="#catalogue">Browse bikes</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/admin">Open admin panel</Link>
                </Button>
              </div>
            </div>

            <Card className="relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-foreground/10" />
              <div className="relative p-6">
                <div className="text-sm font-medium">Quick demo</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  - Visit a bike page
                  <br />- Pick a part, choose quantity
                  <br />- Buy and download a PDF receipt
                  <br />- Review requests in /admin/requests
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section id="catalogue" className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Catalogue</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a bike to view available parts.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bikes.map((bike) => (
              <Card key={bike.id} className="overflow-hidden transition-colors hover:bg-card/70">
                <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
                  <img
                    src={bike.imageUrl}
                    alt={bike.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-baseline justify-between gap-3">
                    <span className="truncate">{bike.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{bike.year}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="line-clamp-2 text-sm text-muted-foreground">{bike.description}</div>
                  <Button asChild className="w-full">
                    <Link href={`/bikes/${bike.id}`}>View parts</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Bike Catalogue</div>
          <div className="flex items-center gap-4">
            <a className="hover:text-foreground" href="/api/health">
              Health
            </a>
            <a className="hover:text-foreground" href="/admin">
              Admin
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
