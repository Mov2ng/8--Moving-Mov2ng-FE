import { QueryClient } from "@tanstack/react-query";
import { removeToken } from "./tokenStorage";

/**
 * 인증 에러(401) 처리 공통 함수
 * - accessToken 삭제
 * - me 쿼리 캐시 삭제
 *
 * @param queryClient - React Query 클라이언트
 *
 * @example
 * // useApiMutation에서 사용
 * if (error?.status === 401) {
 *   handleAuthError(queryClient);
 * }
 *
 * @example
 * // useMe에서 사용
 * if (result.error?.status === 401) {
 *   handleAuthError(queryClient);
 *   router.push("/login");
 * }
 */
export function handleAuthError(queryClient: QueryClient) {
  // accessToken 삭제
  removeToken();
  // me 캐시 완전 삭제
  queryClient.removeQueries({ queryKey: ["me"] });
}
