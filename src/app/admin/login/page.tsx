import Navbar from "@/components/layout/navbar";
import LoginForm from "./login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/admin";

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-16">
        <LoginForm nextPath={next} />
      </main>
    </div>
  );
}
