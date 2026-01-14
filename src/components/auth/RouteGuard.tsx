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

  // 프로필 조회 에러 체크 (404 등)
  const isProfileError = Boolean(
    profileError &&
      ((typeof profileError === "object" &&
        "status" in profileError &&
        profileError.status === 404) ||
        profileError !== null)
  );

  // 프로필이 없거나 필수 정보가 없는 경우
  const hasServiceCategories =
    (profile as { serviceCategories?: unknown[] })?.serviceCategories &&
    Array.isArray(
      (profile as { serviceCategories?: unknown[] }).serviceCategories
    ) &&
    ((profile as { serviceCategories?: unknown[] }).serviceCategories?.length ??
      0) > 0;

  const hasRegion =
    (profile as { regions?: unknown[] })?.regions &&
    Array.isArray((profile as { regions?: unknown[] }).regions) &&
    ((profile as { regions?: unknown[] }).regions?.length ?? 0) > 0;

  // FIXME: 종종 프로필 등록했음에도 미등록 판단 오류가 있음. 해결할 것
  // 프로필 조회 실패 (404 등) 또는 필수 정보가 없으면 프로필 미등록으로 판단
  return isProfileError || !profile || !hasServiceCategories || !hasRegion;
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
      pathname !== "/profile/register" // 프로필 등록 페이지이므로 예외 처리
    ) {
      const isProfileMissing = checkProfileMissing(profileData, profileError);

      if (isProfileMissing) {
        alert("프로필 등록 후 이용 부탁드립니다.");
        router.push("/profile/register");
        return;
      }
    }
  }, [
    isGuest,
    isDriver,
    isLoading,
    isProfileLoading,
    profileData,
    profileError,
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
  if (isLoading || (isDriverOnlyRoute && isDriver && isProfileLoading)) {
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
    pathname !== "/profile/register" // 프로필 등록 페이지이므로 예외 처리
  ) {
    if (checkProfileMissing(profileData, profileError)) {
      return null;
    }
  }

  return <>{children}</>;
}
