export type ThemePreset = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  surfaceAlt: string;
  text: string;
};

export type MenuItem = {
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  promo?: string;
};

export type Promo = {
  name: string;
  window: string;
  highlight: string;
};

export type OrderItem = {
  name: string;
  qty: number;
  price: number;
  notes?: string;
};
