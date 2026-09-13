import { AppData, Sale } from "./types";
import { uid, todayKey } from "./format";

export const STORAGE_KEY = "ppc_v1";

export function seedData(): AppData {
  const products = [
    { id: uid(), name: "Coca-Cola 250ml", price: 45, unit: "per bottle" },
    { id: uid(), name: "Wai Wai Noodles", price: 30, unit: "per packet" },
    { id: uid(), name: "Tea", price: 20, unit: "per cup" },
    { id: uid(), name: "Buff Momo", price: 150, unit: "per plate" },
    { id: uid(), name: "Surya Cigarette", price: 20, unit: "per stick" },
    { id: uid(), name: "Eggs", price: 18, unit: "per piece" },
  ];

  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yKey = todayKey(y);
  const sales: Sale[] = [
    {
      id: uid(),
      dateKey: yKey,
      ts: new Date(y.setHours(11, 20)).getTime(),
      items: [
        { name: "Tea", price: 20, qty: 2, lineTotal: 40 },
        { name: "Wai Wai Noodles", price: 30, qty: 1, lineTotal: 30 },
      ],
      total: 70,
    },
    {
      id: uid(),
      dateKey: yKey,
      ts: new Date(y.setHours(17, 45)).getTime(),
      items: [
        { name: "Buff Momo", price: 150, qty: 1, lineTotal: 150 },
        { name: "Coca-Cola 250ml", price: 45, qty: 2, lineTotal: 90 },
      ],
      total: 240,
    },
  ];

  return {
    products,
    sales,
    onboarded: false,
    user: null,
    theme: "system",
    hintDismissed: false,
    pendingFeedback: [],
  };
}

/** Loads saved state from localStorage, backfilling any fields older
 * saved data might be missing. Returns fresh seed data on first run
 * or if the saved data is unreadable. Must only be called client-side. */
export function loadData(): AppData {
  const base = seedData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.products)) return base;
    return {
      products: parsed.products,
      sales: Array.isArray(parsed.sales) ? parsed.sales : base.sales,
      onboarded: typeof parsed.onboarded === "boolean" ? parsed.onboarded : false,
      user: parsed.user && typeof parsed.user === "object" ? parsed.user : null,
      theme: typeof parsed.theme === "string" ? parsed.theme : "system",
      hintDismissed: typeof parsed.hintDismissed === "boolean" ? parsed.hintDismissed : false,
      pendingFeedback: Array.isArray(parsed.pendingFeedback) ? parsed.pendingFeedback : [],
    };
  } catch {
    return base;
  }
}

export function saveData(data: AppData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable (private mode, quota, etc.) — state still works in-memory
  }
}
