"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

import { MobileShell } from "@/components/layout/mobile-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { setCustomerToken } from "@/lib/storage";
import { PublicRestaurantResponse, RestaurantResource } from "@/types/api";

export default function TablePage({
  params,
}: {
  params: Promise<{ tableId: string }>;
}) {
  const resolvedParams = use(params);
  const [restaurant, setRestaurant] = useState<RestaurantResource | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function bootstrap() {
      try {
        const publicData =
          await api<PublicRestaurantResponse>("/public/restaurant");
        setRestaurant(publicData.restaurant);
        const session = await api<{ token: string }>(
          "/public/customer/session",
          {
            method: "POST",
            body: {
              tableCode: resolvedParams.tableId,
            },
          }
        );
        setCustomerToken(session.token);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to create customer session"
        );
      }
    }

    bootstrap();
  }, [resolvedParams.tableId]);

  return (
    <MobileShell>
      <main className="relative min-h-screen overflow-hidden">
        <div className="relative h-[62vh]">
          <Image
            src={
              restaurant?.heroImageUrl ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
            }
            alt="Chinese dining spread"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/20 to-[#651317]" />
        </div>
        <section className="-mt-20 rounded-t-[36px] bg-[var(--background)] px-6 pb-10 pt-6">
          <Badge>Table detected</Badge>
          <h1 className="mt-4 font-serif text-4xl text-stone-950">
            Welcome to {restaurant?.name ?? "Restaurant"}! You are seated at
            Table {resolvedParams.tableId}.
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Session customer dibuat otomatis dari QR meja. Selanjutnya customer
            tinggal pilih menu, tambah notes, lalu bayar QRIS.
          </p>
          {message ? (
            <p className="mt-3 text-sm text-red-700">{message}</p>
          ) : null}
          <Button asChild size="lg" variant="secondary" className="mt-8 w-full">
            <Link href="/menu">View Menu and Order</Link>
          </Button>
        </section>
      </main>
    </MobileShell>
  );
}
