import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TMDBItem } from "@/services/tmdb";
import MovieCard from "./MovieCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ContentRowProps {
  title: string;
  items: TMDBItem[];
  isLoading: boolean;
  myListIds?: Set<number>;
}

const ContentRow = ({ title, items, isLoading, myListIds }: ContentRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.85;
    rowRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeft(scrollLeft > 20);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  return (
    <div className="mb-8 md:mb-10 group/row relative">
      <h2 className="text-base md:text-lg lg:text-xl font-bold text-foreground px-4 md:px-12 mb-2">
        {title}
      </h2>
      <div className="relative">
        {/* Left arrow */}
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-black/50 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft size={32} className="text-foreground" />
          </button>
        )}

        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-1 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-12"
          style={{ scrollbarWidth: "none" }}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[calc(100%/2.5)] sm:w-[calc(100%/3.5)] md:w-[calc(100%/4.5)] lg:w-[calc(100%/6)]">
                  <Skeleton className="aspect-video rounded" />
                </div>
              ))
            : items.map((item, i) => (
                <MovieCard
                  key={item.id}
                  item={item}
                  index={i}
                  totalVisible={6}
                  isInList={myListIds?.has(item.id)}
                />
              ))}
        </div>

        {/* Right arrow */}
        {showRight && !isLoading && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-black/50 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight size={32} className="text-foreground" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ContentRow;
