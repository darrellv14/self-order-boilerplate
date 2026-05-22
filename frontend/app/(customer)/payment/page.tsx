"use client";

import Link from "next/link";
import { Download, QrCode, Timer } from "lucide-react";
import { useEffect, useState } from "react";

import { MobileShell } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { clearCart, getCustomerToken, getLastOrderId } from "@/lib/storage";
import { PublicOrderResponse } from "@/types/api";
import { formatRupiah } from "@/lib/utils";

export default function PaymentPage() {
  const [order, setOrder] = useState<PublicOrderResponse["order"]>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const orderId = getLastOrderId();
        if (!orderId) {
          setMessage("Belum ada order aktif. Buat order dari cart dulu.");
          return;
        }

        const response = await api<PublicOrderResponse>(
          `/public/orders/${orderId}`
        );
        setOrder(response.order);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Failed to load order"
        );
      }
    }

    load();
  }, []);

  async function simulatePayment() {
    try {
      const token = getCustomerToken();
      const orderId = getLastOrderId();
      if (!token || !orderId) {
        setMessage("Session payment tidak lengkap.");
        return;
      }

      await api("/customer/payment/simulate", {
        method: "POST",
        token,
        body: { orderId },
      });

      clearCart();
      setMessage("Pembayaran disimulasikan sukses.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Payment simulation failed"
      );
    }
  }

  return (
    <MobileShell>
      <TopBar title="QRIS Payment" />
      <main className="space-y-5 px-4 pb-10 pt-4 text-center">
        <Card className="p-5">
          <p className="text-sm text-stone-500">Total Amount</p>
          <p className="mt-2 text-4xl font-semibold text-red-900">
            {formatRupiah(order?.totalAmount ?? 0)}
          </p>
        </Card>
        <Card className="p-6">
          <div className="mx-auto flex h-72 w-72 items-center justify-center rounded-[32px] border-8 border-stone-100 bg-[linear-gradient(135deg,#fff,#f5f5f4)]">
            <QrCode className="h-40 w-40 text-red-900" />
          </div>
          <p className="mt-5 text-sm text-stone-600">
            Scan or download this QRIS to pay.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-900">
            <Timer className="h-4 w-4" />
            QR expires in 14:59
          </div>
        </Card>
        <div className="grid gap-3">
          <Button size="lg" onClick={simulatePayment}>
            Simulate Payment Success
          </Button>
          <Button size="lg" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download QRIS
          </Button>
          {message ? (
            <Card className="p-4">
              <p className="text-sm text-stone-700">{message}</p>
              <Button asChild className="mt-3 w-full">
                <Link href="/status">Lihat Status Order</Link>
              </Button>
            </Card>
          ) : null}
        </div>
      </main>
    </MobileShell>
  );
}
