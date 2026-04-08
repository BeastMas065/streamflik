import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useProfileStore } from "@/store/profileStore";
import { supabase } from "@/integrations/supabase/client";
import { useTMDBRows } from "@/hooks/useTMDBRows";
import BrowseNavbar from "@/components/browse/BrowseNavbar";
import HeroBillboard from "@/components/browse/HeroBillboard";
import ContentRow from "@/components/browse/ContentRow";
import DetailModal from "@/components/browse/DetailModal";

const Browse = () => {
  const { user, loading: authLoading } = useAuth();
  const { selectedProfile } = useProfileStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
    else if (!authLoading && user && !selectedProfile) navigate("/profiles");
  }, [authLoading, user, selectedProfile, navigate]);

  const rows = useTMDBRows(!!user);

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
        {rows.map((row) => (
          <ContentRow
            key={row.title}
            title={row.title}
            items={row.data}
            isLoading={row.isLoading}
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
