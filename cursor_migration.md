# CommunityConnect — Lovable Migration Guide & Codebase Overview

This document provides an overview of the CommunityConnect (Minority X-Change) codebase and step-by-step instructions for running it as a standalone local development project after disconnecting from Lovable.dev.

---

## Codebase Overview

### What This App Does

**Minority X-Change** is a marketplace platform for discovering and supporting verified minority-owned and Howard University–affiliated businesses. Users can browse businesses, view details, leave reviews, and business owners can register and manage their listings.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Build | Vite 5 |
| Language | TypeScript |
| UI | React 18 |
| Components | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS |
| Backend | Supabase (PostgreSQL, Auth) |
| State | React Query (TanStack Query) |
| Routing | React Router v6 |

### Project Structure

```
CommunityConnect/
├── src/
│   ├── App.tsx                 # App shell, routes, providers
│   ├── main.tsx                # Entry point
│   ├── vite-env.d.ts           # Vite env typings
│   ├── assets/                 # Images, static files
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components (40+ components)
│   │   ├── AuthButton.tsx      # Auth state & login/logout button
│   │   ├── BusinessCard.tsx    # Business listing card
│   │   ├── FilterSidebar.tsx   # Browse filters
│   │   └── ReviewCard.tsx      # Review display
│   ├── hooks/
│   │   ├── use-mobile.tsx      # Mobile detection
│   │   └── use-toast.ts        # Toast notifications
│   ├── integrations/supabase/
│   │   ├── client.ts           # Supabase client (uses env vars)
│   │   └── types.ts            # Database types (currently stub)
│   ├── lib/utils.ts            # cn() and utilities
│   ├── pages/
│   │   ├── Index.tsx           # Landing page
│   │   ├── Browse.tsx          # Business listing with filters
│   │   ├── BusinessDetail.tsx  # Single business view
│   │   ├── Auth.tsx            # Login/signup/verification
│   │   └── NotFound.tsx        # 404 page
│   └── types/
│       └── business-filters.ts
├── supabase/
│   ├── config.toml             # Supabase local config
│   └── migrations/             # SQL migrations
├── public/                     # Static assets
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json
```

### Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Index | Landing page with hero, search, featured businesses |
| `/browse` | Browse | Business listing with filters |
| `/business/:id` | BusinessDetail | Single business detail and reviews |
| `/auth` | Auth | Login, signup, email verification |
| `*` | NotFound | 404 fallback |

### Data Model (Supabase)

- **profiles** — User profiles (full_name, avatar_url)
- **user_roles** — Role linking (business_owner, customer)
- **business_profiles** — Business info (name, category, description, verification_status)
- **reviews** — Reviews for businesses (if defined in later migrations)
- RLS policies restrict access by role and ownership

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/public key |

---

## Step-by-Step: Disconnect Lovable & Run Locally

### Step 1: Remove Lovable Dependencies

**vite.config.ts**

- Remove the `lovable-tagger` import and plugin.
- Use a simple plugins array: `[react()]`.

**package.json**

- Remove `lovable-tagger` from `devDependencies`.

### Step 2: Update Meta Tags (index.html)

- Remove `og:image` and `twitter:image` that point to lovable.dev.
- Optionally add your own social preview images later.

### Step 3: Replace README

- Replace Lovable-focused README with project-specific setup instructions.
- Document local dev commands, env vars, and scripts.

### Step 4: Install Dependencies & Run

```sh
cd /Users/khandieanijah-obi/Documents/SeniorProject/CommunityConnect
npm install
npm run dev
```

### Step 5: Configure Environment

Ensure `.env` exists with:

```
VITE_SUPABASE_URL=https://gfofximpghlnjixdffkx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

---

## What Was Changed (Migration Summary)

| File | Change |
|------|--------|
| `vite.config.ts` | Removed `lovable-tagger` import and `componentTagger()` plugin |
| `package.json` | Removed `lovable-tagger` from devDependencies |
| `index.html` | Removed Lovable og/twitter meta tags |
| `README.md` | Replaced with project-specific local dev docs |

---

## Running the App

```sh
# Development
npm run dev          # http://localhost:8080

# Production build
npm run build
npm run preview      # Preview production build

# Linting
npm run lint
```

---

## Post-Migration Recommendations

1. **Regenerate Supabase types** — `src/integrations/supabase/types.ts` has stub types (`never`). Run `supabase gen types typescript` to sync with your schema.
2. **Add `.env.example`** — For new developers, include a template with variable names (no real keys).
3. **Replace social images** — Add your own `og:image` and `twitter:image` URLs in `index.html`.
4. **Review `DEBT_AND_RISK.md`** — Contains notes on tech debt and platform lock-in; useful for future cleanup.

---

## Notes

- The app is a standard Vite + React + Supabase project; no Lovable-specific logic remains.
- Supabase handles auth and database; ensure your project URL and anon key are correct in `.env`.
- Port is `8080` as set in `vite.config.ts`.
