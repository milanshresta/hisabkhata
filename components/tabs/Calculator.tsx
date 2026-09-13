"use client";

import { CurrentSaleLine, Product } from "@/lib/types";
import { money } from "@/lib/format";

type Props = {
  products: Product[];
  currentSale: CurrentSaleLine[];
  hintDismissed: boolean;
  onDismissHint: () => void;
  onTapProduct: (id: string) => void;
  onChangeQty: (id: string, delta: number) => void;
  onRemoveLine: (id: string) => void;
  onCompleteSale: () => void;
};

export default function Calculator({
  products,
  currentSale,
  hintDismissed,
  onDismissHint,
  onTapProduct,
  onChangeQty,
  onRemoveLine,
  onCompleteSale,
}: Props) {
  const grand = currentSale.reduce((s, l) => s + l.price * l.qty, 0);
  const lineFor = (productId: string) => currentSale.find((l) => l.productId === productId);

  return (
    <main>
      <div className="section-head">
        <div>
          <h1>New sale</h1>
          <p>Tap a product, set the quantity, done.</p>
        </div>
      </div>

      {!hintDismissed && (
        <div className="hint">
          <span>👋</span>
          <div>
            <b>Sample products loaded</b>
            We added a few example products from a typical kirana shop so you can try it right
            away — edit prices or remove them anytime in the Products tab.
          </div>
          <button className="x" aria-label="Dismiss" onClick={onDismissHint}>
            ×
          </button>
        </div>
      )}

      {products.length === 0 ? (
        <div className="grid">
          <div className="empty-state" style={{ gridColumn: "1/-1" }}>
            <div className="glyph">🛒</div>
            <b>No products yet</b>
            <p>Add your first product in the Products tab.</p>
          </div>
        </div>
      ) : (
        <div className="grid">
          {products.map((p) => {
            const line = lineFor(p.id);
            const qty = line ? line.qty : 0;
            return (
              <button
                key={p.id}
                className={"tile" + (qty > 0 ? " in-sale" : "")}
                type="button"
                onClick={() => onTapProduct(p.id)}
              >
                <span className="pname">{p.name}</span>
                <span className="pmeta">{p.unit || " "}</span>
                <span className="pprice amount">{money(p.price)}</span>
                {qty > 0 && <span className="qty-badge">×{qty}</span>}
              </button>
            );
          })}
        </div>
      )}

      <div className="sale-sheet">
        <div className="head">
          <h2>Current sale</h2>
          <span className="num" style={{ color: "var(--ink-soft)", fontSize: "12.5px" }}>
            {currentSale.length > 0 ? `${currentSale.length} ${currentSale.length === 1 ? "item" : "items"}` : ""}
          </span>
        </div>
        <div className="lines">
          {currentSale.length === 0 ? (
            <div className="empty-line">Tap a product above to start this sale.</div>
          ) : (
            currentSale.map((l) => (
              <div className="line" key={l.productId}>
                <div className="lname">
                  {l.name}
                  <span className="sub amount">{money(l.price)} each</span>
                </div>
                <div className="stepper">
                  <button type="button" onClick={() => onChangeQty(l.productId, -1)}>
                    −
                  </button>
                  <span className="qv num">{l.qty}</span>
                  <button type="button" onClick={() => onChangeQty(l.productId, 1)}>
                    +
                  </button>
                </div>
                <span className="ltotal amount">{money(l.price * l.qty)}</span>
                <button
                  className="remove"
                  type="button"
                  aria-label="Remove"
                  onClick={() => onRemoveLine(l.productId)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
        <div className="sale-total">
          <span className="label">Grand total</span>
          <span className="value amount">{money(grand)}</span>
        </div>
        <button className="btn-complete" disabled={currentSale.length === 0} onClick={onCompleteSale}>
          Complete sale
        </button>
      </div>
    </main>
  );
}
