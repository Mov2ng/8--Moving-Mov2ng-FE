import { QueryClient } from "@tanstack/react-query";
import { removeToken } from "@/libs/auth/tokenStorage";

/**
 * 인증 에러(401) 처리 공통 함수
 * - accessToken 삭제
 * - me 쿼리 캐시 삭제 (queryClient가 제공된 경우)
 * - 선택적으로 리디렉션 및 메시지 표시
 * @param queryClient - React Query 클라이언트 (optional, 제공되면 쿼리 캐시도 삭제)
 * @param options - 추가 옵션 (리디렉션, 메시지 표시 등)
 */
export function handleAuthError(
  queryClient?: QueryClient,
  options?: {
    redirectTo?: string;
    showMessage?: string;
    onShowMessage?: (message: string) => void; // toast 콜백
  }
) {
  // accessToken 삭제
  removeToken();
  
  // me 캐시 완전 삭제 (queryClient가 제공된 경우만)
  if (queryClient) {
    queryClient.removeQueries({ queryKey: ["me"] });
  }

  // 메시지 표시 (toast 콜백이 있으면 사용, 없으면 alert)
  if (options?.showMessage) {
    if (options.onShowMessage) {
      options.onShowMessage(options.showMessage);
    } else {
      // fallback: alert (하위 호환성)
      alert(options.showMessage);
    }
  }

  // 리디렉션 (클라이언트 사이드에서만 동작)
  if (options?.redirectTo && typeof window !== "undefined") {
    window.location.href = options.redirectTo;
  }
}
