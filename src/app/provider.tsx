"use client";

import React, { useState } from "react";
import {
  DehydratedState, // 서버에서 미리 가져온 쿼리 상태 타입
  HydrationBoundary, // 서버 → 클라이언트로 쿼리 상태를 복원하는 경계
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { I18nProvider } from "../libs/i18n/I18nProvider";

type ProviderProps = {
  children: React.ReactNode;
  dehydratedState?: DehydratedState; // 서버에서 dehydrate한 쿼리 상태
};

// 프로바이더: 쿼리 클라이언트 제공, 데이터 상태 관리, 국제화 지원 등
export function Provider({ children, dehydratedState }: ProviderProps) {
  // 쿼리 클라이언트 생성
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // 쿼리 옵션 설정
        defaultOptions: {
          queries: {
            retry: 1, // 실패 시 1번 재시도
            refetchOnWindowFocus: false, // 창 포커스 시 자동 리패치 방지
            staleTime: 1000 * 60, // 1분 동안 fresh 상태 유지
          },
        },
      })
  );

  return (
    // QueryClient를 React Query Context로 주입 (useQuery, useMutation 등 사용 가능)
    <QueryClientProvider client={queryClient}>
      {/* 서버에서 받아온 쿼리 상태를 클라이언트의 QueryClient에 복원하는 역할 */}
      <HydrationBoundary state={dehydratedState}> 
        <I18nProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </I18nProvider>
      </HydrationBoundary>
    </QueryClientProvider>  
  );
}
