"use client";

import { userService } from "@/services/userService";
import { useApiMutation } from "./useApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useApiQuery } from "./useApiQuery";
import { useRouter, usePathname } from "next/navigation";
import { setToken, getToken, removeToken } from "@/libs/auth/tokenStorage";
import { useEffect, useState } from "react";
import { useI18n } from "@/libs/i18n/I18nProvider";
import { useToast } from "@/hooks/useToast";

/**
 * 회원가입 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function useSignup() {
  return useApiMutation({
    mutationKey: ["signup"],
    mutationFn: userService.signup,
    successConfig: {
      redirectPath: "/login?success=signup",
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

  return useApiMutation({
    mutationKey: ["login"],
    mutationFn: userService.login,
    onSuccess: async (data) => {
      const { accessToken } = data.data;
      if (accessToken) {
        setToken(accessToken);
      }

      queryClient.removeQueries({ queryKey: ["me"] });

      try {
        // userService.me()를 직접 호출하여 최신 유저 정보 확인
        // queryClient.fetchQuery를 사용하면 캐시 설정 등에 영향을 받을 수 있으므로 직접 호출이 안전함
        const meResponse = await userService.me();
        const me = meResponse?.data;

        // 가져온 데이터를 캐시에 주입하여 이후 useMe 호출 시 즉시 사용 가능하게 함
        queryClient.setQueryData(["me"], meResponse);

        // 프로필 등록 여부 확인
        let isProfileRegistered = false;

        // hasProfile 값에 의존하지 않고 항상 getProfile로 직접 확인하여 정확성 보장
        try {
          const profileResponse = await userService.getProfile();
          const profile = profileResponse?.data;

          // 필수 정보(서비스, 지역)가 있는지 확인
          const hasServiceCategories =
            profile?.serviceCategories &&
            Array.isArray(profile.serviceCategories) &&
            profile.serviceCategories.length > 0;

          // API 응답이 region 또는 regions로 올 수 있음
          const regionData = profile?.region || profile?.regions;
          const hasRegion =
            regionData && Array.isArray(regionData) && regionData.length > 0;

          isProfileRegistered = !!(hasServiceCategories && hasRegion);
        } catch (error: any) {
          // 404(프로필 없음) 또는 기타 에러 발생 시 미등록 상태로 간주하여 등록 페이지로 유도
          isProfileRegistered = false;
        }

        // 리디렉션 처리
        if (!isProfileRegistered) {
          router.replace("/profile/register?success=login-profile");
        } else {
          const finalRedirectPath =
            redirectPath && redirectPath.startsWith("/") ? redirectPath : "/";
          router.replace(`${finalRedirectPath}?success=login`);
        }
      } catch (error) {
        console.error("Failed to fetch user info after login:", error);
        // 에러 발생 시에도 홈으로 리디렉션 (토큰은 저장되었으므로)
        const finalRedirectPath =
          redirectPath && redirectPath.startsWith("/") ? redirectPath : "/";
        router.replace(`${finalRedirectPath}?success=login`);
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 마운트 된 후에만 토큰 확인 (Hydration Mismatch 방지)
  const hasToken = isMounted ? getToken() !== null : false;

  return useApiQuery({
    queryKey: ["me"],
    queryFn: userService.me,
    enabled: enabled && hasToken, // 토큰이 있을 때만 쿼리 실행
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
  const pathname = usePathname();
  
  // useMe 내부에서 토큰 체크를 하므로 여기서는 별도 상태 관리 불필요
  // pathname이 변경될 때 리렌더링되어 useMe가 최신 토큰 상태를 반영하도록 함
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
      // 1. 토큰 삭제
      removeToken();
      // 2. 'me' 쿼리 캐시를 완전히 제거하여 모든 관련 컴포넌트(예: Header)가 즉시 업데이트되도록 함
      queryClient.removeQueries({ queryKey: ["me"] });
      // 3. 홈페이지로 리디렉션하며, 로그아웃 성공 토스트를 띄우도록 유도
      router.push("/?success=logout");
    },
    onError: (error) => {
      // 서버 요청 실패 시에도 클라이언트 측 상태는 확실히 정리
      removeToken();
      queryClient.removeQueries({ queryKey: ["me"] });
      // 에러가 발생해도 사용자는 로그아웃된 것으로 처리하고 홈으로 리디렉션
      router.push("/?error=logout");
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
