"use client";

import { useState } from "react";
import { Sale } from "@/lib/types";
import { money, dateLabel, timeLabel, todayKey } from "@/lib/format";

export default function History({ sales }: { sales: Sale[] }) {
  const [openDay, setOpenDay] = useState<string | null>(null);
  const key = todayKey();

  const byDate: Record<string, Sale[]> = {};
  for (const s of sales) {
    if (s.dateKey === key) continue; // today lives in its own tab
    (byDate[s.dateKey] = byDate[s.dateKey] || []).push(s);
  }
  const keys = Object.keys(byDate).sort().reverse();

  return (
    <main>
      <div className="section-head">
        <div>
          <h1>History</h1>
          <p>Past days, at a glance.</p>
        </div>
      </div>

      {keys.length === 0 ? (
        <div className="empty-state">
          <div className="glyph">📅</div>
          <b>Nothing here yet</b>
          <p>Once a day ends, it will show up here with its total.</p>
        </div>
      ) : (
        <div>
          {keys.map((k) => {
            const dayTotal = byDate[k].reduce((s, x) => s + x.total, 0);
            const isOpen = openDay === k;
            return (
              <div className="day-card" key={k}>
                <div className="day-head" onClick={() => setOpenDay(isOpen ? null : k)}>
                  <span className="d">{dateLabel(k)}</span>
                  <span className="meta">
                    <span className="t amount">{money(dayTotal)}</span> · {byDate[k].length} sales
                  </span>
                </div>
                <div className={"day-body" + (isOpen ? " open" : "")}>
                  {byDate[k]
                    .slice()
                    .sort((a, b) => b.ts - a.ts)
                    .map((s) => (
                      <div className="sale-card" key={s.id}>
                        <div className="row1">
                          <span className="time">{timeLabel(s.ts)}</span>
                          <span className="total amount">{money(s.total)}</span>
                        </div>
                        <div className="items">{s.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
