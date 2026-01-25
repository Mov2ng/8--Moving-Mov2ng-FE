// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

/**
 * Sentry 서버 사이드 초기화 (비용 최적화 설정)
 * - 무료 플랜: 에러 5,000개/월, 스팬 1천만 개/월
 * - 비용 절감 전략: 샘플링 최소화, 중복 에러 필터링
 */

import * as Sentry from "@sentry/nextjs";

// DSN이 없으면 Sentry 비활성화 (로컬 개발 시 비용 절감)
if (!process.env.SENTRY_DSN) {
  console.log("⚠️ SENTRY_DSN이 없어 Sentry를 비활성화합니다.");
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

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",

    // 트레이스 샘플링 (비용 절감)
    tracesSampleRate: getSampleRate(),

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
      return event;
    },

    // 개발 환경에서만 디버그 모드 활성화
    debug: process.env.NODE_ENV === "development",
  });
}
