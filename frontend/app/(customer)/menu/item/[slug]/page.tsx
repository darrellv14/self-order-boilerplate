"use client";

import Image from "next/image";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { MobileShell } from "@/components/layout/mobile-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { addToCart } from "@/lib/storage";
import { PublicRestaurantResponse, RestaurantResource } from "@/types/api";

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [item, setItem] = useState<
    RestaurantResource["menuItems"][number] | null
  >(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function load() {
      const response =
        await api<PublicRestaurantResponse>("/public/restaurant");
      const found = response.restaurant?.menuItems?.find(
        (entry) => entry.slug === resolvedParams.slug
      );
      setItem(found ?? null);
    }

    load();
  }, [resolvedParams.slug]);

  function handleAdd() {
    if (!item) return;

    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: item.basePrice,
      quantity: 1,
      notes,
    });

    router.push("/cart");
  }

  if (!item) {
    return (
      <MobileShell>
        <main className="p-6 text-sm text-stone-600">Loading item...</main>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <main className="pb-36">
        <div className="relative h-80">
          <Image
            src={
              item.imageUrl ||
              "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80"
            }
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
        <section className="-mt-8 rounded-t-[32px] bg-[var(--background)] px-4 py-6">
          <h1 className="font-serif text-3xl text-stone-950">{item.name}</h1>
          <p className="mt-2 text-sm text-stone-600">{item.description}</p>
          <div className="mt-6 space-y-5">
            <div className="luxury-card p-4">
              <p className="font-semibold text-stone-900">Spice Level</p>
              <div className="mt-3 space-y-3 text-sm">
                <label className="flex items-center justify-between rounded-2xl border p-3">
                  <span>None</span>
                  <input type="radio" name="spice" defaultChecked />
                </label>
                <label className="flex items-center justify-between rounded-2xl border p-3">
                  <span>Medium</span>
                  <input type="radio" name="spice" />
                </label>
                <label className="flex items-center justify-between rounded-2xl border p-3">
                  <span>Extra Spicy</span>
                  <input type="radio" name="spice" />
                </label>
              </div>
            </div>
            <div className="luxury-card p-4">
              <p className="font-semibold text-stone-900">Special Notes</p>
              <Textarea
                className="mt-3"
                placeholder="No peanuts, sauce on the side, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </section>
      </main>
      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t bg-white/95 p-4 backdrop-blur">
        <Button size="lg" className="w-full" onClick={handleAdd}>
          Add to Order
        </Button>
      </div>
    </MobileShell>
  );
}
