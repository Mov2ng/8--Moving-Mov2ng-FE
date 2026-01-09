import { apiFetch } from "./client";

export interface DriverRequest {
  requestId: number;
  movingType: string;
  movingDate: string;
  origin: string;
  destination: string;
  isDesignated: boolean;
  estimateId?: number;
  estimateStatus?: string;
  estimatePrice?: number;
  requestCreatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * 🔹 드라이버 전체 견적 요청 리스트
 */
export function getDriverRequests(page = 1, pageSize = 10) {
  return apiFetch<Paginated<DriverRequest>>(
    `/api/requests/driver/list?page=${page}&pageSize=${pageSize}`
  );
}
