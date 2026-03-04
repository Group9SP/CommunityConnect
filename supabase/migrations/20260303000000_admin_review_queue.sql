-- F4.2.2 Admin review queue: add admin role, RLS for admins, and restrict verification_status updates to admins only.
--
-- To create the first admin after running this migration, run in Supabase SQL editor:
--   INSERT INTO public.user_roles (user_id, role) VALUES ('<auth-users-uuid>', 'admin') ON CONFLICT DO NOTHING;

-- 1. Add 'admin' to app_role enum so we can distinguish administrators from customers and business owners.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';

-- 2. Trigger: enforce that only admins may change verification_status (business owners cannot self-verify).
CREATE OR REPLACE FUNCTION public.check_verification_status_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.verification_status IS DISTINCT FROM NEW.verification_status THEN
    IF NOT public.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only admins can change verification_status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS business_profiles_verification_status_admin_only ON public.business_profiles;
CREATE TRIGGER business_profiles_verification_status_admin_only
  BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_verification_status_update();

-- 3. RLS: Admins can SELECT all business_profiles (pending, rejected, verified) for review purposes.
CREATE POLICY "Admins can view all business profiles"
  ON public.business_profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. RLS: Admins can UPDATE any business_profile, including verification decisions.
CREATE POLICY "Admins can update any business profile"
  ON public.business_profiles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
