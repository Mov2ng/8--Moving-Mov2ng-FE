"use client";

// React Query import
import {
  QueryFunctionContext,
  useQuery,
  UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";

/**
 * React Query query 래퍼
 * - useQuery를 API 호출에 맞게 래핑
 * - 공통 쿼리 옵션 적용
 * - API 호출을 apiClient로 통합
 * - 성공/에러 처리 통일
 * - 401 에러 발생 시 me 쿼리 자동 무효화 (accessToken 만료 시 me 캐시도 함께 무효화)
 * @param queryKey - 쿼리 키
 * @param queryFn - 쿼리 함수
 * @param enabled - 쿼리 활성화 여부
 * @param staleTime - 캐시 유효 시간
 * @param options - 쿼리 옵션
 * @returns useQuery 결과
 */
export function useApiQuery<TData, TError>({
  // 제네릭: 함수 재사용을 위해 타입을 변수처럼 사용
  queryKey,
  queryFn,
  enabled,
  staleTime,
  ...options
}: {
  queryKey: unknown[];
  queryFn: (context: QueryFunctionContext) => Promise<TData> | TData;
  enabled?: boolean;
  staleTime?: number;
  // Omit: UseQueryOptions에서 이미 타입 정의한 queryKey와 queryFn을 제외한 나머지 옵션들을 사용
} & Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) {
  // 브라우저 메모리에 있는 캐시 접근을 위한 queryClient 생성
  const queryClient = useQueryClient();

  // queryFn을 래핑해 401 에러를 동기적으로 처리
  const wrappedQueryFn = async (context: QueryFunctionContext) => {
    try {
      return await queryFn(context);
    } catch (error) {
      // 401 에러 발생 시 me 쿼리 무효화 (accessToken 만료 시 me 캐시도 함께 무효화)
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 401
      ) {
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
      // 에러를 다시 throw하여 React Query가 에러 상태로 처리하도록 함
      throw error;
    }
  };

  return useQuery({
    queryKey,
    queryFn: wrappedQueryFn,
    enabled,
    staleTime,
    retry: 1,
    ...options,
  });
}
