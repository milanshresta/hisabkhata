"use client";

import { CurrentSaleLine, Product, Sale, UserProfile } from "@/lib/types";
import { money, todayKey } from "@/lib/format";
import { IconCalculator, IconProducts, IconToday, IconHistory, IconGear } from "./icons";
import Calculator from "./tabs/Calculator";
import Products from "./tabs/Products";
import Today from "./tabs/Today";
import History from "./tabs/History";

export type TabKey = "calc" | "products" | "today" | "history";

type Props = {
  user: UserProfile | null;
  products: Product[];
  sales: Sale[];
  currentSale: CurrentSaleLine[];
  hintDismissed: boolean;
  activeTab: TabKey;
  onChangeTab: (t: TabKey) => void;
  onOpenSettings: () => void;
  onDismissHint: () => void;
  onTapProduct: (id: string) => void;
  onChangeQty: (id: string, delta: number) => void;
  onRemoveLine: (id: string) => void;
  onCompleteSale: () => void;
  onAddProduct: (name: string, price: number, unit: string) => void;
  onDeleteProduct: (id: string) => void;
  onUpdatePrice: (id: string, price: number) => void;
};

const TABS: { key: TabKey; label: string; Icon: (p: { size?: number }) => React.JSX.Element }[] = [
  { key: "calc", label: "Calculator", Icon: IconCalculator },
  { key: "products", label: "Products", Icon: IconProducts },
  { key: "today", label: "Today", Icon: IconToday },
  { key: "history", label: "History", Icon: IconHistory },
];

export default function AppShell(props: Props) {
  const { user, products, sales, currentSale, hintDismissed, activeTab, onChangeTab, onOpenSettings } = props;
  const key = todayKey();
  const todayTotal = sales.filter((s) => s.dateKey === key).reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="app">
      <header className="topbar">
        <div className="shopname">
          Namaste
          <strong>{user?.shopName || "My Shop"}</strong>
        </div>
        <div className="today-pill">
          <span className="label">Today</span>
          <span className="value amount">{money(todayTotal)}</span>
        </div>
        <button className="gear-btn" aria-label="Settings" onClick={onOpenSettings}>
          <IconGear />
        </button>
      </header>

      {activeTab === "calc" && (
        <Calculator
          products={products}
          currentSale={currentSale}
          hintDismissed={hintDismissed}
          onDismissHint={props.onDismissHint}
          onTapProduct={props.onTapProduct}
          onChangeQty={props.onChangeQty}
          onRemoveLine={props.onRemoveLine}
          onCompleteSale={props.onCompleteSale}
        />
      )}
      {activeTab === "products" && (
        <Products
          products={products}
          onAddProduct={props.onAddProduct}
          onDeleteProduct={props.onDeleteProduct}
          onUpdatePrice={props.onUpdatePrice}
        />
      )}
      {activeTab === "today" && <Today sales={sales} />}
      {activeTab === "history" && <History sales={sales} />}

      <nav className="tabbar">
        {TABS.map(({ key: k, label, Icon }) => (
          <button
            key={k}
            className={"tab" + (activeTab === k ? " active" : "")}
            onClick={() => onChangeTab(k)}
          >
            <span className="ic">
              <Icon size={20} />
            </span>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
