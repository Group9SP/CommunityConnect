-- F4: Business listings — logo, draft/published visibility, soft delete, public browse RLS, storage.

-- 1. Columns on business_profiles
ALTER TABLE public.business_profiles
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS listing_visibility TEXT NOT NULL DEFAULT 'published'
    CHECK (listing_visibility IN ('draft', 'published')),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- New listings default to draft; existing rows keep published so verified listings stay discoverable.
ALTER TABLE public.business_profiles
  ALTER COLUMN listing_visibility SET DEFAULT 'draft';

-- 2. Replace broad verified-only policy with verified + published + not soft-deleted (authenticated).
DROP POLICY IF EXISTS "Anyone can view verified business profiles" ON public.business_profiles;

CREATE POLICY "Discover verified published listings"
  ON public.business_profiles FOR SELECT
  TO authenticated
  USING (
    verification_status = 'verified'
    AND listing_visibility = 'published'
    AND deleted_at IS NULL
  );

-- Anonymous visitors can browse the same public catalog (browse page without sign-in).
CREATE POLICY "Anon discover verified published listings"
  ON public.business_profiles FOR SELECT
  TO anon
  USING (
    verification_status = 'verified'
    AND listing_visibility = 'published'
    AND deleted_at IS NULL
  );

-- 3. Storage bucket for business images (public read; writes scoped to owner folder = auth.uid())
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-images', 'business-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read business images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload to own business-images folder" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update own business-images objects" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete own business-images objects" ON storage.objects;

CREATE POLICY "Public read business images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'business-images');

CREATE POLICY "Authenticated upload to own business-images folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'business-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Authenticated update own business-images objects"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'business-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Authenticated delete own business-images objects"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'business-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
