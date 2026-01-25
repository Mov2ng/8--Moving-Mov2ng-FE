import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Provider } from "./provider";
import Header from "@/components/layout/Header";
import { RouteGuard } from "@/components/auth/RouteGuard";

export const metadata: Metadata = {
  title: "무빙",
  description: "스마트 이사 매칭 플랫폼",
};

/** 기본 locale. bfcache 활성화를 위해 headers()/cookies() 미사용 → layout static → no-store 제거 */
const DEFAULT_LOCALE = "ko" as const;

/**
 * 레이아웃 컴포넌트
 * - headers()/cookies() 미사용 → static 렌더링 → Cache-Control에 no-store 없음 → bfcache 가능
 * - locale: 클라이언트 I18nProvider에서 localStorage 우선, 없으면 ko
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <head>
        {/* NOTE preconnect: DNS 조회, TCP 연결, TLS 핸드셰이크 미리 수행 */}
        {/* NOTE dns-prefetch: DNS 조회 미리 수행 */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://t1.kakaocdn.net" />
        <link rel="dns-prefetch" href="https://t1.kakaocdn.net" />
        <link // NOTE: 브라우저가 병렬로 로드 가능 (기존: globals.css @import url() 방식은 순차적 로드)
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/static/pretendard.css"
          crossOrigin="anonymous"
        />
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-[#FFF]">
        <Provider initialLocale={DEFAULT_LOCALE}>
          <RouteGuard>
            <Header />
            {children}
          </RouteGuard>
        </Provider>
      </body>
    </html>
  );
}
