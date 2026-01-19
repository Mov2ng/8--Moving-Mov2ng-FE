/**
 * 서버 에러 객체를 안전하게 파싱하는 유틸리티 함수
 *
 * 서버에서 반환된 에러 객체에서 안전하게 정보 추출
 * - 필드별 에러 메시지 추출은 이 함수가 아닌, 이 함수가 반환한 `details` 객체를
 *   사용하는 쪽(예: ProfileForm.tsx의 onSubmit)에서 처리
 *
 * @param error - unknown 타입의 에러 객체 (서버에서 던진 에러)
 * @returns 파싱된 에러 정보 { name, code, status, details, message } 또는 null
 *
 * @example
 *  서버 에러 예시:
 *  { status: 400, message: "검증 실패", details: { field: "nickname", reason: "닉네임이 필요합니다" } }
 *
 *  const parsed = parseServerError(error);
 *  반환값: { status: 400, message: "검증 실패", details: { field: "nickname", reason: "닉네임이 필요합니다" } }
 *
 *  ProfileForm.tsx에서 필드별 에러 처리:
 *  if (parsed?.details?.field) {
 *    setError(parsed.details.field, { message: parsed.details.reason });
 *  }
 */
export function parseServerError(error: unknown): {
  name?: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown> | unknown[];
  message?: string;
} {
  // 객체인지 확인
  if (!error || typeof error !== "object") {
    // 원시 타입이면 최소한의 정보라도 반환
    return {
      message: String(error),
    };
  }

  // apiClient가 던진 에러 구조: { status, message, error: {...} }
  // 최상위 error 객체에서 status와 message를 먼저 확인
  const errorObj = error as Record<string, unknown>;

  // error 안에 error 속성이 있는 경우 서버 응답이 error.error에 있음
  const nestedError =
    "error" in errorObj &&
    typeof errorObj.error === "object" &&
    errorObj.error !== null
      ? errorObj.error
      : null;

  // base 결정: nestedError가 있으면 그것을 우선 사용 (서버 응답이 여기 있음)
  // 없으면 최상위 error 사용
  const base = nestedError || error;

  if (!base || typeof base !== "object") {
    // base가 객체가 아니면 원본 에러에서 최소한의 정보 추출
    return {
      message: String(error),
    };
  }

  // obj에서 key의 값을 확인해 가져오는 함수
  const getValue = (obj: unknown, key: string): unknown => {
    // obj가 존재하고 객체이며 key가 obj에 존재하는지 확인
    if (!obj || typeof obj !== "object" || !(key in obj)) {
      return undefined;
    }
    // obj[key]의 값을 가져옴 (타입 단언 필요)
    return (obj as Record<string, unknown>)[key];
  };

  // 문자열인지 확인하는 안전 접근
  // 예: getString(error, "message") → error.message가 문자열이면 반환, 아니면 undefined
  const getString = (obj: unknown, key: string): string | undefined => {
    const value = getValue(obj, key);
    // 가져온 값이 문자열인지 확인
    return typeof value === "string" ? value : undefined;
  };

  // 숫자인지 확인하는 안전 접근
  // 예: getNumber(error, "status") → error.status가 숫자면 반환, 아니면 undefined
  const getNumber = (obj: unknown, key: string): number | undefined => {
    const value = getValue(obj, key);
    // 가져온 값이 숫자인지 확인
    return typeof value === "number" ? value : undefined;
  };

  // 객체인지 확인하는 안전 접근
  // 예: getObject(error, "details") → error.details가 객체면 반환, 아니면 undefined
  const getObject = (
    obj: unknown,
    key: string
  ): Record<string, unknown> | undefined => {
    const value = getValue(obj, key);
    // 가져온 값이 객체인지 확인
    return value !== null && typeof value === "object"
      ? (value as Record<string, unknown>)
      : undefined;
  };

  // 배열인지 확인하는 안전 접근
  const getArray = (obj: unknown, key: string): unknown[] | undefined => {
    const value = getValue(obj, key);
    return Array.isArray(value) ? value : undefined;
  };

  // status는 최상위 error 객체에서 가져오기 (apiClient가 추가한 것)
  // message는 최상위가 있으면 그것을 사용, 없으면 base(서버 응답)에서 가져오기
  // code와 details는 base(서버 응답)에서 가져오기
  const topLevelStatus = getNumber(errorObj, "status");
  const topLevelMessage = getString(errorObj, "message");
  const baseMessage = getString(base, "message");
  const baseCode = getString(base, "code");
  const baseDetails = getObject(base, "details") || getArray(base, "details");

  return {
    name: getString(base, "name"),
    code: baseCode,
    status: topLevelStatus || getNumber(base, "status"),
    details: baseDetails,
    // 최상위 메시지가 있으면 그것을 사용 (apiClient가 추가한 기본 메시지)
    // 없으면 서버 응답의 메시지 사용
    message: topLevelMessage || baseMessage || "알 수 없는 오류가 발생했습니다",
  };
}
