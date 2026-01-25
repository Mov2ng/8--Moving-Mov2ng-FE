// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

/**
 * Sentry Edge 런타임 초기화 (비용 최적화 설정)
 * - Edge 함수는 트래픽이 많을 수 있으므로 샘플링을 최소화
 */

import * as Sentry from "@sentry/nextjs";

// DSN이 없으면 Sentry 비활성화 (로컬 개발 시 비용 절감)
if (!process.env.SENTRY_DSN) {
  console.log("⚠️ SENTRY_DSN이 없어 Sentry를 비활성화합니다.");
} else {
  // 환경별 샘플링 비율 설정 (비용 최적화)
  // Edge는 트래픽이 많을 수 있으므로 더 낮은 샘플링 사용
  const getSampleRate = () => {
    const env = process.env.NODE_ENV;
    if (env === "production") {
      return 0.005; // 프로덕션: 0.5%만 추적 (Edge는 더 낮게)
    }
    if (env === "development") {
      return 0.05; // 개발: 5% 추적
    }
    return 0.5; // 로컬: 50% 추적
  };

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",

    // 트레이스 샘플링 (비용 절감)
    tracesSampleRate: getSampleRate(),

    // PII 데이터 전송 비활성화 (비용 절감)
    sendDefaultPii: false,

    // 무료 플랜 한도 초과 방지
    maxBreadcrumbs: 20, // Edge는 더 적게 (기본값 100 → 20으로 감소)

    // 중복/불필요한 에러 필터링 (비용 절감)
    beforeSend(event, hint) {
      // 4xx 에러는 클라이언트 에러이므로 제외
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
