/**
 * useQuery를 api 호출에 맞게 wrapping, apiClient 통합, 타입 안정성 제공, 공통 쿼리 옵션 적용
 *
 */
"use client";

// React Query import
import {
  QueryFunctionContext,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

/**
 * React Query query 래퍼
 * - useQuery를 API 호출에 맞게 래핑
 * - API 호출을 apiClient로 통합
 * - 성공/에러 처리 통일
 * @param queryKey - 쿼리 키
 * @param queryFn - 쿼리 함수
 * @param enabled - 쿼리 활성화 여부
 * @param staleTime - 캐시 유효 시간
 * @param options - 쿼리 옵션
 * @returns useQuery 결과
 */
export function useApiQuery<TData, TError>({
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
} & Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime,
    retry: 1,
    ...options,
  });
}