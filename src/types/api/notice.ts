export interface Notice {
  noticeId: string;
  audience: "USER" | "DRIVER";
  noticeType: string;
  title: string;
  content: string;
  noticeDate: string;
  requestId?: number;
  estimateId?: number;
  movingDate?: string;
  daysUntil?: number;
  requesterName?: string;
  requesterId?: string;
  driverName?: string;
  driverId?: number;
}

export interface NoticeListResponse {
  items: Notice[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ReadAllResponse {
  count: number;
}

