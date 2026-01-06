import { NextResponse, NextRequest } from "next/server";

/**
 * Middleware - 서버 사이드에서 페이지 접근 제한 가능
 * - 페이지 렌더링 전, 페이지 요청이 Next.js에 도착했을 때 실행
 * - refreshToken 쿠키로 로그인 여부 체크
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 쿠키에서 refreshToken 확인 (서버에서만 접근 가능한 httpOnly 쿠키)
  // refreshToken이 있으면 세션이 유효하다고 판단
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = !!refreshToken;

  // 보호된 경로 목록 (인증 필요)
  const protectedRoutes = ["/profile", "/quote", "/estimate"];

  // 게스트 전용 경로 (로그인한 사용자 접근 불가)
  const guestOnlyRoutes = ["/login", "/signup"];

  // 보호된 경로 접근 시도
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    // 인증되지 않은 사용자가 보호된 경로 접근 시 로그인 페이지로 리디렉션
    const loginUrl = new URL("/login", request.url);
    // 리디렉션 후 원래 가려던 경로로 돌아올 수 있도록 저장 (선택사항)
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 게스트 전용 경로 접근 시도
  const isGuestOnlyRoute = guestOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isGuestOnlyRoute && isAuthenticated) {
    // 이미 로그인한 사용자가 로그인/회원가입 페이지 접근 시 홈으로 리디렉션
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

/**
 * Middleware 실행 범위 설정
 * - matcher로 미리 필터링하면 함수가 실행되지 않아 성능상 유리
 * - API 라우트, static 파일 등은 제외
 */
export const config = {
  matcher: [
    /*
     * 모든 경로에서 다음 항목들 제외:
     * - /api/* (API routes)
     * - /_next/* (Next.js 내부 파일)
     * - /favicon.ico (favicon file)
     */
    "/((?!api|_next|favicon.ico).*)",
  ],
};
