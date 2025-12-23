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

async function prefetchMe() {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(
      ({ name, value }: { name: string; value: string }) => `${name}=${value}`
    )
    .join("; ");

  if (!cookieHeader) return null;

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: { Cookie: cookieHeader },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) return null;
    return response.json().catch(() => null);
  } catch (error) {
    console.error("서버 사이드 me 호출 실패:", error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60,
      },
    },
  });

  const isDev = process.env.NODE_ENV === "development";
  const me = isDev ? null : await prefetchMe();

  if (me) queryClient.setQueryData(["me"], me);

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="ko">
      {/* ✅ 전역 배경색 여기서 설정 */}
      <body className="min-h-screen bg-[#F7F7F7]">
        <Provider dehydratedState={dehydratedState}>
          {/* ✅ Header는 RootLayout에만 1번 */}
          <Header />
          {children}
        </Provider>
      </body>
    </html>
  );
}
