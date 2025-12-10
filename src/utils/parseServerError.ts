/**
 * 서버 에러 객체를 안전하게 파싱하는 함수
 *
 * @param error - unknown 타입의 에러 객체
 * @returns 파싱된 에러 정보 또는 null
 */
export function parseServerError(error: unknown): {
  name?: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
  message?: string;
} | null {
  // ▷ 객체인지 확인
  if (!error || typeof error !== "object") {
    return null;
  }

  // ▷ error 안에 error 속성이 있는 경우 (ex: axios, fetch wrapper)
  // 이때도 타입 단언 없이 안전하게 접근
  const base =
    "error" in error && typeof (error as Record<string, unknown>).error === "object"
      ? (error as Record<string, unknown>).error
      : error;

  if (!base || typeof base !== "object") {
    return null;
  }

  // ▷ 문자열인지 확인하는 안전 접근
  const getString = (obj: unknown, key: string): string | undefined => {
    if (
      obj &&
      typeof obj === "object" &&
      key in obj &&
      typeof (obj as Record<string, unknown>)[key] === "string"
    ) {
      return (obj as Record<string, unknown>)[key] as string;
    }
    return undefined;
  };

  // ▷ 숫자인지 확인하는 안전 접근
  const getNumber = (obj: unknown, key: string): number | undefined => {
    if (
      obj &&
      typeof obj === "object" &&
      key in obj &&
      typeof (obj as Record<string, unknown>)[key] === "number"
    ) {
      return (obj as Record<string, unknown>)[key] as number;
    }
    return undefined;
  };

  // ▷ 객체인지 확인하는 안전 접근
  const getObject = (obj: unknown, key: string): Record<string, unknown> | undefined => {
    if (
      obj &&
      typeof obj === "object" &&
      key in obj &&
      typeof (obj as Record<string, unknown>)[key] === "object"
    ) {
      return (obj as Record<string, unknown>)[key] as Record<string, unknown>;
    }
    return undefined;
  };

  return {
    name: getString(base, "name"),
    code: getString(base, "code"),
    status: getNumber(base, "status"),
    details: getObject(base, "details"),
    message: getString(base, "message"),
  };
}
