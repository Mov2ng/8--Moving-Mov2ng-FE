"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * RouteGuard - 클라이언트에서 접근 제한
 * - useAuth로 role 체크
 * - 프로필 완성 여부 등 추가 검증 가능
 */

// 보호가 필요한 경로 목록
const PROTECTED_ROUTES = ["/profile", "/quote", "/movers", "/estimate"];

// 로그인한 사용자가 접근하면 안 되는 경로
const GUEST_ONLY_ROUTES = ["/login", "/signup"];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isGuest, isLoading, me } = useAuth();
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

  useEffect(() => {
    // 로딩 중이면 아무것도 안 함
    if (isLoading) return;

    /* Middleware에서 이미 차단했지만, 혹시 모를 경우 대비 */

    // 비회원이 보호된 경로 접근 시도 시 로그인 페이지로 리디렉션
    if (isProtectedRoute && isGuest) {
      router.push("/login");
      return;
    }
    // 로그인한 사용자가 게스트 전용 경로 접근 시도 시 홈으로 리디렉션
    if (isGuestOnlyRoute && !isGuest) {
      router.push("/");
      return;
    }

    // TODO: 여기에 Role 기반 접근 제어나 프로필 완성 여부 체크 등 추가 가능
    // 예: if (pathname.startsWith("/movers") && me?.role !== "USER") { ... }
  }, [
    isGuest,
    isLoading,
    pathname,
    isProtectedRoute,
    isGuestOnlyRoute,
    router,
    me,
  ]);

  // 로딩 중일 때는 로딩 UI 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>로딩 중...</div>
      </div>
    );
  }

  // 리디렉션 중이면 렌더링하지 않음 (깜빡임 방지)
  if ((isProtectedRoute && isGuest) || (isGuestOnlyRoute && !isGuest)) {
    return null;
  }

  return <>{children}</>;
}
