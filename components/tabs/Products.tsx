"use client";

import { FormEvent, useState } from "react";
import { Product } from "@/lib/types";
import { money } from "@/lib/format";
import { IconEdit, IconTrash } from "../icons";

type Props = {
  products: Product[];
  onAddProduct: (name: string, price: number, unit: string) => void;
  onDeleteProduct: (id: string) => void;
  onUpdatePrice: (id: string, price: number) => void;
};

export default function Products({ products, onAddProduct, onDeleteProduct, onUpdatePrice }: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [armedDeleteId, setArmedDeleteId] = useState<string | null>(null);

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    if (!name.trim() || isNaN(parsedPrice) || parsedPrice < 0) return;
    onAddProduct(name.trim(), parsedPrice, unit.trim());
    setName("");
    setPrice("");
    setUnit("");
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setEditPrice(String(p.price));
    setArmedDeleteId(null);
  }

  function commitEdit(id: string) {
    const val = parseFloat(editPrice);
    if (!isNaN(val) && val >= 0) onUpdatePrice(id, val);
    setEditingId(null);
  }

  function handleDeleteClick(id: string) {
    if (armedDeleteId === id) {
      onDeleteProduct(id);
      setArmedDeleteId(null);
    } else {
      setArmedDeleteId(id);
      setEditingId(null);
    }
  }

  return (
    <main>
      <div className="section-head">
        <div>
          <h1>Products</h1>
          <p>What you sell, and today&apos;s price.</p>
        </div>
      </div>

      <form className="add-form" onSubmit={handleAdd}>
        <div className="row">
          <div className="field" style={{ flex: 1.4 }}>
            <label htmlFor="newPName">Product name</label>
            <input
              id="newPName"
              type="text"
              placeholder="e.g. Wai Wai"
              autoComplete="off"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="newPPrice">Price (Rs.)</label>
            <input
              id="newPPrice"
              className="amount"
              type="number"
              inputMode="decimal"
              min={0}
              step={0.5}
              placeholder="30"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="newPUnit">Unit (optional)</label>
          <input
            id="newPUnit"
            type="text"
            placeholder="e.g. per packet, per plate"
            autoComplete="off"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>
        <button className="btn-primary" type="submit">
          Add product
        </button>
      </form>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="glyph">📦</div>
          <b>No products yet</b>
          <p>Add what you sell above — you can edit prices anytime.</p>
        </div>
      ) : (
        <div>
          {products.map((p) => {
            const isEditing = editingId === p.id;
            const isArmed = armedDeleteId === p.id;
            return (
              <div className="product-row" key={p.id}>
                <div className="pinfo">
                  <div className="n">{p.name}</div>
                  {isEditing ? (
                    <span className="edit-price">
                      <input
                        className="amount"
                        type="number"
                        min={0}
                        step={0.5}
                        value={editPrice}
                        autoFocus
                        onChange={(e) => setEditPrice(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit(p.id);
                        }}
                      />
                    </span>
                  ) : (
                    <div className="m">
                      {p.unit ? `${p.unit} · ` : ""}
                      <span className="p amount">{money(p.price)}</span>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <>
                    <button className="icon-btn" aria-label="Save price" onClick={() => commitEdit(p.id)}>
                      ✓
                    </button>
                    <button className="icon-btn" aria-label="Cancel" onClick={() => setEditingId(null)}>
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <button className="icon-btn" aria-label="Edit price" onClick={() => startEdit(p)}>
                      <IconEdit />
                    </button>
                    <button
                      className={"icon-btn" + (isArmed ? " danger armed" : "")}
                      aria-label={isArmed ? "Confirm delete" : "Delete"}
                      onClick={() => handleDeleteClick(p.id)}
                    >
                      {isArmed ? <span style={{ fontSize: 11, fontWeight: 700 }}>Sure?</span> : <IconTrash />}
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
