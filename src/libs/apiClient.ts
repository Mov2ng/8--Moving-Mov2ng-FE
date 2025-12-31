import { BASE_URL } from "@/constants/api.constants";
import { getToken, removeToken } from "@/utils/tokenStorage";

// 기본 url
export const API_URL = process.env.NEXT_PUBLIC_API || BASE_URL;
// 기본 헤더
const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
};
// 요청 옵션 타입 정의
export type ApiRequestOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown> | FormData | string;
  query?: Record<string, string | number | boolean> | URLSearchParams;
  headers?: Record<string, string>;
};

/**
 * API 호출 래퍼
 * - baseURL 설정
 * - Content-Type 자동 설정
 * - 쿼리 파라미터 자동 처리
 * - Authorization 헤더에 accessToken 자동 추가
 * - 요청/응답 처리 통일
 * - 성공/실패 시 에러 처리 통일
 */
export async function apiClient(endpoint: string, options: ApiRequestOptions) {
  const { method = "GET", body, query, headers } = options ?? {}; // 여기 headers가 상수 headers랑 options.headers랑 겹침 ㅠㅠ

  // 1. body가 FormData인지 확인 (FormData일 때는 Content-Type을 제거해야 함)
  const isFormData = body instanceof FormData;

  // 2. 기본 헤더로 시작 (FormData가 아닐 때만 Content-Type 추가)
  const combinedHeaders: Record<string, string> = {
    ...(!isFormData ? defaultHeaders : {}),
    ...headers,
  };

  // 2. 클라이언트 사이드에서 토큰 조회 (localStorage에서)
  const accessToken = getToken();

  // 3. 액세스 토큰 있을 시 Auth 헤더 추가
  if (accessToken) {
    combinedHeaders["Authorization"] = `Bearer ${accessToken}`;
  }

  // 4. baseURL(url + query) 설정
  let url = API_URL + endpoint;

  // 5. 쿼리 파라미터 처리
  if (query) {
    // query 객체를 URLSearchParams로 변환
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    url += `?${params.toString()}`;
  }

  // 6. body 처리(body가 객체면 JSON.stringify, FormData면 그대로)
  const isJsonObj =
    body !== null && typeof body === "object" && !(body instanceof FormData);

  // body 최종 형태 결정
  const jsonBody =
    method !== "GET"
      ? isJsonObj
        ? JSON.stringify(body) // 객체 → JSON 문자열
        : body // FormData 또는 string → 그대로
      : undefined;

  // 7. try-catch로 fetch 호출 (타임아웃 추가)
  try {
    // AbortController를 사용하여 타임아웃 구현
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

    const response = await fetch(url, {
      method,
      headers: combinedHeaders,
      credentials: "include", // refreshToken 쿠키 자동 전송
      signal: controller.signal, // 타임아웃 시 중단
      ...(jsonBody ? { body: jsonBody } : {}),
    });

    clearTimeout(timeoutId); // 성공 시 타임아웃 클리어

    // 9. 응답 상태 체크
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      // 10. `/me` API의 401은 비회원 상태로 처리 (에러가 아님)
      if (response.status === 401 && endpoint === "/auth/me") {
        // 비회원은 정상 상태: me = null 반환
        return { data: null };
      }

      // 11. 다른 API의 401은 토큰 만료로 처리
      if (typeof window !== "undefined" && response.status === 401) {
        // accessToken 제거
        removeToken();
      }

      // 12. 실패는 에러 throw
      throw {
        status: response.status,
        message: errorData?.message ?? "API 요청 중 오류 발생",
        error: errorData,
      };
    }

    // 13. 성공이면 JSON 파싱 후 반환
    return response.json().catch(() => ({})); // 런타임 오류 안전장치
  } catch (error) {
    // 13. catch에서 에러 처리
    // 타임아웃 또는 네트워크 에러 처리
    if (error instanceof Error && error.name === "AbortError") {
      throw {
        status: 408,
        message: "요청 시간이 초과되었습니다",
        error: error,
      };
    }
    // 이미 throw된 에러 객체인 경우 그대로 throw
    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }
    // 기타 에러 (네트워크 에러 등)
    throw {
      status: 500,
      message: "네트워크 오류가 발생했습니다",
      error: error,
    };
  }
}
