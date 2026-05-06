"use client";

import { Menu } from "lucide-react";

import Sidebar from "@/components/layout/sidebar";
import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

export default function AppShell({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
                <p className="text-sm text-muted-foreground">
                  Manage bikes, parts inventory, and customer requests.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {actions}
              <ThemeToggle />
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
