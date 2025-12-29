import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Provider } from "./provider";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "무빙",
  description: "스마트 이사 매칭 플랫폼",
}; // SEO + <head> 자동 관리

/**
 * 레이아웃 컴포넌트
 * @param children 자식 컴포넌트
 * @returns 레이아웃
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <Provider>
          <Header />
          {children}
        </Provider>
      </body>
    </html>
  );
}
