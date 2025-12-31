/**
 * localStorage 접근 유틸리티
 *
 * 하이브리드 접근 방식:
 * - accessToken: localStorage/메모리에 저장 (클라이언트에서 API 호출용)
 * - refreshToken: httpOnly 쿠키에 저장 (서버에서만 접근, Middleware에서 검증)
 */

const ACCESS_TOKEN_KEY = "accessToken";

/**
 * accessToken을 localStorage에 저장
 * @param token accessToken
 */
export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

/**
 * accessToken을 localStorage에서 삭제
 */
export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

/**
 * localStorage에서 accessToken 조회 (apiClient에서 사용)
 * @returns accessToken 또는 null
 */
export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

// TODO: 나중에 메모리 저장으로 리팩토링해도 구조 변경 최소화