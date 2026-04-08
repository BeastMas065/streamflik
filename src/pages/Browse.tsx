import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useProfileStore } from "@/store/profileStore";
import { supabase } from "@/integrations/supabase/client";
import {
  getTrending,
  getTopRated,
  getNowPlaying,
  getPopularTV,
  getByGenre,
} from "@/services/tmdb";
import BrowseNavbar from "@/components/browse/BrowseNavbar";
import HeroBillboard from "@/components/browse/HeroBillboard";
import ContentRow from "@/components/browse/ContentRow";

const ROWS = [
  { key: "trending", title: "Trending Now", fn: getTrending },
  { key: "topRated", title: "Top Rated Movies", fn: getTopRated },
  { key: "nowPlaying", title: "New Releases", fn: getNowPlaying },
  { key: "popularTV", title: "Popular on Streamflix", fn: getPopularTV },
  { key: "action", title: "Action & Adventure", fn: () => getByGenre(28) },
  { key: "comedy", title: "Comedies", fn: () => getByGenre(35) },
  { key: "documentary", title: "Documentaries", fn: () => getByGenre(99) },
  { key: "horror", title: "Horror", fn: () => getByGenre(27) },
  { key: "romance", title: "Romantic Movies", fn: () => getByGenre(10749) },
];

const Browse = () => {
  const { user, loading: authLoading } = useAuth();
  const { selectedProfile } = useProfileStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
    else if (!authLoading && user && !selectedProfile) navigate("/profiles");
  }, [authLoading, user, selectedProfile, navigate]);

  // Fetch all rows
  const rowQueries = ROWS.map((row) =>
    useQuery({
      queryKey: [row.key],
      queryFn: row.fn,
      staleTime: 1000 * 60 * 10,
      enabled: !!user,
    })
  );

  // Fetch My List
  const { data: myListData, isLoading: myListLoading } = useQuery({
    queryKey: ["myList", selectedProfile?.id],
    queryFn: async () => {
      if (!selectedProfile) return [];
      const { data } = await supabase
        .from("my_list")
        .select("*")
        .eq("profile_id", selectedProfile.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!selectedProfile,
  });

  const myListIds = new Set((myListData ?? []).map((item) => item.tmdb_id));

  // Convert my_list items to TMDBItem format for the row
  const myListItems = (myListData ?? []).map((item) => ({
    id: item.tmdb_id,
    title: item.title,
    overview: item.overview ?? "",
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    vote_average: Number(item.vote_average) || 0,
    release_date: item.release_date ?? undefined,
    genre_ids: (item.genre_ids as number[]) ?? [],
    media_type: item.media_type,
  }));

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <BrowseNavbar />
      <HeroBillboard />
      <div className="-mt-24 relative z-10">
        {ROWS.map((row, i) => (
          <ContentRow
            key={row.key}
            title={row.title}
            items={rowQueries[i].data?.results ?? []}
            isLoading={rowQueries[i].isLoading}
            myListIds={myListIds}
          />
        ))}
        {myListItems.length > 0 && (
          <ContentRow
            title="My List"
            items={myListItems}
            isLoading={myListLoading}
            myListIds={myListIds}
          />
        )}
      </div>
    </div>
  );
};

export default Browse;
