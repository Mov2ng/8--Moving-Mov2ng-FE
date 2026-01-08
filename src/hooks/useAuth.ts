"use client";

import { userService } from "@/services/userService";
import { useApiMutation } from "./useApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery } from "./useApiQuery";
import { useRouter } from "next/navigation";
import { setToken } from "@/libs/auth/tokenStorage";
import { handleAuthError } from "@/utils/authError";
import { parseServerError } from "@/utils/parseServerError";

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
      const parsedError = parseServerError(error);
      console.error("회원가입 실패:", {
        status: parsedError?.status,
        message: parsedError?.message,
        details: parsedError?.details,
        fullError: error,
      });
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

      // 2. accessToken을 localStorage에 저장
      if (accessToken) {
        setToken(accessToken);
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
      const parsedError = parseServerError(error);
      console.error("로그인 실패:", {
        status: parsedError?.status,
        message: parsedError?.message,
        details: parsedError?.details,
        fullError: error,
      });
    },
  });
}

/**
 * 사용자 정보 조회 query 생성 훅
 * @returns useApiQuery 결과
 */
export function useMe() {
  // /auth/me API는 apiClient에서 refresh token도 만료된 경우에만 { data: null }로 반환하므로
  // React Query 입장에서는 에러가 아닌 성공 응답으로 처리 → 여기서 401 에러 처리는 필요X

  const result = useApiQuery({
    queryKey: ["me"],
    queryFn: userService.me,
    retry: false, // 401 재시도 방지
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 5, // 미사용 시 캐시 메모리 정리 시간
    refetchOnMount: false, // 마운트 시 리패치 방지
  });

  return result;
}

/**
 * 사용자 권한(role) 조회 훅
 * 데이터 접근은 useMe에 맡기고, 판단 로직만 공통화
 * @returns 사용자 권한 판단 결과
 */
export function useAuth() {
  // 사용자 정보 조회
  const { data: meData, isLoading } = useMe();
  const me = meData?.data;

  // 비회원은 me = null로 정상 처리
  return {
    me,
    isLoading,
    isGuest: !me, // 비회원 (me가 null이면 guest)
    isUser: me?.role === "USER", // 일반회원
    isDriver: me?.role === "DRIVER", // 기사님
    role: me?.role as "USER" | "DRIVER" | undefined,
  };
}

/**
 * 로그아웃 mutation 생성 훅
 * - 토큰 삭제, 쿼리 삭제 처리
 * @returns useApiMutation 결과
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useApiMutation<unknown, void, unknown>({
    mutationKey: ["logout"],
    mutationFn: () => userService.logout(), // TVariables = void로 명시
    onSuccess: () => {
      // 인증 상태 정리 (토큰 삭제 + me 쿼리 삭제)
      handleAuthError(queryClient);
      // refreshToken 쿠키는 서버에서 삭제
    },
    onError: (error) => {
      const parsedError = parseServerError(error);
      console.error("로그아웃 실패:", {
        status: parsedError?.status,
        message: parsedError?.message,
        details: parsedError?.details,
        fullError: error,
      });
      // 서버 요청 실패해도 클라이언트 상태는 정리
      handleAuthError(queryClient);
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
    onSuccess: () => {
      // refreshAccessToken에서 이미 토큰 저장 처리 → me 캐시 갱신
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
