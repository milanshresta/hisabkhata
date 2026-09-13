"use client";

import { useState } from "react";
import { IconCalculator, IconHistory } from "./icons";

function WifiOffIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
      <path d="M3 12a15 15 0 0 1 18 0" />
      <path d="M6.5 15.5a10 10 0 0 1 11 0" />
      <path d="M10 19a5 5 0 0 1 4 0" />
      <circle cx="12" cy="20.5" r="1" />
    </svg>
  );
}

const SLIDES = [
  {
    icon: <IconCalculator size={34} />,
    title: "Skip the calculator",
    body: "Add your products once. Tap a name, set the quantity, and the total's ready — faster than typing it into a calculator.",
  },
  {
    icon: <IconHistory size={34} />,
    title: "No more paper bills",
    body: "Every completed sale is logged automatically. See exactly what you sold today — no notebook, no redoing the math by hand.",
  },
  {
    icon: <WifiOffIcon />,
    title: "Works with no internet",
    body: "Everything stays on your phone, so it works even with no signal at the counter. Nothing to set up, nothing to sync.",
  },
];

export default function Onboarding({ onFinish }: { onFinish: () => void }) {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;

  return (
    <div className="screen-inner">
      <button className="ob-skip" type="button" onClick={onFinish}>
        Skip
      </button>

      <div className="ob-slides">
        {SLIDES.map((s, i) => (
          <div key={s.title} className={"ob-slide" + (i === index ? " active" : "")}>
            <div className="ob-icon">{s.icon}</div>
            <h1>{s.title}</h1>
            <p>{s.body}</p>
          </div>
        ))}
      </div>

      <div className="ob-foot">
        <div className="ob-dots">
          {SLIDES.map((s, i) => (
            <span key={s.title} className={"ob-dot" + (i === index ? " active" : "")} />
          ))}
        </div>
        <button
          className="btn-primary"
          type="button"
          onClick={() => (isLast ? onFinish() : setIndex((i) => i + 1))}
        >
          {isLast ? "Get started" : "Next"}
        </button>
      </div>
    </div>
  );
}
