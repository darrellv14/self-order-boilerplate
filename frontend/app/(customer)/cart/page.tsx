"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MobileShell } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { api } from "@/lib/api";
import { getCart, getCustomerToken, setLastOrderId } from "@/lib/storage";
import { formatRupiah } from "@/lib/utils";

export default function CartPage() {
  const [cartItems, setCartItems] = useState(getCart());
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const pb1 = subtotal * 0.1;
  const service = subtotal * 0.05;
  const total = subtotal + pb1 + service;

  async function handleCheckout() {
    try {
      const token = getCustomerToken();
      if (!token) {
        setMessage("Session customer belum ada. Mulai dari scan meja dulu.");
        return;
      }

      const response = await api<{ id: string }>("/customer/orders", {
        method: "POST",
        token,
        body: {
          specialNotes: notes,
          items: cartItems.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            notes: item.notes,
          })),
        },
      });

      setLastOrderId(response.id);
      setMessage("Order berhasil dibuat.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout gagal");
    }
  }

  return (
    <MobileShell>
      <TopBar title="Cart and Checkout" />
      <main className="space-y-4 px-4 pb-40 pt-4">
        {cartItems.map((item) => (
          <Card key={`${item.menuItemId}-${item.notes ?? ""}`} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-stone-900">{item.name}</h3>
                <p className="mt-1 text-sm text-stone-500">
                  {item.notes ?? "Standard preparation"}
                </p>
              </div>
              <span className="font-semibold text-red-900">
                {formatRupiah(item.quantity * item.price)}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 rounded-full bg-stone-100 px-3 py-2">
                <span className="w-6 text-center">{item.quantity}</span>
              </div>
            </div>
          </Card>
        ))}
        <Card className="p-4">
          <p className="font-semibold text-stone-900">
            Special Notes to Kitchen
          </p>
          <Textarea
            className="mt-3"
            placeholder="Allergy note, split dishes, no spring onion..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Card>
        <Card className="space-y-3 p-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>PB1 10%</span>
            <span>{formatRupiah(pb1)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Service 5%</span>
            <span>{formatRupiah(service)}</span>
          </div>
          <div className="flex justify-between border-t pt-3 text-base font-semibold">
            <span>Grand Total</span>
            <span>{formatRupiah(total)}</span>
          </div>
        </Card>
        {message ? (
          <Card className="p-4">
            <p className="text-sm text-stone-700">{message}</p>
            <Button asChild className="mt-3 w-full">
              <Link href="/payment">Lanjut ke QRIS</Link>
            </Button>
          </Card>
        ) : null}
      </main>
      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t bg-white/95 p-4 backdrop-blur">
        <Button size="lg" className="w-full" onClick={handleCheckout}>
          Pay with QRIS
        </Button>
      </div>
    </MobileShell>
  );
}
