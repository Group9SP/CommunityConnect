-- F5.1.4: Verification requests, storage, RLS, admin workflow triggers
-- Requires: add_admin_app_role migration, business_profiles, has_role, update_updated_at

-- 1) Admin-confirmed badge flags (distinct from owner claims is_minority_owned / is_howard_affiliated)
ALTER TABLE public.business_profiles
  ADD COLUMN IF NOT EXISTS minority_verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS howard_verified BOOLEAN NOT NULL DEFAULT false;

-- 3) verification_requests
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_profile_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requests_minority_owned BOOLEAN NOT NULL DEFAULT false,
  requests_howard_affiliated BOOLEAN NOT NULL DEFAULT false,
  minority_document_path TEXT,
  howard_document_path TEXT,
  admin_notes TEXT,
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT verification_requests_at_least_one_type CHECK (
    requests_minority_owned OR requests_howard_affiliated
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS verification_requests_one_pending_per_business
  ON public.verification_requests (business_profile_id)
  WHERE status = 'pending';

ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Submitters see own rows; admins see all
CREATE POLICY "Submitters can view own verification requests"
  ON public.verification_requests FOR SELECT
  TO authenticated
  USING (submitted_by = auth.uid());

CREATE POLICY "Admins can view all verification requests"
  ON public.verification_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Business owners can submit verification requests"
  ON public.verification_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = submitted_by
    AND public.has_role(auth.uid(), 'business_owner')
    AND EXISTS (
      SELECT 1
      FROM public.business_profiles bp
      WHERE bp.id = business_profile_id
        AND bp.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update verification requests"
  ON public.verification_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_verification_requests_updated_at
  BEFORE UPDATE ON public.verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- 4) Apply admin decision to business_profiles
CREATE OR REPLACE FUNCTION public.apply_verification_request_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status = 'pending' AND NEW.status = 'approved' THEN
    UPDATE public.business_profiles bp
    SET
      minority_verified = CASE
        WHEN NEW.requests_minority_owned THEN TRUE
        ELSE bp.minority_verified
      END,
      howard_verified = CASE
        WHEN NEW.requests_howard_affiliated THEN TRUE
        ELSE bp.howard_verified
      END,
      verification_status = 'verified',
      updated_at = now()
    WHERE bp.id = NEW.business_profile_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'pending' AND NEW.status = 'rejected' THEN
    UPDATE public.business_profiles
    SET
      verification_status = 'rejected',
      updated_at = now()
    WHERE id = NEW.business_profile_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_apply_verification_request_status
  AFTER UPDATE OF status ON public.verification_requests
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.apply_verification_request_status();

-- 5) New submission sets profile back to pending (e.g. after rejection)
CREATE OR REPLACE FUNCTION public.on_verification_request_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Resubmission after rejection: profile returns to pending review (does not unpublish verified listings)
  IF NEW.status = 'pending' THEN
    UPDATE public.business_profiles
    SET
      verification_status = 'pending',
      updated_at = now()
    WHERE id = NEW.business_profile_id
      AND verification_status = 'rejected';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_on_verification_request_insert
  AFTER INSERT ON public.verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.on_verification_request_insert();

-- 6) Public (anon) can browse verified listings — required for unauthenticated Browse
CREATE POLICY "Anon can view verified business profiles"
  ON public.business_profiles FOR SELECT
  TO anon
  USING (verification_status = 'verified');

-- Admins can read any business profile (moderation / joins from verification_requests)
CREATE POLICY "Admins can view all business profiles"
  ON public.business_profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 7) Private verification documents bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-documents', 'verification-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Path convention: first folder segment = auth.uid()
CREATE POLICY "verification_docs_insert_own_folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'verification-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "verification_docs_select_own_folder"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'verification-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "verification_docs_select_admin"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'verification-documents'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "verification_docs_update_own_folder"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'verification-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "verification_docs_delete_own_folder"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'verification-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
