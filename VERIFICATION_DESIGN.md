# F5.1 — Business Verification Design

## F5.1.1 Verification types

| Type | Code | Meaning |
|------|------|---------|
| **Minority-owned** | `minority_owned` | Business identifies as minority-owned; requires admin verification before the public “Verified Minority-Owned” badge is shown. |
| **Howard-affiliated** | `howard_affiliated` | Business identifies as Howard University–affiliated; requires admin verification before the “Howard Affiliated” badge is shown. |

A business may request one or both types in a single **verification request**. The data model stores claims on `business_profiles` (`is_minority_owned`, `is_howard_affiliated`) and admin-confirmed flags (`minority_verified`, `howard_verified`) set only after approval.

## F5.1.2 Required documentation

| Verification type | Required documentation |
|-------------------|------------------------|
| **Minority-owned** | Government-issued ID or certification that supports minority ownership (e.g. MBE certification, state minority business certification, or other documentation accepted by platform policy). Upload: PDF or image (JPEG/PNG), max size enforced by app and storage limits. |
| **Howard-affiliated** | Proof of affiliation with Howard University (e.g. diploma, alumni ID, current student/faculty verification letter, or official HU partnership document). Upload: PDF or image. |

Owners must upload **one document per requested type** before submitting. File names are stored as private object paths in Supabase Storage; URLs are not public.

## F5.1.3 Admin approval workflow

1. **Submit** — Business owner (role `business_owner`) creates a `verification_requests` row in `pending` status with document paths and requested types.
2. **Queue** — Admins (role `admin`) see pending requests on `/admin` (admin dashboard).
3. **Review** — Admin opens request details, downloads documents via authenticated Storage access (RLS allows only owner + admins).
4. **Decide** — Admin sets status to **approved** or **rejected** and may add `admin_notes` / `rejection_reason`.
5. **Apply** — Database trigger updates `business_profiles`: on **approve**, sets `minority_verified` / `howard_verified` for requested types, sets `verification_status = 'verified'`, and the business becomes publicly visible (subject to existing RLS). On **reject**, sets `verification_status = 'rejected'`; owner may submit a new request later (new row), which sets the profile back to `pending`.

**Admin assignment:** Grant admin by inserting `(user_id, 'admin')` into `user_roles` in Supabase (SQL Editor or dashboard). There is no self-service admin signup.

```sql
-- Replace with your auth user UUID from Supabase Authentication
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_UUID'::uuid, 'admin');
```

## Automated tests (F5.1.8–F5.1.10)

After `npm install`, run:

```sh
npm run test
```

- **F5.1.8** — Unit tests assert private storage paths are scoped by user id (`verificationUpload.test.ts`); documents are not served from a public bucket (see migration: `public = false`).
- **F5.1.9** — `verification.test.ts` encodes expected public badge behavior when `verification_status` is `rejected` vs `verified`.
- **F5.1.10** — Badge visibility rules are covered in `verification.test.ts` (`showMinorityOwnedBadge`, `showHowardAffiliatedBadge`, browse filters).
