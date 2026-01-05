"use client";

import { useApiMutation } from "./useApiMutation";
import { useApiQuery } from "./useApiQuery";
import { userService } from "@/services/userService";
import { useRouter } from "next/navigation";

/**
 * 프로필 조회 query 생성 훅
 * @param enabled - 쿼리 활성화 여부
 * @returns useApiQuery 결과
 */
export function useGetProfile(enabled?: boolean) {
  return useApiQuery({
    queryKey: ["profile"],
    queryFn: userService.getProfile,
    retry: false,
    enabled,
    staleTime: 1000 * 60 * 1, // 1분 동안은 최신으로 간주
  });
}

/**
 * 프로필 등록 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function usePostProfile() {
  const router = useRouter();

  return useApiMutation({
    mutationKey: ["postProfile"],
    mutationFn: userService.postProfile,
    onSuccess: () => {
      alert("프로필 등록이 완료되었습니다.");
      router.push("/");
    },
    onError: (error) => {
      console.error("프로필 등록 실패: ", error);
    },
  });
}
