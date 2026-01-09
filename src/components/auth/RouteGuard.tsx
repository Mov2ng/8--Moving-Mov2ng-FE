"use client";

import { useAuth } from "@/hooks/useAuth";
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

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isGuest, isLoading } = useAuth();
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

    // 비회원이 보호된 경로 접근 시도 시 로그인 페이지로 리디렉션
    if (isProtectedRoute && isGuest) {
      // 리디렉션 후 원래 가려던 경로로 돌아올 수 있도록 저장
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }

    // 로그인한 사용자가 게스트 전용 경로 접근 시도 시 홈으로 리디렉션
    if (isGuestOnlyRoute && !isGuest) {
      router.push("/");
      return;
    }
  }, [
    isGuest,
    isLoading,
    pathname,
    router,
    isProtectedRoute,
    isGuestOnlyRoute,
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
