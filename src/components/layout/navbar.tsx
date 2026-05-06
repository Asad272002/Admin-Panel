import Link from "next/link";
import { Bike } from "lucide-react";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

export default function Navbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-foreground ring-1 ring-border/70">
            <Bike className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Bike Catalogue</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#catalogue" className="hover:text-foreground">
            Catalogue
          </a>
          <Link href="/admin" className="hover:text-foreground">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/admin">Admin Panel</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
