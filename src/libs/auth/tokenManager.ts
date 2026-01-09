import { apiClient } from "@/libs/apiClient";
import { removeToken, setToken } from "./tokenStorage";

// 동시 요청 시 refresh 중복 호출 방지
let isRefreshing = false; // refresh 중복 호출 방지 플래그
let refreshPromise: Promise<string | null> | null = null; // refresh 프로미스

/**
 * refreshToken으로 accessToken 재발급 유틸리티
 * - apiClient에서 API 호출 시 401 (Unauthorized) 에러가 발생 & accessToken이 만료되었거나 유효하지 않을 때
 * - 사용자가 로그인 상태를 유지하면서 API 호출을 계속할 수 있도록 accessToken 재발급
 * @returns 새로 발급받은 accessToken 또는 null (실패 시)
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise; // 이미 리프레시 중이면 기존 프로미스 반환
  }

  isRefreshing = true; // 리프레시 중 플래그 설정
  refreshPromise = (async () => {
    try {
      // skipAutoRefresh: true로 설정하여 401 발생 시 자동 재발급 시도하지 않음 (무한루프 방지)
      const response = await apiClient("/auth/refresh", {
        method: "POST",
        skipAutoRefresh: true, // 무한루프 방지
      });

      // 응답 데이터 구조 확인
      const accessToken = response?.accessToken || response?.data?.accessToken;

      if (!accessToken) {
        removeToken();
        return null;
      }

      // 새 accessToken을 localStorage에 저장
      setToken(accessToken);
      return accessToken;
    } catch {
      // 네트워크 에러 등 예외 발생 시 토큰만 삭제 (리디렉션은 호출하는 쪽에서 처리)
      removeToken();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
