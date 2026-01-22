import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { headers, cookies } from "next/headers";
import { Provider } from "./provider";
import Header from "@/components/layout/Header";
import { RouteGuard } from "@/components/auth/RouteGuard";

export const metadata: Metadata = {
  title: "무빙",
  description: "스마트 이사 매칭 플랫폼",
};

/**
 * Accept-Language 헤더에서 언어 코드 추출
 * (쿠키 대신 헤더만 사용하여 성능 최적화)
 */
function detectLocaleFromHeaders(acceptLanguage: string | null): "ko" | "en" | "zh" {
  if (!acceptLanguage) return "ko";
  
  const langCode = acceptLanguage.toLowerCase().split(",")[0].split("-")[0].trim();
  
  if (langCode === "ko") return "ko";
  if (langCode === "zh" || langCode === "cn") return "zh";
  return "en";
}

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
  // Accept-Language 헤더에서 초기 locale 결정
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");
  const initialLocale = detectLocaleFromHeaders(acceptLanguage);

  // refreshToken 쿠키 확인하여 초기 인증 상태 결정 (깜빡임 방지)
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");
  const hasRefreshToken = !!refreshToken?.value;

  return (
    <html lang={initialLocale}>
      <head>
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-[#FFF]">
        <Provider initialLocale={initialLocale} initialHasAuth={hasRefreshToken}>
          <RouteGuard>
            <Header />
            {children}
          </RouteGuard>
        </Provider>
      </body>
    </html>
  );
}
