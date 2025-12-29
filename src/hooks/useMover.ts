// /movers api 관련 훅 모음

import { moverService } from "@/services/moverService";
import { useApiQuery } from "./useApiQuery";
import { useApiMutation } from "./useApiMutation";

export function useGetMovers(query?: {
  keyword?: string;
  region?: string;
  service?: string;
  sort?: string;
  cursor?: number;
  limit?: number;
}) {
  if (query?.keyword === "") {
    query.keyword = undefined;
  }
  if (query?.region === "") {
    query.region = undefined;
  }
  if (query?.service === "") {
    query.service = undefined;
  }
  if (query?.sort === "") {
    query.sort = undefined;
  }
  if (query?.limit === 0) {
    query.limit = undefined;
  }

  return useApiQuery({
    queryKey: ["movers", query],
    queryFn: () => moverService.getMovers(query),
  });
}

export function useGetMoverFull(id: number, options?: { enabled?: boolean }) {
  return useApiQuery({
    queryKey: ["mover", id, "full"],
    queryFn: () => moverService.getMoverFull(id),
    enabled: options?.enabled ?? true,
  });
}

export function useGetMoverExtra(id: number, options?: { enabled?: boolean }) {
  return useApiQuery({
    queryKey: ["mover", id, "extra"],
    queryFn: () => moverService.getMoverExtra(id),
    enabled: options?.enabled ?? true,
  });
}

export function usePostFavoriteMover(id: number) {
  return useApiMutation({
    mutationKey: ["favorite", id],
    mutationFn: () => moverService.postFavoriteMover(id),
  });
}
