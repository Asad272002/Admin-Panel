"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PackageSearch, Receipt, Settings } from "lucide-react";

import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bikes", label: "Bikes & Parts", icon: PackageSearch },
  { href: "/admin/requests", label: "Requests", icon: Receipt },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        "relative hidden h-[calc(100vh-4rem)] w-72 shrink-0 border-r border-border/60 bg-background/40 p-3 backdrop-blur md:block",
        !sidebarOpen && "w-[76px]",
      )}
    >
      <div className="flex items-center justify-between px-2 py-2">
        <div className={cn("text-xs font-semibold text-muted-foreground", !sidebarOpen && "sr-only")}>
          Workspace
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <span className="text-xs font-semibold">{sidebarOpen ? "⟨" : "⟩"}</span>
        </Button>
      </div>

      <nav className="mt-2 space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                isActive && "bg-muted/50 text-foreground ring-1 ring-border/70",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className={cn("truncate", !sidebarOpen && "sr-only")}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
