"use client";

import { useState } from "react";
import { FeedbackType, Theme, UserProfile } from "@/lib/types";
import { initials } from "@/lib/format";
import { IconBack } from "./icons";

type Props = {
  user: UserProfile | null;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  onLogout: () => void;
  onBack: () => void;
  onSubmitFeedback: (type: FeedbackType, message: string, rating: number | null) => { synced: boolean };
};

type PanelKey = FeedbackType | null;

function FeedbackPanel({
  type,
  onSubmit,
}: {
  type: FeedbackType;
  onSubmit: (message: string, rating: number | null) => { synced: boolean };
}) {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const placeholder =
    type === "feature"
      ? "What would make this more useful for your shop?"
      : type === "bug"
      ? "What happened, and what did you expect instead?"
      : "How's it working out for your shop so far?";

  function handleSend() {
    if (!message.trim() && type !== "review") {
      setStatus({ ok: false, text: "Add a few words first." });
      return;
    }
    const result = onSubmit(message.trim(), type === "review" ? rating : null);
    setStatus({
      ok: true,
      text: result.synced ? "Thanks — sent!" : "Saved on this device for now.",
    });
    setMessage("");
    setRating(0);
  }

  return (
    <div className="feedback-panel">
      {type === "review" && (
        <div className="star-row">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={n <= rating ? "on" : ""}
              onClick={() => setRating(n)}
            >
              ★
            </button>
          ))}
        </div>
      )}
      <textarea
        placeholder={placeholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="btn-primary" style={{ marginTop: 10 }} type="button" onClick={handleSend}>
        Send
      </button>
      <div className="feedback-msg" style={{ color: status?.ok ? "var(--green)" : "#C1362B" }}>
        {status?.text ?? ""}
      </div>
    </div>
  );
}

export default function Settings({ user, theme, onThemeChange, onLogout, onBack, onSubmitFeedback }: Props) {
  const [openPanel, setOpenPanel] = useState<PanelKey>(null);
  const displayUser = user || { name: "Guest", shopName: "—" };

  return (
    <div className="screen-inner">
      <div className="settings-header">
        <button className="back-btn" aria-label="Back" onClick={onBack}>
          <IconBack />
        </button>
        <h1>Settings</h1>
      </div>

      <div className="settings-group">
        <p className="group-label">Profile</p>
        <div className="settings-card">
          <div className="profile-row">
            <div className="profile-avatar">{initials(displayUser.name)}</div>
            <div className="profile-info">
              <div className="pname">{displayUser.name}</div>
              <div className="pshop">{displayUser.shopName}</div>
            </div>
          </div>
          <button className="settings-row danger" onClick={onLogout}>
            <span className="rtext">
              Log out
              <small>Your products &amp; sales stay on this device</small>
            </span>
          </button>
        </div>
      </div>

      <div className="settings-group">
        <p className="group-label">Appearance</p>
        <div className="settings-card">
          <div className="segmented">
            {(["system", "light", "dark"] as Theme[]).map((t) => (
              <button
                key={t}
                type="button"
                className={theme === t ? "active" : ""}
                onClick={() => onThemeChange(t)}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-group">
        <p className="group-label">Feedback</p>
        <div className="settings-card">
          {([
            ["feature", "Request a feature"],
            ["bug", "Report a bug"],
            ["review", "Leave a review"],
          ] as [FeedbackType, string][]).map(([key, label]) => (
            <div key={key}>
              <button
                className="settings-row"
                type="button"
                onClick={() => setOpenPanel(openPanel === key ? null : key)}
              >
                <span className="rtext">{label}</span>
                <span className="chev">›</span>
              </button>
              {openPanel === key && (
                <FeedbackPanel
                  type={key}
                  onSubmit={(message, rating) => onSubmitFeedback(key, message, rating)}
                />
              )}
            </div>
          ))}
          <div className="about-line">Khaata Calculator · v0.3</div>
        </div>
      </div>
    </div>
  );
}
