'use client';

import React from 'react';
import { UserProvider } from '@/contexts/UserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from './i18n/I18nProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 1번 재시도
      refetchOnWindowFocus: false, // 창 포커스 시 재시도 안함
      staleTime: 1000 * 60 * 1, // 1분
    }
}})

export function Provider({ children }: { children: React.ReactNode }) { // 모든 페이지에 적용되는 공통 레이아웃
  return (
    <QueryClientProvider client={queryClient}> {/* queryClient를 사용하여 데이터 캐싱 */}
      <UserProvider> {/* UserContext를 사용하여 로그인 유저 정보 관리 */}
        <I18nProvider> {/* I18nContext를 사용하여 언어 설정 관리 */}
        {children}
        </I18nProvider>
      </UserProvider>
    </QueryClientProvider>
  )
}