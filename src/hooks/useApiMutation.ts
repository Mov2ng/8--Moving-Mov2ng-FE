"use client";

import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";

/** 
 * React Query mutation 래퍼
 * - useMutation을 API 호출에 맞게 래핑
 * - 데이터 변경 작업(POST, PUT, DELETE) 처리
 * - API 호출을 apiClient로 통합
 * - 성공/에러 처리 통일
 * @param mutationFn - 뮤테이션 함수
 * @param options - 뮤테이션 옵션
 * @returns useMutation 결과
 */
export function useApiMutation<TData, TVariables, TError>({
  mutationFn,
  ...options
}: {
  mutationFn: MutationFunction<TData, TVariables>
} & Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">) {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    retry: 0,
    ...options,
  });
}