import { supabase } from "@/integrations/supabase/client";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const FUNCTION_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/tmdb`;

async function tmdbFetch(path: string, extra: Record<string, string> = {}) {
  const params = new URLSearchParams({ path, ...extra });
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(`${FUNCTION_URL}?${params}`, {
    headers: {
      Authorization: `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });
  if (!res.ok) throw new Error(`TMDB fetch failed: ${res.status}`);
  return res.json();
}

export const TMDB_IMG = "https://image.tmdb.org/t/p";

export const getTrending = () => tmdbFetch("/trending/all/day");
export const getTopRated = () => tmdbFetch("/movie/top_rated");
export const getNowPlaying = () => tmdbFetch("/movie/now_playing");
export const getPopularTV = () => tmdbFetch("/tv/popular");
export const getByGenre = (genreId: number) =>
  tmdbFetch("/discover/movie", { with_genres: String(genreId) });

export interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type?: string;
}
