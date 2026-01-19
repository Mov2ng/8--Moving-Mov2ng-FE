"use client";

import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { handleAuthError } from "@/utils/authError";
import { parseServerError } from "@/utils/parseServerError";

/**
 * 성공 시 처리 설정
 */
export type SuccessConfig = {
  /** 무효화할 쿼리 키 배열 */
  invalidateQueries?: string[][];
  /** 성공 메시지 (alert로 표시) */
  successMessage?: string;
  /** 성공 후 리디렉션 경로 */
  redirectPath?: string;
};

/**
 * 에러 시 처리 설정
 */
export type ErrorConfig = {
  /** 에러 메시지 접두사 (예: "프로필 등록") */
  errorMessagePrefix?: string;
  /** 기본 에러 메시지 (parseServerError로 파싱한 메시지가 없을 때 사용) */
  defaultErrorMessage?: string;
};

/**
 * React Query mutation 래퍼
 * - useMutation을 API 호출에 맞게 래핑
 * - 데이터 변경 작업(POST, PUT, DELETE) 처리
 * - API 호출을 apiClient로 통합
 * - 성공/에러 처리 통일
 * - 401 에러 발생 시 me 쿼리 자동 무효화 (accessToken 만료 시 me 캐시도 함께 무효화)
 * @param mutationFn - 뮤테이션 함수 (variables만 받는 함수)
 * @param successConfig - 성공 시 자동 처리 설정 (쿼리 무효화, alert, 리디렉션)
 * @param errorConfig - 에러 시 자동 처리 설정 (에러 파싱, 로깅, alert)
 * @param options - 뮤테이션 옵션 (mutationKey, onSuccess, onError 등)
 * @returns useMutation 결과
 */
export function useApiMutation<TData, TVariables, TError>({
  // TData: API 응답 데이터 타입 (예: { data: { accessToken: string } })
  // TVariables: mutationFn에 전달할 인자 타입 (예: { email: string; password: string })
  // TError: 에러 타입 (예: { status: number; message: string })
  mutationFn,
  successConfig,
  errorConfig,
  onSuccess,
  onError,
  ...options
}: {
  // 실제 사용하는 mutationFn은 variables만 받는 함수
  mutationFn: (variables: TVariables) => Promise<TData>;
  successConfig?: SuccessConfig;
  errorConfig?: ErrorConfig;
  onSuccess?: UseMutationOptions<TData, TError, TVariables>["onSuccess"];
  onError?: UseMutationOptions<TData, TError, TVariables>["onError"];
} & Omit<
  UseMutationOptions<TData, TError, TVariables>,
  "mutationFn" | "onSuccess" | "onError"
>) {
  // mutationFn만 타입 정의했기 때문에, 그 외 옵션을 안전히 사용하기 위해 UseMutationOptions에서 mutationFn을 제외한 나머지 옵션들을 사용
  // 브라우저 메모리에 있는 캐시 접근을 위한 queryClient 생성
  const queryClient = useQueryClient();
  const router = useRouter();

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

  // 성공 핸들러 통합
  const handleSuccess: UseMutationOptions<
    TData,
    TError,
    TVariables
  >["onSuccess"] = (data, variables, context, mutation) => {
    // successConfig가 있으면 자동 처리
    if (successConfig) {
      // 쿼리 무효화
      if (successConfig.invalidateQueries) {
        successConfig.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      // 성공 메시지 표시
      if (successConfig.successMessage) {
        alert(successConfig.successMessage);
      }
      // 리디렉션
      if (successConfig.redirectPath) {
        router.push(successConfig.redirectPath);
      }
    }
    // 기존 onSuccess도 호출 (있다면)
    // 타입 가드: onSuccess가 함수인지 확인
    if (onSuccess && typeof onSuccess === "function") {
      // React Query v5의 onSuccess는 3개 또는 4개 인자를 받을 수 있음
      // 타입 안전성을 위해 Parameters 유틸리티 타입으로 인자 타입 추출
      type OnSuccessParams = Parameters<
        NonNullable<UseMutationOptions<TData, TError, TVariables>["onSuccess"]>
      >;
      // 함수 시그니처에 맞게 호출 (타입 가드를 통해 안전하게 호출)
      const successHandler = onSuccess as (...args: OnSuccessParams) => void;
      successHandler(data, variables, context, mutation);
    }
  };

  // 에러 핸들러 통합
  const handleError: UseMutationOptions<
    TData,
    TError,
    TVariables
  >["onError"] = (error, variables, context, mutation) => {
    // errorConfig가 있으면 자동 처리
    if (errorConfig) {
      const parsedError = parseServerError(error);
      console.error(`${errorConfig.errorMessagePrefix || "작업"} 실패:`, {
        status: parsedError?.status,
        message: parsedError?.message,
        details: parsedError?.details,
        code: parsedError?.code,
        fullError: error,
      });
      // 사용자에게 에러 메시지 표시
      const errorMessage =
        parsedError?.message ||
        errorConfig.defaultErrorMessage ||
        "작업에 실패했습니다. 다시 시도해주세요.";
      alert(errorMessage);
    }
    // 기존 onError도 호출 (있다면)
    // 타입 가드: onError가 함수인지 확인
    if (onError && typeof onError === "function") {
      // React Query v5의 onError는 3개 또는 4개 인자를 받을 수 있음
      // 타입 안전성을 위해 Parameters 유틸리티 타입으로 인자 타입 추출
      type OnErrorParams = Parameters<
        NonNullable<UseMutationOptions<TData, TError, TVariables>["onError"]>
      >;
      // 함수 시그니처에 맞게 호출 (타입 가드를 통해 안전하게 호출)
      const errorHandler = onError as (...args: OnErrorParams) => void;
      errorHandler(error, variables, context, mutation);
    }
  };

  return useMutation<TData, TError, TVariables>({
    mutationFn: wrappedMutationFn,
    retry: 0,
    onSuccess: handleSuccess,
    onError: handleError,
    ...options,
  });
}
