"use client";

import AppShell from "@/components/layout/app-shell";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <AppShell title="Settings">
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Admin can manage bikes, parts inventory, and requests. Worker role is reserved for a
            later iteration.
          </CardContent>
        </Card>
      </AppShell>
    </div>
  );
}

