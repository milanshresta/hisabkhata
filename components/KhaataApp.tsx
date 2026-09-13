"use client";

import { useEffect, useState } from "react";
import { AppData, CurrentSaleLine, FeedbackType, Theme, UserProfile } from "@/lib/types";
import { loadData, saveData } from "@/lib/storage";
import { uid, todayKey } from "@/lib/format";
import Onboarding from "./Onboarding";
import Signin from "./Signin";
import Settings from "./Settings";
import AppShell, { TabKey } from "./AppShell";

type Screen = "onboarding" | "signin" | "app" | "settings";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") root.setAttribute("data-theme", "light");
  else if (theme === "dark") root.setAttribute("data-theme", "dark");
  else root.removeAttribute("data-theme");
}

export default function KhaataApp() {
  // `data` starts null so the very first client render (and the server
  // render it must match) never guesses at localStorage — real values
  // load in the effect below, right after mount.
  const [data, setData] = useState<AppData | null>(null);
  const [screen, setScreen] = useState<Screen>("onboarding");
  const [activeTab, setActiveTab] = useState<TabKey>("calc");
  const [currentSale, setCurrentSale] = useState<CurrentSaleLine[]>([]);

  useEffect(() => {
    const loaded = loadData();
    setData(loaded);
    setScreen(!loaded.onboarded ? "onboarding" : !loaded.user ? "signin" : "app");
  }, []);

  useEffect(() => {
    if (data) applyTheme(data.theme);
  }, [data?.theme]);

  useEffect(() => {
    if (data) saveData(data);
  }, [data]);

  if (!data) {
    // Brief, unstyled instant before client data loads — effectively invisible in practice.
    return <div style={{ minHeight: "100dvh", background: "var(--paper)" }} />;
  }

  // Narrowed, stable alias: everything below only ever runs while `data`
  // is loaded, but TypeScript can't carry that narrowing into closures
  // defined further down, so read through this non-null binding instead.
  const appData = data;

  function update(patch: Partial<AppData>) {
    setData((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function finishOnboarding() {
    update({ onboarded: true });
    setScreen(appData.user ? "app" : "signin");
  }

  function handleSignIn(user: UserProfile) {
    update({ user, onboarded: true });
    setScreen("app");
  }

  function handleLogout() {
    update({ user: null });
    setScreen("signin");
  }

  function dismissHint() {
    update({ hintDismissed: true });
  }

  // ---- product & sale actions ----
  function tapProduct(id: string) {
    const p = appData.products.find((x) => x.id === id);
    if (!p) return;
    setCurrentSale((prev) => {
      const existing = prev.find((l) => l.productId === id);
      if (existing) {
        return prev.map((l) => (l.productId === id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { productId: id, name: p.name, price: p.price, qty: 1 }];
    });
  }

  function changeQty(id: string, delta: number) {
    setCurrentSale((prev) =>
      prev
        .map((l) => (l.productId === id ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0)
    );
  }

  function removeLine(id: string) {
    setCurrentSale((prev) => prev.filter((l) => l.productId !== id));
  }

  function completeSale() {
    if (currentSale.length === 0) return;
    const grand = currentSale.reduce((s, l) => s + l.price * l.qty, 0);
    const now = new Date();
    const sale = {
      id: uid(),
      dateKey: todayKey(now),
      ts: now.getTime(),
      items: currentSale.map((l) => ({
        name: l.name,
        price: l.price,
        qty: l.qty,
        lineTotal: l.price * l.qty,
      })),
      total: grand,
    };
    update({ sales: [...appData.sales, sale] });
    setCurrentSale([]);
  }

  function addProduct(name: string, price: number, unit: string) {
    update({ products: [...appData.products, { id: uid(), name, price, unit }] });
  }

  function deleteProduct(id: string) {
    update({ products: appData.products.filter((p) => p.id !== id) });
    setCurrentSale((prev) => prev.filter((l) => l.productId !== id));
  }

  function updatePrice(id: string, price: number) {
    update({ products: appData.products.map((p) => (p.id === id ? { ...p, price } : p)) });
  }

  // Feedback currently has nowhere to sync to outside the Claude Artifact
  // prototype this app started as — it saves on-device until a real
  // `/api/feedback` route (or similar) exists to send it somewhere durable.
  function submitFeedback(type: FeedbackType, message: string, rating: number | null) {
    const entry = {
      type,
      message,
      rating,
      name: appData.user?.name ?? null,
      shopName: appData.user?.shopName ?? null,
      submittedAt: new Date().toISOString(),
    };
    update({ pendingFeedback: [...appData.pendingFeedback, entry] });
    return { synced: false };
  }

  if (screen === "onboarding") return <Onboarding onFinish={finishOnboarding} />;
  if (screen === "signin") return <Signin onSignIn={handleSignIn} />;
  if (screen === "settings") {
    return (
      <Settings
        user={appData.user}
        theme={appData.theme}
        onThemeChange={(theme) => update({ theme })}
        onLogout={handleLogout}
        onBack={() => setScreen("app")}
        onSubmitFeedback={submitFeedback}
      />
    );
  }

  return (
    <AppShell
      user={appData.user}
      products={appData.products}
      sales={appData.sales}
      currentSale={currentSale}
      hintDismissed={appData.hintDismissed}
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      onOpenSettings={() => setScreen("settings")}
      onDismissHint={dismissHint}
      onTapProduct={tapProduct}
      onChangeQty={changeQty}
      onRemoveLine={removeLine}
      onCompleteSale={completeSale}
      onAddProduct={addProduct}
      onDeleteProduct={deleteProduct}
      onUpdatePrice={updatePrice}
    />
  );
}
