// app/quote/request/api.ts
"use client";

import { apiClient } from "@/libs/apiClient";
import { useApiMutation } from "@/hooks/useApiMutation";

export type CreateEstimatePayload = {
  movingType: string; // API enum (e.g. "HOME")
  movingDate: string; // "YYYY-MM-DD"
  origin: string; // "서울 중구" (string per swagger example)
  destination: string; // "서울 종로구"
};

export type CreateEstimateResponse = {
  data?: unknown;
  [key: string]: unknown;
};

/**
 * 견적 생성 API 서비스 함수
 */
export async function createEstimate(payload: CreateEstimatePayload) {
  return apiClient("/requests", {
    method: "POST",
    body: payload,
  });
}

/**
 * 견적 생성 커스텀 훅
 */
export function useCreateEstimate() {
  return useApiMutation<
    CreateEstimateResponse,
    CreateEstimatePayload,
    { status: number; message: string }
  >({
    mutationFn: createEstimate,
    mutationKey: ["createEstimate"],
  });
}