/** useMutation을 api 호출에 맞게 래핑, 데이터 변경 작업(POST, PUT, DELETE) 처리, apiClient 통합, 성공/에러 처리 통일
 */
"use client";

import {
  MutationFunction,
  MutationFunctionContext,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";

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