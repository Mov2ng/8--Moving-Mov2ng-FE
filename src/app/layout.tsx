import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "./provider";
import Header from "@/components/layout/Header";
import { cookies } from "next/headers"; // 서버 사이드에서 쿠키 가져오기
import { API_URL } from "@/libs/apiClient";
import { QueryClient, dehydrate } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "무빙",
  description: "스마트 이사 매칭 플랫폼",
}; // SEO + <head> 자동 관리

/**
 * 서버에서 me 데이터를 미리 호출하는 함수
 * @returns me 데이터
 */
async function prefetchMe() {
  // 서버에서 요청에 포함된 쿠키 가져오기
  const cookieStore = await cookies();

  // fetch에 넣을 Cookie 헤더 문자열 생성
  const cookieHeader = cookieStore
    .getAll()
    .map(
      ({ name, value }: { name: string; value: string }) => `${name}=${value}`
    )
    .join("; ");

    // 로그인 안된 경우 → 가져올 필요 X
  if (!cookieHeader) {
    return null;
  }

  // 로그인 된 경우
  try {
    // me 데이터 호출
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader, // 쿠키 헤더 전송
      },
      credentials: "include", // 쿠키 포함 전송
      cache: "no-store", // 항상 최신 사용자 정보
    });

    // 인증 실패 → 토큰 만료
    if (!response.ok) {
      return null;
    }

    return response.json().catch(() => null);
  } catch (error) {
    console.error("서버 사이드 me 호출 실패:", error);
    return null;
  }
}

/**
 * 서버 사이드에서 쿼리 클라이언트 생성 및 me 데이터 미리 가져오기
 * @param children 자식 컴포넌트
 * @returns 레이아웃
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버사이드에서 쿼리 클라이언트 생성
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60,
      },
    },
  });

  // 서버 사이드에서 me 데이터 미리 가져오기
  const me = await prefetchMe();

  // me 데이터가 있으면 React Query 캐시에 수동으로 저장
  if (me) {
    queryClient.setQueryData(["me"], me);
  }

  // 서버의 QueryClient 상태를 직렬화(dehydrate)해서 클라이언트에 전달
  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="ko">
      <body>
        {/* 서버에서 받아온 쿼리 상태를 클라이언트의 QueryClient에 복원하는 역할 */}
        <Provider dehydratedState={dehydratedState}>
          <Header />
          {children}
        </Provider>
      </body>
    </html>
  );
}
