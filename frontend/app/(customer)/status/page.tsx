"use client";

import { CheckCircle2, CookingPot, Hand, Soup } from "lucide-react";
import { useEffect, useState } from "react";

import { MobileShell } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { getCustomerToken, getLastOrderId } from "@/lib/storage";
import { PublicOrderResponse } from "@/types/api";

const steps = [
  { label: "Order Received", status: "CONFIRMED", icon: CheckCircle2 },
  { label: "Kitchen Preparing", status: "PREPARING", icon: CookingPot },
  { label: "Serving", status: "SERVING", icon: Soup },
];

export default function StatusPage() {
  const [order, setOrder] = useState<PublicOrderResponse["order"]>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const orderId = getLastOrderId();
        if (!orderId) {
          setMessage("Belum ada order untuk ditrack.");
          return;
        }

        const response = await api<PublicOrderResponse>(
          `/public/orders/${orderId}`
        );
        setOrder(response.order);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Failed to load status"
        );
      }
    }

    load();
  }, []);

  async function callWaiter() {
    try {
      const token = getCustomerToken();
      if (!token) {
        setMessage("Session customer belum aktif.");
        return;
      }

      await api("/customer/call-waiter", {
        method: "POST",
        token,
        body: { message: "Need assistance at the table." },
      });

      setMessage("Waiter berhasil dipanggil ke meja Anda.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to call waiter"
      );
    }
  }

  return (
    <MobileShell>
      <TopBar title="Order Status" />
      <main className="space-y-5 px-4 pb-10 pt-5">
        <Card className="bg-red-950 p-6 text-center text-white">
          <p className="text-sm uppercase tracking-[0.25em] text-amber-200">
            Payment Received
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            Order #{order?.id?.slice(0, 8) ?? "----"} is sent to the kitchen.
          </h1>
        </Card>
        <Card className="space-y-5 p-5">
          {steps.map((step) => {
            const Icon = step.icon;
            const active =
              ["CONFIRMED", "PREPARING", "SERVING", "COMPLETED"].includes(
                order?.status ?? ""
              ) && step.status !== "SERVING"
                ? true
                : order?.status === step.status;

            return (
              <div key={step.label} className="flex items-center gap-4">
                <div
                  className={`rounded-full p-3 ${active ? "bg-red-900 text-white" : "bg-stone-100 text-stone-400"}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-stone-900">{step.label}</p>
                  <p className="text-sm text-stone-500">
                    Current order status: {order?.status ?? "PENDING"}
                  </p>
                </div>
              </div>
            );
          })}
        </Card>
        <Button
          size="lg"
          variant="secondary"
          className="w-full"
          onClick={callWaiter}
        >
          <Hand className="mr-2 h-4 w-4" />
          Call Waiter
        </Button>
        {message ? (
          <p className="rounded-2xl bg-white/80 p-4 text-sm text-stone-700">
            {message}
          </p>
        ) : null}
      </main>
    </MobileShell>
  );
}
