"use client";

import { FormEvent, useState } from "react";
import { UserProfile } from "@/lib/types";
import { IconCalculator } from "./icons";

export default function Signin({ onSignIn }: { onSignIn: (user: UserProfile) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedShop = shopName.trim();
    if (!trimmedName || !trimmedShop) return;
    onSignIn({ name: trimmedName, shopName: trimmedShop });
  }

  return (
    <div className="screen-inner">
      <div className="signin-wrap">
        <div className="signin-mark">
          <IconCalculator size={30} />
        </div>
        <h1>Welcome to Khaata</h1>
        <p>Sign in to keep your shop&apos;s products and sales saved on this phone.</p>

        <button className="btn-google" type="button" onClick={() => setShowForm(true)}>
          <span className="google-g">G</span> Continue with Google
        </button>
        <p className="signin-note">
          This is a local stand-in for Google sign-in — your name just labels your data on this
          device, nothing is sent anywhere. Wiring up real Google OAuth is a fast-follow once
          there&apos;s a backend to support it.
        </p>

        {showForm && (
          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="siName">Your name</label>
              <input
                id="siName"
                type="text"
                placeholder="e.g. Milan Shrestha"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="siShop">Shop name</label>
              <input
                id="siShop"
                type="text"
                placeholder="e.g. Shrestha Kirana Pasal"
                autoComplete="off"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />
            </div>
            <button className="btn-primary" type="submit">
              Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
