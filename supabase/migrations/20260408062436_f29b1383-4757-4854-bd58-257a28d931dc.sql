
-- Add new columns to profiles for multi-profile support
ALTER TABLE public.profiles ADD COLUMN avatar_color text NOT NULL DEFAULT '#E50914';
ALTER TABLE public.profiles ADD COLUMN content_rating text NOT NULL DEFAULT 'All';
ALTER TABLE public.profiles ADD COLUMN is_kids boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN sort_order integer NOT NULL DEFAULT 0;

-- Update the handle_new_user function to create a default + Kids profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_color, is_kids, sort_order)
  VALUES
    (NEW.id, NULL, '#E50914', false, 0),
    (NEW.id, 'Kids', '#56CCF2', true, 1);
  RETURN NEW;
END;
$function$;

-- Create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END;
$$;
