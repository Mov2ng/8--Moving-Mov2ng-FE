/**
 * localStorage 접근 유틸리티
 *
 * 하이브리드 접근 방식:
 * - accessToken: localStorage/메모리에 저장 (클라이언트에서 API 호출용)
 * - refreshToken: httpOnly 쿠키에 저장 (서버에서만 접근, Middleware에서 검증)
 */

import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN_KEY = "accessToken";

/**
 * JWT 토큰의 만료 시간을 디코딩하여 확인
 * @param token JWT 토큰
 * @returns 만료 여부 (true: 만료됨, false: 유효함)
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    if (!decoded.exp) {
      return true; // exp가 없으면 만료된 것으로 간주
    }
    // exp는 초 단위, 현재 시간과 비교 (여유를 위해 10초 여유를 둠)
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp <= currentTime + 10;
  } catch {
    // 디코딩 실패 시 만료된 것으로 간주
    return true;
  }
}

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
