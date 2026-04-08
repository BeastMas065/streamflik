import { useQuery } from "@tanstack/react-query";
import {
  getTrending,
  getTopRated,
  getNowPlaying,
  getPopularTV,
  getByGenre,
} from "@/services/tmdb";

export const useTMDBRows = (enabled: boolean) => {
  const trending = useQuery({ queryKey: ["trending"], queryFn: getTrending, staleTime: 600000, enabled });
  const topRated = useQuery({ queryKey: ["topRated"], queryFn: getTopRated, staleTime: 600000, enabled });
  const nowPlaying = useQuery({ queryKey: ["nowPlaying"], queryFn: getNowPlaying, staleTime: 600000, enabled });
  const popularTV = useQuery({ queryKey: ["popularTV"], queryFn: getPopularTV, staleTime: 600000, enabled });
  const action = useQuery({ queryKey: ["genre-28"], queryFn: () => getByGenre(28), staleTime: 600000, enabled });
  const comedy = useQuery({ queryKey: ["genre-35"], queryFn: () => getByGenre(35), staleTime: 600000, enabled });
  const documentary = useQuery({ queryKey: ["genre-99"], queryFn: () => getByGenre(99), staleTime: 600000, enabled });
  const horror = useQuery({ queryKey: ["genre-27"], queryFn: () => getByGenre(27), staleTime: 600000, enabled });
  const romance = useQuery({ queryKey: ["genre-10749"], queryFn: () => getByGenre(10749), staleTime: 600000, enabled });

  return [
    { title: "Trending Now", data: trending.data?.results ?? [], isLoading: trending.isLoading },
    { title: "Top Rated Movies", data: topRated.data?.results ?? [], isLoading: topRated.isLoading },
    { title: "New Releases", data: nowPlaying.data?.results ?? [], isLoading: nowPlaying.isLoading },
    { title: "Popular on Streamflix", data: popularTV.data?.results ?? [], isLoading: popularTV.isLoading },
    { title: "Action & Adventure", data: action.data?.results ?? [], isLoading: action.isLoading },
    { title: "Comedies", data: comedy.data?.results ?? [], isLoading: comedy.isLoading },
    { title: "Documentaries", data: documentary.data?.results ?? [], isLoading: documentary.isLoading },
    { title: "Horror", data: horror.data?.results ?? [], isLoading: horror.isLoading },
    { title: "Romantic Movies", data: romance.data?.results ?? [], isLoading: romance.isLoading },
  ];
};
