"use client";

import { useEffect, useState } from "react";
import {
  CalendarClock,
  Percent,
  Settings2,
  UtensilsCrossed,
  WalletCards,
} from "lucide-react";

import { MobileShell } from "@/components/layout/mobile-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { getOwnerToken } from "@/lib/storage";
import { OwnerDashboardResponse } from "@/types/api";

const metricsMeta = [
  { key: "menuCount", label: "Active Menus", icon: UtensilsCrossed },
  { key: "promoCount", label: "Promo Running", icon: Percent },
  { key: "waiterCount", label: "Waiter Online", icon: Settings2 },
  { key: "ordersToday", label: "Orders Today", icon: WalletCards },
] as const satisfies Array<{
  key: keyof OwnerDashboardResponse["metrics"];
  label: string;
  icon: typeof UtensilsCrossed;
}>;

export default function OwnerDashboardPage() {
  const [dashboard, setDashboard] = useState<OwnerDashboardResponse | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [waiterForm, setWaiterForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [menuForm, setMenuForm] = useState({
    slug: "",
    name: "",
    description: "",
    imageUrl: "",
    basePrice: "0",
  });
  const [promoForm, setPromoForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    startsAt: "",
    endsAt: "",
  });

  async function loadDashboard() {
    try {
      const token = getOwnerToken();
      if (!token) {
        setMessage("Login owner dulu di /owner/setup.");
        return;
      }

      const data = await api<OwnerDashboardResponse>("/owner/dashboard", {
        token,
      });
      setDashboard(data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to load dashboard"
      );
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function createWaiter() {
    try {
      const token = getOwnerToken();
      if (!token) return;
      await api("/owner/waiters", { method: "POST", token, body: waiterForm });
      setMessage("Waiter berhasil dibuat.");
      setWaiterForm({ fullName: "", email: "", password: "" });
      loadDashboard();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to create waiter"
      );
    }
  }

  async function createMenu() {
    try {
      const token = getOwnerToken();
      if (!token) return;
      await api("/owner/menu-items", {
        method: "POST",
        token,
        body: {
          ...menuForm,
          basePrice: Number(menuForm.basePrice),
        },
      });
      setMessage("Menu berhasil disimpan.");
      setMenuForm({
        slug: "",
        name: "",
        description: "",
        imageUrl: "",
        basePrice: "0",
      });
      loadDashboard();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save menu"
      );
    }
  }

  async function createPromo() {
    try {
      const token = getOwnerToken();
      if (!token) return;
      await api("/owner/promos", {
        method: "POST",
        token,
        body: promoForm,
      });
      setMessage("Promo berhasil disimpan.");
      setPromoForm({
        title: "",
        description: "",
        imageUrl: "",
        startsAt: "",
        endsAt: "",
      });
      loadDashboard();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save promo"
      );
    }
  }

  return (
    <MobileShell>
      <main className="space-y-5 px-4 py-5">
        <div className="rounded-[30px] bg-red-950 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
            Owner control
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            Dashboard owner terhubung ke backend + Prisma.
          </h1>
        </div>

        <section className="grid grid-cols-2 gap-3">
          {metricsMeta.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.key} className="p-4">
                <Icon className="h-5 w-5 text-red-900" />
                <p className="mt-4 text-2xl font-semibold text-stone-900">
                  {dashboard?.metrics?.[metric.key] ?? "-"}
                </p>
                <p className="text-sm text-stone-500">{metric.label}</p>
              </Card>
            );
          })}
        </section>

        <Card className="p-4">
          <p className="font-semibold">Restaurant setup snapshot</p>
          <p className="mt-2 text-sm text-stone-600">
            {dashboard?.restaurant?.name ?? "Belum ada data restoran"}
          </p>
          <p className="text-sm text-stone-500">
            {dashboard?.restaurant?.description ??
              "Owner bisa update dari setup."}
          </p>
        </Card>

        <Card className="space-y-3 p-4">
          <p className="font-semibold">Tambah waiter</p>
          <Input
            placeholder="Nama waiter"
            value={waiterForm.fullName}
            onChange={(e) =>
              setWaiterForm((prev) => ({ ...prev, fullName: e.target.value }))
            }
          />
          <Input
            placeholder="Email waiter"
            value={waiterForm.email}
            onChange={(e) =>
              setWaiterForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <Input
            type="password"
            placeholder="Password waiter"
            value={waiterForm.password}
            onChange={(e) =>
              setWaiterForm((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <Button onClick={createWaiter}>Simpan Waiter</Button>
        </Card>

        <Card className="space-y-3 p-4">
          <p className="font-semibold">Tambah menu</p>
          <Input
            placeholder="Slug menu"
            value={menuForm.slug}
            onChange={(e) =>
              setMenuForm((prev) => ({ ...prev, slug: e.target.value }))
            }
          />
          <Input
            placeholder="Nama menu"
            value={menuForm.name}
            onChange={(e) =>
              setMenuForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Input
            placeholder="Harga dasar"
            value={menuForm.basePrice}
            onChange={(e) =>
              setMenuForm((prev) => ({ ...prev, basePrice: e.target.value }))
            }
          />
          <Input
            placeholder="Image URL Cloudinary"
            value={menuForm.imageUrl}
            onChange={(e) =>
              setMenuForm((prev) => ({ ...prev, imageUrl: e.target.value }))
            }
          />
          <Input
            placeholder="Deskripsi"
            value={menuForm.description}
            onChange={(e) =>
              setMenuForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <Button onClick={createMenu}>Simpan Menu</Button>
        </Card>

        <Card className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-red-900" />
            <p className="font-semibold">Tambah promo timeline</p>
          </div>
          <Input
            placeholder="Judul promo"
            value={promoForm.title}
            onChange={(e) =>
              setPromoForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Input
            placeholder="Deskripsi promo"
            value={promoForm.description}
            onChange={(e) =>
              setPromoForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <Input
            placeholder="Image URL promo"
            value={promoForm.imageUrl}
            onChange={(e) =>
              setPromoForm((prev) => ({ ...prev, imageUrl: e.target.value }))
            }
          />
          <Input
            type="datetime-local"
            value={promoForm.startsAt}
            onChange={(e) =>
              setPromoForm((prev) => ({ ...prev, startsAt: e.target.value }))
            }
          />
          <Input
            type="datetime-local"
            value={promoForm.endsAt}
            onChange={(e) =>
              setPromoForm((prev) => ({ ...prev, endsAt: e.target.value }))
            }
          />
          <Button onClick={createPromo}>Simpan Promo</Button>
        </Card>

        {dashboard?.restaurant?.promos?.length ? (
          <Card className="space-y-3 p-4">
            <p className="font-semibold">Promo aktif</p>
            {dashboard.restaurant.promos.map((promo) => (
              <div key={promo.id} className="rounded-2xl border p-3">
                <p className="font-medium text-stone-900">{promo.title}</p>
                <p className="text-sm text-stone-500">
                  {new Date(promo.startsAt).toLocaleString()} -{" "}
                  {new Date(promo.endsAt).toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  {promo.description}
                </p>
              </div>
            ))}
          </Card>
        ) : null}

        {message ? (
          <p className="rounded-2xl bg-white/80 p-4 text-sm text-stone-700">
            {message}
          </p>
        ) : null}
      </main>
    </MobileShell>
  );
}
