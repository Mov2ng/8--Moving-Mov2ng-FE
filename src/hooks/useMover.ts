// /movers api 관련 훅 모음

import { useInfiniteQuery } from "@tanstack/react-query";
import { moverService } from "@/services/moverService";
import { useApiQuery } from "./useApiQuery";
import { useApiMutation } from "./useApiMutation";

import type { DriverResponseType } from "@/types/driverProfileType";

// 무한 스크롤용 기사님 목록 조회 훅
interface MoversResponse {
  list: DriverResponseType[];
  nextCursor: number | null;
  hasNext: boolean;
}

export function useGetMovers(query?: {
  keyword?: string;
  region?: string;
  service?: string;
  sort?: string;
  limit?: number;
}) {
  const sanitizedQuery = {
    keyword: query?.keyword === "" ? undefined : query?.keyword,
    region: query?.region === "" ? undefined : query?.region,
    service: query?.service === "" ? undefined : query?.service,
    sort: query?.sort === "" ? undefined : query?.sort,
    limit: query?.limit === 0 ? undefined : query?.limit,
  };

  return useInfiniteQuery({
    queryKey: ["movers", sanitizedQuery],
    queryFn: async ({ pageParam }) => {
      const response = await moverService.getMovers({
        ...sanitizedQuery,
        cursor: pageParam,
      });
      
      return response.data as MoversResponse;
    },
    // 다음 페이지 파라미터 반환
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNext && lastPage.nextCursor !== null) {
        return lastPage.nextCursor;
      }
      return undefined;
    },
    initialPageParam: 0,
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
