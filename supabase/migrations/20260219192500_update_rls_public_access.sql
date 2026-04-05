-- Enable public read access to verified business profiles
-- Drop the existing restricted policy if it exists (it was named "Anyone can view verified business profiles" but restricted to authenticated)
DROP POLICY IF EXISTS "Anyone can view verified business profiles" ON public.business_profiles;

-- Create a new policy that allows everyone (anon + authenticated) to view verified profiles
CREATE POLICY "Public can view verified business profiles"
ON public.business_profiles
FOR SELECT
TO public
USING (verification_status = 'verified');

-- Ensure the table has RLS enabled (should already be true, but good for safety)
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
