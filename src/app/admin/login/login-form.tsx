"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginSchema, type LoginInput } from "@/lib/validations/catalog.schema";

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Admin login</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-3"
          onSubmit={form.handleSubmit(async (values) => {
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(values),
              credentials: "include",
            });
            const json = (await res.json().catch(() => null)) as unknown;
            if (!res.ok) {
              const message =
                typeof json === "object" && json && "error" in json
                  ? String((json as { error: unknown }).error)
                  : "Login failed";
              toast.error(message);
              return;
            }
            toast.success("Welcome back");
            window.location.assign(nextPath);
          })}
        >
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              {...form.register("username")}
            />
            {form.formState.errors.username ? (
              <div className="text-xs text-red-500">{form.formState.errors.username.message}</div>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="h-10 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <div className="text-xs text-red-500">{form.formState.errors.password.message}</div>
            ) : null}
          </div>

          <Button type="submit" className="w-full">
            Sign in
          </Button>

          <div className="rounded-[var(--radius-lg)] border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
            Demo credentials (hardcoded): <span className="font-medium text-foreground">Asad</span> /{" "}
            <span className="font-medium text-foreground">admin</span> (role: admin)
          </div>

          <Button asChild variant="ghost" className="w-full">
            <Link href="/">Back to catalogue</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
