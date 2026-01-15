"use client";

import { useApiMutation } from "./useApiMutation";
import { useApiQuery } from "./useApiQuery";
import { userService } from "@/services/userService";
import { moverService } from "@/services/moverService";

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
  return useApiMutation({
    mutationKey: ["postProfile"],
    mutationFn: userService.postProfile,
    successConfig: {
      invalidateQueries: [["profile"], ["myMoverDetail"], ["me"]],
      successMessage: "프로필 등록이 완료되었습니다.",
      redirectPath: "/",
    },
    errorConfig: {
      errorMessagePrefix: "프로필 등록",
      defaultErrorMessage: "프로필 등록에 실패했습니다. 다시 시도해주세요.",
    },
  });
}

/**
 * 프로필 수정 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function usePutProfile() {
  return useApiMutation({
    mutationKey: ["putProfile"],
    mutationFn: userService.putProfile,
    successConfig: {
      invalidateQueries: [["profile"], ["myMoverDetail"], ["me"]],
      successMessage: "프로필 수정이 완료되었습니다.",
      redirectPath: "/profile",
    },
    errorConfig: {
      errorMessagePrefix: "프로필 수정",
      defaultErrorMessage: "프로필 수정에 실패했습니다. 다시 시도해주세요.",
    },
  });
}

/**
 * 기본정보 수정 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function useUpdateBasicInfo() {
  return useApiMutation({
    mutationKey: ["updateBasicInfo"],
    mutationFn: userService.updateBasicInfo,
    successConfig: {
      invalidateQueries: [["me"]],
      successMessage: "기본정보 수정이 완료되었습니다.",
      redirectPath: "/profile",
    },
    errorConfig: {
      errorMessagePrefix: "기본정보 수정",
      defaultErrorMessage: "기본정보 수정에 실패했습니다. 다시 시도해주세요.",
    },
  });
}

/**
 * 일반유저 프로필 수정 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function usePutUserProfile() {
  return useApiMutation({
    mutationKey: ["putUserProfile"],
    mutationFn: userService.putUserProfile,
    successConfig: {
      invalidateQueries: [["me"]],
      successMessage: "일반유저 프로필 수정이 완료되었습니다.",
      redirectPath: "/",
    },
    errorConfig: {
      errorMessagePrefix: "일반유저 프로필 수정",
      defaultErrorMessage:
        "일반유저 프로필 수정에 실패했습니다. 다시 시도해주세요.",
    },
  });
}
