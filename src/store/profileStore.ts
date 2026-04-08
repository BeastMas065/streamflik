import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProfileData {
  id: string;
  display_name: string | null;
  avatar_color: string;
  content_rating: string;
  is_kids: boolean;
  sort_order: number;
}

interface ProfileStore {
  selectedProfile: ProfileData | null;
  setSelectedProfile: (profile: ProfileData) => void;
  clearSelectedProfile: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      selectedProfile: null,
      setSelectedProfile: (profile) => set({ selectedProfile: profile }),
      clearSelectedProfile: () => set({ selectedProfile: null }),
    }),
    { name: "streamflix-profile" }
  )
);
