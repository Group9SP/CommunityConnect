-- F4.2.4 Edit history tracking: capture an audit trail for business profile changes.

-- 1. Table to store a snapshot of business profile changes over time.
CREATE TABLE IF NOT EXISTS public.business_profile_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_profile_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  changed_by UUID,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  action TEXT NOT NULL CHECK (action IN ('insert', 'update', 'delete')),
  previous_row JSONB,
  new_row JSONB
);

-- Enable RLS so we can scope who can read audit history.
ALTER TABLE public.business_profile_history ENABLE ROW LEVEL SECURITY;

-- Admins should be able to see edit history for all business profiles.
CREATE POLICY "Admins can view business profile history"
  ON public.business_profile_history FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Business owners can see the history for their own listing.
CREATE POLICY "Owners can view own business profile history"
  ON public.business_profile_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.business_profiles bp
      WHERE bp.id = business_profile_id
        AND bp.user_id = auth.uid()
    )
  );

-- 2. Trigger function that logs business profile inserts, updates, and deletes into the history table.
CREATE OR REPLACE FUNCTION public.log_business_profile_history()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor UUID;
BEGIN
  -- Capture the current authenticated user id, if available.
  actor := auth.uid();

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.business_profile_history (
      business_profile_id,
      changed_by,
      action,
      previous_row,
      new_row
    )
    VALUES (
      NEW.id,
      actor,
      'insert',
      NULL,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.business_profile_history (
      business_profile_id,
      changed_by,
      action,
      previous_row,
      new_row
    )
    VALUES (
      NEW.id,
      actor,
      'update',
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.business_profile_history (
      business_profile_id,
      changed_by,
      action,
      previous_row,
      new_row
    )
    VALUES (
      OLD.id,
      actor,
      'delete',
      to_jsonb(OLD),
      NULL
    );
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Attach the trigger to the business_profiles table so every change is recorded.
DROP TRIGGER IF EXISTS business_profiles_history_trigger ON public.business_profiles;

CREATE TRIGGER business_profiles_history_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.business_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_business_profile_history();

