"use client";

import { userService } from "@/services/userService";
import { useApiMutation } from "./useApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery } from "./useApiQuery";
import { useRouter } from "next/navigation";

/**
 * 회원가입 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function useSignup() {
  const router = useRouter();

  return useApiMutation({
    mutationKey: ["signup"],
    mutationFn: userService.signup,
    onSuccess: () => {
      alert("회원가입이 완료되었습니다. 로그인 해주세요.");
      router.push("/login");
    },
    onError: (error) => {
      console.error("회원가입 실패: ", error);
    },
  });
}

/**
 * 로그인 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useApiMutation({
    mutationKey: ["login"],
    mutationFn: userService.login,
    onSuccess: async (data) => {
      // 1. api 응답에서 accessToken get
      const { accessToken } = data.data;

      // 2. localStorage에 accessToken 저장 (apiClient에서 읽기 위해)
      if (typeof window !== "undefined" && accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      // 3. 사용자 정보(me) 쿼리 무효화해 최신 정보로 업데이트
      queryClient.invalidateQueries({ queryKey: ["me"] });

      // 4. 프로필 완성 여부 확인하여 첫 로그인 판단
      try {
        const profileResponse = await userService.getProfile();
        const profile = profileResponse?.data;

        // serviceCategories와 region이 없거나 비어있으면 프로필 미완성으로 판단
        const hasServiceCategories =
          profile?.serviceCategories &&
          Array.isArray(profile.serviceCategories) &&
          profile.serviceCategories.length > 0;
        const hasRegion =
          profile?.region &&
          Array.isArray(profile.region) &&
          profile.region.length > 0;

        if (!hasServiceCategories || !hasRegion) {
          alert("로그인이 완료되었습니다. 추가 정보를 입력해주세요.");
          router.push("/profile/setup");
          return;
        }
      } catch (error: unknown) {
        // 404 에러만 "프로필 없음"으로 판단 (첫 로그인)
        if (
          error &&
          typeof error === "object" &&
          "status" in error &&
          error.status === 404
        ) {
          alert("로그인이 완료되었습니다. 추가 정보를 입력해주세요.");
          router.push("/profile/setup");
          return;
        }
        // 그 외 에러(500, 네트워크 에러 등)는 로그만 남기고 메인으로 이동
        console.error("프로필 조회 중 오류 발생:", error);
        // 서버 문제 등으로 프로필 조회 실패해도 로그인은 성공했으므로 메인으로 이동
      }

      // 5. 프로필이 있으면 메인 페이지로 리디렉션
      alert("로그인이 완료되었습니다");
      router.push("/");
    },
    onError: (error) => {
      console.error("로그인 실패: ", error);
    },
  });
}

/**
 * 사용자 정보 조회 query 생성 훅
 * @returns useApiQuery 결과
 */
export function useMe() {
  return useApiQuery({
    queryKey: ["me"],
    queryFn: userService.me,
    retry: false,
    staleTime: 1000 * 60 * 10, // accessToken 만료 시 me 캐시도 함께 무효화되어 동기화처럼 동작해 길게 설정 가능
  });
}

/**
 * 사용자 권한(role) 조회 훅
 * 데이터 접근은 useMe에 맡기고, 판단 로직만 공통화
 * @returns 사용자 권한 판단 결과
 */
export function useAuth() {
  // 사용자 정보 조회
  const { data: meData, isLoading, isError } = useMe();
  const me = meData?.data;

  // 쿼리 실패 시 (401 등) 자동으로 me = undefined, isLoading = false → isGuest = true
  return {
    me,
    isLoading,
    isGuest: isError || !me, // 비회원
    isUser: me?.role === "USER", // 일반회원
    isDriver: me?.role === "DRIVER", // 기사님
    role: me?.role as "USER" | "DRIVER" | undefined,
  };
}

/**
 * 로그아웃 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationKey: ["logout"],
    mutationFn: userService.logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

/**
 * 토큰 갱신 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function useRefresh() {
  const queryClient = useQueryClient();

  return useApiMutation({
    mutationKey: ["refresh"],
    mutationFn: userService.refresh,
    onSuccess: (data) => {
      // refresh 성공 시 새 accessToken을 localStorage에 저장
      const { accessToken } = data.data;
      if (typeof window !== "undefined" && accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
