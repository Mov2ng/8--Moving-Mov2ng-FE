import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "./provider";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "무빙",
  description: "스마트 이사 매칭 플랫폼",
};

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
      <body className="min-h-screen bg-[#F7F7F7]">
        <Provider>
          <Header />
          {children}
        </Provider>
      </body>
    </html>
  );
}
