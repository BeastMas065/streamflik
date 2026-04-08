import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { TMDB_IMG, TMDBItem, getTVSeasonEpisodes } from "@/services/tmdb";
import { Skeleton } from "@/components/ui/skeleton";
import { useDetailModalStore } from "@/store/detailModalStore";

interface DetailTabsProps {
  mediaType: "movie" | "tv";
  id: number;
  similar: TMDBItem[];
  videos: any[];
  seasons?: number;
}

const DetailTabs = ({ mediaType, id, similar, videos, seasons }: DetailTabsProps) => {
  const isTV = mediaType === "tv";
  const tabs = isTV
    ? ["Episodes", "More Like This", "Trailers & More"]
    : ["More Like This", "Trailers & More"];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const { openModal } = useDetailModalStore();

  const { data: episodesData, isLoading: episodesLoading } = useQuery({
    queryKey: ["episodes", id, selectedSeason],
    queryFn: () => getTVSeasonEpisodes(id, selectedSeason),
    enabled: isTV && activeTab === "Episodes",
    staleTime: 600000,
  });

  const youtubeVideos = videos.filter(
    (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser" || v.type === "Clip")
  );

  return (
    <div className="px-6 pb-8">
      {/* Tab headers */}
      <div className="flex gap-6 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-semibold transition-colors relative ${
              activeTab === tab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/70"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Episodes tab */}
      {activeTab === "Episodes" && isTV && (
        <div>
          <div className="mb-4">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="bg-card text-foreground border border-border rounded px-3 py-1.5 text-sm"
            >
              {Array.from({ length: seasons ?? 1 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Season {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            {episodesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded" />
                ))
              : (episodesData?.episodes ?? []).map((ep: any) => (
                  <div
                    key={ep.id}
                    className="flex gap-4 p-3 rounded hover:bg-card/60 transition-colors group cursor-pointer"
                  >
                    <div className="relative w-32 flex-shrink-0 aspect-video rounded overflow-hidden">
                      {ep.still_path ? (
                        <img
                          src={`${TMDB_IMG}/w300${ep.still_path}`}
                          alt={ep.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Play size={24} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-foreground/20 border-2 border-foreground flex items-center justify-center backdrop-blur-sm">
                          <Play size={18} className="text-foreground" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-foreground">
                          {ep.episode_number}. {ep.name}
                        </h4>
                        {ep.runtime && (
                          <span className="text-xs text-muted-foreground">{ep.runtime}m</span>
                        )}
                      </div>
                      <p className="text-xs text-foreground/60 line-clamp-2">{ep.overview}</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}

      {/* More Like This */}
      {activeTab === "More Like This" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {similar.slice(0, 9).map((item) => (
            <div
              key={item.id}
              className="rounded overflow-hidden bg-card cursor-pointer hover:brightness-125 transition-all"
              onClick={() => openModal(item, mediaType)}
            >
              <div className="aspect-video">
                <img
                  src={
                    item.backdrop_path
                      ? `${TMDB_IMG}/w500${item.backdrop_path}`
                      : `${TMDB_IMG}/w500${item.poster_path}`
                  }
                  alt={item.title ?? item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-2.5">
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="text-green-400 font-bold">
                    {Math.round(item.vote_average * 10)}% Match
                  </span>
                  <span className="border border-muted-foreground/40 px-1 py-0.5 text-[10px] text-foreground/60">
                    16+
                  </span>
                </div>
                <p className="text-xs text-foreground/60 line-clamp-2">{item.overview}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trailers & More */}
      {activeTab === "Trailers & More" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {youtubeVideos.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-2">No trailers available.</p>
          )}
          {youtubeVideos.map((v: any) => (
            <a
              key={v.id}
              href={`https://www.youtube.com/watch?v=${v.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded overflow-hidden bg-card hover:brightness-125 transition-all"
            >
              <div className="relative aspect-video">
                <img
                  src={`https://img.youtube.com/vi/${v.key}/hqdefault.jpg`}
                  alt={v.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-foreground/20 border-2 border-foreground flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <Play size={22} className="text-foreground" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-sm font-medium text-foreground">{v.name}</p>
                <p className="text-xs text-muted-foreground">{v.type}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailTabs;
