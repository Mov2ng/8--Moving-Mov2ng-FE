/**
 * apiClient: 프런트 전역 API 호출 래퍼
 * - baseURL 적용
 * - Content-Type 자동 설정
 * - accessToken 자동 추가
 * - 쿼리 파라미터 자동 처리
 * - 에러 처리 통일
 */

import { BASE_URL } from "@/constants/api.constants";

// 기본 url
export const API_URL = process.env.NEXT_PUBLIC_API || BASE_URL;
// 기본 헤더
const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
};
// 요청 옵션 타입 정의
export type ApiRequestOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: BodyInit;
  query?: Record<string, string | number | boolean> | URLSearchParams;
  headers?: Record<string, string>;
};

export async function apiClient(endpoint: string, options: ApiRequestOptions) {
  const { method = "GET", body, query, headers } = options ?? {}; // 여기 headers가 상수 headers랑 options.headers랑 겹침 ㅠㅠ

  // 1. 기본 헤더로 시작
  let combinedHeaders: Record<string, string> = { ...defaultHeaders };

  // 2. 클라이언트 사이드 체크 및 토큰 읽기
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("accessToken");

    // 3. 액세스 토큰 있을 시 Auth 헤더 추가
    if (accessToken && accessToken.trim()) {
      combinedHeaders["Authorization"] = `Bearer ${accessToken}`;

      // 4. 커스텀 헤더 존재 시 병합
      if (headers) combinedHeaders = { ...combinedHeaders, ...headers };
    }
  }

  // 5. baseURL 설정
  let url = API_URL + endpoint;

  // 6. 쿼리 파라미터 처리
  if (query) {
    // query 객체를 URLSearchParams로 변환
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if(value !== undefined && value !== null) {
        params. append(key, String(value));
      }
    });
    url += `?${params.toString()}`;
  }

  // 7. try-catch로 fetch 호출
  try {
    const response = await fetch(url, {
      // 8. 메서드 기본값 설정
      method,
      headers: combinedHeaders,
      credentials: "include", // 쿠키 전송 (리프레시 토큰 용)
      ...(method !== "GET" && body ? { body: JSON.stringify(body) } : {}), // json 직렬화
    });

    // 9. 응답 상태 체크
    if (!response.ok) {
      // 10. 실패는 에러 throw
      const errorData = await response.json().catch(() => null);
      throw {
        status: response.status,
        message: errorData?.message ?? "API 요청 중 오류 발생",
        error: errorData,
      };
    }

    // 11. 성공이면 JSON 파싱 후 반환
    return response.json();
  } catch (error) {
    // 12. catch에서 에러 처리
    console.error(error);
    throw error;
  }
}
