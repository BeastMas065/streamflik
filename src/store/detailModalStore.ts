import { create } from "zustand";
import { TMDBItem } from "@/services/tmdb";

interface DetailModalStore {
  isOpen: boolean;
  item: TMDBItem | null;
  mediaType: "movie" | "tv";
  openModal: (item: TMDBItem, mediaType?: "movie" | "tv") => void;
  closeModal: () => void;
}

export const useDetailModalStore = create<DetailModalStore>((set) => ({
  isOpen: false,
  item: null,
  mediaType: "movie",
  openModal: (item, mediaType) =>
    set({
      isOpen: true,
      item,
      mediaType: mediaType ?? (item.media_type === "tv" || item.first_air_date ? "tv" : "movie"),
    }),
  closeModal: () => set({ isOpen: false, item: null }),
}));
