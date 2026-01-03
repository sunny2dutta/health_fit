-- 1. Add supabase_id to public.users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS supabase_id UUID REFERENCES auth.users(id);

-- 2. Create the function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (email_id, supabase_id)
  VALUES (new.email, new.id)
  ON CONFLICT (email_id) DO UPDATE
  SET supabase_id = new.id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
