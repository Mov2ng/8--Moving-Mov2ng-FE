"use client";

import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { handleAuthError } from "@/utils/authError";

/**
 * React Query mutation 래퍼
 * - useMutation을 API 호출에 맞게 래핑
 * - 데이터 변경 작업(POST, PUT, DELETE) 처리
 * - API 호출을 apiClient로 통합
 * - 성공/에러 처리 통일
 * - 401 에러 발생 시 me 쿼리 자동 무효화 (accessToken 만료 시 me 캐시도 함께 무효화)
 * @param mutationFn - 뮤테이션 함수 (variables만 받는 함수)
 * @param options - 뮤테이션 옵션 (mutationKey, onSuccess, onError 등)
 * @returns useMutation 결과
 */
export function useApiMutation<TData, TVariables, TError>({
  // TData: API 응답 데이터 타입 (예: { data: { accessToken: string } })
  // TVariables: mutationFn에 전달할 인자 타입 (예: { email: string; password: string })
  // TError: 에러 타입 (예: { status: number; message: string })
  mutationFn,
  ...options
}: {
  // 실제 사용하는 mutationFn은 variables만 받는 함수
  mutationFn: (variables: TVariables) => Promise<TData>;
} & Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">) {
  // mutationFn만 타입 정의했기 때문에, 그 외 옵션을 안전히 사용하기 위해 UseMutationOptions에서 mutationFn을 제외한 나머지 옵션들을 사용
  // 브라우저 메모리에 있는 캐시 접근을 위한 queryClient 생성
  const queryClient = useQueryClient();

  // mutationFn을 래핑해 401 에러를 동기적으로 처리
  const wrappedMutationFn: MutationFunction<TData, TVariables> = async (
    variables: TVariables
  ) => {
    try {
      // mutationFn은 variables만 받으므로 직접 호출
      return await mutationFn(variables);
    } catch (error) {
      // 401 에러 발생 시 인증 상태 정리 (토큰 삭제 + me 쿼리 삭제)
      // 리디렉션은 useMe에서 처리
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 401
      ) {
        handleAuthError(queryClient);
      }
      // 에러를 다시 throw하여 React Query가 에러 상태로 처리하도록 함
      throw error;
    }
  };

  return useMutation<TData, TError, TVariables>({
    mutationFn: wrappedMutationFn,
    retry: 0,
    ...options,
  });
}
