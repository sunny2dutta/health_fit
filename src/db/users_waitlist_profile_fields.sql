ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS track TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT;

CREATE INDEX IF NOT EXISTS idx_users_city ON public.users(city);
CREATE INDEX IF NOT EXISTS idx_users_track ON public.users(track);
CREATE INDEX IF NOT EXISTS idx_users_gender ON public.users(gender);
