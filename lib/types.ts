export type Product = {
  id: string;
  name: string;
  price: number;
  unit?: string;
};

export type SaleLineItem = {
  name: string;
  price: number;
  qty: number;
  lineTotal: number;
};

export type Sale = {
  id: string;
  dateKey: string; // "YYYY-MM-DD"
  ts: number; // epoch ms
  items: SaleLineItem[];
  total: number;
};

export type UserProfile = {
  name: string;
  shopName: string;
};

export type Theme = "system" | "light" | "dark";

export type FeedbackType = "feature" | "bug" | "review";

export type FeedbackEntry = {
  type: FeedbackType;
  message: string;
  rating: number | null;
  name: string | null;
  shopName: string | null;
  submittedAt: string; // ISO
};

export type CurrentSaleLine = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export type AppData = {
  products: Product[];
  sales: Sale[];
  onboarded: boolean;
  user: UserProfile | null;
  theme: Theme;
  hintDismissed: boolean;
  pendingFeedback: FeedbackEntry[];
};
