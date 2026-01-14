"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { I18nProvider } from "../libs/i18n/I18nProvider";

type ProviderProps = {
  children: React.ReactNode;
};

// 프로바이더: 쿼리 클라이언트 제공, 데이터 상태 관리, 국제화 지원 등
export function Provider({ children }: ProviderProps) {
  // 쿼리 클라이언트 생성
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // 쿼리 옵션 설정
        defaultOptions: {
          queries: {
            retry: false, // 재시도 안 함
            staleTime: 1000 * 60, // 1분 동안 fresh 상태 유지 (1분 이내에는 리패치 안 함)
          },
        },
      })
  );

  return (
    // QueryClient를 React Query Context로 주입 (useQuery, useMutation 등 사용 가능)
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </I18nProvider>
    </QueryClientProvider>
  );
}
