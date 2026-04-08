import { useEffect } from "react";
import { X, Play, Plus, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDetailModalStore } from "@/store/detailModalStore";
import { useProfileStore } from "@/store/profileStore";
import { supabase } from "@/integrations/supabase/client";
import {
  TMDB_IMG,
  getMovieDetails,
  getTVDetails,
  getMovieCredits,
  getTVCredits,
  getMovieSimilar,
  getTVSimilar,
  getMovieVideos,
  getTVVideos,
  TMDBItem,
} from "@/services/tmdb";
import DetailTabs from "./DetailTabs";
import { Skeleton } from "@/components/ui/skeleton";

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action", 10765: "Sci-Fi", 10766: "Soap", 10767: "Talk", 10768: "War & Politics",
};

const DetailModal = () => {
  const { isOpen, item, mediaType, closeModal } = useDetailModalStore();
  const { selectedProfile } = useProfileStore();
  const queryClient = useQueryClient();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeModal]);

  const id = item?.id ?? 0;
  const isTV = mediaType === "tv";

  const { data: details, isLoading: detailsLoading } = useQuery({
    queryKey: ["details", mediaType, id],
    queryFn: () => (isTV ? getTVDetails(id) : getMovieDetails(id)),
    enabled: isOpen && id > 0,
    staleTime: 600000,
  });

  const { data: credits } = useQuery({
    queryKey: ["credits", mediaType, id],
    queryFn: () => (isTV ? getTVCredits(id) : getMovieCredits(id)),
    enabled: isOpen && id > 0,
    staleTime: 600000,
  });

  const { data: similar } = useQuery({
    queryKey: ["similar", mediaType, id],
    queryFn: () => (isTV ? getTVSimilar(id) : getMovieSimilar(id)),
    enabled: isOpen && id > 0,
    staleTime: 600000,
  });

  const { data: videos } = useQuery({
    queryKey: ["videos", mediaType, id],
    queryFn: () => (isTV ? getTVVideos(id) : getMovieVideos(id)),
    enabled: isOpen && id > 0,
    staleTime: 600000,
  });

  // Check if in my list
  const { data: myListData } = useQuery({
    queryKey: ["myList", selectedProfile?.id],
    enabled: !!selectedProfile,
  });

  const isInList = (myListData as any[])?.some((i: any) => i.tmdb_id === id) ?? false;

  const toggleMyList = async () => {
    if (!selectedProfile || !item) return;
    const title = item.title ?? item.name ?? "Untitled";
    if (isInList) {
      await supabase.from("my_list").delete().match({ profile_id: selectedProfile.id, tmdb_id: item.id });
    } else {
      await supabase.from("my_list").insert({
        profile_id: selectedProfile.id,
        tmdb_id: item.id,
        title,
        media_type: mediaType,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        overview: item.overview,
        vote_average: item.vote_average,
        release_date: item.release_date ?? item.first_air_date,
        genre_ids: item.genre_ids,
      });
    }
    queryClient.invalidateQueries({ queryKey: ["myList"] });
  };

  if (!item) return null;

  const title = details?.title ?? details?.name ?? item.title ?? item.name ?? "Untitled";
  const year = (details?.release_date ?? details?.first_air_date ?? "").slice(0, 4);
  const match = Math.round((details?.vote_average ?? item.vote_average) * 10);
  const runtime = details?.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null;
  const seasons = details?.number_of_seasons;
  const genres = (details?.genres ?? []).map((g: any) => g.name);
  const cast = (credits?.cast ?? []).slice(0, 6).map((c: any) => c.name);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto py-8 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/70" onClick={closeModal} />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-[850px] rounded-md overflow-hidden z-10 my-4"
            style={{ backgroundColor: "#181818" }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-card flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <X size={20} />
            </button>

            {/* Hero image */}
            <div className="relative aspect-video">
              {detailsLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <img
                  src={`${TMDB_IMG}/original${details?.backdrop_path ?? item.backdrop_path}`}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />

              {/* Bottom overlay content */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-foreground mb-3 drop-shadow-lg">
                    {title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 bg-foreground text-background font-bold px-5 py-2 rounded hover:bg-foreground/80 transition-colors text-sm">
                      <Play size={18} fill="currentColor" />
                      Play
                    </button>
                    <button
                      onClick={toggleMyList}
                      className="w-9 h-9 rounded-full border-2 border-muted-foreground/60 text-foreground flex items-center justify-center hover:border-foreground transition-colors"
                    >
                      {isInList ? <Check size={18} /> : <Plus size={18} />}
                    </button>
                    <button className="w-9 h-9 rounded-full border-2 border-muted-foreground/60 text-foreground flex items-center justify-center hover:border-foreground transition-colors">
                      <ThumbsUp size={16} />
                    </button>
                    <button className="w-9 h-9 rounded-full border-2 border-muted-foreground/60 text-foreground flex items-center justify-center hover:border-foreground transition-colors">
                      <ThumbsDown size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border border-muted-foreground/50 px-2 py-0.5 text-xs text-foreground/70">
                    {details?.adult ? "18+" : "16+"}
                  </span>
                  <span className="text-xs text-foreground/70">
                    {isTV && seasons ? `${seasons} Season${seasons > 1 ? "s" : ""}` : runtime}
                  </span>
                </div>
              </div>
            </div>

            {/* Details section */}
            <div className="px-6 py-5">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left column */}
                <div className="flex-[3]">
                  <div className="flex items-center gap-3 text-sm mb-3 flex-wrap">
                    <span className="text-green-400 font-bold">{match}% Match</span>
                    {year && <span className="text-foreground/70">{year}</span>}
                    {isTV && seasons && (
                      <span className="text-foreground/70">{seasons} Season{seasons > 1 ? "s" : ""}</span>
                    )}
                    {runtime && <span className="text-foreground/70">{runtime}</span>}
                    <span className="border border-muted-foreground/40 px-1.5 py-0.5 text-[10px] text-foreground/60">HD</span>
                    <span className="border border-muted-foreground/40 px-1.5 py-0.5 text-[10px] text-foreground/60">5.1</span>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {details?.overview ?? item.overview}
                  </p>
                </div>

                {/* Right column */}
                <div className="flex-[2] text-sm space-y-2">
                  {cast.length > 0 && (
                    <p>
                      <span className="text-muted-foreground">Cast: </span>
                      <span className="text-foreground/80">{cast.join(", ")}</span>
                    </p>
                  )}
                  {genres.length > 0 && (
                    <p>
                      <span className="text-muted-foreground">Genres: </span>
                      <span className="text-foreground/80">{genres.join(", ")}</span>
                    </p>
                  )}
                  <p>
                    <span className="text-muted-foreground">This show is: </span>
                    <span className="text-foreground/80">Exciting, Suspenseful</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <DetailTabs
              mediaType={mediaType}
              id={id}
              similar={similar?.results ?? []}
              videos={videos?.results ?? []}
              seasons={seasons}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;
