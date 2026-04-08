import { useQuery } from "@tanstack/react-query";
import { getTrending, TMDB_IMG, TMDBItem } from "@/services/tmdb";
import { Play, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDetailModalStore } from "@/store/detailModalStore";

const HeroBillboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: getTrending,
    staleTime: 1000 * 60 * 10,
  });

  const [featured, setFeatured] = useState<TMDBItem | null>(null);

  useEffect(() => {
    if (data?.results?.length) {
      // Pick a random item from top 5
      const top = data.results.slice(0, 5);
      setFeatured(top[Math.floor(Math.random() * top.length)]);
    }
  }, [data]);

  if (isLoading || !featured) {
    return (
      <div className="relative w-full h-[85vh] bg-background">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  const title = featured.title ?? featured.name ?? "Untitled";
  const year = (featured.release_date ?? featured.first_air_date ?? "").slice(0, 4);

  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {/* Background image */}
      <img
        src={`${TMDB_IMG}/original${featured.backdrop_path}`}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-[15%] left-4 md:left-12 max-w-xl z-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-foreground mb-3 drop-shadow-lg leading-tight">
          {title}
        </h1>
        <div className="flex items-center gap-2 mb-3 text-sm text-foreground/80">
          <span className="text-green-400 font-semibold">
            {Math.round(featured.vote_average * 10)}% Match
          </span>
          {year && <span>{year}</span>}
          <span className="border border-foreground/40 px-1.5 py-0.5 text-xs">HD</span>
        </div>
        <p className="text-sm md:text-base text-foreground/90 line-clamp-3 mb-5 leading-relaxed">
          {featured.overview}
        </p>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-foreground text-background font-bold px-6 py-2.5 rounded hover:bg-foreground/80 transition-colors text-sm md:text-base">
            <Play size={20} fill="currentColor" />
            Play
          </button>
          <button className="flex items-center gap-2 bg-muted-foreground/30 text-foreground font-semibold px-6 py-2.5 rounded hover:bg-muted-foreground/20 transition-colors text-sm md:text-base backdrop-blur-sm">
            <Info size={20} />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBillboard;
