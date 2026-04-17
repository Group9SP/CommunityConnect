# Lab 6 — Lovable.dev Feature Extension
## Pull Request: Business Discovery & Listing Enhancement

**Team:** Community Connect  
**Branch:** `lab6-lovable-feature` → `main`  
**Date:** April 2026  

---

## Overview

This PR documents the integration of a Lovable.dev-generated feature extension into the Community Connect codebase. The team selected the **Business Discovery & Listing** feature from the backlog as the target for Lovable.dev enhancement. Lovable was used as an ongoing development platform to extend the static business seed data and refine the business listing flow. The generated output was then carefully reviewed, adapted to match our existing architecture, and merged cleanly without breaking existing behavior.

---

## Step 1 — Feature Selected

**Feature:** Business Discovery & Listing (Browse Page Seed Data + Business Owner Flow)

**Backlog justification:** The browse page relied on only 4 static demo businesses, limiting the ability to demonstrate filtering, search, and community representation. Additionally, the business owner onboarding flow had gaps: hours were not saved on initial creation, and the "My Business" navigation did not reliably route owners to their manage page.

---

## Step 2 — Lovable.dev Extension

The team used Lovable.dev to:
- Generate three new representative Howard-corridor business entries matching the platform's mission
- Refine the business listing data shape to include richer metadata (address, hours, Howard affiliation, minority-owned status)
- Identify UI gaps in the business owner flow during platform review

Lovable.dev generated the following business objects as a `.ts` snippet:

```ts
// Generated via Lovable.dev — Lab 6 Feature Extension
{ id: "biz-005", name: "Bison Books & Brew", category: "Bookstore & Cafe", ... }
{ id: "biz-006", name: "Mecca Tech Repair", category: "Technology & Repair", ... }
{ id: "biz-007", name: "Sankofa Sweets Bakery", category: "Bakery & Desserts", ... }
```

---

## Step 3 — Clean Integration

The Lovable.dev output required the following adaptations before merging:

| Lovable Output | Adaptation Required |
|---|---|
| `imageUrl` field | Renamed to `image` to match `Business` interface |
| `email` field | Removed — not in `Business` interface |
| `tags` field | Removed — not in `Business` interface |
| `hours` as plain string | Kept as string; matches schema |
| `isMinorityOwned` / `isHowardAffiliated` | Already matched interface — no change |

All three entries were inserted into `STATIC_BUSINESSES` in `src/lib/businessLogic.ts` with a clear comment marking the Lovable.dev insertion point. No existing entries were modified.

During integration testing, two additional bugs were discovered and resolved to ensure the feature integrated without breaking existing behavior:

---

## Step 4 — Before / After Summary

### Change 1 — Lovable.dev Business Listings (Core Feature)

**File:** `src/lib/businessLogic.ts`

**Before:**
- 4 static demo businesses in `STATIC_BUSINESSES`
- No Howard-corridor representation beyond 3 existing entries
- Browse page fallback showed limited community variety

**After:**
- 7 static demo businesses (3 new entries added via Lovable.dev)
- 5 Howard-affiliated entries (up from 3)
- All 7 entries are minority-owned
- New entries cover Bookstore & Cafe, Technology & Repair, Bakery & Desserts categories
- Browse fallback now reflects broader community representation

```ts
// ── Lovable.dev Feature Extension (Lab 6) ──────────────────────────────
{ id: "biz-005", name: "Bison Books & Brew", ... isHowardAffiliated: true }
{ id: "biz-006", name: "Mecca Tech Repair", ... isHowardAffiliated: true }
{ id: "biz-007", name: "Sankofa Sweets Bakery", ... isHowardAffiliated: false }
```

---

### Change 2 — Business Owner Navigation Fix (Integration Bug Resolved)

**File:** `src/components/AuthButton.tsx`, `src/integrations/amplify/businessProfiles.ts`

**Before:**
- "My Business" button in the user dropdown always navigated to `/owner/business`
- `MyBusinessHub` had a race condition where the session wasn't fully loaded before the query fired
- `getBusinessProfileForUser` queried by `profileID` which didn't match Amplify's actual `owner` field format (`userId::userId`)
- Result: owners were incorrectly redirected to `/business/add` even when they had an existing listing

**After:**
- "My Business" button directly calls `getBusinessProfileForUser` and navigates to `/business/:id/manage` if a business exists, or `/business/add` if not
- `getBusinessProfileForUser` fetches all businesses and matches by `owner` field using `includes(userId)` to handle Amplify's `userId::userId` format
- Business owners are correctly routed to their manage page on every click

---

### Change 3 — Hours Not Saving on Business Creation (Integration Bug Resolved)

**File:** `src/pages/AddBusiness.tsx`

**Before:**
- Business hours form field existed in the UI and schema
- `hours` was missing from the `payload` object passed to `createBusinessProfile()`
- Hours entered during initial business creation were silently dropped
- Owners had to navigate back to Manage and re-enter hours after creation

**After:**
- `hours: values.hours?.trim() || undefined` added to the create payload
- Hours now persist from the very first submission
- No schema changes required

---

## Files Changed

| File | Type | Description |
|---|---|---|
| `src/lib/businessLogic.ts` | Modified | 3 Lovable.dev business entries added |
| `src/components/AuthButton.tsx` | Modified | My Business button navigates directly to manage page |
| `src/integrations/amplify/businessProfiles.ts` | Modified | Owner lookup uses `includes()` to handle Amplify owner format |
| `src/pages/AddBusiness.tsx` | Modified | Added `hours` to create payload |
| `src/pages/MyBusinessHub.tsx` | Modified | Fixed session loading race condition |

---

## Verification Checklist

- [x] `npm run build` passes with no errors
- [x] Browse page displays Lovable.dev businesses in fallback mode
- [x] Business owner clicking "My Business" is routed to correct manage page
- [x] Business owner clicking "My Business" without a listing is routed to `/business/add`
- [x] Hours entered during creation are saved and shown on manage page
- [x] No existing tests broken
- [x] No architectural regressions — all changes follow existing patterns
- [x] PR reviewed by team before submission

---

## Lovable.dev Integration Process Summary

1. Identified **Business Discovery** as the target feature from the backlog
2. Used Lovable.dev to generate three new business entries representing the Howard University corridor
3. Received generated `.ts` snippet with business objects
4. Reviewed output — identified 3 field mismatches (`imageUrl`, `email`, `tags`) requiring adaptation
5. Inserted entries into `STATIC_BUSINESSES` with clear Lab 6 comment marker
6. Ran integration tests — discovered and resolved 2 existing bugs exposed during testing
7. Verified browse, owner flow, and hours persistence end-to-end
8. Opened PR with this Before/After documentation
