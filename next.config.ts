import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler 활성화 (자동 최적화)
  reactCompiler: true,

  // 외부 이미지 로드 허용 (S3 버킷)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "moving-img-s3bucket.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // 정적 리소스 캐싱 설정 (비용 절감)
  async headers() {
    return [
      {
        // Next.js 빌드 결과물 캐싱 (1년)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // max-age(1년 동안 정적 리소스 저장)
          },
        ],
      },
      {
        // Next.js 이미지 최적화 결과 캐싱 (1년)
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // immutable(파일 변경되지 않음 명시)
          },
        ],
      },
      {        
        // 커스텀 정적 에셋 캐싱 (1년)
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // public(반복 방문시 네트워크 요청 감소)
          },
        ],
      },
    ];
  },
  // 프로덕션에서 console 제거
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
};

// Sentry 설정을 Next.js 설정에 적용
export default withSentryConfig(nextConfig, {
  // Sentry 조직 및 프로젝트 정보
  org: "mov2ng",
  project: "mov2ng-fe",

  // CI 환경에서만 소스맵 업로드 로그 출력
  silent: !process.env.CI,

  // 클라이언트 소스맵을 더 넓게 업로드 (에러 추적 가독성 ↑)
  widenClientFileUpload: true,

  // 개발 환경에서만 Sentry 요청을 Next.js 라우트로 우회
  // (광고 차단 회피용, 프로덕션에서는 서버 부하 방지를 위해 비활성화)
  tunnelRoute:
    process.env.NODE_ENV === "production" ? undefined : "/monitoring",

  // 소스맵 업로드 후 로컬 파일 삭제 (보안 및 비용 절감)
  sourcemaps: {
    disable: false,
    deleteSourcemapsAfterUpload: true,
  },

  // Sentry 관련 Webpack 최적화
  webpack: {
    // 디버그용 Sentry 로그 제거 (번들 사이즈 감소)
    treeshake: {
      removeDebugLogging: true,
    },
    // Vercel Cron Monitor 자동 계측
    automaticVercelMonitors: true,
  },
});