
CREATE TABLE public.my_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tmdb_id integer NOT NULL,
  media_type text NOT NULL DEFAULT 'movie',
  title text NOT NULL,
  poster_path text,
  backdrop_path text,
  overview text,
  vote_average numeric,
  release_date text,
  genre_ids jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(profile_id, tmdb_id)
);

ALTER TABLE public.my_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own list"
  ON public.my_list FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = my_list.profile_id
        AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add to their own list"
  ON public.my_list FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = my_list.profile_id
        AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove from their own list"
  ON public.my_list FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = my_list.profile_id
        AND profiles.user_id = auth.uid()
    )
  );
