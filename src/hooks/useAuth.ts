"use client";

import { userService } from "@/services/userService";
import { useApiMutation } from "./useApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery } from "./useApiQuery";
import { useRouter } from "next/navigation";
import { setToken, getToken } from "@/libs/auth/tokenStorage";
import { handleAuthError } from "@/utils/authError";
import { useEffect } from "react";
import { useI18n } from "@/libs/i18n/I18nProvider";
import { useToast } from "@/hooks/useToast";

/**
 * 회원가입 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function useSignup() {
  const router = useRouter();
  const { t } = useI18n();
  const { showToast } = useToast();

  return useApiMutation({
    mutationKey: ["signup"],
    mutationFn: userService.signup,
    successConfig: {
      successMessage: t("signup_success"),
      onSuccessMessage: showToast,
      redirectPath: "/login",
    },
  });
}

/**
 * 로그인 mutation 생성 훅
 * @param redirectPath - 로그인 성공 후 리디렉션할 경로 (선택사항)
 * @returns useApiMutation 결과
 */
export function useLogin(redirectPath?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useI18n();
  const { showToast } = useToast();

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

      // 3. 사용자 정보(me) 쿼리 캐시 삭제 (다음 useMe 호출 시 자동으로 새로 가져옴)
      queryClient.removeQueries({ queryKey: ["me"] });

      // 4. 사용자 정보(me) 조회 및 프로필 등록 여부 확인
      try {
        const meResponse = await userService.me();
        const me = meResponse?.data;

        // React Query 캐시에 me 데이터 저장 (RouteGuard가 즉시 인식하도록)
        if (me) {
          queryClient.setQueryData(["me"], meResponse);
        }

        // 프로필 미등록이면 프로필 등록 페이지로, 아니면 원래 경로로 리디렉션
        if (!me?.hasProfile) {
          // 프로필 미등록 시에는 별도 메시지 표시
          showToast(t("login_success"));
          router.push("/profile/register");
        } else {
          const finalRedirectPath =
            redirectPath && redirectPath.startsWith("/") ? redirectPath : "/";
          router.push(finalRedirectPath);
        }
      } catch (error) {
        // 예상치 못한 에러 시에도 기본 경로로 리디렉션
        const finalRedirectPath =
          redirectPath && redirectPath.startsWith("/") ? redirectPath : "/";
        router.push(finalRedirectPath);
      }
    },
  });
}

/**
 * 사용자 정보 조회 query 생성 훅
 * 토큰 만료 체크 및 refresh는 apiClient에서 자동 처리됨
 * @param enabled - 쿼리 활성화 여부 (기본값: true)
 * @returns useApiQuery 결과
 */
export function useMe(enabled: boolean = true) {
  const queryClient = useQueryClient();
  const currentHasToken = getToken() !== null;
  
  // 토큰이 없어질 때만 캐시 삭제 (refresh 실패 후 오래된 캐시 방지)
  useEffect(() => {
    if (!currentHasToken) {
      queryClient.removeQueries({ queryKey: ["me"] });
    }
  }, [currentHasToken, queryClient]);

  return useApiQuery({
    queryKey: ["me"],
    queryFn: userService.me,
    enabled: enabled && currentHasToken, // 토큰이 없으면 쿼리 비활성화 (무한 호출 방지)
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 5, // 미사용 시 캐시 메모리 정리 시간
    refetchOnMount: false, // /auth/me는 무한 호출 방지를 위해 마운트 시 리패치 안 함
    refetchOnWindowFocus: false, // /auth/me는 포커스 시 리패치 안 함 (staleTime 5분으로 충분)
    refetchOnReconnect: false, // 네트워크 재연결 시 자동 리패치 방지 (서버 꺼져있을 때 무한 호출 방지) // TODO: 재발 방지 재확인 필요
  });
}

/**
 * 사용자 권한(role) 조회 훅
 * 데이터 접근은 useMe에 맡기고, 판단 로직만 공통화
 * @param enabled - 쿼리 활성화 여부 (기본값: true)
 * @returns 사용자 권한 판단 결과
 */
export function useAuth(enabled: boolean = true) {
  // 사용자 정보 조회
  const { data: meData, isLoading, isFetching, status } = useMe(enabled);
  const me = meData?.data;

  // 비회원은 me = null로 정상 처리
  return {
    me,
    isLoading: isLoading, // 하위 호환성을 위해 유지하되, isPending도 제공
    isPending: isLoading, // isLoading의 별칭
    isFetching, // 서버/클라이언트 초기 상태 일치용
    status, // 서버/클라이언트 초기 상태 일치용
    isGuest: !me, // 비회원 (me가 null이면 guest)
    isUser: me?.role === "USER", // 일반회원
    isDriver: me?.role === "DRIVER", // 기사님
    role: me?.role as "USER" | "DRIVER" | undefined,
    profileImage: me?.profileImage,
    nickname: me?.nickname,
  };
}

/**
 * 로그아웃 mutation 생성 훅
 * - 토큰 삭제, 쿼리 삭제 처리
 * - 성공 시 홈페이지로 리디렉션
 * @returns useApiMutation 결과
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useApiMutation<unknown, void, unknown>({
    mutationKey: ["logout"],
    mutationFn: () => userService.logout(), // TVariables = void로 명시
    onSuccess: () => {
      // 인증 상태 정리 (토큰 삭제 + me 쿼리 삭제)
      handleAuthError(queryClient);
      // refreshToken 쿠키는 서버에서 삭제
      // 홈페이지로 리디렉션
      router.push("/");
    },
    onError: (error) => {
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
      // refreshAccessToken에서 이미 토큰 저장 처리 → me 캐시 삭제 (다음 useMe 호출 시 자동으로 새로 가져옴)
      queryClient.removeQueries({ queryKey: ["me"] });
    },
  });
}
