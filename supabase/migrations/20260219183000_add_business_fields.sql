-- Add missing fields to business_profiles to support search requirements
ALTER TABLE public.business_profiles
ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create indexes for performant search
CREATE INDEX IF NOT EXISTS idx_business_profiles_category ON public.business_profiles(category);
CREATE INDEX IF NOT EXISTS idx_business_profiles_address ON public.business_profiles(address);
CREATE INDEX IF NOT EXISTS idx_business_profiles_name ON public.business_profiles(business_name);
CREATE INDEX IF NOT EXISTS idx_business_profiles_rating ON public.business_profiles(rating DESC);
