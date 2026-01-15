"use client";

import { useAuth } from "@/hooks/useAuth";
import { useGetMyMoverDetail } from "@/hooks/useProfile";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * RouteGuard - 클라이언트 사이드에서 접근 제한
 * - useAuth로 인증 상태 체크
 * - 프로필 완성 여부 등 추가 검증 가능
 */

// 게스트 접근 불가 목록
const PROTECTED_ROUTES = ["/profile", "/quote", "/estimate", "/review"];

// 회원 접근 불가
const GUEST_ONLY_ROUTES = ["/login", "/signup"];

// 기사님만 접근 가능한 경로
// /profile은 정확히 일치하는 경우만, /profile/driver로 시작하는 경로는 모두 기사 전용
const DRIVER_ONLY_ROUTES = ["/estimate/driver, /profile/driver"];

// 일반 회원만 접근 가능한 경로
const USER_ONLY_ROUTES = ["/profile/user"];

// 모든 회원 접근 가능한 경로 (예외 처리용)
const PUBLIC_PROFILE_ROUTES = ["/profile/register"];

/**
 * 프로필 미등록 여부 체크
 * @param profileData - 프로필 데이터
 * @param profileError - 프로필 에러
 * @returns 프로필이 미등록되었는지 여부
 */
function checkProfileMissing(
  profileData: unknown,
  profileError: unknown
): boolean {
  const profile = (profileData as { data?: unknown })?.data;

  // 프로필 데이터가 있으면 데이터 기반으로 판단
  if (profile) {
    // 프로필이 있거나 필수 정보가 없는 경우
    const hasServiceCategories =
      (profile as { serviceCategories?: unknown[] })?.serviceCategories &&
      Array.isArray(
        (profile as { serviceCategories?: unknown[] }).serviceCategories
      ) &&
      ((profile as { serviceCategories?: unknown[] }).serviceCategories
        ?.length ?? 0) > 0;

    const hasRegion =
      (profile as { regions?: unknown[] })?.regions &&
      Array.isArray((profile as { regions?: unknown[] }).regions) &&
      ((profile as { regions?: unknown[] }).regions?.length ?? 0) > 0;

    // 필수 정보가 없으면 프로필 미등록으로 판단
    return !hasServiceCategories || !hasRegion;
  }

  // 프로필 데이터가 없을 때만 에러 체크
  // 404 에러만 프로필 미등록으로 판단 (401, 500 등은 네트워크/인증 문제이므로 프로필 미등록으로 판단하지 않음)
  if (profileError) {
    if (
      typeof profileError === "object" &&
      "status" in profileError &&
      profileError.status === 404
    ) {
      // 404 에러는 프로필이 실제로 없는 경우
      return true;
    }
    // 404가 아닌 에러(401 토큰 만료, 500 서버 에러, 네트워크 에러 등)는
    // 프로필 미등록이 아닌 다른 문제이므로 false 반환 (프로필 체크 건너뜀)
    return false;
  }

  // 프로필 데이터도 없고 에러도 없으면 프로필 미등록으로 판단
  return true;
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isGuest, isDriver, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 보호된 경로 접근 시도
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // 게스트 전용 경로 접근 시도
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // 모든 회원 접근 가능한 프로필 경로 (예외 처리용)
  const isProfileRegisterRoute = PUBLIC_PROFILE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // 기사님 전용 경로 접근 시도
  const isDriverOnlyRoute =
    pathname === "/profile" ||
    DRIVER_ONLY_ROUTES.some((route) => pathname.startsWith(route));

  // 일반 회원 전용 경로 접근 시도
  const isUserOnlyRoute = USER_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  // 드라이버 전용 경로에서 프로필 조회 (드라이버이고 로딩이 완료되었을 때만)
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
    isError,
    isFetching,
  } = useGetMyMoverDetail(isDriver && !isLoading && isDriverOnlyRoute);

  useEffect(() => {
    // 로딩 중이면 아무것도 안 함
    if (isLoading) return;

    // 비회원이 보호된 경로 접근 시도 시 로그인 페이지로 리디렉션
    if (isProtectedRoute && isGuest) {
      // 리디렉션 후 원래 가려던 경로로 돌아올 수 있도록 URL 파라미터로 전달
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }

    // 기사님이 아닌 회원이 기사님 전용 경로 접근 시도 시 홈으로 리디렉션
    if (isDriverOnlyRoute && !isGuest && !isDriver && !isProfileRegisterRoute) {
      router.push("/");
      return;
    }

    // 일반 회원이 아닌 회원이 일반 회원 전용 경로 접근 시도 시 홈으로 리디렉션
    if (isUserOnlyRoute && !isGuest && isDriver) {
      router.push("/");
      return;
    }

    // 로그인한 사용자가 게스트 전용 경로 접근 시도 시 홈으로 리디렉션
    if (isGuestOnlyRoute && !isGuest) {
      router.push("/");
      return;
    }

    // 드라이버 전용 경로 접근 시 프로필 등록 여부 체크
    if (
      isDriverOnlyRoute &&
      isDriver &&
      !isProfileLoading &&
      !isFetching && // 재시도 중이 아닐 때만 체크
      pathname !== "/profile/register" // 프로필 등록 페이지이므로 예외 처리
    ) {
      // 프로필 데이터가 있으면 캐시된 데이터로 판단 (가장 안전)
      if (profileData) {
        const isProfileMissing = checkProfileMissing(profileData, profileError);
        if (isProfileMissing) {
          alert("프로필 등록 후 이용 부탁드립니다.");
          router.push("/profile/register");
          return;
        }
        // 프로필 데이터가 있고 유효하면 통과
        return;
      }

      // 프로필 데이터가 없을 때만 에러 체크
      if (isError && profileError) {
        const is404Error =
          typeof profileError === "object" &&
          "status" in profileError &&
          profileError.status === 404;

        // 404 에러만 프로필 미등록으로 판단
        if (is404Error) {
          alert("프로필 등록 후 이용 부탁드립니다.");
          router.push("/profile/register");
          return;
        }
      }
    }
  }, [
    isGuest,
    isDriver,
    isLoading,
    isProfileLoading,
    isFetching,
    profileData,
    profileError,
    isError,
    pathname,
    router,
    isProtectedRoute,
    isGuestOnlyRoute,
    isDriverOnlyRoute,
    isUserOnlyRoute,
    isProfileRegisterRoute,
  ]);

  // 로딩 중일 때는 로딩 UI 표시
  // TODO: 추후 로딩중 텍스트 애니메이션으로 변경
  if (
    isLoading ||
    (isDriverOnlyRoute && isDriver && (isProfileLoading || isFetching))
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>로딩 중...</div>
      </div>
    );
  }

  // 리디렉션 중이면 렌더링하지 않음 (깜빡임 방지)
  if (
    (isProtectedRoute && isGuest) || // 보호된 경로 접근 시도 시
    (isDriverOnlyRoute && !isGuest && !isDriver && !isProfileRegisterRoute) || // 기사님 전용 경로 접근 시도 시
    (isUserOnlyRoute && !isGuest && isDriver) || // 일반 회원 전용 경로 접근 시도 시
    (isGuestOnlyRoute && !isGuest) // 게스트 전용 경로 접근 시도 시
  ) {
    return null;
  }

  // 드라이버 전용 경로에서 프로필 미등록 시 리디렉션 중이면 렌더링하지 않음
  if (
    isDriverOnlyRoute &&
    isDriver &&
    !isProfileLoading &&
    !isFetching && // 재시도 중이 아닐 때만 체크
    pathname !== "/profile/register" // 프로필 등록 페이지이므로 예외 처리
  ) {
    // 프로필 데이터가 있으면 캐시된 데이터로 판단
    if (profileData) {
      if (checkProfileMissing(profileData, profileError)) {
        return null;
      }
      // 프로필 데이터가 있고 유효하면 통과
      return <>{children}</>;
    }

    // 프로필 데이터가 없을 때만 에러 체크
    if (isError && profileError) {
      const is404Error =
        typeof profileError === "object" &&
        "status" in profileError &&
        profileError.status === 404;

      // 404 에러만 프로필 미등록으로 판단
      if (is404Error) {
        return null;
      }
      // 404가 아닌 에러는 프로필 체크를 건너뛰고 페이지 렌더링 허용
    }
  }

  return <>{children}</>;
}
