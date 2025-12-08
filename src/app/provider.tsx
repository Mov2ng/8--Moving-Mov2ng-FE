'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from '../libs/i18n/I18nProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


export function Provider({ children }: { children: React.ReactNode }) { // 모든 페이지에 적용되는 공통 레이아웃
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60,
      },
    }
  }));
  
  return (
    <QueryClientProvider client={queryClient}> {/* queryClient를 사용하여 데이터 캐싱 */}
        <I18nProvider> {/* I18nContext를 사용하여 언어 설정 관리 */}
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        </I18nProvider>
    </QueryClientProvider>
  )
}