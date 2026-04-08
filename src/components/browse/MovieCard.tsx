import { useState, useRef } from "react";
import { Play, Plus, ThumbsUp, ChevronDown, Check } from "lucide-react";
import { TMDB_IMG, TMDBItem } from "@/services/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useProfileStore } from "@/store/profileStore";
import { useQueryClient } from "@tanstack/react-query";
import { useDetailModalStore } from "@/store/detailModalStore";

interface MovieCardProps {
  item: TMDBItem;
  index: number;
  totalVisible: number;
  isInList?: boolean;
}

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

const MovieCard = ({ item, index, totalVisible, isInList }: MovieCardProps) => {
  const [hovered, setHovered] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const { selectedProfile } = useProfileStore();
  const queryClient = useQueryClient();
  const { openModal } = useDetailModalStore();

  const title = item.title ?? item.name ?? "Untitled";
  const year = (item.release_date ?? item.first_air_date ?? "").slice(0, 4);
  const match = Math.round(item.vote_average * 10);
  const genres = item.genre_ids?.slice(0, 3).map((id) => GENRE_MAP[id]).filter(Boolean) ?? [];

  // Determine if card is near left or right edge
  const isLeftEdge = index <= 1;
  const isRightEdge = index >= totalVisible - 2;

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => setHovered(true), 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHovered(false);
  };

  const toggleMyList = async () => {
    if (!selectedProfile) return;
    if (isInList) {
      await supabase.from("my_list").delete().match({
        profile_id: selectedProfile.id,
        tmdb_id: item.id,
      });
    } else {
      await supabase.from("my_list").insert({
        profile_id: selectedProfile.id,
        tmdb_id: item.id,
        title,
        media_type: item.media_type ?? "movie",
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

  return (
    <div
      className="relative flex-shrink-0 w-[calc(100%/2.5)] sm:w-[calc(100%/3.5)] md:w-[calc(100%/4.5)] lg:w-[calc(100%/6)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-video rounded overflow-hidden cursor-pointer">
        <img
          src={item.backdrop_path ? `${TMDB_IMG}/w500${item.backdrop_path}` : `${TMDB_IMG}/w500${item.poster_path}`}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-0 z-50 w-[300px] bg-card rounded-lg shadow-2xl overflow-hidden ${
              isRightEdge ? "right-0 origin-top-right" : isLeftEdge ? "left-0 origin-top-left" : "left-1/2 -translate-x-1/2 origin-top"
            }`}
            style={{ marginTop: "-10px" }}
          >
            <div className="aspect-video">
              <img
                src={item.backdrop_path ? `${TMDB_IMG}/w500${item.backdrop_path}` : `${TMDB_IMG}/w500${item.poster_path}`}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <button className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-colors">
                  <Play size={16} fill="currentColor" />
                </button>
                <button
                  onClick={toggleMyList}
                  className="w-8 h-8 rounded-full border-2 border-muted-foreground/60 text-foreground flex items-center justify-center hover:border-foreground transition-colors"
                >
                  {isInList ? <Check size={16} /> : <Plus size={16} />}
                </button>
                <button className="w-8 h-8 rounded-full border-2 border-muted-foreground/60 text-foreground flex items-center justify-center hover:border-foreground transition-colors">
                  <ThumbsUp size={16} />
                </button>
                <button className="w-8 h-8 rounded-full border-2 border-muted-foreground/60 text-foreground flex items-center justify-center hover:border-foreground transition-colors ml-auto">
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs mb-1.5">
                <span className="text-green-400 font-bold">{match}% Match</span>
                <span className="border border-muted-foreground/50 px-1 py-0.5 text-[10px] text-foreground/70">16+</span>
                {year && <span className="text-foreground/60">{year}</span>}
              </div>
              <div className="flex flex-wrap gap-1">
                {genres.map((g, i) => (
                  <span key={g} className="text-[11px] text-foreground/70">
                    {i > 0 && <span className="text-muted-foreground mx-0.5">•</span>}
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieCard;
