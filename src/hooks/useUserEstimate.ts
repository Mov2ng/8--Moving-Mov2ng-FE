import { apiClient } from "@/libs/apiClient";
import { useApiQuery } from "./useApiQuery";
import { STALE_TIME } from "@/constants/query";

const ENDPOINT = "/request/user/estimates";

export function useGetUserEstimate() {
  return useApiQuery({
    queryKey: ["quotes", "pending"],
    queryFn: async () => {
      return apiClient(ENDPOINT, {
        method: "GET",
        query: { status: "ACCEPTED" },
      });
    },
    staleTime: STALE_TIME.ESTIMATE,
  });
}
