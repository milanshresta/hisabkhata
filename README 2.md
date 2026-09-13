# Khaata Calculator

A mobile-first sale calculator and daily sales log for small shop owners — tap products, get a total, no calculator or notebook needed. This is a Next.js (App Router) rebuild of the original single-file prototype.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploying to Vercel

```bash
npm i -g vercel   # if you don't have it yet
vercel login
vercel --prod
```

No environment variables or backend are required — it's a static, client-only app.

## How it's built

- **Next.js App Router + TypeScript**, one client component tree (`components/KhaataApp.tsx`) holding all app state.
- **No backend yet.** Every shop's products and sales live only in that browser's `localStorage` (`lib/storage.ts`) — nothing syncs between devices, and nothing is sent anywhere.
- **Sign-in is a local placeholder.** The "Continue with Google" button (`components/Signin.tsx`) just asks for a name and shop name to label the on-device data — there's no real OAuth wired up. Real Google sign-in needs a backend to hold sessions and accounts; that hasn't been built yet.
- **Feedback (feature requests / bug reports / reviews)** in Settings currently just saves into the same local `pendingFeedback` array — see the comment above `submitFeedback` in `KhaataApp.tsx`. It never reaches you. Wiring up a real destination (e.g. an API route that writes to a database, or forwards to email/Slack) is the natural next step once you want to actually collect this from real users.
- **Fonts** (Sora, IBM Plex Sans, IBM Plex Mono) load via `next/font/google`, self-hosted and optimized by Next.js at build time.

## What's next for a real multi-shop product

This still matches the "keep everyone's data on their own phone" design from the prototype phase. The moment more than one device per shop, or any cross-device backup, matters, the things to add are: a real backend + database (so a shop's data isn't lost if they lose their phone), real accounts (replacing the placeholder sign-in), and a way for feedback to actually reach you.
