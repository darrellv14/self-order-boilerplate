import Link from "next/link";

import { MobileShell } from "@/components/layout/mobile-shell";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <MobileShell>
      <main className="flex min-h-screen flex-col justify-center gap-6 px-6 text-white">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-200">
          Restaurant Boilerplate
        </p>
        <h1 className="font-serif text-5xl leading-tight">
          Self Order template untuk owner, waiter, dan customer.
        </h1>
        <p className="max-w-sm text-sm text-red-50/90">
          Mulai dari setup owner, simulasi meja QR, panel waiter, sampai fondasi
          backend Prisma.
        </p>
        <div className="grid gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link href="/owner/setup">Masuk Owner Setup</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/table/12">Lihat Flow Customer</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/waiter/orders">Masuk Panel Waiter</Link>
          </Button>
        </div>
      </main>
    </MobileShell>
  );
}
