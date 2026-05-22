"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import { MobileShell } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { addToCart, getCart } from "@/lib/storage";
import { formatRupiah } from "@/lib/utils";
import { PublicRestaurantResponse, RestaurantResource } from "@/types/api";

export default function MenuPage() {
  const [restaurant, setRestaurant] = useState<RestaurantResource | null>(null);
  const [message, setMessage] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const response =
          await api<PublicRestaurantResponse>("/public/restaurant");
        setRestaurant(response.restaurant);
        const cart = getCart();
        setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Failed to load restaurant"
        );
      }
    }

    load();
  }, []);

  const total = getCart().reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  function handleAdd(item: RestaurantResource["menuItems"][number]) {
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: item.basePrice,
      quantity: 1,
    });

    const cart = getCart();
    setCartCount(cart.reduce((acc, entry) => acc + entry.quantity, 0));
  }

  const categories = restaurant?.categories ?? [];

  return (
    <MobileShell>
      <TopBar title={`${restaurant?.name ?? "Restaurant"} Menu`} />
      <main className="space-y-6 px-4 pb-32 pt-4">
        <section className="luxury-card overflow-hidden border-none bg-red-950 text-white">
          <div className="p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
              {restaurant?.promos?.[0]
                ? new Date(restaurant.promos[0].startsAt).toLocaleDateString()
                : "Promo"}
            </p>
            <h2 className="mt-2 font-serif text-3xl">
              {restaurant?.promos?.[0]?.title ?? "Premium Chinese Dining"}
            </h2>
            <p className="mt-2 text-sm text-red-50/90">
              {restaurant?.promos?.[0]?.description ??
                "Owner dapat setup promo timeline dari dashboard."}
            </p>
          </div>
        </section>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {categories.map((category, index) => (
            <button
              key={category.id}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                index === 0
                  ? "bg-red-900 text-white"
                  : "bg-white text-stone-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {restaurant?.menuItems?.map((item) => (
            <Card key={item.id} className="flex gap-4 p-4">
              <div className="flex-1">
                <Link href={`/menu/item/${item.slug}`}>
                  <h3 className="font-semibold text-stone-900">{item.name}</h3>
                </Link>
                <p className="mt-1 text-sm text-stone-500">
                  {item.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-red-900">
                    {formatRupiah(item.basePrice)}
                  </span>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/menu/item/${item.slug}`}>Customize</Link>
                    </Button>
                    <Button size="sm" onClick={() => handleAdd(item)}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {message ? <p className="text-sm text-red-700">{message}</p> : null}
      </main>
      <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 px-4">
        <div className="flex items-center justify-between rounded-[26px] bg-red-900 p-4 text-white shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/10 p-2">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-red-100">
                Cart
              </p>
              <p className="font-semibold">
                {cartCount} items | {formatRupiah(total)}
              </p>
            </div>
          </div>
          <Button asChild variant="secondary">
            <Link href="/cart">Checkout</Link>
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}
