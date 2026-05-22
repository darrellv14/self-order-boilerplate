import { MenuItem, OrderItem, Promo, ThemePreset } from "@/types/domain";

export const restaurantName = "Golden Dragon";
export const activeTable = 12;

export const themePresets: ThemePreset[] = [
  {
    name: "Imperial Red",
    primary: "#8f1d21",
    secondary: "#d4a63d",
    accent: "#f3d37a",
    surface: "#f8f3eb",
    surfaceAlt: "#fffdf9",
    text: "#221815",
  },
  {
    name: "Jade Gold",
    primary: "#255648",
    secondary: "#d1a239",
    accent: "#ebc96d",
    surface: "#f5f0e8",
    surfaceAlt: "#fffdfa",
    text: "#16211d",
  },
  {
    name: "Night Market",
    primary: "#1f2937",
    secondary: "#f59e0b",
    accent: "#fcd34d",
    surface: "#f5f5f4",
    surfaceAlt: "#ffffff",
    text: "#111827",
  },
];

export const promos: Promo[] = [
  {
    name: "Chef's Dimsum Set",
    window: "16:00 - 18:00",
    highlight: "Diskon 20% untuk dimsum dan teh premium.",
  },
  {
    name: "Seafood Friday",
    window: "Jumat 17:00 - 21:00",
    highlight: "Buy 2 seafood mains, free lychee tea.",
  },
];

export const menuItems: MenuItem[] = [
  {
    slug: "hakau-shrimp",
    name: "Hakau Shrimp",
    description: "Crystal dumpling isi udang utuh dengan chili oil opsional.",
    category: "Dimsum",
    price: 48000,
    image:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80",
    promo: "Best Seller",
  },
  {
    slug: "mapo-tofu",
    name: "Sichuan Mapo Tofu",
    description: "Silken tofu dengan beef mince dan lada Sichuan.",
    category: "Mains",
    price: 72000,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "peking-duck",
    name: "Peking Duck",
    description: "Roasted duck premium dengan pancake, cucumber, hoisin.",
    category: "Signature",
    price: 198000,
    image:
      "https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?auto=format&fit=crop&w=900&q=80",
    promo: "Weekend Promo",
  },
  {
    slug: "jasmine-tea",
    name: "Jasmine Tea Pot",
    description: "Teh jasmine hangat untuk sharing 2-3 orang.",
    category: "Drinks",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80",
  },
];

export const cartItems: OrderItem[] = [
  { name: "Hakau Shrimp", qty: 2, price: 48000, notes: "No bamboo shoots" },
  { name: "Sichuan Mapo Tofu", qty: 1, price: 72000 },
  { name: "Jasmine Tea Pot", qty: 1, price: 28000 },
];
