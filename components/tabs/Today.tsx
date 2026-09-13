"use client";

import { Sale } from "@/lib/types";
import { money, dateLabel, timeLabel, todayKey } from "@/lib/format";

export default function Today({ sales }: { sales: Sale[] }) {
  const key = todayKey();
  const todays = sales.filter((s) => s.dateKey === key).sort((a, b) => b.ts - a.ts);
  const total = todays.reduce((s, x) => s + x.total, 0);

  return (
    <main>
      <div className="section-head">
        <div>
          <h1>Today&apos;s sales</h1>
          <p>{dateLabel(key)}</p>
        </div>
      </div>
      <div className="big-total">
        <div>
          <div className="label">Total collected today</div>
          <div className="count">{todays.length} {todays.length === 1 ? "sale" : "sales"}</div>
        </div>
        <div className="value amount">{money(total)}</div>
      </div>

      {todays.length === 0 ? (
        <div className="empty-state">
          <div className="glyph">🧾</div>
          <b>No sales yet today</b>
          <p>Tap a product in the Calculator tab to start your first sale.</p>
        </div>
      ) : (
        <div>
          {todays.map((s) => (
            <div className="sale-card" key={s.id}>
              <div className="row1">
                <span className="time">{timeLabel(s.ts)}</span>
                <span className="total amount">{money(s.total)}</span>
              </div>
              <div className="items">{s.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
