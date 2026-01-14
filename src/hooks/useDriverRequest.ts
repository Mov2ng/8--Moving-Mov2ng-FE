"use client";

import { useApiQuery } from "./useApiQuery";
import { useApiMutation } from "./useApiMutation";
import { driverRequestService } from "@/services/driverRequestService";
import type { DriverRequestListResponse } from "@/types/api/driverRequest";

/**
 * 드라이버 요청 목록 조회 query 생성 훅
 * @param params - 쿼리 파라미터
 * @param enabled - 쿼리 활성화 여부
 * @returns useApiQuery 결과
 */
export function useGetDriverRequests(
  params: {
    userId: string;
    page?: number;
    pageSize?: number;
    requestId?: number;
    movingType?: string;
    region?: string;
    isDesignated?: boolean;
    sort?: "soonest" | "recent";
  },
  enabled?: boolean
) {
  // useApiQuery를 사용하여 driverRequests 쿼리(apiClient)를 생성
  return useApiQuery<DriverRequestListResponse, unknown>({
    queryKey: ["driverRequests", params], // 쿼리 키: ["driverRequests", params]
    queryFn: () => driverRequestService.getDriverRequests(params),
    enabled: enabled && !!params.userId,
  });
}

/**
 * 지정 견적 요청 목록 조회 query 생성 훅
 * @param params - 쿼리 파라미터
 * @param enabled - 쿼리 활성화 여부
 * @returns useApiQuery 결과
 */
export function useGetDriverDesignatedRequests(
  params: {
    userId: string;
    page?: number;
    pageSize?: number;
    movingType?: string;
    region?: string;
    requestId?: number;
    sort?: "soonest" | "recent";
  },
  enabled?: boolean
) {
  return useApiQuery<DriverRequestListResponse, unknown>({
    queryKey: ["driverDesignatedRequests", params],
    queryFn: () => driverRequestService.getDriverDesignatedRequests(params),
    enabled: enabled && !!params.userId,
  });
}

/**
 * 견적 수락 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function useAcceptEstimate() {
  return useApiMutation<
    unknown,
    {
      userId?: string;
      requestId: number;
      requestReason?: string;
      price: number;
    },
    unknown
  >({
    mutationKey: ["acceptEstimate"],
    mutationFn: driverRequestService.acceptEstimate,
  });
}

/**
 * 견적 반려 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function useRejectEstimate() {
  return useApiMutation<
    unknown,
    {
      userId?: string;
      requestId: number;
      requestReason?: string;
    },
    unknown
  >({
    mutationKey: ["rejectEstimate"],
    mutationFn: driverRequestService.rejectEstimate,
  });
}

/**
 * 견적 수정 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function useUpdateEstimate() {
  return useApiMutation<
    unknown,
    {
      userId?: string;
      requestId: number;
      status: "ACCEPTED" | "REJECTED";
      requestReason?: string;
      price?: number;
    },
    unknown
  >({
    mutationKey: ["updateEstimate"],
    mutationFn: driverRequestService.updateEstimate,
  });
}

/**
 * 요청 삭제 mutation 생성 훅
 * @returns useApiMutation 결과
 */
export function useDeleteRequest() {
  return useApiMutation<
    unknown,
    {
      userId?: string;
      requestId: number;
    },
    unknown
  >({
    mutationKey: ["deleteRequest"],
    mutationFn: driverRequestService.deleteRequest,
  });
}

