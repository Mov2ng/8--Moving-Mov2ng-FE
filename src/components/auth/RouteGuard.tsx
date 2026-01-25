"use client";

import { useAuth } from "@/hooks/useAuth";
import { useGetMyMoverDetail, useGetProfile } from "@/hooks/useProfile";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { getToken } from "@/libs/auth/tokenStorage";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/common/Toast";
import { useI18n } from "@/libs/i18n/I18nProvider";

const PROTECTED_ROUTES = ["/profile", "/quote", "/estimate", "/review"];
const GUEST_ONLY_ROUTES = ["/login", "/signup"];
const DRIVER_ONLY_ROUTES = ["/profile", "/estimate/driver", "/profile/driver"];
const USER_ONLY_ROUTES = ["/profile/user"];
const PROFILE_MISSING_ONLY_ROUTES = ["/profile/register"];

/**
 * 프로필 미등록 여부 체크
 * me.hasProfile 우선 사용, 없으면 프로필 데이터나 에러로 판단 (하위 호환성)
 */
function checkProfileMissing(
  me?: { hasProfile?: boolean } | null,
  profileData?: unknown,
  profileError?: unknown
): boolean {
  if (me && typeof me.hasProfile === "boolean") {
    return !me.hasProfile;
  }

  if (profileData) {
    const profile = (profileData as { data?: unknown })?.data;
    if (profile) {
      const serviceCategories = (profile as { serviceCategories?: unknown[] })
        ?.serviceCategories;
      const regionData =
        (profile as { region?: unknown[] })?.region ||
        (profile as { regions?: unknown[] })?.regions;
      return (
        !Array.isArray(serviceCategories) ||
        serviceCategories.length === 0 ||
        !Array.isArray(regionData) ||
        regionData.length === 0
      );
    }
  }

  if (
    profileError &&
    typeof profileError === "object" &&
    "status" in profileError &&
    profileError.status === 404
  ) {
    return true;
  }

  return true;
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { me, isGuest, isDriver, isLoading: isPending, isFetching: isAuthFetching, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const hasRedirectedRef = useRef(false); // 리디렉션 중복 방지
  const { toastContent, showToast } = useToast();
  const { t } = useI18n();

  // 클라이언트 마운트 후에만 로딩 상태 체크 (Hydration 에러 방지)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // pathname이 변경되면 리디렉션 플래그 리셋 (리디렉션 대상 경로가 아닐 때만)
  useEffect(() => {
    if (pathname !== "/profile/register") {
      hasRedirectedRef.current = false;
    }
  }, [pathname]);

  // 페이지 이동 후 쿼리 파라미터를 확인하여 토스트 메시지를 표시합니다.
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    let message = "";

    if (success) {
      switch (success) {
        case "signup":
          message = t("signup_success");
          break;
        case "login":
          message = t("login_completed");
          break;
        case "login-profile":
          message = t("login_success"); // "프로필을 등록해주세요"
          break;
        case "logout":
          message = t("logout_success");
          break;
      }
    } else if (error) {
      switch (error) {
        case "logout":
          message = t("logout_error");
          break;
      }
    }

    if (message) {
      showToast(message);
      router.replace(pathname, { scroll: false }); // 토스트 표시 후 URL에서 쿼리 파라미터 제거
    }
  }, [searchParams, pathname, router, showToast, t]);

  // 보호된 경로 접근 시도
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  
  // 캐시 확인: me가 있으면 캐시된 데이터 있음
  const hasCachedData = me !== undefined;
  
  // 로딩 체크: 캐시 없고 보호된 경로이고 실제 로딩 중일 때만
  const hasToken = isMounted && getToken() !== null;
  const isAuthLoading = isProtectedRoute && !hasCachedData && hasToken && isPending && me === undefined;
  const isCurrentlyLoading = isAuthLoading;

  // 프로필 미등록자만 접근 가능한 경로
  const isProfileMissingOnlyRoute = PROFILE_MISSING_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isDriverOnlyRoute =
    pathname === "/profile" ||
    DRIVER_ONLY_ROUTES.some((route) => route !== "/profile" && pathname.startsWith(route));
  const isUserOnlyRoute = USER_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const canCheckProfile = !isGuest && !isAuthLoading;
  const shouldWaitForAuth = pathname === "/profile/register" && hasToken && isAuthLoading;
  const needsProfileCheck = canCheckProfile && me && typeof me.hasProfile !== "boolean";

  const shouldFetchDriverProfile =
    isDriver && needsProfileCheck && isDriverOnlyRoute;
  const shouldFetchUserProfile = !isDriver && needsProfileCheck && isUserOnlyRoute;

  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
    isError,
    isFetching,
  } = useGetMyMoverDetail(shouldFetchDriverProfile);

  const {
    data: userProfileData,
    isLoading: isUserProfileLoading,
    error: userProfileError,
    isError: isUserProfileError,
    isFetching: isUserProfileFetching,
  } = useGetProfile(shouldFetchUserProfile);

  useEffect(() => {
    if (isCurrentlyLoading || shouldWaitForAuth) return;

    // 프로필 등록 페이지: 이미 프로필이 등록되어 있으면 홈으로 리디렉션
    if (isProfileMissingOnlyRoute && canCheckProfile && me?.hasProfile === true) {
      router.push("/");
      return;
    }

    // 비회원이 보호된 경로 접근 시 로그인 페이지로 리디렉션
    // 로딩이 완료된 후(isLoading, isAuthFetching이 false) 실제 게스트인 경우에만 리디렉션
    if (
      isProtectedRoute &&
      isGuest &&
      !shouldWaitForAuth &&
      !isPending &&
      !isAuthFetching &&
      status !== "pending"
    ) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // 권한 체크: 잘못된 경로 접근 시 홈으로 리디렉션
    if (
      (isDriverOnlyRoute && !isGuest && !isDriver && !isProfileMissingOnlyRoute) ||
      (isUserOnlyRoute && !isGuest && isDriver) ||
      (isGuestOnlyRoute && !isGuest)
    ) {
      router.push("/");
      return;
    }

    // 드라이버 전용 경로: 프로필 미등록 시 리디렉션 (한 번만)
    if (
      !hasRedirectedRef.current &&
      pathname !== "/profile/register" &&
      isDriverOnlyRoute &&
      isDriver &&
      !isProfileMissingOnlyRoute &&
      !isProfileLoading &&
      !isFetching &&
      (me?.hasProfile === false ||
        (profileData && checkProfileMissing(me, profileData, profileError)) ||
        (isError && profileError))
    ) {
      hasRedirectedRef.current = true;
      showToast(t("profile_register_required"));
      router.push("/profile/register");
      return;
    }

    // 일반 회원 전용 경로: 프로필 미등록 시 리디렉션 (한 번만)
    if (
      !hasRedirectedRef.current &&
      pathname !== "/profile/register" &&
      isUserOnlyRoute &&
      !isDriver &&
      !isGuest &&
      !isProfileMissingOnlyRoute &&
      !isUserProfileLoading &&
      !isUserProfileFetching &&
      (me?.hasProfile === false ||
        (userProfileData && checkProfileMissing(me, userProfileData, userProfileError)) ||
        (isUserProfileError && userProfileError))
    ) {
      hasRedirectedRef.current = true;
      showToast(t("profile_register_required"));
      router.push("/profile/register");
      return;
    }
  }, [
    isGuest,
    isDriver,
    me,
    isPending,
    isAuthFetching,
    status,
    isProfileLoading,
    isFetching,
    profileData,
    profileError,
    isError,
    isUserProfileLoading,
    isUserProfileFetching,
    userProfileData,
    userProfileError,
    isUserProfileError,
    pathname,
    router,
    isCurrentlyLoading,
    shouldWaitForAuth,
    canCheckProfile,
    isProfileMissingOnlyRoute,
    isProtectedRoute,
    isDriverOnlyRoute,
    isUserOnlyRoute,
    isGuestOnlyRoute,
  ]);

  // 프로필 데이터 로딩: 캐시 없고 프로필 체크 필요할 때만
  const isProfileDataLoading =
    !hasCachedData &&
    needsProfileCheck &&
    ((isDriverOnlyRoute && isDriver && isProfileLoading) ||
      (isUserOnlyRoute && !isDriver && isUserProfileLoading));

  // 프로필 미등록 체크: 리디렉션이 필요한 경우 렌더링하지 않음
  const isAuthComplete = !isPending && !isAuthFetching && status !== "pending";
  const isDriverProfileMissing =
    isAuthComplete &&
    !hasRedirectedRef.current &&
    pathname !== "/profile/register" &&
    isDriverOnlyRoute &&
    isDriver &&
    !isProfileMissingOnlyRoute &&
    !isProfileLoading &&
    !isFetching &&
    (me?.hasProfile === false ||
      (profileData && checkProfileMissing(me, profileData, profileError)) ||
      (isError && profileError));

  const isUserProfileMissing =
    isAuthComplete &&
    !hasRedirectedRef.current &&
    pathname !== "/profile/register" &&
    isUserOnlyRoute &&
    !isDriver &&
    !isGuest &&
    !isProfileMissingOnlyRoute &&
    !isUserProfileLoading &&
    !isUserProfileFetching &&
    (me?.hasProfile === false ||
      (userProfileData && checkProfileMissing(me, userProfileData, userProfileError)) ||
      (isUserProfileError && userProfileError));

  // 프로필 미등록이면 렌더링하지 않음 (useEffect에서 리디렉션 처리)
  if (isDriverProfileMissing || isUserProfileMissing) {
    return null;
  }

  // 로딩 스피너: 캐시 없고 로딩 중일 때만
  const isAllLoading = !hasCachedData && (isCurrentlyLoading || isProfileDataLoading || shouldWaitForAuth);

  if (isAllLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  // 리디렉션 중이면 렌더링하지 않음 (로딩 완료 후에만 체크)
  if (isAuthComplete) {
    if (
      (isProtectedRoute && isGuest && !shouldWaitForAuth) ||
      (isDriverOnlyRoute && !isGuest && !isDriver && !isProfileMissingOnlyRoute) ||
      (isUserOnlyRoute && !isGuest && isDriver) ||
      (isGuestOnlyRoute && !isGuest) ||
      (isProfileMissingOnlyRoute && !isGuest && me?.hasProfile === true)
    ) {
      return null;
    }
  }

  return (
    <>
      {children}
      <Toast content={toastContent} />
    </>
  );
}
// TODO: 보호 접근 페이지에 프로필 미등록 판단시 토스트 컴포넌트로 알리고 리디렉션 처리