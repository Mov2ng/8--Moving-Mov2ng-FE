import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "./provider";
import Header from "@/components/layout/Header";
import { cookies } from "next/headers";
import { API_URL } from "@/libs/apiClient";
import { QueryClient, dehydrate } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "무빙",
  description: "스마트 이사 매칭 플랫폼",
};

/**
 * 서버에서 me 데이터를 미리 호출하는 함수
 * @returns me 데이터
 */
async function prefetchMe() {
  const cookieStore = await cookies();

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

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json().catch(() => null);
  } catch (error) {
    console.error("서버 사이드 me 호출 실패:", error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60,
      },
    },
  });

  // ✅ dev에서는 me 프리패치 스킵 (백엔드 불안정/404/timeout으로 전체 렌더가 멈추는 것 방지)
  const isDev = process.env.NODE_ENV === "development";
  const me = isDev ? null : await prefetchMe();

  if (me) {
    queryClient.setQueryData(["me"], me);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="ko">
      <body>
        <Provider dehydratedState={dehydratedState}>
          <Header />
          {children}
        </Provider>
      </body>
    </html>
  );
}
