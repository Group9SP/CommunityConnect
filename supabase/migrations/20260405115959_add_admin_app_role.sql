-- Must run in its own migration so the new enum value is committed before use (PostgreSQL).
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';
