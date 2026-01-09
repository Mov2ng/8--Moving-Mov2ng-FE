export interface ApiError extends Error {
  status?: number;
  code?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * 공통 fetch 래퍼
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // 쿠키 기반 인증일 경우
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);

    const error: ApiError = new Error(
      errorBody?.message || "API 요청 실패"
    );
    error.status = res.status;
    error.code = errorBody?.code;

    throw error;
  }

  return res.json();
}
