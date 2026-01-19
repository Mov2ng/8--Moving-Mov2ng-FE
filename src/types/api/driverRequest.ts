// src/types/api/driverRequests.ts

/**
 * 목록용 타입
 */
export type DriverRequest = {
  requestId: number;
  movingType: string;
  movingDate?: string | null;
  origin?: string | null;
  destination?: string | null;
  isDesignated?: boolean;
  estimateId?: number | null;
  estimateStatus?: string | null;
  estimatePrice?: number | null;
  userId?: string | null;
  userName?: string | null;
  requestCreatedAt?: string | null;
  requestUpdatedAt?: string | null;
};

export type DriverRequestListResponse = {
  items: DriverRequest[];
  designatedCount?: number;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
};

/**
 * 상세 타입 (UI용으로 정제해서 반환)
 */
export type DriverRequestDetail = {
  requestId: number;
  movingType: string;
  movingDate: string;
  origin: string;
  destination: string;
  userId: string;
  userName?: string;
};
