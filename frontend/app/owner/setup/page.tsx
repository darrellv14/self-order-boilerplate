"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { ImagePlus, Palette, Store } from "lucide-react";
import { useRouter } from "next/navigation";

import { MobileShell } from "@/components/layout/mobile-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { themePresets } from "@/data/mock";
import { api } from "@/lib/api";
import { getOwnerToken, setOwnerToken } from "@/lib/storage";

export default function OwnerSetupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"register" | "login">("register");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [tokenReady] = useState(
    () => typeof window !== "undefined" && !!getOwnerToken()
  );
  const [form, setForm] = useState({
    restaurantName: "Golden Dragon",
    restaurantSlug: "golden-dragon",
    ownerName: "Golden Dragon Owner",
    ownerEmail: "owner@goldendragon.local",
    password: "owner123",
  });

  const [themeForm, setThemeForm] = useState({
    primaryColor: "#8f1d21",
    secondaryColor: "#d4a63d",
    accentColor: "#f3d37a",
    bgColor: "#f8f3eb",
    textColor: "#221815",
  });

  const previewStyle = useMemo(
    () => ({
      background: `linear-gradient(135deg, ${themeForm.primaryColor}, ${themeForm.secondaryColor})`,
    }),
    [themeForm]
  );

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAuthSubmit() {
    try {
      setLoading(true);
      setMessage("");

      const endpoint =
        mode === "register"
          ? "/public/auth/owner/register"
          : "/public/auth/login";
      const payload =
        mode === "register"
          ? form
          : {
              email: form.ownerEmail,
              password: form.password,
            };

      const response = await api<{ token: string }>(endpoint, {
        method: "POST",
        body: payload,
      });

      setOwnerToken(response.token);
      setMessage(
        "Owner authenticated. Anda bisa lanjut upload asset dan masuk dashboard."
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleThemeSave() {
    try {
      const token = getOwnerToken();
      if (!token) {
        setMessage("Login owner dulu sebelum menyimpan theme.");
        return;
      }

      await api("/owner/settings", {
        method: "PATCH",
        token,
        body: themeForm,
      });

      setMessage("Theme restoran berhasil disimpan.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save theme"
      );
    }
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    folder: string,
    targetField: "logoUrl" | "heroImageUrl"
  ) {
    try {
      const token = getOwnerToken();
      const file = event.target.files?.[0];
      if (!token || !file) {
        return;
      }

      setUploading(true);
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);

      const upload = await api<{ optimizedUrl: string }>("/owner/upload", {
        method: "POST",
        token,
        body,
        isFormData: true,
      });

      await api("/owner/settings", {
        method: "PATCH",
        token,
        body: {
          [targetField]: upload.optimizedUrl,
        },
      });

      setMessage(
        `${targetField === "logoUrl" ? "Logo" : "Hero image"} berhasil diupload.`
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <MobileShell>
      <main className="space-y-5 px-4 py-5">
        <div className="rounded-[30px] bg-red-950 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
            Owner onboarding
          </p>
          <h1 className="mt-3 font-serif text-4xl">
            Setup awal boilerplate restoran Anda.
          </h1>
          <p className="mt-3 text-sm text-red-50/90">
            Owner bisa registrasi, login, upload asset ke Cloudinary, dan simpan
            warna brand sejak awal.
          </p>
        </div>

        <Card className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <Store className="h-5 w-5 text-red-900" />
            <p className="font-semibold">
              {mode === "register"
                ? "Register owner + restaurant"
                : "Login owner"}
            </p>
          </div>
          {mode === "register" ? (
            <>
              <Input
                placeholder="Nama restoran"
                value={form.restaurantName}
                onChange={(e) => updateField("restaurantName", e.target.value)}
              />
              <Input
                placeholder="Slug restoran"
                value={form.restaurantSlug}
                onChange={(e) => updateField("restaurantSlug", e.target.value)}
              />
              <Input
                placeholder="Nama owner"
                value={form.ownerName}
                onChange={(e) => updateField("ownerName", e.target.value)}
              />
            </>
          ) : null}
          <Input
            placeholder="Email owner"
            value={form.ownerEmail}
            onChange={(e) => updateField("ownerEmail", e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
          />
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={handleAuthSubmit}
              disabled={loading}
            >
              {loading
                ? "Memproses..."
                : mode === "register"
                  ? "Register Owner"
                  : "Login Owner"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                setMode((prev) => (prev === "register" ? "login" : "register"))
              }
            >
              {mode === "register" ? "Punya akun?" : "Buat akun"}
            </Button>
          </div>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => router.push("/owner/dashboard")}
            disabled={!tokenReady && !getOwnerToken()}
          >
            Buka Dashboard Owner
          </Button>
        </Card>

        <Card className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <ImagePlus className="h-5 w-5 text-red-900" />
            <p className="font-semibold">Upload asset owner via Cloudinary</p>
          </div>
          <label className="block text-sm font-medium text-stone-700">
            Upload logo
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "logos", "logoUrl")}
            disabled={uploading}
          />
          <label className="block text-sm font-medium text-stone-700">
            Upload hero image
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "hero", "heroImageUrl")}
            disabled={uploading}
          />
          <p className="text-xs text-stone-500">
            Asset diupload lewat backend dan dikembalikan sebagai URL Cloudinary
            yang sudah `q_auto` dan `f_auto`.
          </p>
        </Card>

        <Card className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-red-900" />
            <p className="font-semibold">Theme preset dan custom color</p>
          </div>
          <div className="grid gap-3">
            {themePresets.map((preset) => (
              <button
                key={preset.name}
                className="rounded-[22px] border p-4 text-left"
                onClick={() =>
                  setThemeForm({
                    primaryColor: preset.primary,
                    secondaryColor: preset.secondary,
                    accentColor: preset.accent,
                    bgColor: preset.surface,
                    textColor: preset.text,
                  })
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{preset.name}</p>
                    <p className="text-sm text-stone-500">
                      Preset warna default owner.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <span
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <span
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="color"
              value={themeForm.primaryColor}
              onChange={(e) =>
                setThemeForm((prev) => ({
                  ...prev,
                  primaryColor: e.target.value,
                }))
              }
            />
            <Input
              type="color"
              value={themeForm.secondaryColor}
              onChange={(e) =>
                setThemeForm((prev) => ({
                  ...prev,
                  secondaryColor: e.target.value,
                }))
              }
            />
            <Input
              type="color"
              value={themeForm.accentColor}
              onChange={(e) =>
                setThemeForm((prev) => ({
                  ...prev,
                  accentColor: e.target.value,
                }))
              }
            />
            <Input
              type="color"
              value={themeForm.bgColor}
              onChange={(e) =>
                setThemeForm((prev) => ({ ...prev, bgColor: e.target.value }))
              }
            />
          </div>
          <div className="rounded-[24px] p-5 text-white" style={previewStyle}>
            <p className="text-xs uppercase tracking-[0.2em]">
              Live Theme Preview
            </p>
            <p className="mt-2 text-2xl font-semibold">
              Golden Dragon Experience
            </p>
          </div>
          <Button size="lg" className="w-full" onClick={handleThemeSave}>
            Save Theme Settings
          </Button>
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
