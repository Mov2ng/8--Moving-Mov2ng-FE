// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

/**
 * Sentry 클라이언트 사이드 초기화 (비용 최적화 설정)
 * - 무료 플랜: 에러 5,000개/월, 스팬 1천만 개/월
 * - 비용 절감 전략: 샘플링 최소화, Session Replay 선택적, 중복 에러 필터링
 */

import * as Sentry from "@sentry/nextjs";

// DSN이 없으면 Sentry 비활성화 (로컬 개발 시 비용 절감)
if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
  console.log("⚠️ NEXT_PUBLIC_SENTRY_DSN이 없어 Sentry를 비활성화합니다.");
} else {
  // 환경별 샘플링 비율 설정 (비용 최적화)
  const getSampleRate = () => {
    const env = process.env.NODE_ENV;
    if (env === "production") {
      return 0.01; // 프로덕션: 1%만 추적
    }
    if (env === "development") {
      return 0.1; // 개발: 10% 추적
    }
    return 1.0; // 로컬: 100% 추적 (로컬은 DSN 없으면 비활성화됨)
  };

  // Session Replay는 비용이 많이 들므로 프로덕션에서는 비활성화
  const isProduction = process.env.NODE_ENV === "production";
  const integrations = [];

  // 프로덕션에서는 Session Replay 비활성화 (비용 절감)
  if (!isProduction) {
    integrations.push(
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      })
    );
  }

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",

    // 트레이스 샘플링 (비용 절감)
    tracesSampleRate: getSampleRate(),

    // Session Replay 샘플링 (비용 절감)
    // 프로덕션에서는 완전히 비활성화, 개발 환경에서만 최소한으로 사용
    replaysOnErrorSampleRate: isProduction ? 0 : 0.1, // 에러 발생 시 10%만 리플레이
    replaysSessionSampleRate: isProduction ? 0 : 0.01, // 전체 세션의 1%만 리플레이

    integrations,

    // PII 데이터 전송 비활성화 (비용 절감)
    sendDefaultPii: false,

    // 무료 플랜 한도 초과 방지
    maxBreadcrumbs: 30, // 기본값 100 → 30으로 감소

    // 중복/불필요한 에러 필터링 (비용 절감)
    beforeSend(event, hint) {
      // 4xx 에러는 클라이언트 에러이므로 제외 (서버 에러만 추적)
      if (event.exception) {
        const error = hint.originalException;
        if (error && typeof error === "object" && "statusCode" in error) {
          const statusCode = (error as { statusCode?: number }).statusCode;
          if (statusCode && statusCode >= 400 && statusCode < 500) {
            return null; // 4xx 에러는 전송하지 않음
          }
        }
      }

      // 네트워크 에러 중 일부는 필터링 (비용 절감)
      if (event.exception?.values) {
        const errorMessage = event.exception.values[0]?.value || "";
        // 네트워크 연결 실패 등 일반적인 클라이언트 에러는 제외
        if (
          errorMessage.includes("NetworkError") ||
          errorMessage.includes("Failed to fetch") ||
          errorMessage.includes("Network request failed")
        ) {
          return null;
        }
      }

      return event;
    },

    // 개발 환경에서만 디버그 모드 활성화
    debug: process.env.NODE_ENV === "development",
  });
}
