import { apiClient } from "@/libs/apiClient";
import type {
  DriverRequestListResponse,
  DriverRequestDetail,
} from "@/types/api/driverRequest";

/**
 * 드라이버 요청 관련 API 엔드포인트 레이어 서비스
 * - getDriverRequests: 드라이버 견적 요청 리스트 조회
 * - getDriverDesignatedRequests: 드라이버 지정 견적 요청 리스트 조회
 * - getDriverRequestById: 드라이버 요청 단건 조회
 * - acceptEstimate: 견적 수락
 * - rejectEstimate: 견적 반려
 * - updateEstimate: 견적 수정
 * - deleteRequest: 요청 삭제
 */
export const driverRequestService = {
  getDriverRequests: (params: {
    userId: string;
    page?: number;
    pageSize?: number;
    requestId?: number;
    movingType?: string;
    region?: string;
    isDesignated?: boolean;
    sort?: "soonest" | "recent";
  }) => {
    return apiClient(`/api/requests/driver/list`, {
      method: "GET",
      query: {
        userId: params.userId,
        ...(params.page && { page: params.page }),
        ...(params.pageSize && { pageSize: params.pageSize }),
        ...(params.requestId && { requestId: params.requestId }),
        ...(params.movingType && { movingType: params.movingType }),
        ...(params.region && { region: params.region }),
        ...(params.isDesignated !== undefined && {
          isDesignated: params.isDesignated,
        }),
        ...(params.sort && { sort: params.sort }),
      },
    });
  },
  getDriverDesignatedRequests: (params: {
    userId: string;
    page?: number;
    pageSize?: number;
    movingType?: string;
    region?: string;
    requestId?: number;
    sort?: "soonest" | "recent";
  }) => {
    return apiClient(`/api/requests/driver/estimate/list`, {
      method: "GET",
      query: {
        userId: params.userId,
        ...(params.page && { page: params.page }),
        ...(params.pageSize && { pageSize: params.pageSize }),
        ...(params.movingType && { movingType: params.movingType }),
        ...(params.region && { region: params.region }),
        ...(params.requestId && { requestId: params.requestId }),
        ...(params.sort && { sort: params.sort }),
      },
    });
  },
  getDriverRequestById: async (params: {
    userId: string;
    requestId: number;
  }) => {
    const res: DriverRequestListResponse = await apiClient(
      `/api/requests/driver/list`,
      {
        method: "GET",
        query: {
          userId: params.userId,
          requestId: params.requestId,
        },
      }
    );

    if (!res?.items || res.items.length === 0) return null;

    const item = res.items[0];

    return {
      requestId: item.requestId,
      movingType: item.movingType,
      movingDate: item.movingDate ?? "",
      origin: item.origin ?? "",
      destination: item.destination ?? "",
      userId: item.userId ?? "고객",
    } as DriverRequestDetail;
  },
  acceptEstimate: (payload: {
    userId?: string;
    requestId: number;
    requestReason?: string;
    price: number;
  }) => {
    return apiClient(`/api/requests/driver/estimate/accept`, {
      method: "POST",
      body: payload,
    });
  },
  rejectEstimate: (payload: {
    userId?: string;
    requestId: number;
    requestReason?: string;
  }) => {
    return apiClient(`/api/requests/driver/estimate/reject`, {
      method: "POST",
      body: payload,
    });
  },
  updateEstimate: (payload: {
    userId?: string;
    requestId: number;
    status: "ACCEPTED" | "REJECTED";
    requestReason?: string;
    price?: number;
  }) => {
    return apiClient(`/api/requests/driver/estimate/update`, {
      method: "POST",
      body: payload,
    });
  },
  deleteRequest: (payload: {
    userId?: string;
    requestId: number;
  }) => {
    return apiClient(`/api/requests/driver/request`, {
      method: "DELETE",
      body: payload,
    });
  },
};

