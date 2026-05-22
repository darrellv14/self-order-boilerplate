"use client";

const OWNER_TOKEN = "self-order-owner-token";
const CUSTOMER_TOKEN = "self-order-customer-token";
const WAITER_TOKEN = "self-order-waiter-token";
const LAST_ORDER_ID = "self-order-last-order-id";
const CART_KEY = "self-order-cart";

export type CartEntry = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
};

export function setOwnerToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(OWNER_TOKEN, token);
}

export function getOwnerToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(OWNER_TOKEN);
}

export function setCustomerToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOMER_TOKEN, token);
}

export function getCustomerToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CUSTOMER_TOKEN);
}

export function setWaiterToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WAITER_TOKEN, token);
}

export function getWaiterToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(WAITER_TOKEN);
}

export function setLastOrderId(orderId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_ORDER_ID, orderId);
}

export function getLastOrderId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LAST_ORDER_ID);
}

export function getCart(): CartEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_KEY);
  return raw ? (JSON.parse(raw) as CartEntry[]) : [];
}

export function setCart(items: CartEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(entry: CartEntry) {
  const cart = getCart();
  const existing = cart.find(
    (item) => item.menuItemId === entry.menuItemId && item.notes === entry.notes
  );

  if (existing) {
    existing.quantity += entry.quantity;
  } else {
    cart.push(entry);
  }

  setCart(cart);
}

export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}
