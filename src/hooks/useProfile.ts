"use client";

import { useApiMutation } from "./useApiMutation";
import { useApiQuery } from "./useApiQuery";
import { userService } from "@/services/userService";
import { moverService } from "@/services/moverService";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { BasicInfoFormValues } from "@/libs/validation/basicInfoSchemas";
import { parseServerError } from "@/utils/parseServerError";

/**
 * 프로필 조회 query 생성 훅
 * @param enabled - 쿼리 활성화 여부
 * @returns useApiQuery 결과
 */
export function useGetProfile(enabled?: boolean) {
  return useApiQuery({
    queryKey: ["profile"],
    queryFn: userService.getProfile,
    enabled,
    staleTime: 1000 * 60 * 1, // 1분 동안은 최신으로 간주
  });
}

/**
 * 기사님 본인 프로필 조회 query 생성 훅
 * @param enabled - 쿼리 활성화 여부
 * @returns useApiQuery 결과
 */
export function useGetMyMoverDetail(enabled?: boolean) {
  return useApiQuery({
    queryKey: ["myMoverDetail"],
    queryFn: moverService.getMyMoverDetail,
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
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationKey: ["postProfile"],
    mutationFn: userService.postProfile,
    onSuccess: () => {
      // 프로필 관련 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["myMoverDetail"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      alert("프로필 등록이 완료되었습니다.");
      router.push("/");
    },
    onError: (error) => {
      const parsedError = parseServerError(error);
      console.error("프로필 등록 실패:", {
        status: parsedError?.status,
        message: parsedError?.message,
        details: parsedError?.details,
        fullError: error,
      });
    },
  });
}

/**
 * 프로필 수정 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function usePutProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationKey: ["putProfile"],
    mutationFn: userService.putProfile,
    onSuccess: () => {
      // 프로필 관련 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["myMoverDetail"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      alert("프로필 수정이 완료되었습니다.");
      router.push("/profile");
    },
    onError: (error) => {
      const parsedError = parseServerError(error);
      console.error("프로필 수정 실패:", {
        status: parsedError?.status,
        message: parsedError?.message,
        details: parsedError?.details,
        fullError: error,
      });
    },
  });
}

/**
 * 기본정보 수정 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function useUpdateBasicInfo() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationKey: ["updateBasicInfo"],
    mutationFn: userService.updateBasicInfo,
    onSuccess: () => {
      // me 쿼리 캐시 무효화 (기본정보는 me에 포함됨)
      queryClient.invalidateQueries({ queryKey: ["me"] });
      alert("기본정보 수정이 완료되었습니다.");
      router.push("/profile");
    },
    onError: (error) => {
      const parsedError = parseServerError(error);
      console.error("기본정보 수정 실패:", {
        status: parsedError?.status,
        message: parsedError?.message,
        details: parsedError?.details,
        fullError: error,
      });
    },
  });
}

/**
 * 일반유저 프로필 수정 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function usePutUserProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationKey: ["putUserProfile"],
    mutationFn: userService.putUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      alert("일반유저 프로필 수정이 완료되었습니다.");
      router.push("/profile/user");
    },
    onError: (error) => {
      const parsedError = parseServerError(error);
      console.error("일반유저 프로필 수정 실패:", {
        status: parsedError?.status,
        message: parsedError?.message,
        details: parsedError?.details,
        fullError: error,
      });
    },
  });
}
