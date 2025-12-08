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