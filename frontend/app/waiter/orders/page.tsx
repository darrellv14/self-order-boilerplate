"use client";

import { useEffect, useState } from "react";
import { BellRing, ChefHat, ClipboardList } from "lucide-react";

import { MobileShell } from "@/components/layout/mobile-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { getWaiterToken, setWaiterToken } from "@/lib/storage";
import { WaiterBoardResponse } from "@/types/api";

export default function WaiterOrdersPage() {
  const [board, setBoard] = useState<WaiterBoardResponse | null>(null);
  const [message, setMessage] = useState("");
  const [credentials, setCredentials] = useState({
    email: "waiter@goldendragon.local",
    password: "waiter123",
  });

  async function login() {
    try {
      const response = await api<{ token: string }>("/public/auth/login", {
        method: "POST",
        body: credentials,
      });
      setWaiterToken(response.token);
      setMessage("Waiter login berhasil.");
      loadBoard(response.token);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login gagal");
    }
  }

  async function loadBoard(forcedToken?: string) {
    try {
      const token = forcedToken ?? getWaiterToken();
      if (!token) {
        return;
      }

      const data = await api<WaiterBoardResponse>("/waiter/board", { token });
      setBoard(data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to load waiter board"
      );
    }
  }

  useEffect(() => {
    loadBoard();
  }, []);

  async function updateOrderStatus(orderId: string, status: string) {
    try {
      const token = getWaiterToken();
      if (!token) return;
      await api("/waiter/orders/status", {
        method: "PATCH",
        token,
        body: { orderId, status },
      });
      loadBoard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update gagal");
    }
  }

  async function updateCallStatus(callId: string, status: string) {
    try {
      const token = getWaiterToken();
      if (!token) return;
      await api("/waiter/calls/status", {
        method: "PATCH",
        token,
        body: { callId, status },
      });
      loadBoard();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update gagal");
    }
  }

  return (
    <MobileShell>
      <main className="space-y-5 px-4 py-5">
        <div className="rounded-[30px] bg-red-950 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
            Waiter panel
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            Terima order, handle panggilan, teruskan ke kitchen.
          </h1>
        </div>

        <Card className="space-y-3 p-4">
          <p className="font-semibold">Login waiter</p>
          <Input
            value={credentials.email}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <Input
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <Button onClick={login}>Login Waiter</Button>
        </Card>

        <section className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <ClipboardList className="mx-auto h-5 w-5 text-red-900" />
            <p className="mt-3 text-xl font-semibold">
              {board?.orders?.length ?? 0}
            </p>
            <p className="text-xs text-stone-500">Incoming</p>
          </Card>
          <Card className="p-4 text-center">
            <ChefHat className="mx-auto h-5 w-5 text-red-900" />
            <p className="mt-3 text-xl font-semibold">
              {board?.orders?.filter((item) => item.status === "PREPARING")
                .length ?? 0}
            </p>
            <p className="text-xs text-stone-500">Kitchen</p>
          </Card>
          <Card className="p-4 text-center">
            <BellRing className="mx-auto h-5 w-5 text-red-900" />
            <p className="mt-3 text-xl font-semibold">
              {board?.calls?.length ?? 0}
            </p>
            <p className="text-xs text-stone-500">Calls</p>
          </Card>
        </section>

        <Card className="space-y-3 p-4">
          <p className="font-semibold">Incoming orders</p>
          {board?.orders?.length ? (
            board.orders.map((order) => (
              <div key={order.id} className="rounded-2xl border p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                  Table {order.table.code}
                </p>
                <p className="font-semibold text-stone-900">{order.status}</p>
                <p className="mt-2 text-sm text-stone-600">
                  {order.items
                    .map((item) => `${item.name} x${item.quantity}`)
                    .join(", ")}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => updateOrderStatus(order.id, "PREPARING")}
                  >
                    Prepare
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => updateOrderStatus(order.id, "SERVING")}
                  >
                    Serve
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-stone-500">Belum ada order aktif.</p>
          )}
        </Card>

        <Card className="space-y-3 p-4">
          <p className="font-semibold">Call waiter queue</p>
          {board?.calls?.length ? (
            board.calls.map((call) => (
              <div key={call.id} className="rounded-2xl border p-3">
                <p className="font-semibold text-stone-900">
                  Table {call.table.code}
                </p>
                <p className="text-sm text-stone-600">
                  {call.message ?? "Customer meminta bantuan waiter."}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => updateCallStatus(call.id, "ACKNOWLEDGED")}
                  >
                    Acknowledge
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => updateCallStatus(call.id, "RESOLVED")}
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-stone-500">Belum ada panggilan aktif.</p>
          )}
        </Card>

        {message ? (
          <p className="rounded-2xl bg-white/80 p-4 text-sm text-stone-700">
            {message}
          </p>
        ) : null}
      </main>
    </MobileShell>
  );
}
